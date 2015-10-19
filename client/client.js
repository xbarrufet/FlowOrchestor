var data = require('./flow.js');
var qis = 'instruction_set_queue';
var uuid = require('node-uuid');


function bail(err) {
  console.error(err);
  process.exit(1);
}

var channel,connection

require('amqplib/callback_api')
    .connect('amqp://192.168.1.121',function(err, conn) {
            console.log("connected");
            connection=conn;
            if (err != null) bail(err);
            conn.createChannel(function(err,ch) {
                if (err != null) bail(err);
                channel=ch;
                channel.assertQueue(qis);
                sendMessage(JSON.stringify(data.graf));
            });
        });

function sendMessage(stream) {
 channel.sendToQueue(qis, new Buffer(stream));
 console.log(stream + " sent");    
}


