const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');
/*********************************************************************************
	座席使用重置技能队列签入座席所配置的所有技能队列或签入指定的技能队列。
	，{agentid}为座席工号，{autoflag}为是否自动签入技能标志（true为自动签入
	座席所配置技能，false为手工签入技能队列， true以外的参数都作为false处理），
	{skillid}为技能队列ID（当签入方式为false时，skillid可以为空，为技能队列ID字符串组，
	例如1;2;3，座席签入的技能队列为此id和所配置的交集，最大长度为100个字符），
	{phonelinkage}为是否话机联动（1是，0否）。
	/agentgateway/resource/onlineagent/{agentid}/resetskill/{autoflag}?
	skillid={skillid}&phonelinkage={phonelinkage}
*************************************************************************************/

module.exports={//重置技能队列
			url:'/agentgateway/resource/onlineagent/:agentid/resetskill/:autoflag?skillid=:skillid&phonelinkage=:phonelinkage',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write("");
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				let autoflag=true;
				let skillid='';
				//debugger
				if(param['skillid'] !== void 0 && param['skillid'] != ''){
					autoflag=false;
					skillid = param['skillid'];
				}
				var baseUrl=agent.url.replace(':agentid', param['agentId']).replace(':autoflag', autoflag).replace(':skillid', skillid).replace(':phonelinkage', param['phonelinkage']?1:0);
				console.log('baseUrl:', baseUrl);
				return baseUrl;
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("重置技能队列失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("重置技能队列:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					logger.info(param['agentId'], '重置技能组', JSON.stringify(data));

				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}