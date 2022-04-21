'use strict';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoURI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



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
            if(err) {
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
  }
};