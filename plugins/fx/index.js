'use strict';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoURI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const axios = require('axios')



exports.plugin = {
  name: 'fx',
  version: '1.0.0',
  register: async function (server, options) {

    // Create a route for example

    server.route({
      method: 'GET',
      path: '/test',
      handler: function (request, h) {

        return new Promise((resolve, reject) => {
          client.connect(err => {
            if (err) {
              console.log(err);
              reject(err);
            }
            const collection = client.db("Hapi").collection("rates");
            // perform actions on the collection object
            collection.find().toArray().then((res) => {
              resolve(res);
            }).catch((err) => {
              console.log(err);
              reject(err);
            }).finally(() => {
              // client.close();
            })
          });

          // const name = options.name;
          // resolve(`Hello ${name}`);
        })


      }
    });

    server.route({
      method: 'POST',
      path: '/updateRates',
      handler: function (request, h) {
        return new Promise((resolve, reject) => {
          let url = `http://data.fixer.io/api/2013-12-24?access_key=${process.env.fxKey}&base=ARS&symbols=USD,BRL,ARS,EUR`;

          function update(resp) {
            const symbols = ["ARS", "EUR", "BRL", "USD"];

            // console.log(resp, resp.rates);

            const collection = client.db("Hapi").collection("rates");

            let promises = [];

            client.connect(err => {
              if (err) {
                console.log(err);
                reject(err);
              }
              symbols.forEach((parent) => {
                let parentRate = resp.rates[parent] || 1;
                symbols.forEach((son) => {
                  if (son === parent) return;
                  let sonRate = resp.rates[son] || 1;

                  let setUpdate = {}
                  let key = `${son}.rate`;
                  setUpdate[key] = sonRate/parentRate;
                  promises.push(collection.updateOne({ _id: parent }, { $set: setUpdate }, { upsert: true }));
                });
              });
            });



            Promise.all(promises).then((res) => {
              resolve("All data updated");
            }, (err) => {
              console.log("error", err);
              reject(new Error("Error updating mongodb data"));
            });
          }

          axios.get(url).then((resp) => {

            if (resp.data.success) {
              update(resp);
            } else {
              // console.log("ignored error", resp.data);
              // const response = { "success": true, "timestamp": 1650515583, "base": "EUR", "date": "2022-04-21", "rates": { "USD": 1.083377, "BRL": 5.007476, "ARS": 123.45795, "EUR": 1 } }
              // //i ignore api error for now
              // update(response);
              reject(new Error("Error fetching data from fx"));
            }
          }).catch((err) => {
            // console.log("error", err);
            // const response = { "success": true, "timestamp": 1650515583, "base": "EUR", "date": "2022-04-21", "rates": { "USD": 1.083377, "BRL": 5.007476, "ARS": 123.45795, "EUR": 1 } }
            // //i ignore api error for now
            // update(response);
            reject(err);
          })
        });
      }
    })
  }
};