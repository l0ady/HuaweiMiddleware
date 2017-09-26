/***
	缓存所有用户信息:键 -- 工号
					 值 -- 对象
					 8052:{
					 	agentId:'',//-- 当前用户的工号
						phonenum:8091, //-- 分机号
						password:'',//--密码可以为空
						autoanswer: //是否自动应答 默认为true。
						afterWorkBusy:0,//-- 默认整理后空闲(0)
						status: 签入后的状态，默认为空闲态。4：空闲，5：整理态
						autoenteridle:是否自动进入空闲态，默认为true
						guid:'',//-- 当前坐席的认证信息,默认为空签出后重置为空
						socketId:''//-- socketId通讯Id改变时更新
						lastStatus:'AgentOther_ShutdownService',//-- 上一状态,默认为未签入态
						currentStatus:'AgentOther_ShutdownService'//-- 当前状态,默认为未签入态
					 }
****/
//const db=require('../../db/dbapplication');
const logger = require('../../tool').logger('logger');

var session=(function(){
	var cache={};
	var socketIdToAgentId={};

	Date.prototype.Format = function (fmt) {
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	function saveUser(option, callback){
		option = option || {};
		if(option['agentId'] !== void 0){
			let id=option['agentId'];
			if(cache[id] === void 0) cache[id] = {};
			debugger
			option['autoenteridle']=option['autoenteridle'] || 1;//默认为1
			option['autoanswer']=option['autoanswer'] || 1;//默认为1
			option['phonelinkage'] = option['phonelinkage'] || 1;//默认话机联动
			option['releasephone'] = option['releasephone'] || -1;//座席挂机后是否进入非长通态：默认为false
			option['status'] = option['status'] && (option['status'] == 4 || option['status'] == 5) ? option['status'] : 4;
			cache[id]['agentId'] = id;
			cache[id]['updateDate'] = new Date().Format("yyyy-MM-dd hh:mm:ss");
			cache[id]['phonenum'] = option['phonenum'] || '12345678';
			cache[id]['password'] = option['password'] || '';
			cache[id]['autoenteridle']= ( ~option['autoenteridle'] ) ? true : false;
			cache[id]['autoanswer']= ( ~option['autoanswer'] ) ? true : false;
			cache[id]['afterWorkBusy'] = option['afterWorkBusy'] || 0;
			cache[id]['socketId'] = option['socketId'] || '';
			cache[id]['status'] = option['status'];
			cache[id]['skillid']=option['skillid'] || '';//技能组,可为空,多个以;分割
			cache[id]['releasephone']=(~option['releasephone']) ? true : false;
			cache[id]['lastStatus'] = 'AgentOther_ShutdownService';
			cache[id]['currentStatus'] = 'AgentOther_ShutdownService';
			cache[id]['phonelinkage'] = ( ~option['phonelinkage'] ) ? true : false;
			_saveSocketId(option['socketId'], id);
			callback(cache[id]);
			//db.insertSession(cache[id], callback);
		}else{
			logger.error('save user fail,agentId is undefined in session !!');
		}
	}
	//当用户重连以后使用
	function setSocketId(agentId, socketId){
		if(!!cache[agentId]){
			 cache[agentId]['socketId'] = socketId;
		}
	}

	/***
		socketIdToAgentId保存着 socketId -- 工号对应关系 
		在用户签入的状态下断网或者关闭连接 执行签出操作
		每次保存时查看该工号是不是存在,存在的话将其删除保证socketIdToAgentId里的对应关系唯一
		否则会出现内存泄漏
	***/
	function _saveSocketId(socketId, agentId){
		let values=Object.keys(socketIdToAgentId).map(function(key) {
				    return socketIdToAgentId[key];
				});
		logger.info('_saveSocketId:', values);
		if(values.length != 0){
			let isIndex=values.indexOf(agentId);
			while(~isIndex){
				let keys=Object.keys(socketIdToAgentId);
				delete socketIdToAgentId[keys[isIndex]];
				values=Object.keys(socketIdToAgentId).map(function(key) {
				    return socketIdToAgentId[key];
				});
				isIndex=values.indexOf(agentId);
			}
			socketIdToAgentId[socketId] = agentId;
		}else{
			socketIdToAgentId[socketId] = agentId;
		}
	}


	function getUser(agentId, cb){
		if(cb !== void 0){
			cb(cache[agentId]);
		}else{
			return cache[agentId];
		}
	}
	//更新用户状态 并发射用户事件
	//events [{"eventType": "AgentOther_InService""workNo": "291"，"content": null}]
	function updateState(events, cb){
		events=events || [];
		for(let e in events){
			let once = events[e];
			if(once['workNo'] !== void 0){
				let user=cache[once['workNo']];
				//logger.info('user',user);
					if(!!user && user['currentStatus'] !== once['eventType']){
						
						user['lastStatus']=user['currentStatus'];
						user['currentStatus']=once['eventType'];
						if(once['content'] !== void 0 && !!once['content']){
							
							cb(user['socketId'], once, once['workNo']);
						}else{
							
							cb(user['socketId'], {'eventType' : user['currentStatus']}, once['workNo']);
						}
					}
			}
		}
	}
	/**
	**数据格式:{"eventType": "AgentOther_InService","workNo": "291","content": null}
	**/
	function updateOneState(event, cb){
		event=event || {};
		if(!!event && !!event['eventContent']){
			event=event['eventContent'];
			event=JSON.parse(event);
			//let once = events[e];
			if(event['workNo'] !== void 0){
				let user=cache[event['workNo']];
				//logger.info('user',user);
					if(!!user && user['currentStatus'] !== event['eventType']){
						
						user['lastStatus']=user['currentStatus'];
						user['currentStatus']=event['eventType'];
						if(event['content'] !== void 0 && !!event['content']){
							
							cb(user['socketId'], event, event['workNo']);
						}else{
							
							cb(user['socketId'], {'eventType' : user['currentStatus']}, event['workNo']);
						}
					}
			}
		}
	}
	//events [{"eventType": "AgentOther_InService""workNo": "291"，"content": null}]
	//发送自定义事件 eventType 事件名称 workNo 工号 content 内容
	function customEven(events, cb){
		for(let e in events){
			let once = events[e];
			if(once['workNo'] !== void 0){
				let user = cache[once['workNo']];
				cb(user['socketId'], once['content'], once['eventType']);
			}
		}
	}
	//回调和直接返回 根据socketId获取工号
	function finishSocketId(socketId, cb){
		logger.info('根据socketId获取工号 before ', Object.keys(socketIdToAgentId).length);
		let agentId=socketIdToAgentId[socketId];
		if(agentId !== void 0){
			delete socketIdToAgentId[socketId];
		}
		if(cb !== void 0){
			cb(agentId);
		}else{
			return agentId;
		}
	}

	//坐席签出以后删除该坐席的工号和socketId对应关系
	function clearCache(agentId){
		if(agentId !== void 0){
			let values=Object.keys(socketIdToAgentId).map(function(key) {
				    return socketIdToAgentId[key];
				});
			//let values=Object.values(socketIdToAgentId);
			let index=values.indexOf(agentId);
			if(~index){
				let keys=Object.keys(socketIdToAgentId);
				delete socketIdToAgentId[keys[index]];
			}
			console.log('clear after', Object.keys(socketIdToAgentId).length);
		}
	}
	//获取有效用户
	function getEffectiveUser(){
		return Object.keys(socketIdToAgentId).length;
	}
	return {
		saveUser:saveUser,
		setSocketId:setSocketId,
		getUser:getUser,
		updateState:updateState,
		customEven:customEven,
		finishSocketId:finishSocketId,
		clearCache:clearCache,
		updateOneState:updateOneState,
		getEffectiveUser:getEffectiveUser
	}
})()

module.exports={session}