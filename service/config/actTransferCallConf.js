const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//
			url:'/agentgateway/resource/voicecall/:agentid/transfer',
			type:'POST',
			/***
				devicetype:转移设备类型，技能队列为1，业务代表为2，IVR设备为3，系统接入码为4，
							外呼号码为5
				address:转移地址，即转移设备类型对应的设备ID。最大长度24。
				mode:转移模式，在内部转移的情况下：释放转为0，挂起转为1，成功转为2，
					指定转为3，合并转为4；在外呼转移的情况下，释放转为1，成功转为2，
					通话转为3，三方转为4
				callappdata: 需设置的随路数据。内容可为空，最大长度为1024
			***/
			getParam:function(agent, conf, param, callblack){
				let callappdata=param['callappdata'] || '';
				callblack.write(JSON.stringify({
					devicetype:param['devicetype'],
					address:param['address'],
					mode:param['mode'],
					callappdata:callappdata
				}));
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				console.log('transfer url', agent.url.replace(':agentid', param['agentId']));
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("转接失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("转接:",data['retcode'] == 0)
				if(data['retcode'] == 0){//转接成功以后进入工作态
				//	session.updateState([{'eventType':'AgentState_Work','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}