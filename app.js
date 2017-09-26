var koa = require('koa');
var app = new koa();
var tool = require("./tool");
var logger = tool.logger('logger');
var session=require('./service/session/session')['session'];
const cpu = require('./service/cpu');
const router = require('koa-router')();
const koaBody = require('koa-body')();

router.post('/SAP/SapAdapterEventServlet', koaBody,
  (ctx) => {
    session.updateOneState(ctx.request.body, cpu.emit);
  }
);
app.use(router.routes());

app.use(tool.getLog4j().connectLogger(tool.logger("app"), {level:tool.getLog4j().levels.INFO}));
var server = require('http').createServer(app.callback());


server.listen(18080);
logger.info("listen:", 18080);
require('./service/event.js')(server);
//定时任务轮询获取坐席状态
require('./service/currentStatusJOB')();