///////////////////////////////////////////////////////////
//
//		Main Connector Object
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
//////////////////////////////////////////////////////////

function Connector(obj,type,number)
{
	this.instruction = obj;	//instruction object connector is connected to
	var thisConnector = this;
	this.pinLocation = number;
	this.type = type;
	this.value=0;
	this.connectorX = 0;
	this.connectorY = 0;
	this.connectorHeight = 10;
	this.connectorWidth = 8;
	this.isConnected = 0;
	
	//New connector references
	//connectedTo (Outputs) can be connected to multiple
	//input pins. A connectedFrom (Inputs) can have only one
	//line connected to it.
	this.connectedTo = [];          
	this.connectedToIndex = 0;
	this.connectedFrom = null;

	//The one and only lines object for input pins.
	//The line object belongs to the Input Connector
	//object. Output pin theLine variable is always
	//null
	this.theLine = null;
	
	this.calcConnector(this.pinLocation);

	this.theConnector = document.createElement("div");
	this.theConnector.style.position="absolute";
	this.theConnector.style.top = this.connectorY;
	this.theConnector.style.left = this.connectorX;
	this.theConnector.style.height = this.connectorHeight;
	this.theConnector.style.width = this.connectorWidth;
	this.theConnector.style.backgroundColor="black"
	this.theConnector.style.fontSize="6";
	this.theConnector.style.cursor = "hand";
	document.body.appendChild(this.theConnector);

	this.theConnector.addEventListener("mousedown",function(e)
							{
								thisConnector.clickHandler(e);
							},true);
	this.theConnector.addEventListener("mouseup",function(e)
							{
								thisConnector.mouseupHandler(e);
							},true);
}
Connector.prototype.calcConnector=function(pinNo)
{
	if(this.type==1)
	{
		this.connectorX = parseInt(this.instruction.divObj.style.left.substring(3,0))- (this.connectorWidth);
		this.connectorY = parseInt(this.instruction.divObj.style.top.substring(3,0)) + ((pinNo/100)*parseInt(this.instruction.divObj.style.height))-this.connectorHeight/2;
	}
	else if(this.type==0)
	{
		this.connectorX = parseInt(this.instruction.divObj.style.left.substring(3,0))+ parseInt(this.instruction.divObj.style.width)+2;
		this.connectorY = (parseInt(this.instruction.divObj.style.top.substring(3,0)) + ((pinNo/100)*parseInt(this.instruction.divObj.style.height))-this.connectorHeight/2);
	}
	else
	{
		alert("Error: no associated connector type!");
	}	
}
Connector.prototype.moveConnector = function() {
    this.calcConnector(this.pinLocation);
    this.theConnector.style.top = this.connectorY;
    this.theConnector.style.left = this.connectorX;
    if (this.connectedFrom != null)
        this.theLine.connectTo();
 
    if (this.connectedTo.length > 0) {
        for (var i = 0; i < this.connectedTo.length; i++)
            this.connectedTo[i].theLine.connectTo();
    }

}
Connector.prototype.clickHandler=function(e)
{
	if(this.type==0 || this.type==2) //type 2 is for future connectors i.e top and bottom pins
	{
		this.instruction.sheetObject.turnOffSelect();
		this.instruction.sheetObject.currentConnector = this;
	}
	else
	{
		this.instruction.sheetObject.turnOffSelect();
		alert("Must click on output and connect to input!");
	}
}
Connector.prototype.mouseupHandler = function(e) {

    //Make reference to output pin that was clicked on and stored
    //in the sheet's currentConnector varibale to the input
    //pin that the mouse was let up on. connectedTo is added to the
    //output pin and the connectedFrom is set on the input pin.
    //Along with some error checking to make sure connections are
    //made per "the rules".

    if (this.instruction.sheetObject.currentConnector != null) {
        if (this.instruction.sheetObject.currentConnector == this)
            alert("Error connecting: Cannot connect to self!");
        else if (this.instruction.sheetObject.currentConnector.type == this.type)
            alert("Error connecting: Cannot connect two outputs together!");
        else if (this.connectedFrom != null)
            alert("Error connecting: Input connector already connected!");
        else {
            this.theLine = new LineObject(this, this.instruction.sheetObject.currentConnector);
            this.theLine.connectTo();
            this.instruction.sheetObject.currentConnector.addConnector(this);
            this.connectedFrom = this.instruction.sheetObject.currentConnector;
        }
    }
    this.instruction.sheetObject.currentConnector = null

    if (document.selection)
        document.selection.empty();
}

Connector.prototype.addConnector = function(obj) {
    this.connectedTo[this.connectedToIndex] = obj;
    this.connectedToIndex++;
    if (this.connectedToIndex > 0)
        this.isConnected = 1;
    else
        this.isConnected = 0;
}

Connector.prototype.removeConnectedTo = function() {

    //Input pins call this function to notify output
    //pin that it is being deleted and then sets
    //itself to null
    var removeIndex = -1;
    if (this.connectedFrom != null) {
        for (var i = 0; i < this.connectedFrom.connectedTo.length; i++) {

            if (this.connectedFrom.connectedTo[i] == this) {

                removeIndex = i;
            }
        }
    }
    if (removeIndex >= 0) {
        this.connectedFrom.connectedTo.splice(removeIndex, 1);
        this.connectedFrom.connectedToIndex--;
        this.theLine.removeLine();
        delete this.theLine;
    }
    this.connectedFrom = null;
    document.body.removeChild(this.theConnector);
}

Connector.prototype.removeConnectedFrom = function() {

    //Output pins call this function to notify input
    //pins that it is being deleted.
    if (this.connectedTo.length > 0) {
        for (var i = 0; i < this.connectedTo.length; i++) {
            this.connectedTo[i].theLine.removeLine();
            this.connectedTo[i].connectedFrom = null;
        }
    }
    document.body.removeChild(this.theConnector);
}