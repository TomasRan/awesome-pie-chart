var $ = require('./node_modules/jquery/dist/jquery.min.js');

function DoughnutGraph(args) {
	//this.graphEngine = $.browser.id < 9 ? 'vml' : 'svg';
	
	this.insideR = args.insideR;
	this.outsideR = args.outsideR;
}

DoughnutGraph.prototype = {
	constructor: DoughnutGraph,
}

module.exports = DoughnutGraph;
