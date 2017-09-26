const actTransferConf=require('../config/actTransferCallConf');//转接
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');
/***
	devicetype:转移设备类型，技能队列为1，业务代表为2，IVR设备为3，系统接入码为4，
				外呼号码为5
	address:转移地址，即转移设备类型对应的设备ID。最大长度24。
	mode:转移模式，在内部转移的情况下：释放转为0，挂起转为1，成功转为2，
		指定转为3，合并转为4；在外呼转移的情况下，释放转为1，成功转为2，
		通话转为3，三方转为4
	callappdata: 需设置的随路数据。内容可为空，最大长度为1024
***/
module.exports=function(socket, session){
	socket.on('actTransfer', function(data){
		logger.info(data['agentId'], '转接:', JSON.stringify(data));
		
		egine(data, actTransferConf, config);
	})
}



