# jsBlocks
Function Block Diagram Simulator for PLCs written in JavaScript

This project focuses on provided a quick simulator for Function Block Diagrams (FBD) for 
IEC1131 programming of process control equipment. Process control equipment is used in 
manufacturing and includes, but is not limited to, Programmable Logic Controllers (PLCs).
This simulator is also meant for users to be able to develop custom blocks to simulate if
need be. 

YouTube Demo Video:
https://youtu.be/VDzM3FngfBk

# Installation
In order to install, just download the source and open the index.html with either 
Chrome or Safari (not tested with Firefox or Microsoft Browser).

# Objects

## Sheet Object

The Sheet object keeps track of a list of blocks to simulate. If a connection between an input connector and
output connector is being made, the Sheet object keeps track of the initial Connector object. In simulation
mode, the Sheet loops through its list of blocks and calls the Execute() function. Every block must have an
Execute() function.

## Block Object
The Block object is a block that will be simulated. A block is derived from the BaseBlock object. The 
BaseBlock object takes care of how the block looks and the movement/placement of the block on the sheet. 
The BaseBlock also makes sure connectors and lines get updated as blocks are moved. Blocks are simple 
HTML DIV objects.

## Connector Object
The Connector object is added to a block and represents a value depending on the block. Input connectors keeps
track of which connector connects to it. An input connector can only have one connection from an output
connector. An output connector keeps track of the connectors that it is connected to. An output connector
can connect to multiple input connectors. When a block goes to solve it's logic it does the following:

1. Input connectors "go out" to their connected from object (which is a Connector object) and read its value.
2. The block uses the inputs to solve logic.
3. The resulting values are placed on the output connector(s) for connected input connectors to retrieve.

Every block must have an addConnections() function where Connectors are added to the block.
```js
new Connector(this,io,percent);
```
Where:

- this = block pointer
- io = input or output (1 = input (left) side; 0 = output (right) side)
- percent = percentage along the edge of the block to place connector (50 = 50% or half way down the edge)
	
Connectors are simple HTML DIV objects that get moved when the block they are "attached" to is moved.

To connect two connectors, mouse over an output connector until the mouse cursor changes (usually to a
hand). Click the mouse button, hold, and move the mouse to an input connector until the mouse cursor
changes again (usually to a hand). Release the mouse button and the connection will be made.

## Line Object
Line objects are purely cosmetic. Connectors are connected via the Connector object's connectedTo and
connectedFrom variables. The Line object only makes that connection visible. The Line object keeps track 
of three HTML DIV objects. These DIV objects represent two horizontal lines (DIV with height of zero)
and one vertical line (DIV with width of zero).

# Create Blocks
The blocks work like small, distributed PLCs. A block will take it's input(s), solve some logic
and write its output(s). The FunctionBlockObjects.js file contains blocks, not only to use, but to
serve as an example to create more blocks.

```js
function TestBlock() {
	this.objectName = "TestBlock";	// used to identify block internally
	this.text = " Test Block";	// text that appears at the top of the block
	
	// define any variables that the block may need to solve its logic
}

// derive from BaseBlock
TestBlock.prototype = new Base;

TestBlock.prototype.addConnections()
{
	// simple two input connectors and one output connector (like a two input AND block)
	this.inConnections[0] = new Connector(this,1,25);
	this.inConnections[1] = new Connector(this,1,75);
	
	this.outConnections[0] = new Connector(this,0,50);
}

// what to do when the Sheet object starts simulating
TestBlock.prototype.Execute()
{
	// fetch inputs by going "back" to get the value from the connected Connector's output
	var in1 = this.inConnections[0].connectedFrom.value;
	var in2 = this.inConnections[1].connectedFrom.value;
	
	// solve some logic
	
	// set the result value of the output connector for input connectors to fetch.
	this.outConnections[0].value = result;
}
```
In the index.html, find the selection box and add your block to the list using the value of
```js
this.objectName
```
as the option value.

# Extras
The AND and OR blocks in the FunctionBlockObjects.js file give examples how to specify input and 
size the block accordingly as well as working with those inputs in the logic.

The AI (Analog In) block gives an example how to handle mouse events for a particular block. The AI
allows the user to click in the middle of the block and specify a value, but clicking on the left
side of the block increments the value by 1 while clicking on the right side decrements the value
by one.

The DI block handles a mouse click in order to switch it on or off. Both DI and DO blocks Execute
function looks at the value and updates the color of the DIV.
# Notes
One of the biggest features missing is type checking. Currently nothing stops a user from connecting a
connector that outputs a boolean to a connector that is expecting an integer or float.

Also, lines are really simple and there is no line routing.

Perhaps later, the updated version using jQuery and connector labels will be placed in a separate repo.
This is just the original code that was first written back in 2007.