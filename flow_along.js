$(function(){
    function test() {
	const steps = [
	    new Step('drawRect', [], function(){
		var svg = createRect([16, 16]);
		svg.setAttribute('fill', 'red')
		return svg
	    }),

	    new Step('setCount', [], 36),
	    new Step('multiplyRect', ['drawRect', 'setCount'], function(a, b) { return multiply(a, b) }),
	    
	    new Step('getPath', [], document.getElementById('path')),
	    new Step('layRect', ['multiplyRect', 'getPath'], function(a){
		return positionEvery(arguments[1], [].slice.call(arguments[0]));
	    }),
	    new Step('resize', ['layRect', 'getPath'], function(a){
		var p = arguments[1];
		var nodeList = [].slice.call(arguments[0])
		var l = p.getTotalLength()
		l = l / (nodeList.length - 1)

		nodeList.forEach(function(e, i){
		    var xy = p.getPointAtLength(l * i)
		    e.setAttribute('height', 2 * Math.log(1000 * xy.y / xy.x))
		})
		return nodeList;
	    }),
	    new Step('tile', ['resize'], function(a){
		var inputList = [].slice.call(arguments[0]);
		var nodeList = [];
		inputList.forEach(function(e){
		    nodeList.push(e)		    
		    var y = parseFloat(e.getAttribute('y'));
		    var h = parseFloat(e.getAttribute('height'));
		    var i = 1;
		    while (y > 0) {
			y = y - (h + 2);
			var c = e.cloneNode(true);
			c.setAttribute('y', y);
			nodeList.push(c)
		    }
		    y = parseFloat(e.getAttribute('y'));
		    while (y < 300) {
			y = y + (h + 2);
			var c = e.cloneNode(true);
			c.setAttribute('y', y);
			nodeList.push(c)
		    }
		})
		return nodeList;
	    }),
	    new Step('recolor', ['tile'], function(){
		var nodeList = [].slice.call(arguments[0])
		var d = 360 / nodeList.length;
		nodeList.forEach(function(e, i){
		    var c = chroma.hsl(d * i / 5, 0.5, 0.1 + 0.7 * Math.random())
		    e.setAttribute('fill', c.hex())
		    
		})
		return nodeList;
	    })
	    
	    
	    
	];
	
	const flow = new Flow(steps);

	var canvas = document.getElementById('canvas')
	flow.render(undefined, document.getElementById('render'))
    }
    
    test();
    
})
