const MongoClient = require('mongodb').MongoClient
const dburl = require('../service/config/config').dburl;

let insert=function(db, data, callback){
	var collection = db.collection('session');
	collection.insertMany([data], function(err, result) {
    console.log("insert success");
    callback(result);
  });
}

let select=function(db, data, callback){
	var collection = db.collection('session');
	collection.findOne(data).then(function(result){
		callback(result);
	})
}

let deleteSession=function(db, data, callback){
	var collection = db.collection('session');
	collection.deleteMany(data, function(err, result){
		if(err) console.log('deleteSession err', err);
		callback(result);
	})
}
//插入数据前先删除该工号的数据;
var insertSession=function(data, callback){
	MongoClient.connect(dburl, function(err, db){
		if(err) console.log('mongo insert connect err', err);
		deleteSession(db, {agentId:data['agentId']}, function(){
			insert(db, data, function(){
				db.close();
				callback(data);
			})
		})
	})
}

var queryOneSession=function(args, callback){
	MongoClient.connect(dburl, function(err, db){
		if(err) console.log('mongo query connect err', err);

		select(db, args, function(result){
			db.close();
			callback(result);
		})
	})
}

module.exports={insertSession, queryOneSession}