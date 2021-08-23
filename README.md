# jsBlocks
Function Block Diagram Simulator for PLCs written in JavaScript

This project focuses on provided a quick simulator for Function Block Diagrams (FBD) for 
IEC1131 programming of process control equipment. Process control equipment is used in 
manufacturing and includes, but is not limited to, Programmable Logic Controllers (PLCs).
This simulator is also meant for users to be able to develop custom blocks to simulate if
need be. 

# Installation
In order to install, just download the source and open the index.html with either 
Chrome or Safari (not tested with Firefox or Microsoft Browser).

# Objects
---

## Sheet Object

The Sheet object keeps track of a list of blocks to simulate. If a connection between an input connector and
output connector is being made, the Sheet object keeps track of the initial Connector object.

## Block Object
The Block object is a block that will be simulated. A block is derived from the BaseBlock object. The 
BaseBlock object takes care of how the block looks and the movement/placement of the block on the sheet.

## Connector Object
The Connector object is added to a block and represents a value depending on the block. Input connectors keeps
track of which connector connects to it. An input connector can only have one connection from an output
connector. An output connector keeps track of the connectors that it is connected to. An output connector
can connect to multiple input connectors. When a block goes to solve it's logic it does the following:

1. Input connectors "go out" to their connected from object (which is a Connector object) and read its value.
2. The block uses the inputs to solve logic.
3. The resulting values are placed on the output connector(s) for connected input connectors to retrieve.

## Line Object

---

# Create Blocks
The blocks work like small, distributed PLCs. A block will take it's input(s), solve some logic
and write it's output(s).
