'use strict';

exports.plugin = {
  name: 'fx',
  version: '1.0.0',
  register: async function (server, options) {

    // Create a route for example

    server.route({
      method: 'GET',
      path: '/test',
      handler: function (request, h) {

        const name = options.name;
        return `Hello ${name}`;
      }
    });
  }
};