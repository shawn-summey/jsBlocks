///////////////////////////////////////////////////////////
//
//		Main Line Object
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

function LineObject(toObj,fromObj)
{
	var thisLine = this;
	this.toConnectorObj = toObj;
	this.fromConnectorObj = fromObj;

	this.lineToX = 0;
	this.lineToY = 0;

	this.lineFromX = 0;
	this.lineFromY = 0;
	
	this.connectLines=[];

	this.connectLines[1]=document.createElement("div");
	this.connectLines[1].style.position="absolute";
	this.connectLines[1].style.fontSize="1";
	this.connectLines[1].style.height = 1;
	this.connectLines[1].style.backgroundColor = "black";
	document.body.appendChild(this.connectLines[1]);

	this.connectLines[2]=document.createElement("div");
	this.connectLines[2].style.position="absolute";
	this.connectLines[2].style.fontSize="1";
	this.connectLines[2].style.width = 1;
	this.connectLines[2].style.backgroundColor = "black";
	//this.connectLines[2].style.borderLeft = "1px solid black";
	this.connectLines[2].style.cursor = "e-resize";
	document.body.appendChild(this.connectLines[2]);
	
	this.connectLines[3]=document.createElement("div");
	this.connectLines[3].style.position="absolute";
	this.connectLines[3].style.fontSize="1";
	this.connectLines[3].style.height = 1;
	this.connectLines[3].style.backgroundColor = "black";
	document.body.appendChild(this.connectLines[3]);
}
LineObject.prototype.connectTo=function()
{

	this.lineToX = parseInt(this.toConnectorObj.theConnector.style.left.substring(3,0));
	this.lineToY = parseInt(this.toConnectorObj.theConnector.style.top.substring(3,0));

	this.lineFromX = parseInt(this.fromConnectorObj.theConnector.style.left.substring(3,0))+5;
	this.lineFromY = parseInt(this.fromConnectorObj.theConnector.style.top.substring(3,0));
	//window.status = this.lineFromY + " : " + this.lineToY
		
		this.connectLines[1].style.top = this.lineFromY+5;
		this.connectLines[1].style.left = this.lineFromX;
		this.connectLines[1].style.width = Math.abs(this.lineToX-this.lineFromX)/2;

		if(this.lineToY >= this.lineFromY)
		{
			this.connectLines[2].style.top = this.connectLines[1].style.top;
			this.connectLines[2].style.left = parseInt(this.connectLines[1].style.left.substring(3,0)) + parseInt(this.connectLines[1].style.width.substring(3,0));
			this.connectLines[2].style.height = Math.abs(this.lineFromY - this.lineToY);
		}
		else
		{
			this.connectLines[2].style.top = this.lineToY+5;
			this.connectLines[2].style.left = parseInt(this.connectLines[1].style.left.substring(3,0)) + parseInt(this.connectLines[1].style.width.substring(3,0));
			this.connectLines[2].style.height = Math.abs(this.lineFromY - this.lineToY);
		}

		if(this.lineToY >= this.lineFromY)
		{
			this.connectLines[3].style.top = parseInt(this.connectLines[2].style.top.substring(3,0))+parseInt(this.connectLines[2].style.height.substring(3,0));
			this.connectLines[3].style.left = this.connectLines[2].style.left;
		}
		else
		{
			this.connectLines[3].style.top = parseInt(this.connectLines[2].style.top);
			this.connectLines[3].style.left = this.connectLines[2].style.left;
		}
		this.connectLines[3].style.width = Math.abs(this.lineToX-this.lineFromX)/2;
}

LineObject.prototype.removeLine = function() {

    for (var x = 1; x < this.connectLines.length; x++) {

        document.body.removeChild(this.connectLines[x]);
    }
}

/*LineObject.propotype.changeColor = function(color) {

    for (var x = 1; x < this.connectLines.length; x++) {

        this.connectLines[x].style.backgroundColor = color;
    }

}*/