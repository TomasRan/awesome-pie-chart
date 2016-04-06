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
 *			'className': '',					//container class
 *			'relativePos': 'left',				//relative position
 *			'graph': {
 *				'className': '',
 *				'strokeColor': '#eee',			//color of svg border
 *				'strokeWidth': 10,				//color of svg border width
 *				'space': 2,						//the angle between two slices
 *				'flipX': false,					//whether turn on the axis
 *				'flipY': false,					//whether turn on the axis
 *				'outsideR': 100,				//the outside circle's radius
 *				'insideR': 80,					//the inside circle's radius
 *				'rotation': 30,					//graph rotation
 *				'title': '<span>80%</span>'		//title content
 *				'slices': [{					// slices configuration	
 *					'color': '#eee',
 *					'percent': 0.1,
 *					'name': 'a'
 *				}, {
 *					'color': '#fff',
 *					'percent': 0.2,
 *					'name': 'b'
 *				}],
 *				'clickCallback': null,			//callback when you click on one slice
 *				'mouseOverCallback': null,		//callback when mouse entered the area of one slice 
 *				'mouseOutCallback': null		//callback when mouse leave out of the area of one slice
 *			},
 *			'description': {
 *				'className': '',		
 *				'items': [{						//description items configuration
 *					'background': '',			//item background
 *					'content': '<span></span>',	//description content
 *					'className': '',			//class of every item
 *					'name': 'a'					//unique label
 *				}, {
 *					'desc': '<span></span>',
 *					'name': 'b'
 *				}],
 *				'callback': null				//callback of every item
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
	var allotColor = function(i) {
		var colorPool = ['E32322', 'EA621F', 'F18E1C', 'FDC60B', 'F4E500', '8CBB26', '008E5B', '0696BB', '2A71B0', '444E99', '6D398B', 'C4037D'];
		return '#' + colorPool[i % colorPool.length];
	};

	// bind event
	var eventEntrust = function(pNode, eventType, childNodeName, callback) {
		pNode.on(eventType, function(e) {
			var e = e || window.event;
			var target = e.target || event.srcElement;

			if (target.nodeName.toUpperCase() === childNodeName.toUpperCase()) {
				var name = $(target).attr('data-name');
				if (name ) {
					callback ? callback(name) : null;
				}
			}
		});
	};

	// get trigonometric value
	var generateTriValue = function(radian) {
		return {
			'sin': Math.sin(radian),
			'cos': Math.cos(radian),
			'tan': Math.tan(radian)
		};
	};

	// construct pie chart
	var pieChartGenerator = {
		svg: {
			createElement: function(tagName) {
				return $(document.createElementNS('http://www.w3.org/2000/svg', tagName));
			},
	
			getSectionalPath: function(startAngle, stopAngle, insideR, outsideR) {
				var startRadian = startAngle * Math.PI / 180;
				var stopRadian = stopAngle * Math.PI / 180;	
				var startAngleTri = generateTriValue(startRadian);
				var stopAngleTri = generateTriValue(stopRadian); 
	
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
				// outermost container
				var graph = $(document.createElement('div')).attr({
					'class': config.className || ''
				}).css({
					'position': 'relative',
					'width': config.outsideR * 2
				});
	
				// construct title
				if (config.title) {
					var width = 2 * Math.sqrt(Math.pow(config.insideR, 2) / 2),
						height = width;
					$(document.createElement('p')).css({
						'margin': 0,
						'width': width + 'px',
						'height': height + 'px',
						'position': 'absolute',
						'margin-left': -(width / 2) + 'px',
						'margin-top': -(height / 2) + 'px',
						'line-height': height + 'px',
						'left': '50%',
						'top': '50%',
						'text-align': 'center'
					}).html(config.title).appendTo(graph);
				};
	
				// consturct svg
				var svg = pieChartGenerator.svg.createElement('svg').css({
					'width': config.outsideR * 2 + 'px',
					'height': config.outsideR * 2 + 'px'
				}).appendTo(graph);
		
				var transform = 'translate(' + config.outsideR + ',' + config.outsideR + ') rotate(' + config.rotation + ') scale(' + (config.flipY ? '-1': '1') + ',' + (config.flipX ? '-1' : '1') + ')';
				var graphPanel = pieChartGenerator.svg.createElement('g').attr({
					'transform': transform
				}).appendTo(svg);

				if (config.slices && config.slices.length === 0) {
					pieChartGenerator.svg.createElement('path').attr({
						'd': pieChartGenerator.svg.getSectionalPath(0, 360, config.insideR, config.outsideR)
					}).css({
						'fill': '#d9d9d9'
					}).appendTo(graphPanel);
				} else {
					var startAngle = 0;

					$.each(config.slices, function(i, item) {
						var stopAngle = item.angle === 0 ? startAngle : (item.angle === 360 ? 360 : startAngle + item.angle - config.space);
						pieChartGenerator.svg.createElement('path').attr({
							'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, config.insideR, config.outsideR),
							'data-name': item.name,
							'data-angle': item.angle
						}).css({
							'fill': item.color || allotColor(i),
							'stroke': config.strokeColor || item.color || allotColor(i),
							'strokeWidth': config.strokeColor ? config.strokeWidth : 0,
							'cursor': config.clickCallback ? 'pointer' : 'auto'
						}).appendTo(graphPanel);
							startAngle += item.angle;
					});
					
				}

				config.clickCallback ? eventEntrust(svg, 'click', 'PATH', config.clickCallback) : null;
				config.mouseOverCallback ? eventEntrust(svg, 'mouseover', 'PATH', config.mouseOverCallback) : null;
				config.mouseOutCallback ? eventEntrust(svg, 'mouseout', 'PATH', config.mouseOutCallback) : null;
				return graph;
			}
		}
	};
	
	// parameters check
	function argsCheck(args) {
		this.args = args;
		this.args.graph = $.extend({
			'strokeWidth': args.strokeWidth || 1,
			'space': 0,
			'outsideR': 0,
			'insideR': 0,
			'rotation': 0,
			'slices':[]
		}, args.graph);
	
		$.each(this.args.graph.slices, function(i, item) {
			item.angle = (item.percent || 0) * 360;
		});
	};
	
	// construct description
	function createDescItems(item, callback) {
		return $(document.createElement('li')).attr({
			'class': item.className || '',
			'data-name': item.name
		}).css({
			'cursor': callback ? 'pointer' : 'auto',
			'overflow': 'hidden',
			'background': item.background || 'transparent',
			'position': 'relative'
		}).on('click', function() {
			callback ? callback(item.name) : null;	
		}).html(item.content);
	}

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
				createDescItems(item, config.callback).appendTo(descPanel);
			});
			
			return descPanel;
		}
	};
	

	/*************************** Pie Chart Constructor ****************************/
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
			var description = self.args.description;
			var paths = self.el.find('path');
			var lis = self.el.find('li');
			var slices = {};
			var items = {};

			// fresh title
			data.title ? $(self.el.find('p')).html(data.title) : null;

			// fresh slices
			$.each(data.slices, function(i, slice) {
				slices[slice.name] = {
					'angle': slice.percent * 360,
					'color': slice.color
				}
			});

			var startAngle = 0;

			$.each(paths, function(i, path) {
				var name = $(path).attr('data-name');

				if (name) {
					var angle = slices[name]  === undefined ? parseFloat($(path).attr('angle')) : slices[name].angle;
					var stopAngle = angle === 0 ? startAngle : (angle === 360 ? 360 : startAngle + angle - graph.space);

					$(path).attr({
						'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, graph.insideR, graph.outsideR),
						'data-angle': angle
					});

					startAngle += angle;
					delete slices[name];
				} else {
					$(path).remove();
				}
			});

			var i = 0;
			for (var prop in slices) {
				if (slices.hasOwnProperty(prop))	 {
					var stopAngle = startAngle + slices[prop].angle;

					pieChartGenerator.svg.createElement('path').attr({
						'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, graph.insideR, graph.outsideR),
						'data-name': prop,
						'data-angle': slices[prop].angle
					}).css({
						'fill': slices[prop].color || allotColor(i),
						'stroke': graph.strokeColor || slices[prop].color || allotColor(i),
						'stokeWidth': graph.strokeColor ? graph.strokeWidth : 0,
						'cursor': graph.clickCallback ? 'pointer' : 'auto'
					}).appendTo(self.el.find('g'));
					startAngle += slices[prop].angle;
					i++;
				}
			}

			// fresh items
			$.each(data.items, function(i, item) {
				items[item.name] = {
					'name': item.name,
					'className': item.className,
					'background': item.background,
					'content': item.content
				};
			});

			$.each(lis, function(i, li) {
				var name = $(li).attr('data-name');

				if (items[name]) {
					items[name].content ? $(li).html(items[name].content) : null;
					items[name].background ? $(li).css('background', items[name].background) : null;
					items[name].className ? $(li).attr('class', items[name].className) : null;
					delete items[name];
				}
			});

			for (var prop in items) {
				if (items.hasOwnProperty(prop)) {
					createDescItems(items[prop], description.callback).appendTo(self.el.find('ul'));
				}
			}
		}
	};

	return PieChart;
});
