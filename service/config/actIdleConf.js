const session = require('../session/session').session;
const cpu = require('../cpu');
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//置闲
			url:'/agentgateway/resource/onlineagent/:agentid/sayfree',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, conf, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(){},
			fail:function(param, agent, conf, data, head){
				logger.error("置闲失败返回值:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				//示闲(AgentState_Ready)
				//取消示忙成功(AgentState_CancelNotReady_Success)
				////message:"agent not login",result:"",retcode:"100-006"
				//let user = session.getUser(param['agentId'])
				data = data || err;
				data = JSON.parse(data);
				logger.info("空闲操作:",data['retcode'] == 0)
				if(data.retcode == "0"){
					logger.info("空闲成功:"+JSON.stringify(data));
					session.updateState([{'eventType':'AgentState_Ready','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}

			}
		}