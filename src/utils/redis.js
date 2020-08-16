import redis from 'redis';
const Redis = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
Redis.on('connect', () => console.log('Redis is connected')).on('error', err =>
  console.log(err)
);
export function setRedis(key, data) {
  return new Promise((ful, rej) => {
    if (typeof data === 'object') data = JSON.stringify(data);
    if (typeof key === 'object') key = key.toString();
    Redis.set(key, data, err => {
      if (err) rej(err);
      ful(true);
    });
  });
}
export function setRedisEx(key, duration, data) {
  return new Promise((ful, rej) => {
    if (typeof data === 'object') data = JSON.stringify(data);
    if (typeof key === 'object') key = key.toString();
    Redis.setex(key, duration, data, err => {
      if (err) rej(err);
      ful(true);
    });
  });
}
export function getRedis(key, parse = false) {
  return new Promise((ful, rej) => {
    if (typeof key === 'object') key = key.toString();
    Redis.get(key, (err, data) => {
      if (err) rej(err);
      return parse ? ful(JSON.parse(data)) : ful(data);
    });
  });
}
export function delRedis(key) {
  if (!key) return false;
  return new Promise((ful, rej) => {
    if (typeof key === 'object') key = key.toString();
    Redis.del(key, err => {
      if (err) rej(err);
      return ful(true);
    });
  });
}
export function publish(channel, message) {
  return new Promise((ful, rej) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    else message = String(message);
    Redis.publish(channel, message, (err, reply) => {
      if (err) return rej(err);
      ful(reply);
    });
  });
}
export default Redis;
