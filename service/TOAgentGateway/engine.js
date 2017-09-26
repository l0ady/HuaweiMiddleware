var http = require("http");
const session = require('../session/session').session

module.exports=function(param, agent, conf){
    var opt = {  
        host:conf['host'],
        port:conf['port'],  
        method:agent['type'],
        path:agent.before(agent, conf, param),
        headers:{'Content-Type':'application/json'}
    }
  
var body = '';  
var req = http.request(opt, function(res) {
    if(res.statusCode != 200){
        console.log("response: " + res.statusCode);
    }
    res.on('data',function(data){  
        body += data;  
    }).on('end', function(){
       // console.log('end:', body);
        agent.success(param, agent, conf, body);
    });  
}).on('error', function(e) {
    console.log("error: " + e.message);
    agent.fail(param, agent, conf, body);
})
agent.getParam(agent, conf, param, req);  
}
