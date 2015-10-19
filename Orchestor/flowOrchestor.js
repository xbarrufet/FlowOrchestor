var samples = require("./grafSamples.js");
var FlowSteps = require("./flowData.js")
var FlowQueueManager = require("./flowQueueManager.js")

var flowStep=new FlowSteps();
var flowQueueManager = new FlowQueueManager();


flowQueueManager.connect("192.168.1.121",consumeInstructionSet,consumeTaskEnd,errorConnection);

function consumeInstructionSet(msg) {
    console.log(msg.content.toString('utf8'));
    data =JSON.parse(msg.content.toString('utf8'));
    flowStep.parseFlow(data.flow,startFlowExecution);
}

function consumeTaskEnd(msg) {
    data =JSON.parse(msg.content.toString('utf8'));
    flowStep.stepCompleted(data.stepId);
    console.log("task "+ data.stepId + " completed");
    executeNextTask(flowCompleted);
}

function errorConnection(err) {
  console.error(err);
  process.exit(1);
}

function startFlowExecution(flowTip) {
    console.log("Start flow execution");
    executeNextTask(flowCompleted);
}


function executeNextTask(eofFunction) {
    if(!flowStep.allProcessed()) {
           var tasks=flowStep.getStepsReady();
           console.log(tasks.length + " tasks to execute");
           for(var t=0;t<tasks.length;t++) {
                flowQueueManager.sendTaskMessage(tasks[t]);
           }
    } else {
        eofFunction();
    }
}
    
    
function flowCompleted() {
    console.log("Flow execution completed");
}
