const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//结束静音
			url:'/agentgateway/resource/voicecall/:agentid/endmute',
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
				logger.error("结束静音失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("结束静音:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					logger.info("结束静音后面怎么写?")
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}