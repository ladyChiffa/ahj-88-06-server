const Router = require('koa-router');
const router = new Router();

let subscriptions = [];

/********************************************************************************/
/* POST */
router.post('/subscriptions', (ctx) => {
    console.log('IN POST /subscriptions');

    const {name, phone} = ctx.request.body;
    if (subscriptions.some(sub => sub.phone === phone)) {
        ctx.response.status = 400;
        ctx.response.body = {status: "subscription exists"};
    }
    else {
        subscriptions.push({name, phone});
        ctx.response.body = {status: "OK"};
    }
});

/********************************************************************************/
/* DELETE */
router.delete('/subscriptions/:phone', (ctx) => {
    console.log('IN DELETE /subscriptions/<phone>');

    const {phone} = ctx.params;
    if (subscriptions.every(sub => sub.phone !== phone)) {
        ctx.response.status = 400;
        ctx.response.body = {status: "subscription doesnt exist"};
    }
    else {
        subscriptions = subscriptions.filter(sub => sub.phone !== phone);
        ctx.response.body = {status: "OK"};
    }
});

router.delete('/subscriptions', (ctx) => {
    console.log('IN DELETE /subscriptions');

    const {name, phone} = ctx.request.body;
    if (subscriptions.every(sub => sub.phone !== phone)) {
        ctx.response.status = 400;
        ctx.response.body = {status: "subscription doesnt exist"};
    }
    else {
        subscriptions = subscriptions.filter(sub => sub.phone !== phone);
        ctx.response.body = {status: "OK"};
    }
});


module.exports = router;
