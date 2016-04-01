/*********************************************************************************
 *
 * @file:			pie-chart
 *	@author:		tomasran
 *	@createDate:	2016-03-23
 *	@email:			tomasran@163.com
 *
 *********************************************************************************/ 
 
 /*	@example:
 *		var pieChart = new PieChart({
 *			'className': '',							//container class
 *			'relativePos': 'left',						//relative position
 *			'graph': {
 *				'className',							
 *				'strokeColor': '#eee',					//color of svg border
 *				'strokeWidth': 10,						//color of svg border width
 *				'space': 2,								//the angle between two slices
 *				'flipX': false,							//whether turn on the axis
 *				'flipY': false							//whether turn on the axis
 *				'outsideR': 100,						//the outside circle's radius
 *				'insideR': 80,							//the inside circle's radius
 *				'rotation': 30,							//graph rotation
 *				'title': {								//title
 *					'className': ''						//title class
 *					'content': '<span>80%</span>'		//title content
 *				},
 *				'slices': [{							// slices configuration	
 *					'color': '#eee',
 *					'percent': 0.1,
 *					'name': 'a'
 *				}, {
 *					'color': '#fff',
 *					'percent': 0.2,
 *					'name': 'b'
 *				}],
 *				'clickCallback': null,					//callback when you click on one slice
 *				'mouseOverCallback': null,				//callback when mouse entered the area of one slice 
 *				'mouseOutCallback': null				//callback when mouse leave out of the area of one slice
 *			},
 *			'description': {
 *				'className': '',						
 *				'items': [{								//description items configuration
 *					'content': '<span></span>',			//description content
 *					'className': '',					//class of every item
 *					'name': 'a'							//unique label
 *				}, {
 *					'desc': '<span></span>',
 *					'name': 'b'
 *				}],
 *				'callback': null						//callback of every item
 *			}
 *		});
 */

