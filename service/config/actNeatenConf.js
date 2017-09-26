const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//整理???退出学习态???
			url:'/agentgateway/resource/onlineagent/:agentid/work',
			type:'',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, conf, param)){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(){},
			fail:function(param, agent, conf, data){

			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("整理:",data['retcode'] == 0);
				
			}

		}