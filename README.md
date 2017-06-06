CS 230 Project: Polymetric Views in D3

Spring 2017 UCLA
Prof. Kim

Yanzhe (Nick) Liu
Mushi Zhou
Quanjie Geng
Xiao Yan
Daniel Lau


Description:

Our project is a replication of existing tool developed by Michele Lanza and Ste´phane Ducasse described here:
http://dl.acm.org/citation.cfm?id=942788

Our goal is to be able to display a selection of Polymatric views given a MSE file for a Java project.

Current views avaliable are:

.......

Steps To Use:

1. There are two current verisons of MSE formats, 3.0 and 2.1. Version 3.0 used by MOOSE (a tool to visualize code repositories) does not include the set of attributes that are disscussed in our reference paper. So our tool only works with MSE version 2.1 that is used by Code City (a 3D visualization tool for code repositories).
2. In order to generate 2.1 version MSE for a Java programs, the only tool we found is iPlasma, which can be downloaed here: http://loose.upt.ro/iplasma/ jdt2famix can only generate MSE 3.0.
3. iPlasma is a portable tool that can be run by execute insider.sh. The program takes in a java repository. The exported MSE file locates in the main folder of the iPlasma program. 
4. Any generated MSE file by directly processed by our project by using the upload function on our front page. So our project scale with any code base sizes. 
5. After uploading MSE file, our program automatically parse the file and extracts all the attributes we use. 
6. A selection 

.......


References:

Example Repo of similar work: https://github.com/softvis/polymetric-views
Tutorial for generating mse: http://www.themoosebook.org/book/#h1thefamixfamilyofmeta-models
Tool for generating MSE (iPlasma): http://loose.upt.ro/iplasma/
Our project repo: https://github.com/nicklyz/Polymetric-View-D3