/*************************************************************************************/

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], function(jQuery) {
			return factory(jQuery);
		});
	} else if (typeof module !== undefined && module.exports) {
		module.exports = factory(require('jquery'));
	} else {
		root.PieChart = factory(root.jQuery);
	}
})(window || {}, function($) {
	// default color allotment
	function allotColor(i) {
		var colorPool = ['E32322', 'EA621F', 'F18E1C', 'FDC60B', 'F4E500', '8CBB26', '008E5B', '0696BB', '2A71B0', '444E99', '6D398B', 'C4037D'];
		return '#' + colorPool[i % colorPool.length];
	};
	
	function eventEntrust(pNode, eventType, childNodeName, callback) {
		pNode.on(eventType, function(e) {
			var e = e || window.event;
			var target = e.target || event.srcElement;
			
			if (target.nodeName.toUpperCase() === childNodeName.toUpperCase()) {
				var name = $(target).attr('item-name');
				callback ? callback(name) : null;	
			}
		});
	};
	
	var pieChartGenerator = {
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
			},
	
			getGraph: function(config) {
				var graph = $(document.createElement('div')).attr({
					'class': config.className || ''
				}).css({
					'position': 'relative',
					'width': config.outsideR * 2
				});
	
				if (config.title) {
					var titleWidth = 2 * Math.sqrt(Math.pow(config.insideR, 2) / 2);
					$(document.createElement('p')).html(config.title.content).attr({
						'class': config.title.className	
					}).css({
						'margin': 0,
						'width': titleWidth + 'px',
						'height': titleWidth + 'px',
						'position': 'absolute',
						'margin-left': -(titleWidth / 2) + 'px',
						'margin-top': -(titleWidth / 2) + 'px',
						'line-height': titleWidth + 'px',
						'left': '50%',
						'top': '50%',
						'text-align': 'center'
					}).appendTo(graph);
				}
	
				var svg = pieChartGenerator.svg.createElement('svg').css({
					'width': config.outsideR * 2 + 'px',
					'height': config.outsideR * 2 + 'px'
				}).appendTo(graph);
		
				var transform = 'translate(' + config.outsideR + ',' + config.outsideR + ') rotate(' + config.rotation + ') scale(' + (config.flipY ? '-1': '1') + ',' + (config.flipX ? '-1' : '1') + ')';
				var graphPanel = pieChartGenerator.svg.createElement('g').attr({
					'transform': transform
				}).appendTo(svg);
		
				var startAngle = 0;
		
				$.each(config.slices, function(i, item) {
					var stopAngle = item.angle === 0 ? startAngle : (item.angle === 360 ? 360 : startAngle + item.angle - config.space);
					pieChartGenerator.svg.createElement('path').attr({
						'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, config.insideR, config.outsideR),
						'item-name': item.name,
						'angle': item.angle
					}).css({
						'fill': item.color || allotColor(i),
						'stroke': config.strokeColor || item.color || allotColor(i),
						'strokeWidth': config.strokeColor ? config.strokeWidth : 0,
						'cursor': config.clickCallback ? 'pointer' : 'auto'
					}).appendTo(graphPanel);
						startAngle += item.angle;
				});	
				
				config.clickCallback ? eventEntrust(svg, 'click', 'PATH', config.clickCallback) : null;
				config.mouseOverCallback ? eventEntrust(svg, 'mouseover', 'PATH', config.mouseOverCallback) : null;
				config.mouseOutCallback ? eventEntrust(svg, 'mouseout', 'PATH', config.mouseOutCallback) : null;
	
				return graph;
			}
		}
	};
	
	// parameters check
	function argsCheck(args) {
		this.args = $.extend({
			'background': '#fff',
		}, args);
	
		this.args.graph = $.extend({
			'strokeWidth': args.strokeWidth || 1,
			'space': 0,
			'outsideR': 0,
			'insideR': 0,
			'rotation': 0,
			'slices':[{
				'percent': 1
			}]
		}, args.graph);
	
		this.args.description = args.description;
	
		$.each(this.args.graph.slices, function(i, item) {
			item.angle = (item.percent || 0) * 360;
		});
	};
	
	// construct description
	function createDesc(config) {
		if (config) {
			var descPanel = $(document.createElement('ul')).attr({
				'class': config.className || ''
			}).css({
				'padding': 0,
				'margin': 0,
				'overflow': 'hidden'
			});
	
			$.each(config.items, function(i, item) {
				$(document.createElement('li')).attr({
					'class': item.className || '',
					'item-name': item.name 
				}).css({
					'cursor': config.callback ? 'pointer' : 'auto',
					'overflow': 'hidden',
					'background': item.background || 'transparent',
					'position': 'relative'
				}).on('click', function() {
					config.callback ? config.callback(item.name) : null;
				}).html(item.content).appendTo(descPanel);
			});
			
			return descPanel;
		}
	};
	
	function PieChart(args) {
		argsCheck.call(this, args);
	
		// todo: support vml
		this.graphEngine = 'svg';
	
		var self = this;
	
		this.getNode = function() {
			var graph = pieChartGenerator[self.graphEngine].getGraph(self.args.graph);
			var desc = createDesc(self.args.description);
			var combine = [];
	
			switch(self.args.relativePos) {
				case 'left':
					graph.css({'float': 'left'});
					desc.css({'float':'right'});
					combine.push(graph, desc);
					break;
				case 'right': 
					graph.css({'float': 'right'});
					desc.css({'float':'left'});
					combine.push(desc, graph);
					break;
				case 'top':
					combine.push(graph, desc);
					break;
				case 'bottom':
					combine.push(desc, graph);
					break;
				default:
					break;
			};
	
			self.el = $(document.createElement('div')).attr({
				'class': self.args.className
			}).css({
				'background': self.args.background,
				'display': 'inline-block'
			}).append(combine);

			return self.el;
		};
	};

	PieChart.prototype = {
		constructor: PieChart,

		fresh: function(data) {
			if (!data) {
				return null;
			}

			var self = this;
			var graph = self.args.graph;
			var paths = self.el.find('path');
			var slices = {};

			// fresh title
			if (data.title) {
				data.title.content ? $(self.el.find('p')).html(data.title.content) : null;
			}

			// fresh slices
			$.each(data.slices, function(i, slice) {
				slices[slice.name] = slice.percent * 360;
			});

			var startAngle = 0;
			$.each(paths, function(i, path) {
				var name = $(path).attr('item-name');
				var angle = slices[name]  === undefined ? parseFloat($(path).attr('angle')) : slices[name];
				var stopAngle = angle === 0 ? startAngle : (angle === 360 ? 360 : startAngle + angle     - graph.space);
	
				$(path).attr({
					'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, graph.insideR, graph.outsideR),
					'angle': angle
				});

				startAngle += angle;
			});
	
			// fresh items
			$.each(data.items, function(i, item) {
				$(self.el.find('li[item-name='+ item.name + ']')).html(item.content);
			});
		}
	};

	return PieChart;
});
