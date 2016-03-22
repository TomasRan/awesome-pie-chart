var DoughGraph = require('../doughnut.js');

var doughGraph = new DoughGraph({
	graph: {
		outsideR: 100,
		insideR: 60,
		rotation: 23,
		space: 1,
		slices: [{
			color: 'red',
			percent: 0.3
		}, {
			color: 'green',
			percent: 0.7
		}]
	},
	description: {
		'content': [{
			'desc': '<span>dedw</span>',
			'background': 'red'
		}, {
			'desc': '<span>dedw</span>',
			'background': 'blue'
		}],
		'itemWidth': 50,
		'borderWidth': 1,
		'borderColor': '333',
		'vspace': '10px',
		'hspace': '10px'
			
	}
});

$('body').append(doughGraph.getNode());
