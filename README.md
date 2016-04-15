# awesome-pie-chart

![](https://img.shields.io/badge/npm-0.3.0-blue.svg)
[![bitHound Overall Score](https://www.bithound.io/github/TomasRan/awesome-pie-chart/badges/score.svg)](https://www.bithound.io/github/TomasRan/awesome-pie-chart)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Code Climate](https://codeclimate.com/github/TomasRan/awesome-pie-chart/badges/gpa.svg)](https://codeclimate.com/github/TomasRan/awesome-pie-chart)

[![NPM](https://nodei.co/npm/awesome-pie-chart.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/awesome-pie-chart/)

Here is the awesome pie chart.<br/>
You can customize your own pie chart. Extended space is provided. <br/>
Commit issues or requirements [here](https://github.com/TomasRan/awesome-pie-chart/issues).<br/>
It's convinient for us to create a pie chart in serveral minutes by using this. At first, let's see what it will be look like, as you know: Word is cheap, show me the realization.

example 1:<br/>
![图片丢失](http://cl.ly/2T0P0N3F3n37/Snip20160331_4.png)

example 2:<br/>
![图片丢失](http://cl.ly/1B0V1Q441N0v/Snip20160331_3.png)

example 3:<br/>
![图片丢失](http://cl.ly/1M3n330B2D1I/Snip20160401_7.png)

## Documention

### Install
```
# use npm
$ npm install awesome-pie-chart

# use bower
$ bower install awesome-pie-chart
```

### Usage
```
var PieChart = require('pieChart')

var pieChartExample = new PieChart({
	'className': '',
	'relativePos': 'left',
	'graph': {
		'className': '',
		'strokeColor': '#eee',
		'stokeWidth': 10,
		'space': 0,
		'flipX': false,
		'flipY': false,
		'outsideR': 200,
		'insideR': 160,
		'title': '<span>80%</span>'	
		'slices': [{
			'color': 'red',
			'percent': 0.2,
			'name': 'sliceA'	
		}, {
			'color': 'blue',
			'percent': 0.2,
			'name': 'sliceB'
		}, {
			...			
		}],
		'clickCallback': function(name) {console.log(name);},
		'mouseOverCallback': function(name) {console.log(name);},
		'mouseOutCallback': function(name) {console.log(name);}
	},
	'description': {
		'className': '',
		'items': [{
			'content': '<span>A</span>',
			'className': '',
			'name': 'a'
		}, {
			'content': '<span>B</span>',
			'className': '',
			'name': 'b'
		}, {
			...	
		}],
		'callback': function(name) {console.log(name);}
	}	
});

$(document.body).append(pieChartExample.getNode());
```

#### configuration
Here are the description of the parameters. Be careful that the configruation is netsted.And the validation of data should be handled outside of the component.

#####Attribute
There is a detailed description about the attributes in [pie-chart.js](https://github.com/TomasRan/awesome-pie-chart/blob/master/pie-chart.js).

#####Method
` getNode `<br/>
Get the pie chart node.

` fresh `</br>
You can use this method to fresh your pie chart when the data is changed.


### Browser Support
Currently, it supports almost all major browsers except ie8.

### To Do
- support IE8

## License
The MIT License (MIT)
Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
