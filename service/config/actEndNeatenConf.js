const session = require('../session/session').session;
const actIdle = require('./actIdleConf');//空闲
const actBusy = require('./actBusyConf');//置忙
const egine = require('../TOAgentGateway/engine');
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//结束整理
			url:'/agentgateway/resource/onlineagent/:agentid/cancelwork',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, conf, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(){},
			fail:function(param, agent, conf, data){
				logger.error("取消整理失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("取消整理:", data['retcode'] == 0);
				if(data['retcode'] == 0){
					session.getUser(param['agentId'], function (user){
						if(!!user['afterWorkBusy']){//置忙
							egine(param, actBusy, conf);
						}else{//空闲
							egine(param, actIdle, conf);
						}
					});
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}