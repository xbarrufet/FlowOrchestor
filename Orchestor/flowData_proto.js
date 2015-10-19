//var dataLoad = require('../client/flow.js');





/*********** FLOW TIPS *************/
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

/*********** STEPS and STEPLOW *************/
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

/****************** FLOWS *****************/

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

/****************** PROCESS STEPS *****************/

function ProcesSteps {
    this.procesSteps ={};
    this.inputChannel = [];
    this.outputChannel = [];
    this.numPending = 0
    this.actives =[]
}

ProcessSteps.prototype.addStep = function(step) {
    this.procesSteps[step.stepId]=step
    if(step.status=="PENDING")
        this.numPending = this.numPending + 1;
}

ProcessSteps.prototype.getStep = function(stepId) {
    return this.procesSteps[stepId]
}


ProcessSteps.prototype.parseFlow = function () {
    flowTips = _parseFlow(this,data,new FlowTips())
    for(var k=0;k<flowTips.startProcess.length;k++) {
        var newInput = guid();
        ProcessSteps[flowTips.startProcess[k]].input.push(newInput);
    }
    return flowTips;
}


ProcesSteps.prototype.allProcessed = function () {
    return this.numPending==0;
}

ProcessSteps.prototype.stepCompleted = function(stepId) {
    this.procesSteps[stepId].status = "COMPLETED";
    var index = this.actives.indexOf(stepId);
    if (index > -1) {
        this.actives.splice(index, 1);
    }
}


ProcesSteps.prototype.stepStarted = function(stepId) {
    this.procesSteps[stepId].status = "IN PROGRESS";
    this.actives.push(stepId);
}


ProcesSteps.prototype.getStepsReady = function() {
    var res =[];
    for(var t=0;t<this.procesSteps.length;t++) {
        var step = this.procesSteps[t];
        if (this.checkDependencies(step.stepId))
            res.push(step);
    }
    return res;
}


ProcesSteps.prototype.checkDependencies = function(stepId) {
    var step = this.getStep(stepId);
    var ok=true;
    for(var t=0;t<step.dependencies.length) 
        ok=ok && (this.getStep(step.dependencies[t]).status=="COMPLETED")
    return ok;
}


function _parseFlow(ps,rawFlaw,flowTips) {
    var flow = new Flow(rawFlaw);
    return _parseElement(processSteps,flow,flowTips);
}


function _parseElement(ps,flow,flowTips) {
    if(flow.EOF())
        return flowTips;
    else {
        var element = flow.nextElement();
        flowTips = _parseElement(ps,flow,flowTips);
        if(element.isStep()) {
            var step = new Step();
            step.processName=element.getProcessName();
            ps.addStep(step);
            if(flowTips.endProcess.length==0) {
                flowTips.endProcess.push(step.stepId);
                step.ouput.push(guid());
            } else {
                for(var k=0;k<flowTips.startProcess.length;k++) {
                    var newInput = guid();
                    var follower= ps.getStep(flowTips.startProcess[k]);
                    follower.input.push(newInput);
                    follower.dependencies.push(step.stepId);
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
                subFlowTips.push(_parseFlow(ps,subFlows[t].flow,newFlowTip));
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


