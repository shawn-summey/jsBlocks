///////////////////////////////////////////////////////////
//
//		Main Block Object
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

//**************************************************************************
//
//			Define a BASE BLOCK
//
//**************************************************************************
function Base()
{
	this.divObj=null;
	this.divHeight=80;
	this.divWidth=60;
	this.text="BLOCK";
	this.offsetX=0;
	this.offsetY=0;
	this.captured=0;
	this.sheetObject=null;
	this.hasMoved = 0;
	this.indexNumber = 0;
}
Base.prototype.create = function(sheet, t, l) {
    var current = this;
    this.sheetObject = sheet;
    this.indexNumber = this.sheetObject.blockIndex;

    this.inConnections = [];
    this.outConnections = [];

    this.divObj = document.createElement("div");
    this.divObj.style.position = "absolute";
    this.divObj.style.top = t - (this.divHeight / 2);
    this.divObj.style.left = l - (this.divWidth / 2);
    this.divObj.style.width = this.divWidth;
    this.divObj.style.height = this.divHeight;
    this.divObj.style.border = "1px solid black";
    this.divObj.style.backgroundColor = "yellow";
    this.divObj.style.zIndex = "1";
    this.divObj.style.textAlign = "center";
    this.divObj.style.fontFamily = "Calibri";
    this.divObj.style.fontSize = "11";
    this.divObj.style.fontWeight = "normal";
    this.divObj.style.cursor = "move";
    document.body.appendChild(this.divObj);
    this.divObj.innerHTML = this.text;

    this.divObj.addEventListener("mousedown", function(e) {
        current.mousedownHandler(e);
    }, true);
    this.divObj.addEventListener("mousemove", function(e) {
        current.moveHandler(e);
    }, true);
    this.divObj.addEventListener("mouseup", function(e) {
        current.mouseupHandler(e);
    }, true);
    this.divObj.addEventListener("mouseover", function(e) {
        current.mouseoverHandler(e);
    }, true);
    this.divObj.addEventListener("mouseout", function(e) {
        current.mouseoutHandler(e);
    }, true);
    this.divObj.addEventListener("click", function(e) {
        current.clickHandler(e);
    }, true);
}
Base.prototype.mousedownHandler=function(e)
{	
	if(!e.ctrlKey)
	{
		this.offsetX =  e.clientX - parseInt(this.divObj.style.left.substring(3,0));
		this.offsetY =  e.clientY - parseInt(this.divObj.style.top.substring(3,0));
		this.captured=1;
		this.sheetObject.turnOffSelect();
		this.sheetObject.blockSelected(this);
	}
	
}
Base.prototype.moveHandler=function(e)
{
	if(this.captured)
	{
		this.hasMoved=1;
		snapX = Math.round((e.clientX - this.offsetX)/4);
		snapY = Math.round((e.clientY - this.offsetY)/4);
		this.divObj.style.left = snapX*4;
		this.divObj.style.top = snapY*4;
		this.divObj.style.zIndex="99";
		this.divObj.style.filter="alpha(opacity=80)";

		for(i=0;i<this.inConnections.length;i++)
		{
			this.inConnections[i].moveConnector();
		}
		for(i=0;i<this.outConnections.length;i++)
		{
			this.outConnections[i].moveConnector();
		}
	}
}
Base.prototype.mouseupHandler=function(e)
{
	if(this.captured)
	{
		this.captured=0;
		this.divObj.style.zIndex="1";
		this.divObj.style.filter="alpha(opacity=100)";
	}
	else
	{
		this.captured=0;
		this.sheetObject.turnOnSelect();
	}
}
Base.prototype.mouseoverHandler=function(e)
{
	if(e.ctrlKey)
		this.divObj.style.border="2px solid green";
	else 
		{
			if(!this.sheetObject.selectInProgress)
			{
				this.sheetObject.turnOffSelect();
			}
		}
}
Base.prototype.mouseoutHandler=function(e)
{
	//this.divObj.style.border="1px solid black";
	//this.sheetObject.turnOnSelect();
	//this.sheetObject.showSelected();
}
Base.prototype.clickHandler=function(e)
{
	//There is not a default handler for the
	//Base block. Can override in subclasses
	//if needed.
}
Base.prototype.addConnections=function()
{
	//There are no connections for a base block
	//Override this function in a custom definition
	//block and add input and output connections

}

Base.prototype.removeConnectors = function() {

    //send terminate notification to connectors

    //delete input connections
    for (var i = 0; i < this.inConnections.length; i++) {

        this.inConnections[i].removeConnectedTo();
        delete this.inConnections[i];
    }

    //delete output connections
    for (var i = 0; i < this.outConnections.length; i++) {

        this.outConnections[i].removeConnectedFrom();
        delete this.outConnections[i];
    }

    //remove block from page
    document.body.removeChild(this.divObj);
}