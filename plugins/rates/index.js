'use strict';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoURI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const axios = require('axios')



exports.plugin = {
  name: 'rates',
  version: '1.0.0',
  register: async function (server, options) {

    // Create a route for example

    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {

        return new Promise((resolve, reject) => {
          client.connect(err => {
            if (err) {
              console.log(err);
              reject(err);
            }
            const collection = client.db("Hapi").collection("rates");
            // perform actions on the collection object
            let things = [];
            
            collection.find().toArray().then((res) => {
              res.forEach((symbol) => {
                Object.keys(symbol).forEach((key) => {
                  if(key === "_id") return;
                  let curr = symbol[key];
                  curr.fee = curr.fee || 0;
                  curr.feeAmount = curr.fee * curr.rate / 100;
                  curr.markUpRate = curr.rate + curr.feeAmount;

                  //would use this if i wanted the result as an array of pairs
                  let clone = {...curr};
                  clone.pair = `${symbol._id}${key}`;
                  things.push(clone);
                  // --
                })
              });
              //if i wanted only a few pairs, i would filter them on the request, or maybe before the request
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
      path: '/setFee',
      handler: function (request, h) {

        var payload = request.payload

        return new Promise((resolve, reject) => {
          client.connect(err => {
            if (err) {
              console.log(err);
              reject(err);
            }
            const collection = client.db("Hapi").collection("rates");
            // perform actions on the collection object
            let setUpdate = {}
            let key = `${payload.to}.fee`;
            setUpdate[key] = payload.fee;


            collection.updateOne({ _id: payload.base }, { $set: setUpdate }).then((res) => {
              resolve("Fee updated correctly");
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
  }
};