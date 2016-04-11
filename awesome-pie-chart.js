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
			e = e || window.event;
			var target = e.target || event.srcElement;

			if (target.nodeName.toUpperCase() === childNodeName.toUpperCase()) {
				var name = $(target).attr('data-name');
				if (name  && callback) {
					return callback(name);
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

			constructTitle: function(width, height, title) {
				return $(document.createElement('p')).css({
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
				}).html(title);
			},

			constructSvg: function(svgConfig) {
				var svg = this.createElement('svg').css({
					'width': svgConfig.outsideR * 2 + 'px',
					'height': svgConfig.outsideR * 2 + 'px'
				});

				var graphPanel = this.createElement('g').attr({
					'transform': 'translate(' + svgConfig.outsideR + ',' + svgConfig.outsideR + ') rotate(' + svgConfig.rotation + ') scale(' + (svgConfig.flipY ? '-1': '1') + ',' + (svgConfig.flipX ? '-1' : '1') + ')'
				}).appendTo(svg);

				if (svgConfig.slices && svgConfig.slices.length === 0) {
					this.createElement('path').attr({
						'd': this.getSectionalPath(0, 360, svgConfig.insideR, svgConfig.outsideR)
					}).css({
						'fill': '#d9d9d9'
					}).appendTo(graphPanel);
				} else {
					var startAngle = 0;

					$.each(svgConfig.slices, function(i, item) {
						var stopAngle = item.angle === 0 ? startAngle : (item.angle === 360 ? 360 : startAngle + item.angle - svgConfig.space);
						pieChartGenerator.svg.createElement('path').attr({
							'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, svgConfig.insideR, svgConfig.outsideR),
							'data-name': item.name,
							'data-angle': item.angle
						}).css({
							'fill': item.color || allotColor(i),
							'stroke': svgConfig.strokeColor || item.color || allotColor(i),
							'strokeWidth': svgConfig.strokeColor ? svgConfig.strokeWidth : 0,
							'cursor': svgConfig.clickCallback ? 'pointer' : 'auto'
						}).appendTo(graphPanel);
							startAngle += item.angle;
					});
				}

				if (svgConfig.clickCallback) {
					eventEntrust(svg, 'click', 'PATH', svgConfig.clickCallback);
				}

				if (svgConfig.mouseOverCallback) {
					eventEntrust(svg, 'mouseover', 'PATH', svgConfig.mouseOverCallback);
				}

				if (svgConfig.mouseOutCallback) {
					eventEntrust(svg, 'mouseout', 'PATH', svgConfig.mouseOutCallback);
				}

				return svg;
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
					this.constructTitle(width, height, config.title).appendTo(graph);
				}
	
				// consturct svg
				this.constructSvg(config).appendTo(graph);
		


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
	}
	
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
			if (callback) {
				return callback(item.name);	
			}
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
	}
	

	/*************************** Pie Chart Constructor ****************************/
	function PieChart(args) {
		argsCheck.call(this, args);
	
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
			}

			self.el = $(document.createElement('div')).attr({
				'class': self.args.className
			}).css({
				'background': self.args.background,
				'display': 'inline-block'
			}).append(combine);

			return self.el;
		};
	}

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
			if (data.title) {
				$(self.el.find('p')).html(data.title);
			}

			// fresh slices
			$.each(data.slices, function(i, slice) {
				slices[slice.name] = {
					'angle': slice.percent * 360,
					'color': slice.color
				};
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
					if (items[name].content) {
						$(li).html(items[name].content);
					}
					if (items[name].background) {
						$(li).css('background', items[name].background);
					}
					if (items[name].className) {
						$(li).attr('class', items[name].className);
					}
					delete items[name];
				}
			});

			for (var item in items) {
				if (items.hasOwnProperty(item)) {
					createDescItems(items[item], description.callback).appendTo(self.el.find('ul'));
				}
			}
		}
	};

	return PieChart;
});
