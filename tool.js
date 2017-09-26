//提供工具函数

var log4js = require('log4js');

//日志配置
log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        {
            type: 'dateFile',
            filename: 'logs/nodejs.log',
            pattern: "-yyyy-MM-dd",
            maxLogSize: 20480,
            alwaysIncludePattern: false,
            backups: 60,
            category: 'logger'
        }
    ],
    replaceConsole: true
});


exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('ALL');
    return logger;
};

exports.getLog4j = function(){return log4js;};