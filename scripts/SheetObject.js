///////////////////////////////////////////////////////////
//
//		Main Sheet Object
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
function SheetObject()
{
	sheetObj=this;
	this.blockObjects=[];
	this.blockIndex=0;
	this.currentBlock=null;
	this.overInstruction=0;
	this.selectHeight=0;
	this.selectWidth=0;
	this.currentConnector=null;
	this.selectInProgress=0;
	this.simulateOn=0;

	this.lastScan = 0;
    	
	document.addEventListener("dblclick", function(e) {
	   sheetObj.doubleClickHandler(e);
        }, true);

    document.addEventListener("click", function(e) {
    sheetObj.clickHandler(e);
    }, true);

    document.addEventListener("keydown", function(e) {
        sheetObj.keyDownHandler(e);
    }, true);
    
	//Set up scan timer to 15 ms.
	//Each scan the sheet object loops
	//through its list of blocks and calls
    //their Execute function.
	window.setInterval(function() {
	    if (sheetObj.simulateOn) {
	        for (i = 0; i < sheetObj.blockObjects.length; i++) {
	            sheetObj.blockObjects[i].Execute();
	        }
	        window.status = "Simulating";
	    }
	}
	, 15);

	window.status = "Stopped";
}

SheetObject.prototype.addBlock = function(selection, t, l) {

    if (!this.simulateOn) {
        this.blockObjects[this.blockIndex] = eval("new " + selection + "Block");

        this.blockObjects[this.blockIndex].create(this, l, t);
        this.blockObjects[this.blockIndex].addConnections();
        this.blockIndex++;
    }
    else {
        //alert("Error Adding: Cannot add while simulating!");
    }
}
SheetObject.prototype.blockSelected=function(obj)
{
	if(this.currentInstr==null)
	{
		obj.divObj.style.border="1px solid red";
		this.currentInstr=obj;
	}
	else
	{
		this.currentInstr.divObj.style.border="1px solid black";
		obj.divObj.style.border="1px solid red";
		this.currentInstr=obj;
	}
}
SheetObject.prototype.turnOffSelect=function()
{
	this.selectBox = 0;
}
SheetObject.prototype.turnOnSelect=function()
{
	this.selectBox = 1;
}	
SheetObject.prototype.deselectBlock=function(e)
{
	if(this.selectBox==1)
	{
		if(this.currentInstr!=null)
		{
			this.currentInstr.divObj.style.border="1px solid black";
			this.currentInstr = null;
		}
		this.selectDiv=document.createElement("div");
		this.selectDiv.style.position="absolute";
		this.selectDiv.style.top = e.clientY;
		this.selectDiv.style.left = e.clientX;
		this.selectDiv.style.width = 5;
		this.selectDiv.style.height = 5;
		this.selectDiv.style.border="1px solid black";
		this.selectDiv.style.backgroundColor="lightblue";
		this.selectDiv.style.filter="alpha(opacity=50)";
		this.selectDiv.style.zIndex="99";
		document.body.appendChild(this.selectDiv);
	}
}
SheetObject.prototype.showSelected=function()
{
	if(this.currentInstr!=null)
		this.currentInstr.divObj.style.border="2px solid red";
}
SheetObject.prototype.removeSelectBox=function(e)
{
	if(this.selectDiv != null){
		document.body.removeChild(this.selectDiv);
		this.selectDiv = null;
	}
}
SheetObject.prototype.growSelectBox=function(e)
{
	if(this.selectDiv != null && this.selectBox==1)
	{
		if(e.clientX >= parseInt(this.selectDiv.style.left.substring(0,3)) && e.clientY >= parseInt(this.selectDiv.style.top.substring(0,3)))
		{
			this.selectWidth = e.clientX - parseInt(this.selectDiv.style.left.substring(0,3));
			this.selectHeight = e.clientY - parseInt(this.selectDiv.style.top.substring(0,3));
			window.status=this.selectWidth + " : " + this.selectHeight;
		}
		else
		{
			this.selectWidth = 5;
			this.selectHeight = 5;
		}
		this.selectDiv.style.width=this.selectWidth;
		this.selectDiv.style.height=this.selectHeight;
		this.selectInProgress=1;
			
	}
}

SheetObject.prototype.toggleSimulate = function() {
    if (this.simulateOn == 0) {
        this.simulateOn = 1;
        window.status = "Simulating";
    }
    else {
        this.simulateOn = 0;
        window.status = "Stopped"
    }
}
SheetObject.prototype.doubleClickHandler = function(e) {
	try{
    var currentBlock = document.getElementById("blockList").value
    if (!this.simulateOn)
        this.addBlock(currentBlock, e.clientX, e.clientY);
    //else
        //alert("Error On Sheet: Cannot add blocks while simulating.");
	}
	catch(e){}
}

SheetObject.prototype.clickHandler = function(e) {

    this.deselectBlock();
}

SheetObject.prototype.keyDownHandler = function(e) {

    if (e.keyCode == 46 || e.keyCode == 8) {
        if (!this.simulateOn) {
            if (this.currentInstr != null) {

                this.currentInstr.removeConnectors();
                for (i = 0; i < this.blockObjects.length; i++) {

                    if (this.blockObjects[i] == this.currentInstr) {

                        this.blockObjects.splice(i, 1);
                        this.blockIndex--;
                    }
                }

                delete this.currentInstr;
                //Reindex block array
                for (var x = 0; x < this.blockObjects.length; x++)
                    this.blockObjects[x].indexNumber = x;
            }
            this.currentInstr = null;
        }
        else
            alert("Error Deleting: Cannot delete while simulating!");
    }
}

SheetObject.prototype.getJSON = function(index) {

    var tempObj = { "index": 0, "objecttype": "null", "l": 0, "t": 0,
        "outConnections": []
    };

    tempObj.index = this.blockObjects[index].indexNumber;
    tempObj.objecttype = this.blockObjects[index].objectName;
    tempObj.l = this.blockObjects[index].divObj.style.left;
    tempObj.t = this.blockObjects[index].divObj.style.top;
   
    if (this.blockObjects[index].outConnections.length > 1) {
        //get all connectors and the indexes of the blocks
        //they are connected to
        var tempConnections = this.blockObjects[index].outConnections;
        for (var i = 0; i < tempConnections.length - 1; i++) {
            //check the connectedTo array and get indexes
            if (tempConnections[i].connectedTo.length > 1) {


            }

        }

    }
}