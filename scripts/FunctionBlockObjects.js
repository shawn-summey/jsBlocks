///////////////////////////////////////////////////////////
//
//		Block Object Definitions
//		Copyright 2007 Shawn Summey 
//
//		Permission is hereby granted, free of charge, to any person obtaining a copy of this 	
//		software and associated documentation files (the "Software"), to deal in the Software without restriction,
//		including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//		sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
//		the following conditions:
//
//		The above copyright notice and this permission notice shall be included in all copies or
//		substantial portions of the Software.
//
//		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
//		INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
//		PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//		DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
//		CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//////////////////////////////////////////////////////////

//**************************************************************************
//
//			Define an AND BLOCK
//
//**************************************************************************
function AndBlock()
{
    this.objectName = "And";
    this.text = "AND";
    this.YOffset = 0;
    this.stack = 1;
    this.numberInputs = 0;
    
    do {
        this.inputs = prompt("Enter number of inputs (2-8)", "2");
        this.numberInputs = parseInt(this.inputs)
    }
    while (this.numberInputs < 2 || this.numberInputs > 8);
    
    //extend block in inputs is greater than 4
    if (this.numberInputs > 4) {
        this.divHeight = this.divHeight + ((this.numberInputs - 4)*20)
    }
    
    //determine input spacing factor
    this.inputFactor = 100 / this.numberInputs;

    //2 through 4 uses the same div height.
    //5 and above start tacking on extra height
    if (this.numberInputs == 2)
        this.YOffset = 25;
    else if (this.numberInputs == 3)
        this.YOffset = 15;
    else if (this.numberInputs == 4)
        this.YOffset = 10;
    else
        this.YOffset = (this.numberInputs +45)/this.numberInputs;
}
AndBlock.prototype= new Base;					        //Derive from Base class

AndBlock.prototype.addConnections = function()			//Override connections function
{
    for (connectorIndex = 0; connectorIndex < this.numberInputs; connectorIndex++) {
        this.inConnections[connectorIndex] = new Connector(this, 1, connectorIndex * this.inputFactor + this.YOffset);
    }
    this.outConnections[0] = new Connector(this, 0, 50);
}

AndBlock.prototype.Execute = function() {

    this.stack = 1;
    for (var i = 0; i < this.numberInputs; i++) {
        this.stack = this.stack && this.inConnections[i].connectedFrom.value;
    }
    if (this.stack)
        this.outConnections[0].value = 1;
    else
        this.outConnections[0].value = 0;
}
//**************************************************************************
//
//			Define an OR BLOCK
//
//**************************************************************************
function OrBlock()
{
    this.objectName = "Or";
    this.text = "OR";
    this.YOffset = 0;
    this.stack = 0;
    this.numberInputs = 0;
    
    do {
        this.inputs = prompt("Enter number of inputs (2-8)", "2");
        this.numberInputs = parseInt(this.inputs)
    }
    while (this.numberInputs < 2 || this.numberInputs > 8);

    //extend block when inputs are greater than 4
    if (this.numberInputs > 4) {
        this.divHeight = this.divHeight + ((this.numberInputs - 4) * 20)
    }

    //determine input spacing factor
    this.inputFactor = 100 / this.numberInputs;

    //2 through 4 uses the same div height.
    //5 and above start tacking on extra height
    if (this.numberInputs == 2)
        this.YOffset = 25;
    else if (this.numberInputs == 3)
        this.YOffset = 15;
    else if (this.numberInputs == 4)
        this.YOffset = 10;
    else
        this.YOffset = (this.numberInputs + 45) / this.numberInputs;
}

OrBlock.prototype= new Base;	//Derive from Base class

OrBlock.prototype.addConnections=function()
{
	//alert("Add Connections for OR block.");
    for (connectorIndex = 0; connectorIndex < this.numberInputs; connectorIndex++) {
        this.inConnections[connectorIndex] = new Connector(this, 1, connectorIndex * this.inputFactor + this.YOffset);
    }

	this.outConnections[0] = new Connector(this,0,50);
}
OrBlock.prototype.Execute=function()
{
    this.stack = 0;
    for (var i = 0; i < this.numberInputs; i++) {
        this.stack = this.stack || this.inConnections[i].connectedFrom.value;
    }
    if (this.stack)
        this.outConnections[0].value = 1;
    else
        this.outConnections[0].value = 0;
}
//**************************************************************************
//
//			Define a DI BLOCK
//
//**************************************************************************
function DiBlock()
{
    this.objectName = "Di";
	var tag=prompt("Enter tagname","tagname");
	this.text=tag;
	this.divHeight=16;
	this.divWidth=120;
}

