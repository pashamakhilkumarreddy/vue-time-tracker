const server = require('fastify')({
  logger: true,
});

server.register(require('fastify-cors'));
server.register(require('fastify-helmet'));
server.register(require('fastify-compress'));
server.register(require('fastify-rate-limit'), {
  global: false,
  max: 30,
  ban: 2,
  timeWindow: 6000,
  cache: 10000,
  whiteList: [],
  redis: null,
  skipOnError: true,
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true,
    'retry-after': true,
  },
});
server.register(require('under-pressure'), {
  maxEventLoopDelay: 1000,
  maxHeapUsedBytes: 100000000,
  maxRssBytes: 100000000,
});
// server.register(require('fastify-response-time'));

const startServer = async () => {
  try {
    await server.listen(4000);
    console.info(`The server is up and running on ${server.server.address().port}`);
  } catch (err) {
    console.error(err);
  }
};

startServer();

server.route({
  method: 'GET',
  url: '/',
  schema: {
    querystring: {},
    response: {
      200: {
        type: 'object',
        properties: {
          hello: {
            type: 'string',
          },
        },
      },
    },
  },
  handler(req, res) {
    res.send({
      hello: 'world',
    });
  },
});
