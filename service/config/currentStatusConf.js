/***
	轮询获取所有坐席的状态:修改basic.properties中
								EVENT_METHOD = AGENT_POLL
								GET_EVENT_MODE = 2
	响应消息:
	{"message":"","retcode":"0"，

	"event":[{

	"eventType": "AgentOther_InService"，

	"workNo": "291"，

	"content": null

	}，{

	"eventType": "AgentOther_InService"，

	"workNo": "49999"，

	"content": null

	}

	]}
**/
const cpu = require('../cpu');
const err = require('../../err').ERR;
const session = require('../session/session').session;
const logger = require('../../tool').logger('logger');

module.exports={
			url:'/agentgateway/resource/agentevent/allagentevent',
			type:'GET',
			getParam:function(agent, conf, param, callblack){
				callblack.write("");
				callblack.end();
			},
			before:function(agent, conf, param){
				return agent.url+'?time='+(+new Date());
			},
			execute:function(){},
			fail:function(param, agent, conf, data){
				logger.error("获取坐席状态失败:", data);
			},
			success:function(param, agent, conf, data){
				//message:"no right to invite resouce",result:"",retcode:"000-003"
				//{"message":"","retcode":"0","event":
				//[{"eventType":"AgentState_Ready","workNo":"8052","content":null}]}
				
				data = data || err;
				data = JSON.parse(data);
				if(data["retcode"] == "0"){
					if(data['event'] && data['event'].length > 0){
						logger.info("坐席状态改变all:", JSON.stringify(data));
						session.updateState(data['event'], cpu.emit);
					}
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}