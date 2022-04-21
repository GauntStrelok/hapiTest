'use strict';

const Hapi = require('@hapi/hapi');
require('dotenv').config();

const init = async () => {

  const server = Hapi.server({
    port: 3000
  });

  server.ext('onRequest', function (request, reply) {
    console.log("received request", request.method, request.path);
    return reply.continue;
    // return true;
  });

  await server.register({
    plugin: require('./plugins/fx'),
    options: {
      name: 'Gaunt'
    },
    routes: {
      prefix: '/fx'
    }
  });

  await server.register({
    plugin: require('./plugins/rates'),
    routes: {
      prefix: '/rates'
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();