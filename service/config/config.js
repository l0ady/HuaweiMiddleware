const session = require('../session/session').session
module.exports={
		//host :'10.246.152.24',//华为服务ip 10.246.152.24:8000 (测试) https:8043
		//host :'10.246.152.25',
		//port : 8000,
		//dburl:'mongodb://10.246.146.235:27017/HttpServer'
		host :'10.1.10.23',//华为服务ip 10.246.152.24:8000 (测试) https:8043
		port : 8000,
		//获取排队数工号,该工号需要在华为平台配置全技能队列
		monitor : {'agentId':'59999','phonenum':59999, 'status':5, 'autoanswer':-1,'autoenteridle':-1},
		queueTimer:3,//指定获取排队人数的轮询时间(秒)
		dburl : 'mongodb://10.1.10.83:27017/HttpServer'
	}
