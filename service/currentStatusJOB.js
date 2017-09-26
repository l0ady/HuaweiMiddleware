const schedule = require('node-schedule');
const actSignInConf = require('./config/actSignInConf');
const session = require('./session/session')['session'];
const egine=require('./TOAgentGateway/engine');
const actQueuedevice = require('./config/actQueuedevice');//获取所有坐席状态
const conf = require('./config/config');
const logger = require('../tool').logger('logger');
var rule = new schedule.RecurrenceRule();
const timer=conf['queueTimer'] || 3;

module.exports=function(){
	let times = [];
　　for(let i=0; i<60; i+=timer){
　　　　times.push(i);
　　}
　　rule.second = times;

	try{
		session.saveUser(conf['monitor'], function(param){
			egine(param, actSignInConf, conf);
		});
		schedule.scheduleJob(rule, function(){
			let sum=session.getEffectiveUser();
			if(sum > 1){
				//console.log('有效坐席:', sum);
				egine('', actQueuedevice, conf);
			}
   		});
	}catch(err){
		logger.error(err);
	}
	
}