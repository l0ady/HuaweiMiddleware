const socket = require('socket.io');
const session = require('./session/session').session;
const egine=require('./TOAgentGateway/engine');
const config=require('./config/config');
const actSignInConf=require('./config/actSignInConf');
const actIdleConf=require('./config/actIdleConf');
const actBusyConf=require('./config/actBusyConf');
const logger = require('../tool').logger('logger');
/*
	石化agent 版本:ICDV300R006C86
*/
module.exports=function(app){
	let io=socket(app);
	io.on('connection', function(socket){
		//console.log(socket);
		logger.info("a client is connection!");
		socket.emit('actLoginSuccess', 'AgentOther_ShutdownService');
		//首次连接获取前一状态
		require('./agentStatus/actDisconnect')(socket,session);
		//签入
		require('./agentStatus/actSignIn')(socket,session);
		//空闲
		require('./agentStatus/actIdle')(socket,session);
		//置忙
		require('./agentStatus/actBusy')(socket,session);
		//签出
		require('./agentStatus/actSignOut')(socket,session);
		//应答
		require('./agentStatus/actAnswer')(socket,session);
		//话机联动应答
		require('./agentStatus/actPhoneLinkageAnswer')(socket,session);
		//挂机
		require('./agentStatus/actHungup')(socket,session);
		//转接
		require('./agentStatus/actTransferCall')(socket,session);
		//咨询
		require('./agentStatus/actConsult')(socket,session);
		//会议
		require('./agentStatus/actConference')(socket,session);
		//结束话路
		require('./agentStatus/actKillvoice')(socket,session);
		//取消整理
		require('./agentStatus/actEndNeaten')(socket,session);
		//外呼
		require('./agentStatus/actCallOut')(socket,session);
		//保持
		require('./agentStatus/actHold')(socket,session);
		//取消保持
		require('./agentStatus/actCancelHold')(socket,session);
		//休息
		require('./agentStatus/actRest')(socket,session);
		//取消休息
		require('./agentStatus/actEndRest')(socket,session);
		//查询空闲坐席
		require('./agentStatus/actAllIdles')(socket,session);
		//设置随路数据
		require('./agentStatus/actSetcalldataex')(socket,session);
		//查询随路数据
		require('./agentStatus/actGetcalldata')(socket,session);
	})
	require('./cpu').setIo(io);
}