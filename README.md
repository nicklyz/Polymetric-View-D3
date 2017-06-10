# CS 230 Project: Polymetric Views in D3

## Spring 2017 UCLA with Prof. Kim

## Team Member & Contributers:
Yanzhe Liu      nikeliuyanzhe@gmail.com   
Mushi Zhou      zmushi@gmail.com       
Quanjie Geng    scmun.gengqj@gmail.com   
Xiao Yan        yanxiao0201@ucla.edu    
Daniel Lau      daniel.s.lau@gmail.com    


## Description:

Our project is a replication of existing tool developed by Michele Lanza and Ste´phane Ducasse described here:   
[Paper Link](http://dl.acm.org/citation.cfm?id=942788)  

Our goal is to be able to display a selection of polymatric view layouts given a MSE file for a Java project.  

The project page can be found [**here**](https://nicklyz.github.io/Polymetric-View-D3/index.html)
    
## Current layouts avaliable are:  
* Tree Plot :        Traditional tree plot that maps classes and their dependencies to rectangle tree nodes and hierarchies with a maximum of three parameters to display   
* Tree Map :         Rectangle mapping with a maximum of two parameters to display  
* Scatter Plot :     Scatter style mapping with a maximum of five parameters to display  
* Checker Plot :     A series of checker-like mapping of classes to rectangles with a maximum of four parameters to display  
* Interactive Tree :  Our experimentation of interactive tree that can expand or collapse with only two parameters to display  
   
## Matrix Parameter Avaliable in Our Project:  
* NOM              Number of methods  
* NOPA             Number of public attributes  
* WLOC             Sum of LOC over all methods  
* WMC              Weight Methods Count i.e. complexity of all methods   
* NOAM             Number of accessor methods    
* AMW              Average Method Weight i.e average complexity of each method    
* BUR              Base Class Usage Ratio    
* NAS              Number of Added Services i.e. non-overridden methods    
* BOvR             Base Class Overriding Rate    
Note: The above parameters are all in class level, since our project scope does not dive into method details

## Avaliable Attributes Parameter in Each Layout:
* position-x : x position representation of each rectangle/node/circle, only avaliable in Checker Plot
* position-y : y position representation of each rectangle/node/circle, only avaliable in Checker Plot
* width:       width representation of each rectangle/node/circle, avaliable in all layouts
* height:      height representation of each rectangle/node/circle, not avaliable in Iteractive Tree
* color :      range of color representation of each rectangle/node/circle, only avaliable checker Plot and Tree Map 

## Pre-Formated Layouts:
We provide two pre-formatted views that help user to get started (Once a MSE file is uploaded):
* System Hotspot View: This is a checker plot that, for each class to rectangle mapping, uses NOPA as width, NOM as height, uses color to indicate WLOC and is sorted based NOPA.
* System Complexity View: This is a traditional tree plot that mappes classes and dependencies to rectangle hierarchies, where tree node width represents NOPA, height represents NOM, and color range represents WLOC.

## Steps To Use:  
1. There are two current verisons of MSE formats, 3.0 and 2.1. Version 3.0 used by [MOOSE](http://www.moosetechnology.org) (a tool to visualize code repositories) does not include the set of attributes that are disscussed in our reference paper. So our tool only works with MSE version  
2. that is used by [Code City](https://wettel.github.io/codecity.html) (a 3D visualization tool for code repositories).
3. In order to generate 2.1 version MSE for a Java programs, the only tool we found is iPlasma, which can be downloaed [here](http://loose.upt.ro/iplasma/). 
4. [jdt2famix](https://github.com/girba/jdt2famix) used by [MOOSE](http://www.moosetechnology.org) can only generate MSE 3.0.
5. iPlasma is a portable tool that can be run by execute *insider.sh*. The program takes in a java repository. The exported MSE file locates in the main folder of the iPlasma program. 
6. Any generated MSE file by directly processed by our project by using the upload function on our [front page](https://nicklyz.github.io/Polymetric-View-D3/index.html). So our project scale with any code base sizes. 
7. After uploading MSE file, our program automatically parse the file and extracts all the matrix parameters we use. 
8. The user can scroll down to select from the two pre-formatted views mentioned above and custom view, where the five mentioned layouts are avaliable with matrixs listed above to choose from for each of their avaliable attribute paramemeters. 
9. The layout is automatically redrawn and refreshed each time a new parameter is selected.  


## References:
* Example Repository of Similar Work: [https://github.com/softvis/polymetric-views](https://github.com/softvis/polymetric-views)      
* Tutorial for generating MSE: [http://www.themoosebook.org/book/#h1thefamixfamilyofmeta-models](http://www.themoosebook.org/book/#h1thefamixfamilyofmeta-models)  
* IPlasma tool for generating MSE: [http://loose.upt.ro/iplasma/](http://loose.upt.ro/iplasma/)       
* Our Project Page: [https://github.com/nicklyz/Polymetric-View-D3](http://dl.acm.org/citation.cfm?id=942788)    
* Our Github Repository: [https://github.com/nicklyz/Polymetric-View-D3](https://github.com/nicklyz/Polymetric-View-D3)    

:+1:
