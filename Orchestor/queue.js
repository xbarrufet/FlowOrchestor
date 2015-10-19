
var qis = 'instruction_set_queue';

var channel

function bail(err) {
  console.error(err);
  process.exit(1);
}


require('amqplib/callback_api')
    .connect('amqp://192.168.1.121',function(err, conn) {
            console.log("connected");
            if (err != null) bail(err);
            conn.createChannel(function(err,ch) {
                if (err != null) bail(err);
                channel=ch;
                channel.assertQueue(qis);
                channel.consume(qis,consumeData)
                console.log("waiting for messages");
            });
        });

function consumeData(msg) {
    var flow;
    if (msg !== null) {
        try {
            flow =JSON.parse(msg.content.toString('utf8'));
        } catch (e) {
            bail(e);
        }
        channel.ack(msg);
    }
    return flow;
}

