const session = require('../session/session').session;
const actIdle = require('./actIdleConf');//空闲
const actBusy = require('./actBusyConf');//置忙
const actRestSkill = require('./actRestSkill');//重置技能组
const egine=require('../TOAgentGateway/engine');
const cpu=require('../cpu');
const logger = require('../../tool').logger('logger');

module.exports={//强制签入,无需手动执行程序自动调用
			url:'/agentgateway/resource/onlineagent/:agentid/forcelogin',
			type:'PUT',
			getParam:function(agent, conf, param, callblack){
				callblack.write(JSON.stringify({
						password:param['password'],
						phonenum:param['phonenum'],
						autoanswer:param['autoanswer'],
						autoenteridle:param['autoenteridle'],
						status:param['status'],
						releasephone:param['releasephone']
					}));
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("强制签入失败:",JSON.stringify(data));
				session.customEven([{"eventType": "ERROR", "workNo": param['agentId'], "content": data}], cpu.emit);
			},
			success:function(param, agent, conf, data){
				//debugger
				data = data || {};
				data = JSON.parse(data);
				logger.info("强制签入:", data["retcode"] == 0)
				if(data['retcode'] == 0){
					logger.info(param['agentId'], '强签成功了!!!');
					egine(param, actRestSkill, conf);//重置技能组
				}else if(data['retcode'] == '100-011'){
					//发送自定义事件 eventType 事件名称 workNo 工号 content 内容
					session.customEven([{"eventType": "ERROR", "workNo": param['agentId'], "content": data}], cpu.emit);
					agent.fail(param, agent, conf, data);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}