DiBlock.prototype= new Base;	//Derive from Base class

DiBlock.prototype.addConnections=function()
{
	this.outConnections[0] = new Connector(this,0,50);
}
DiBlock.prototype.clickHandler=function(e)	//override this function to simulate discrete input
{
	if(!this.hasMoved)
	{
		if(this.outConnections[0].isConnected && this.sheetObject.simulateOn)
		{
			if(this.outConnections[0].value==0)
			{
				this.outConnections[0].value=1;
			}
			else
			{
				this.outConnections[0].value=0;
			}
		}
	}
	else
	{
		this.hasMoved=0;
		this.divObj.style.backgroundColor="yellow";
	}
}
DiBlock.prototype.Execute=function()
{
	if(this.outConnections[0].value)
	{
		this.outConnections[0].value=1;
		this.divObj.style.backgroundColor = "lime";
	}
	else
	{
		this.outConnections[0].value=0;
		this.divObj.style.backgroundColor = "tomato";
	}
}
//**************************************************************************
//
//			Define a DO BLOCK
//
//**************************************************************************
function DoBlock()
{
    this.objectName = "Do";
	var tag=prompt("Enter tagname","tagname");
	this.text=tag;
	this.divHeight=16;
	this.divWidth=120;
}

DoBlock.prototype= new Base;	//Derive from Base class

DoBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,50);
}
DoBlock.prototype.Execute=function()
{
	if(this.inConnections[0].connectedFrom.value)
		this.divObj.style.backgroundColor="lime";
	else
		this.divObj.style.backgroundColor="tomato";
}
//**************************************************************************
//
//			Define a 1 SEC TIMER BLOCK
//
//**************************************************************************
function OneSecondTimerBlock()
{
    this.objectName = "OneSecondTimer";
	this.text="1 SEC TIMER";
	//this.d=new Date();
	this.isTiming = 0;
	this.doneTiming=0;
	this.startTime=0;
	this.currentTime=0;
	this.timerTime=0;
}

OneSecondTimerBlock.prototype = new Base;

OneSecondTimerBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,20);
	this.inConnections[1] = new Connector(this,1,50);
	this.inConnections[2] = new Connector(this,1,80);

	this.outConnections[0] = new Connector(this,0,20);
	this.outConnections[1] = new Connector(this,0,80);
}

OneSecondTimerBlock.prototype.Execute=function()
{
	if(this.inConnections[1].connectedFrom.value)	//timer EN/RST is ON
	{
		if(this.inConnections[0].connectedFrom.value && !this.isTiming) //start timer
		{
			this.d = new Date();
			this.startTime = this.d.getTime();
			this.isTiming=1;
			delete this.d;
		}
		if(this.isTiming && !this.doneTiming)
		{
			this.d = new Date();
			this.currentTime = this.d.getTime();
			this.timerTime = parseInt((this.currentTime - this.startTime)/1000);
			this.outConnections[1].value = this.timerTime;
			delete this.d;
		}
		if(this.timerTime >= this.inConnections[2].connectedFrom.value)
		{
			this.outConnections[0].value = 1;
			this.doneTiming = 1;
		}
		if(this.inConnections[0].connectedFrom.value && this.outConnections[0].value==0)
		{
			this.doneTiming=0;
		}
		else
		{
			this.doneTiming=1;
		}
	}
	else
	{
		this.timerTime = 0;
		this.outConnections[1].value = this.timerTime;
		this.outConnections[0].value =0;
		this.isTiming=0;
		this.doneTiming=0;
	}
}
//**************************************************************************
//
//			Define a SET/RESET BLOCK
//
//**************************************************************************
function SetResetBlock()
{
    this.objectName = "SetReset";
	this.text="SR";
	this.lastOutput=0;
}

SetResetBlock.prototype = new Base;

SetResetBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,25);
	this.inConnections[1] = new Connector(this,1,75);

	this.outConnections[0] = new Connector(this,0,25);
}
SetResetBlock.prototype.Execute=function()
{
	if(this.inConnections[0].connectedFrom.value || this.lastOutput)
	{
		this.outConnections[0].value=1;
		this.lastOutput=1;
	}
	
	if(this.inConnections[1].connectedFrom.value && !this.inConnections[0].connectedFrom.value)
	{
		this.outConnections[0].value=0;
		this.lastOutput=0;
	}
}
//**************************************************************************
//
//			Define a Constant Block
//
//**************************************************************************
function ConstantBlock()
{
    this.objectName = "Constant";
	this.divHeight=16;
	this.divWidth=40;
	this.temp=prompt("Enter value","0");
	this.constantValue=parseInt(this.temp);
	this.text = this.constantValue;
}
ConstantBlock.prototype = new Base;

ConstantBlock.prototype.addConnections=function()
{
	this.outConnections[0] = new Connector(this,0,50);
}
ConstantBlock.prototype.Execute = function()
{
	this.outConnections[0].value = this.constantValue
}
ConstantBlock.prototype.clickHandler=function(e)
{
	if(!this.hasMoved)
	{
		this.temp=prompt("Enter value",this.constantValue);
		this.constantValue = parseInt(this.temp);
		this.divObj.innerHTML = this.constantValue;
	}
	else
	{
		this.hasMoved=0;
	}
}
//**************************************************************************
//
//			Define a Variable Block
//
//**************************************************************************
function VariableBlock()
{
    this.objectName = "Variable";
	this.divHeight=16;
	this.divWidth=40;
	this.variableValue=0;
	this.text=0;
}

VariableBlock.prototype = new Base;

VariableBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,50);
}

VariableBlock.prototype.Execute=function()
{
	this.variableValue = this.inConnections[0].connectedFrom.value;
	this.divObj.innerHTML = this.variableValue;
}
//**************************************************************************
//
//			Define an AI Block
//
//**************************************************************************
function AiBlock()
{
    this.objectName = "Ai";
	this.divHeight=16;
	this.divWidth=120;
	this.text=819;
	this.rawValue=819;
}

AiBlock.prototype = new Base;

AiBlock.prototype.addConnections=function()
{
	this.outConnections[0] = new Connector(this,0,50);
}
AiBlock.prototype.clickHandler=function(e)
{
	if(!this.hasMoved)
	{
		if(this.outConnections[0].isConnected && this.sheetObject.simulateOn)
		{
			if(e.clientX>parseInt(this.divObj.style.left) && e.clientX<parseInt(this.divObj.style.left)+40)
			{
				this.rawValue--;
			}
			else if(e.clientX>parseInt(this.divObj.style.left)+80 && e.clientX<parseInt(this.divObj.style.left)+120)
			{
				this.rawValue++;
			}
			else
			{
				this.rawValue=prompt("Enter value",this.rawValue);
			}
		}
	}
	else
	{
		this.hasMoved=0;
		this.divObj.style.backgroundColor="yellow";
	}
}
AiBlock.prototype.Execute=function()
{
	if(this.rawValue<0)
		this.rawValue=0;

	if(this.rawValue>4095)
		this.rawValue=4095;

	this.divObj.innerHTML = this.rawValue;
	this.outConnections[0].value = this.rawValue
}

//**************************************************************************
//
//			Define an AIN Block
//
//**************************************************************************
function AinBlock()
{
    this.objectName = "Ain";
	this.text = "AIN"
	this.linearConstant=0.0;
	this.scaledValue=0.0;
}

AinBlock.prototype = new Base;

AinBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,25);
	this.inConnections[1] = new Connector(this,1,50);
	this.inConnections[2] = new Connector(this,1,75);

	this.outConnections[0] = new Connector(this,0,25);
}

AinBlock.prototype.Execute=function()
{
	this.linearConstant=parseFloat(3276/(this.inConnections[1].connectedFrom.value - this.inConnections[2].connectedFrom.value))

	this.scaledValue = parseFloat((this.inConnections[0].connectedFrom.value - 819.0)/this.linearConstant);
	//y=mx+b or x=(y-b)/m

	this.outConnections[0].value = this.scaledValue.toFixed(2);
}

//**************************************************************************
//
//			Define a Greater Than Block
//
//**************************************************************************
function GtBlock()
{
    this.objectName = "Gt";
	this.text="GT";
}

GtBlock.prototype = new Base;

GtBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,25);
	this.inConnections[1] = new Connector(this,1,75);

	this.outConnections[0] = new Connector(this,0,25);
}

GtBlock.prototype.Execute=function()
{
	if(parseFloat(this.inConnections[0].connectedFrom.value) > parseFloat(this.inConnections[1].connectedFrom.value))
		this.outConnections[0].value = 1;
	else
		this.outConnections[0].value = 0;
}
//**************************************************************************
//
//			Define a Less Than Block
//
//**************************************************************************
function LtBlock()
{
    this.objectName = "Lt";
	this.text="LT";
}

LtBlock.prototype = new Base;

LtBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,25);
	this.inConnections[1] = new Connector(this,1,75);

	this.outConnections[0] = new Connector(this,0,25);
}

LtBlock.prototype.Execute=function()
{
	if(parseFloat(this.inConnections[0].connectedFrom.value) < parseFloat(this.inConnections[1].connectedFrom.value))
		this.outConnections[0].value = 1;
	else
		this.outConnections[0].value = 0;
}
//**************************************************************************
//
//			Define an Unpack 16 Block
//
//**************************************************************************
function UnpackSixteenBlock()
{
    this.objectName = "UnpackSixteen";
	this.text="UNPACK 16";
	this.divHeight=320;
	this.inputNumber=0;
	this.indexCounter=0;
}

UnpackSixteenBlock.prototype = new Base;

UnpackSixteenBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,50);

	for(connectorIndex=0;connectorIndex<16;connectorIndex++)
		this.outConnections[connectorIndex] = new Connector(this,0,(connectorIndex*6.25)+4);
}

UnpackSixteenBlock.prototype.Execute=function()
{
	this.inputNumber = parseInt(this.inConnections[0].connectedFrom.value);

	for(this.indexCounter=0;this.indexCounter<16;this.indexCounter++)
	{
		this.outConnections[this.indexCounter].value = this.inputNumber & 1;
		this.inputNumber=this.inputNumber >> 1;	
	}
}

//**************************************************************************
//
//			Define a Pack 16 Block
//
//**************************************************************************
function PackSixteenBlock()
{
    this.objectName = "PackSixteen";
	this.text="PACK 16";
	this.divHeight=320;
	this.outputNumber=0;
	this.tempNumber=0;
	this.indexCounter=0;
}

PackSixteenBlock.prototype = new Base;

PackSixteenBlock.prototype.addConnections=function()
{
	for(connectorIndex=0;connectorIndex<16;connectorIndex++)
		this.inConnections[connectorIndex] = new Connector(this,1,(connectorIndex*6.25)+4);

	this.outConnections[0] = new Connector(this,0,50);
}

PackSixteenBlock.prototype.Execute=function()
{
	this.inputNumber = this.inConnections[0].connectedFrom.value;
	this.outputNumber = 0;
	this.outConnections[0].value=0;

	for(this.indexCounter=0;this.indexCounter<16;this.indexCounter++)
	{
		if(this.inConnections[this.indexCounter].connectedFrom==null)
			this.tempNumber=0;
		else
		{
			if(this.inConnections[this.indexCounter].connectedFrom.value)
				this.tempNumber = Math.pow(2,this.indexCounter);
			else
				this.tempNumber = 0;
		}
		
		this.outputNumber = this.outputNumber + this.tempNumber;

		this.outConnections[0].value = this.outputNumber;
	}
}

//**************************************************************************
//
//			Define a First Order Lag Block
//
//**************************************************************************
function FirstOrderLagBlock()
{
    this.objectName = "FirstOrderLag";
	this.text="1ST ORDER";
	this.lastpv=0.0;
	this.currentScan=0;
	this.lastScan=0;
	this.firstScan=1;
}

FirstOrderLagBlock.prototype = new Base;

FirstOrderLagBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,20);
	this.inConnections[1] = new Connector(this,1,50);
	this.inConnections[2] = new Connector(this,1,80);

	this.outConnections[0] = new Connector(this,0,20);
}

