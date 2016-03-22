(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DoughGraph = require('../doughnut.js');

var doughGraph = new DoughGraph({
	outsideR: 100,
	insideR: 70,
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
});

$('body').append(doughGraph.getNode());

},{"../doughnut.js":2}],2:[function(require,module,exports){
/*
 * for example:
 * var doughnut = new DoughnutGraph({
 *	'background': 'fff',
 *	'boxWidth': 200,		//宽度
 *	'boxHeight': 200,		//高度
 *	'outsideR': 100,		//外径
 *	'insideR': 80,			//内径
 *	'strokeColor': '#eee',	//边框颜色
 *	'strokeWidth': 10,		//边框宽度
 *	'title': {				//环形图标题
 *		fontFamily: '',
 *		fontSize: ''
 *	},
 *	'callback': null,			//点击slice分片响应的回调
 *	'slices': [{			//分片数组
 *		color: '#eee',
 *		percent: 0.1,
 *		desc: '<span>A 错误</span>'
 *	}, {
 *		color: '#fff',
 *		percent: 0.2,
 *		desc: '<span>B 正确</span>'
 *	}],
 *	'rotation': 30,			//旋转角度
 *	'space': 2,				//不同颜色环之间间隔的角度
 *	'flipX': false,			//是否关于X轴翻转
 *	'flipY': false			//是否关于Y轴翻转
 * });
 *
 */


// 分片默认颜色分配
function allotColor(i) {
	var colorPool = ['E32322', 'EA621F', 'F18E1C', 'FDC60B', 'F4E500', '8CBB26', '008E5B', '0696BB', '2A71B0', '444E99', '6D398B', 'C4037D'];
	return '#' + colorPool[i % colorPool.length];
};

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
		background: '#fff',
		insideR: parseInt(args.insideR),
		outsideR: parseInt(args.outsideR),
		strokeWidth: args.strokeWidth || 1,
		rotation: 0,
		space: 0,
		slices: [{
			percent: 1
		}]	
	}, args);

	$.each(this.args.slices, function(i, item) {
		item.angle = (item.percent || 0) * 360;
	});

	this.args.boxWidth = this.args.boxHeight = this.args.outsideR * 2;
};


function DoughnutGraph(args) {
	argsCheck.call(this, args);

	this.graphEngine = 'svg';
	
	var self = this;
	this.createDoughnut = {
		svg: function() {
			var svg = doughnutGenerator.svg.createElement('svg').attr({
				'width': self.args.boxWidth,
				'height': self.args.boxHeight
			}).css('background', self.args.background);

			// construct graphPanel
			var transform = 'translate(' + self.args.boxWidth / 2 + ',' + self.args.boxHeight / 2 + ') rotate(' + self.args.rotation + ') scale(' + (self.args.flipY ? '-1': '1') + ',' + (self.args.flipX ? '-1' : '1') + ')';
			var graphPanel = doughnutGenerator.svg.createElement('g').attr({
				'transform': transform
			}).appendTo(svg);

			// construct description panel
			var descPanel = doughnutGenerator.svg.createElement('g').attr({
				
			}).appendTo(svg);

			// construct slices
			var startAngle = 0;

			$.each(self.args.slices, function(i, item) {
				doughnutGenerator.svg.createElement('path').attr({
					'd': doughnutGenerator.svg.getSectionalPath(startAngle, startAngle + item.angle - self.args.space, self.args.insideR, self.args.outsideR)
				}).css({
					'fill': item.color || allotColor(i),
					'stroke': self.args.strokeColor || item.color || allotColor(i),
					'strokeWidth': self.args.strokeColor ? self.args.strokeWidth : 0
				}).on('click', function() {
					self.args.callback ? self.args.callback(i) : null;
				}).appendTo(graphPanel);

				doughnutGenerator.svg.createElement('react').attr({
					'width':self.args.boxWidth / 2,
					'height': self.args.boxHeight / 2
				}).css({
					'fill': item.color || allotColor(i),
					'stroke': self.args.strokeColor || item.color || allotColor(i)
				}).on('click', function() {
					self.args.callback ? self.args.callback(i) : null;				
				}).appendTo(descPanel);

				startAngle += item.angle;
			});	

			return svg;
		},

		vml: function() {
			// todo	 
		}
	};
};

DoughnutGraph.prototype = {
	constructor: DoughnutGraph,
	getNode: function() {
		return this.createDoughnut[this.graphEngine]();
	}
};

module.exports = DoughnutGraph;

},{}]},{},[1]);
