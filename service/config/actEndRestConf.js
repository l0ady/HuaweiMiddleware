const session = require('../session/session').session;
const actIdle = require('./actIdleConf');//空闲
const actBusy = require('./actBusyConf');//置忙
const egine=require('../TOAgentGateway/engine');
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//取消休息
			url:'/agentgateway/resource/onlineagent/:agentid/cancelrest',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("取消休息失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("取消休息:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					egine(param, actIdle, conf);//取消休息后空闲
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}