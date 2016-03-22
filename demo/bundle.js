(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../doughnut.js":2}],2:[function(require,module,exports){
/*
 * for example:
 * var doughnut = new DoughnutGraph({
 *	'boxWidth': 200,			//宽度
 *	'boxHeight': 200,			//高度
 *	'background': 'fff',		//背景
 *	'strokeColor': '#eee',		//边框颜色
 *	'strokeWidth': 10,			//边框宽度
 *	'className': '',			//类名
 *	'graph': {
 *		'className',			//类名
 *		'position': 'left',		//环形图相对于描述的位置
 *		'space': 2,				//不同颜色环之间间隔的角度
 *		'flipX': false,			//是否关于X轴翻转
 *		'flipY': false			//是否关于Y轴翻转
 *		'outsideR': 100,		//外径
 *		'insideR': 80,			//内径
 *		'rotation': 30,			//旋转角度
 *		'title': {				//环形图标题
 *			fontFamily: '',
 *			fontSize: ''
 *		},
 *		'slices': [{			//分片数组
 *			'color': '#eee',
 *			'percent': 0.1,
 *			'desc': '<span>A 错误</span>'
 *		}, {
 *			'color': '#fff',
 *			'percent': 0.2,
 *			'desc': '<span>B 正确</span>'
 *		}],
 *		'callback': null		//点击slice分片响应的回调
 *	},
 *	'description': {
 *		'className': '',		//类名
 *		'content': [{
 *			'desc': '<span></span>',
 *			'background': '#eee'
 *		}, {
 *			'desc': '<span></span>',
 *			'background': '#fff'
 *		}],
 *		'callback': null,		//点击description响应的回调
 *		'itemHeight':,			//描述项的高度
 *		'itemWidth': ,			//描述项的宽度
 *		'hspace':,				//水平方向的间距
 *		'vspace':				//垂直方向的间距 
 *	}
 * });
 *
 */


// 分片默认颜色分配
function allotColor(i) {
	var colorPool = ['E32322', 'EA621F', 'F18E1C', 'FDC60B', 'F4E500', '8CBB26', '008E5B', '0696BB', '2A71B0', '444E99', '6D398B', 'C4037D'];
	return '#' + colorPool[i % colorPool.length];
};

// 事件委托
function eventEntrust(parentNode, eventType, childNodeName, callback) {
	parentNode.on(eventType, function(e) {
		var target = e.target || event.srcElement;
		
		if (target.nodeName.toUpperCase() === childNodeName) {
			var index = parseInt($(target).attr('data-index'));
			callback ? callback(index) : null;	
		}
	});
}

// 环形图组件生成器
var doughnutGenerator = {
	svg: {
		createElement: function(tagName) {
			return $(document.createElementNS('http://www.w3.org/2000/svg', tagName));
		},

		getSectionalPath: function(startAngle, stopAngle, insideR, outsideR) {
			var startRadian = startAngle * Math.PI / 180;
			var stopRadian = stopAngle * Math.PI / 180;	
	
			var startAngleTri = {
				cos: Math.cos(startRadian),
				sin: Math.sin(startRadian)
			};

			var stopAngleTri = {
				cos: Math.cos(stopRadian),
				sin: Math.sin(stopRadian)	
			};

			return ['M', insideR * startAngleTri.cos, insideR * startAngleTri.sin,
			'A', insideR, insideR,
			0,
			Math.abs(stopRadian - startRadian) > Math.PI ? 1 : 0,
			1, insideR * stopAngleTri.cos, insideR * stopAngleTri.sin,
			'L', outsideR * stopAngleTri.cos, outsideR * stopAngleTri.sin,
			'A', outsideR, outsideR,
			0,
			Math.abs(stopRadian - startRadian) > Math.PI ? 1 : 0,
			0, outsideR * startAngleTri.cos, outsideR * startAngleTri.sin,
			'Z'].join(' ');
		}
	}
};

// 参数检测，初始化
function argsCheck(args) {
	this.args = $.extend({
		'background': '#fff',
		'strokeWidth': args.strokeWidth || 1,
	}, args);

	this.args.graph = $.extend({
		'space': 0,
		'outsideR': 0,
		'insideR': 0,
		'rotation': 0,
		'title':'<span></span>',
		'slices':[{
			'percent': 1
		}]
	}, args.graph);

	this.args.description = args.description;

	$.each(this.args.graph.slices, function(i, item) {
		item.angle = (item.percent || 0) * 360;
	});

	this.args.boxWidth = this.args.boxHeight = this.args.graph.outsideR * 2;
};

// 构造环形图
function createGraph() {
	var self = this;
	var graphConfig = self.args.graph;	
	var svg = doughnutGenerator.svg.createElement('svg').attr({
		'width': self.args.boxWidth,
		'height': self.args.boxHeight,
		'class': graphConfig.className
	}).css('background', self.args.background);

	// construct graphPanel
	var transform = 'translate(' + self.args.boxWidth / 2 + ',' + self.args.boxHeight / 2 + ') rotate(' + graphConfig.rotation + ') scale(' + (graphConfig.flipY ? '-1': '1') + ',' + (graphConfig.flipX ? '-1' : '1') + ')';
	var graphPanel = doughnutGenerator.svg.createElement('g').attr({
		'transform': transform
	}).appendTo(svg);

	// construct slices
	var startAngle = 0;

	$.each(graphConfig.slices, function(i, item) {
		doughnutGenerator.svg.createElement('path').attr({
			'd': doughnutGenerator.svg.getSectionalPath(startAngle, startAngle + item.angle - graphConfig.space, graphConfig.insideR, graphConfig.outsideR),
			'data-index': i
		}).css({
			'fill': item.color || allotColor(i),
			'stroke': self.args.strokeColor || item.color || allotColor(i),
			'strokeWidth': self.args.strokeColor ? self.args.strokeWidth : 0,
			'cursor': 'pointer'
		}).on('click', function() {
			graphConfig.callback ? graphConfig.callback(i) : null;
			console.log(i);
		}).appendTo(graphPanel);
			startAngle += item.angle;
	});	
	
	eventEntrust(svg, 'click', 'PATH', graphConfig.callback);
	return svg;
};

// 构造描述部分
function createDesc(args) {
	var self = this;
	var descConfig = self.args.description;

	if (descConfig) {
		var descPanel = $(document.createElement('ul')).attr({
			'class': descConfig.className
		}).css({
			'width': self.args.boxWidth,
			'padding': 0,
			'margin': 0,
			'border': 0
		});
				
		$.each(descConfig.content, function(i, item) {
			$(document.createElement('li')).attr({
				'data-index': i
			}).css({
				'display': 'inline-block',
				'cursor': 'pointer',
				'width': descConfig.itemWidth || self.args.boxWidth / 2,
				'background': item.background || allotColor(i)
			}).html(item.desc).appendTo(descPanel);
		});
		
		eventEntrust(descPanel, 'click', 'LI', descConfig.callback); 
		return descPanel;
	}
};

function DoughnutGraph(args) {
	argsCheck.call(this, args);

	this.graphEngine = 'svg';
	
	var self = this;

	this.getNode = function() {
		return $(document.createElement('div')).attr({
			'width': self.args.boxWidth,
			'class': self.args.className
		}).css({
			'display': 'inline-block'
		}).append(createGraph.call(self)).append(createDesc.call(self));
	};
};

DoughnutGraph.prototype = {
	constructor: DoughnutGraph
};

module.exports = DoughnutGraph;

},{}]},{},[1]);
