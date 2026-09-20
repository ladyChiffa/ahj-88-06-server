const Router = require('koa-router');
const router = new Router();

router.get('/index', async (ctx) => {
    console.log('IN GET /index');
    ctx.response.body = {status: "hello"};
});

module.exports = router;
