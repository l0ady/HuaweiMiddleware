const cpu = require('../cpu');
const err = require('../../err').ERR;
const session = require('../session/session').session;
const logger = require('../../tool').logger('logger');

module.exports={//获取排队数
			url:'/agentgateway/resource/queuedevice/:agentid/waitnum',
			type:'GET',
			getParam:function(agent, conf, param, callblack){
				callblack.write("");
				callblack.end();
			},
			before:function(agent, conf, param){
				return agent.url.replace(':agentid', conf['monitor']['agentId'])+'?time='+(+new Date());
			},
			execute:function(){},
			fail:function(param, agent, conf, data){
				logger.error("获取排队数失败:", data);
			},
			success:function(param, agent, conf, data){
				//{"message":"","retcode":"0","result":0}
				data = data || err;
				data = JSON.parse(data);
				if(data["retcode"] == "0"){
					if(data['result'] != void 0 ){
						cpu.broadcast('queuedevice', data['result']);
					}else{
						logger.info("获取排队数:", JSON.stringify(data));
					}
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}