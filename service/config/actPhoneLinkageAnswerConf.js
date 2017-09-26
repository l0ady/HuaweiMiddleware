/*
	在话机联动场景中，原先设计为：座席如果收到物理话机振铃事件（AgentOther_PhoneAlerting），
	则需要先调用话机联动应答接口，然后在收到请求应答事件（AgentEvent_Ringing）后，在调用该接口
	实现联动功能。从IPCC V200R001C80SPC100开始，则可以在收到物理话机振铃事件（AgentOther_PhoneAlerting）
	后，调用该接口同时实现话机的应答和呼叫的应答。原先的设计同时保持兼容。

	话机联动:话机联动是指坐席采用pc+phone工作模式时，坐席的pc机和phone的呼叫状态能够同步;
			 坐席从pc上应答来电后，不需要从话机上单击应答按钮，话机会自动摘机;
			 坐席从话机上应答来电后，不需要再从pc上单击应答按钮，pc能与话机同步应答来电
*/
const cpu = require('../cpu');
const actAnswerConf=require('./actAnswerConf');
const egine=require('../TOAgentGateway/engine');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//话机联动应答
			url:'/agentgateway/resource/voicecall/:agentid/phonehangup',
			type:'PUT',
			getParam:function(agent, conf, param, callblack){
				callblack.write("");
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("话机联动应答:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				
				data = data || err;
				data = JSON.parse(data);
				logger.info("话机联动应答:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					//话机联动应答成功后调用应答接口
					logger.info("话机联动应答成功调用应答接口",JSON.stringify(data));
					//egine(param, actAnswerConf, conf);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}