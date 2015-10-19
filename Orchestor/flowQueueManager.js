queue = "task_flow_exchange";
queue_is = "tasks_instruction_set";
queueReply = "task_flow_reply";

var amqp = require('amqplib/callback_api')

var testChannel;

function FlowQueueManager() {
    this.connection = {};
    this.taskChannel ={};
}

FlowQueueManager.prototype.connect = function(ip,consumeIsFunction,consumeTaskFunction,errorFunction) {
     amqp.connect("amqp://" + ip,function(err, conn) {
            console.log("connected");
            if (err != null) errorFunction(err);
            this.connection=conn;
            this.connection.createChannel(function(err,ch) {
                if (err != null) errorFunction(err);
                this.taskChannel=ch;
                testChannel=this.taskChannel;
                this.taskChannel.assertQueue(queue);
                this.taskChannel.assertQueue(queue_is);
                this.taskChannel.assertQueue(queueReply);
                this.taskChannel.consume(queue_is,consumeIsFunction);
                this.taskChannel.consume(queueReply,consumeTaskFunction);
                // test
                this.taskChannel.consume(queue,workerTest);
                console.log("connected");
            });               
     })
}
                  

FlowQueueManager.prototype.sendTaskMessage = function(task) {
    console.log("asking for execution:" + task.stepId);
    this.taskChannel.sendToQueue(queue, new Buffer(task.stepId));
}
    

    
function workerTest(msg) {
    var stepId =  msg.content.toString();
    console.log("WORKER:" + stepId + " received");
    setTimeout(function() {
                  testChannel.sendToQueue(queueReply, new Buffer(stepId));
                }, 3000);
}

module.exports = FlowQueueManager