const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//结束咨询 暂时废弃 使用结束话路来结束咨询!!
			url:'',
			type:'',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			}
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("结束咨询失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				//let user = session.getUser(agentId);
				data = data || err;
				data = JSON.parse(data);
				logger.info("结束咨询:",data['retcode'] == 0)
				if(data['retcode'] == 0){//结束咨询
					//session.updateState([{'eventType':'','workNo':param['agentid']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}