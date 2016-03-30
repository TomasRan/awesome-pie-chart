var PieChart = require('../pie-chart.js');

var pieChart = new PieChart({
	'relativePos': 'top',
	'graph': {
		'outsideR': 100,
		'insideR': 60,
		'rotation': -90,
		'space': 1,
		'title': {
			'fontSize':	40,
			'content': '<span>80<span style="font-size: 20px;">%</span></span>'
		},
		'slices': [{
			'name': 'slice1',
			'color': '#f75106',
			'percent': 0.3,
			
		}, {
			'name': 'slice2',
			'color': '#13c819',
			'percent': 0.7
		}],
		'callback': function(name) {alert(name);}
	},
	'description': {
		'items': [{
			'className': 'class-item',
			'content': '<span>A</span>',
			'name': 'item1'
		}, {
			'className': 'class-item',
			'content': '<span>B</span>',
			'name': 'item2'
		}],
		'callback': function(name) {alert(name);}
	}
});

$('.main').append(pieChart.getNode());

setTimeout(function() {
	pieChart.fresh({
		'slices': [{
			'name': 'slice1',
			'percent': 0.5
		}, {
			'name': 'slice2',
			'percent': 0.5
		}],
		'items': [{
			'name': 'item1',
			'content': 'C'
		}, {
			'name': 'item2',
			'content': 'D'
		}],
		'title': {
			'content': 'chart'
		}
	});
}, 1500);
