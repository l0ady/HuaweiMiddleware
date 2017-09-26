const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//休息 
			url:'/agentgateway/resource/onlineagent/:agentid/rest/:time/:restcause',
			type:'POST',
			//#time 休息时长,单位秒 1~86399 bug
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			//time 以秒为单位，范围：1~86399
			//restcause平台配置的休息原因码，0-255，其中0代表无休息原因码
			before:function(agent, conf, param){
				return agent.url.replace(':agentid', param['agentId']).replace(':time', param['time']).replace(':restcause', param['restcause']);
			},
			execute:function(){},
			fail:function(param, agent, conf, data){
				logger.error('休息失败:', JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("休息:",data['retcode'] == 0);
				if(data['retcode'] == "0"){
					logger.info("休息成功:"+JSON.stringify(data));
				//	session.updateState([{'eventType':'AgentEvent_Hold','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}