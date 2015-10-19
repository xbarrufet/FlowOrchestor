var samples = require("./grafSamples.js");
queue_is = "tasks_instruction_set";
var amqp = require('amqplib/callback_api')


amqp.connect("amqp://192.168.1.121",function(err, conn) {
            console.log("connected");
            if (err != null) console.log("ERRROR:" + err);
            conn.createChannel(function(err,ch) {
                    if (err != null) console.log("ERRROR:" + err);
                    ch.assertQueue(queue_is);
                    ch.sendToQueue(queue_is, new Buffer(JSON.stringify(samples.graf1)),{persistent: false});
            });               
})


