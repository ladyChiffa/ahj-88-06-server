const combineRouters = require('koa-combine-routers');

const index = require('./index/index.js');
const subscriptions = require('./subscriptions/index.js');

const router = combineRouters(
    index,
    subscriptions
);

module.exports = router;
