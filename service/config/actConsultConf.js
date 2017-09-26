const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

/***
	参数
	dstaddress:求助对象，座席工号或技能队列ID
	devicetype:求助设备类型，技能队列为1，座席工号为2，默认为2
	mode:求助模式，两方求助为1，三方求助为2，默认为1
	callappdata:需设置的随路数据。内容可为空，最大长度为1024
	返回:话路唯一标识
	{"message":"","retcode":"0","result":"1455885056-1095"}
***/

module.exports={//内部求助 咨询
			url:'/agentgateway/resource/voicecall/:agentid/innerhelp',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				let args=JSON.stringify({
					dstaddress:param['dstaddress'],
					devicetype:param['devicetype'],
					mode:param['mode'],
					callappdata:param['callappdata']
				});
				logger.info('咨询 参数', args);
				
				callblack.write(args);
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("咨询失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				//let user = session.getUser(agentId);
				data = data || err;
				data = JSON.parse(data);
				logger.info("咨询:",data['retcode'] == 0)
				if(data['retcode'] == 0){//咨询通话
				//	session.updateState([{'eventType':'','workNo':param['agentId']}], cpu.emit);
					cpu.emit(session.getUser(param['agentId'])['socketId'], {'eventType':'AgentEvent_Call_Release', 'content':{'contantId':data['result']}}, param['agentId']);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}