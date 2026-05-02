const Redis = require('ioredis');

// Connect to Redis on Laragon (default port 6379)
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

module.exports = redis;
