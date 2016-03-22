var DoughGraph = require('../doughnut.js');

var doughGraph = new DoughGraph({
	graph: {
		outsideR: 100,
		insideR: 60,
		rotation: 23,
		space: 1,
		slices: [{
			color: 'red',
			percent: 0.1
		}, {
			color: 'blue',
			percent: 0.7
		}, {
			color: 'yellow',
			percent: 0.2
		}]
	},
	description: {
		'content': [{
			'desc': '<span>dedw</span>',
			'background': 'red'
		}, {
			'desc': '<span>dedw</span>',
			'background': 'blue'
		}, {
			'desc': '<span>dwdww</span>',
			'background': 'yellow'
		}]	
	}
});

$('body').append(doughGraph.getNode());
