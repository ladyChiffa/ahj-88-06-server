const Router = require('koa-router');
const {streamEvents} = require('http-event-stream');
const {v4} = require('uuid');

const router = new Router();

router.get('/sse', async (ctx) => {
    console.log('IN GET /sse');

    streamEvents(ctx.req, ctx.res, {
        async fetch(lastEventId) {
            console.log(lastEventId);
            return [];
        },
        async stream(sse){

            setInterval(() => {
                sse.sendEvent({
                    id : v4(),
                    data: 'hello from server'
                });

            }, 5000);
        }
    });
    
    ctx.respond = false;
});

module.exports = router;
