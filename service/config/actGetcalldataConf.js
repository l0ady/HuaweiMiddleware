const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//设置随路数据
			url:'/agentgateway/resource/calldata/:agentid/appdata',
			type:'GET',
			getParam:function(agent, conf, param, callblack){
				callblack.write("");
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			//处理随路数据
			execute:function(calldata){
				var arrBuf = new Array();
				var temp = '';
				var ch, i = 0;
				var cint = 0;
				var isFieldEnd = true;//是否解析一个字段完成

				//将QueryCallDataEx接口的返回值转成unicode字符串
				var s = escape(calldata);	
				
				//呼叫数据为空，直接返回
				var len = s.length;
				if (0 == len) {
					return arrBuf;
				}
					
				while (i < len) {
			　　ch = s.charCodeAt(i);
			　　if ((33 <= ch && ch < 37) || (37 < ch && ch <= 128)) {	//除百分号%以外的所有字符
						temp = temp.concat(String.fromCharCode(ch));						
						i += 1;
						isFieldEnd = false;		//正在解析一个新的字段
			　　} else if (ch == 37) {								//find %
				　　cint = 0;
						i += 1;
				　　if ('u' != s.substr(i,1)) {　　　　 // %XX : map to ascii(XX)										
					　　cint = (cint << 4) | parseInt(s.substr(i,1), 16);
					　　cint = (cint << 4) | parseInt(s.substr(i+1,1), 16);
					　　i += 2;
				　　} else {　　　　　　　　　　　　　　// %uXXXX : map to unicode(XXXX)
							i += 1;
							cint = (cint << 4) | parseInt(s.substr(i,1), 16);
							cint = (cint << 4) | parseInt(s.substr(i+1,1), 16);
							cint = (cint << 4) | parseInt(s.substr(i+2,1), 16);
							cint = (cint << 4) | parseInt(s.substr(i+3,1), 16);
					　　i += 4;
				　　}
						if (cint != 0) {
			　　		temp = temp.concat(String.fromCharCode(cint));
							isFieldEnd = false;		//正在解析一个新的字段
						} else {//遇到一个字段的结束符"%00"
							if (!isFieldEnd) {
								//arrBuf=arrBuf+temp+';';
								arrBuf.push(temp);
								temp = '';
								isFieldEnd = true;		//一个字段解析结束
							}
						}
			　　}// end of else if (ch == 37)
			　}// end of while

				//如果最后一个字段后没有跟结束符"%00"	，则需要将其保存
				if (!isFieldEnd)arrBuf.push(temp);
					//arrBuf=arrBuf+temp+';';
					
				return arrBuf;
			},
			fail:function(param, agent, conf, data){
				logger.error("查询随路数据:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				/*
				 *	{"message":"","retcode":"0"}
				 */
				data = data || err;
				data = JSON.parse(data);
				logger.info("查询随路数据:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					var arr=agent.execute(data['result']);
					logger.info("查询随路数据success:", arr);
					cpu.emit(session.getUser(param['agentId'])['socketId'], arr, 'actGetcalldata');
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}