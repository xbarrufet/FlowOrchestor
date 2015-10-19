//var dataLoad = require('../client/flow.js');

var ProcessSteps={}

function ProcessSteps {
    procesSteps ={};
    this.inputChannel = [];
    this.outputChannel = [];
}


function FlowTips() {
    this.startProcess=[];
    this.endProcess=[];
}


function copyFlowTip(flowTip) {
var ft = new FlowTips();
for(i=0;i<flowTip.startProcess.length;i++)
    ft.startProcess.push(flowTip.startProcess[i]);
for(i=0;i<flowTip.endProcess.length;i++)
    ft.endProcess.push(flowTip.endProcess[i]);
return ft;
}

FlowTips.prototype.tipEndExist = function (tip) {
   for(var t=0;t<this.endProcess.length;t++) {
    if(this.endProcess[t]==tip)
        return true;
   }
    return false;
}


function Step() {
    this.stepId=guid();
    this.processName="";
    this.dependencies = [];
    this.input=[]
    this.ouput=[]
    this.status="PENDING";
}

function StepFlow(data) {
    this.stepFlow=data;
}

StepFlow.prototype.isStep = function() {
    if (this.stepFlow.step)
        return true;
    return false;
}

StepFlow.prototype.getProcessName = function() {
    if (this.stepFlow.step)
        return this.stepFlow.step.process;
    return "";
}

StepFlow.prototype.getSubFlows = function() {
    var result = []
    for(var t=0;t<this.stepFlow.paralel.length;t++) {
        var subFlow = this.stepFlow.paralel[t];
        result.push(subFlow);
    }
    return result;
}


function Flow(data) {
   this.flow=data;
    this.currentElement = 0;
}

Flow.prototype.nextElement = function() {
   var res= new StepFlow(this.flow[this.currentElement]);
    this.currentElement=this.currentElement+1;
   return res;
}

Flow.prototype.EOF = function() {
    return (this.currentElement>=this.flow.length);
}


function startParsing(data) {
    flowTips = parseFlow(data,new FlowTips())
    for(var k=0;k<flowTips.startProcess.length;k++) {
        var newInput = guid();
        ProcessSteps[flowTips.startProcess[k]].input.push(newInput);
    }
    return flowTips;
}

function printProcesses(flowTip) {
   for (var k in ProcessSteps) {
    if (ProcessSteps.hasOwnProperty(k)) {
        console.log('Process:' + k + ', value is: ' + JSON.stringify(ProcessSteps[k]));
    }
   }
    console.log("-----------------------------------");
    console.log(flowTip);
}


function parseFlow(rawFlaw,flowTips) {
    var flow = new Flow(rawFlaw);
    return parseElement(flow,flowTips);
}


function parseElement(flow,flowTips) {
    if(flow.EOF())
        return flowTips;
    else {
        var element = flow.nextElement();
        flowTips = parseElement(flow,flowTips);
        if(element.isStep()) {
            var step = new Step();
            step.processName=element.getProcessName();
            ProcessSteps[step.stepId]=step;
            if(flowTips.endProcess.length==0) {
                flowTips.endProcess.push(step.stepId);
                step.ouput.push(guid());
            } else {
                for(var k=0;k<flowTips.startProcess.length;k++) {
                    var newInput = guid();
                    ProcessSteps[flowTips.startProcess[k]].input.push(newInput);
                    ProcessSteps[flowTips.startProcess[k]].dependencies.push(step.stepId);
                    step.ouput.push(newInput);
                }
                flowTips.startProcess=[]
            }
            flowTips.startProcess.push(step.stepId);
            return flowTips;
            
        } else {
            //is a paralell execution
            var subFlows =element.getSubFlows();
            var subFlowTips = []
            for (var t=0;t<subFlows.length;t++) {
                var newFlowTip = copyFlowTip(flowTips);
                subFlowTips.push(parseFlow(subFlows[t].flow,newFlowTip));
            }
            var mergedFlowTips = new FlowTips();
            for (var i=0;i<subFlowTips.length;i++) {
                for(var x=0;x<subFlowTips[i].startProcess.length;x++) {
                    mergedFlowTips.startProcess.push(subFlowTips[i].startProcess[x]);
                }
                for(var y=0;y<subFlowTips[i].endProcess.length;y++) {
                    if(!mergedFlowTips.tipEndExist(subFlowTips[i].endProcess[y]))
                       mergedFlowTips.endProcess.push(subFlowTips[i].endProcess[y]);
                }
            }
            return mergedFlowTips;
        }
        
    }
}