FirstOrderLagBlock.prototype.Execute=function()
{
	this.d = new Date();
	this.currentScan = this.d.getTime();
	delete this.d;

	if(this.firstScan)
	{
		this.lastScan = this.currentScan;
		this.firstScan = 0;
	}
	else
	{
		this.scan = parseInt((this.currentScan - this.lastScan)/1000);
		if(this.scan >= 1)
		{
			this.pv = parseFloat(this.inConnections[0].connectedFrom.value);
			this.delay = parseFloat(this.inConnections[1].connectedFrom.value);
			this.lag = parseFloat(this.inConnections[2].connectedFrom.value);

			this.outpv = parseFloat(this.lastpv +(this.delay/(this.delay+this.lag))*(this.pv-this.lastpv));

			this.outConnections[0].value = this.outpv.toFixed(1);
			this.lastpv = this.outpv;

			this.lastScan = this.currentScan;
		}
		else
		{
			//this.lastScan = this.currentScan;
		}
	}
}

//**************************************************************************
//
//			Define a Select Block
//
//**************************************************************************
function SelectBlock()
{
    this.objectName = "Select";
	this.text="SELECT";
}

SelectBlock.prototype = new Base;

SelectBlock.prototype.addConnections=function()
{
	this.inConnections[0] = new Connector(this,1,20);
	this.inConnections[1] = new Connector(this,1,50);
	this.inConnections[2] = new Connector(this,1,80);

	this.outConnections[0] = new Connector(this,0,20);
}

SelectBlock.prototype.Execute=function()
{
    if (this.inConnections[0].connectedFrom.value)
	{
	    this.outConnections[0].value = this.inConnections[1].connectedFrom.value
	}
	else
	{
	    this.outConnections[0].value = this.inConnections[2].connectedFrom.value
	}
}


//New blocks below

function AddBlock() {
    this.objectName = "Add";
    this.text = "ADD";
}

AddBlock.prototype = new Base;

AddBlock.prototype.addConnections = function() {
    this.inConnections[0] = new Connector(this, 1, 25);
    this.inConnections[1] = new Connector(this, 1, 75);

    this.outConnections[0] = new Connector(this, 0, 50);
}

AddBlock.prototype.Execute = function() {
    this.outConnections[0].value = (this.inConnections[0].connectedFrom.value + this.inConnections[1].connectedFrom.value).toFixed(2);
}

function MultiplyBlock() {
    this.objectName = "Mul";
    this.text = "MUL";
}

MultiplyBlock.prototype = new Base;

MultiplyBlock.prototype.addConnections = function() {
    this.inConnections[0] = new Connector(this, 1, 25);
    this.inConnections[1] = new Connector(this, 1, 75);

    this.outConnections[0] = new Connector(this, 0, 50);
}

MultiplyBlock.prototype.Execute = function() {
    this.outConnections[0].value = (this.inConnections[0].connectedFrom.value * this.inConnections[1].connectedFrom.value).toFixed(2);
}

function DivideBlock() {
    this.objectName = "Div";
    this.text = "DIV";
}

DivideBlock.prototype = new Base;

DivideBlock.prototype.addConnections = function() {
    this.inConnections[0] = new Connector(this, 1, 25);
    this.inConnections[1] = new Connector(this, 1, 75);

    this.outConnections[0] = new Connector(this, 0, 50);
}

DivideBlock.prototype.Execute = function() {
    if (this.inConnections[1] != 0) {
        this.outConnections[0].value = (this.inConnections[0].connectedFrom.value / this.inConnections[1].connectedFrom.value).toFixed(2);
    }
}

function SubtractBlock() {
    this.objectName = "Sub";
    this.text = "SUB";
}

SubtractBlock.prototype = new Base;

SubtractBlock.prototype.addConnections = function() {
    this.inConnections[0] = new Connector(this, 1, 25);
    this.inConnections[1] = new Connector(this, 1, 75);

    this.outConnections[0] = new Connector(this, 0, 50);
}

SubtractBlock.prototype.Execute = function() {
        this.outConnections[0].value = (this.inConnections[0].connectedFrom.value - this.inConnections[1].connectedFrom.value).toFixed(2);
    }

function NotBlock() {
    this.objectName = "Not";
    this.text = "NOT";
    this.divHeight = 30;
    this.divWidth = 100;
    }

NotBlock.prototype = new Base;

NotBlock.prototype.addConnections = function() {
        this.inConnections[0] = new Connector(this, 1, 50);

        this.outConnections[0] = new Connector(this, 0, 50);
    }

NotBlock.prototype.Execute = function() {
    if (this.inConnections[0].connectedFrom.value == 0)
        this.outConnections[0].value = 1;
    else
        this.outConnections[0].value = 0;
    }