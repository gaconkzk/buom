This project was bootstrapped with
[Bottender](https://github.com/Yoctol/bottender) init script.

- Walking through persistence models of bottender
- Create cool handlers (might considers the bootender-compose project for utils)
- wit.ai/diaflow.js ... should be integrated as middleware
- multimedia messages should be as abstract as possible
- ...


### Arch Design (alway changes)
![Design](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://github.com/gaconkzk/buom/raw/master/docs/arch.puml)

Something for me:
- I'll tried to make it as clean and readable as possible
- I'll tried to make it as easy for extends as possible
- I'll tried to make it as generic for multiple usages scenarios as possible

#### design challenge #1:

- design handlers recognizer:
    + input: msg (plain text)
    + process: walk msg through multiple recognizers, return processed data using first one that can recognize the msg
    + output: intent objects (what user wanna do?)

>(a simple recognizers is command recognizer which recognize command based on CLI pattern)

>(another one is regex recognizer which can recognize command based on regular expression)
