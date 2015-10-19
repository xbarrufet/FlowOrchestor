
var data = require('./flow.js');
var redis = require('redis');
var uuid = require('node-uuid');

var clientRedis = redis.createClient(6379,"192.168.1.121",{});
var context = uuid.v4();
    

clientRedis.on("error", function (err) {
    console.log("Error " + err);
});

clientRedis.on('connect', function() {
    console.log('connected');
    storeFlowObject(data.graf)
});


function storeFlowObject(flow) {
    clientRedis.set(context + ":flow",flow,function(err, reply) {
                    console.log("storng flow in " + context + " " + reply);
                    }); 
}
