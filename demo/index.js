var PieChart = require('../pie-chart.js');

var graph = {
}

var pieChart = new PieChart({
	'background': '#f7f7f7',
	'relativePos': 'top',
	'graph': {
		'outsideR': 100,
		'insideR': 60,
		'rotation': -90,
		'space': 1,
		'title': {
			'fontSize':	40,
			'content': '<span>80<span>%</span></span>'
		},
		'slices': [{
			'name': 'ab',
			'color': '#f75106',
			'percent': 0.3,
			
		}, {
			'name': 'bc',
			'color': '#13c819',
			'percent': 0.7
		}],
		'callback': function(i) {alert(i);}
	},
	'description': {
		'items': [{
			'content': '<span><i class="sss"></i>对  123人</span>',
			'background': '#fefefe',
			'name': 'a'
		}, {
			'content': '<span>错  243人</span>',
			'background': '#fefefe',
			'name': 'b'
		}, {
			'content': '<span>对错 2423人</span>',
			'name': 'c'
		}, {
			'content': '<span>嘚瑟 120人</span>',
			'name': 'd'
		}, {
			'content': '<span>对错 2423人</span>',
			'name': 'e'
		}],
		'callback': function(i) {alert(i);}
	}
});

$('.main').append(pieChart.getNode());

pieChart.fresh({
	'slices': [{
		'name': 'ab',
		'percent': 0.5
	}, {
		'name': 'bc',
		'percent': 0.5
	}],
	'items': [{
		'name': 'a',
		'content': '121'
	}, {
		'name': 'b',
		'content': 'daewdaw'
	}]
});
