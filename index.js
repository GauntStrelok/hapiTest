'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

  const server = Hapi.server({
    port: 80,
    host: 'localhost'
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

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();