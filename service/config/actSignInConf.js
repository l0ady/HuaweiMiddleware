const session = require('../session/session').session;
const _actSignIn = require('./_actSignInConf');//强制签入
const actIdle = require('./actIdleConf');//空闲
const actBusy = require('./actBusyConf');//置忙
const actQuerySkill = require('./actQuerySkill');//查询技能组
const actRestSkill = require('./actRestSkill');//重置技能组
const egine=require('../TOAgentGateway/engine');
const err = require('../../err').ERR;
const cpu=require('../cpu');
const logger = require('../../tool').logger('logger');

module.exports={//签入
			url:'/agentgateway/resource/onlineagent/:agentid',
			type:'PUT',
			//坐席工号
			getParam:function(agent, conf, param, callblack){
				//debugger
				logger.info('singin param:', JSON.stringify({
						password:param['password'],
						phonenum:param['phonenum'],
						autoanswer:param['autoanswer'],
						autoenteridle:param['autoenteridle'],
						status:param['status'],
						phonelinkage:param['phonelinkage']
					}));
				callblack.write(JSON.stringify({
						password:param['password'],
						phonenum:param['phonenum'],
						autoanswer:param['autoanswer'],
						phonelinkage:param['phonelinkage'],
						autoenteridle:param['autoenteridle'],
						status:param['status']/*,
						releasephone:param['releasephone']*/
					}));
				callblack.end();
			},
			//在ajax执行前调用 修改URL
			before:function(agent, conf, param){
				//debugger
				console.log(agent.url.replace(':agentid', param['agentId']))
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, conf){//状态改变
				
			},
			fail:function(param, agent, conf, data){
				//强制签入
				logger.error("请求失败:", data);
				session.customEven([{"eventType": "ERROR", "workNo": param['agentId'], "content": data}], cpu.emit);
			},
			success:function(param, agent, conf, data){
				
				logger.info("签入:"+data)
				//1.获取guid
				data = data || err;
				data = JSON.parse(data);
				logger.info("签入:",data['retcode'] == 0)
				
				if(data['retcode'] == 0){
					logger.info(param['agentId'],'签入成功了,查询坐席所在技能组');
					//egine(param, actQuerySkill, conf);//查询技能组
					egine(param, actRestSkill, conf);//重置技能组
				}else if(data.retcode == '100-003' || data.retcode == '100-002'){
					logger.info("强签参数:",JSON.stringify(param));
					egine(param, _actSignIn, conf);//强制签入
				}else{
					agent.fail(param, agent, conf, data);
				}
				

			}
		}