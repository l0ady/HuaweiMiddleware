const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//设置随路数据
			url:'/agentgateway/resource/calldata/:agentid/setcalldataex',
			type:'PUT',
			getParam:function(agent, conf, param, callblack){
				//{"callid":"1456229294-1191","calldata":"1233"}
				callblack.write(JSON.stringify({
					'callid' : param['callid'],
					'calldata': param['calldata']
				}));
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("设置随路数据失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				/*
				 *	{"message":"","retcode":"0"}
				 */
				data = data || err;
				data = JSON.parse(data);
				logger.info("设置随路数据:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					logger.error("设置随路数据success:", JSON.stringify(data));
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}