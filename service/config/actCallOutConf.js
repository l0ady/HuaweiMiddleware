const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');
/**
	参数:
	called:(必填)被叫号码。
	callappdata:随路数据
	返回值:{"message":"","retcode":"0","result":"1455885056-1095"}
	result话路唯一标识
**/

module.exports={//外呼
			url:'/agentgateway/resource/voicecall/:agentid/callout',
			type:'PUT',
			getParam:function(agent, conf, param, callblack){
				callblack.write(JSON.stringify({
								called : param['called'],
								callappdata : param['callappdata']
							}));
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("外呼失败:", JSON.stringify(data));
				session.updateOneState({"eventType": "AgentEvent_Call_Out_Fail","workNo": param['agentId'],"content": null}, cpu.emit);
			},
			success:function(param, agent, conf, data){
				
				data = data || err;
				data = JSON.parse(data);
				logger.info("外呼:",data['retcode'] == 0)
				if(data['retcode'] == 0){//外呼
					//session.updateState([{'eventType':'outDial','workNo':param['agentId'], "content": data}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}