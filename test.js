
$(function(){
    function test() {
	const steps = [
	    new Step('getImage', [], new Promise((resolve, reject) => {
		    var img = new Image();
		    img.src = './air.jpg';
		    img.onload = function(){
			console.log('loaded');
			resolve(img)
		    }
	    })),
	    new Step('j', ['getImage'], function(result){
		var canvas = document.createElement("canvas");
		canvas.width = result.width;
		canvas.height = result.height;
		
		
		var ctx = canvas.getContext('2d');
		
		ctx.drawImage(result, 0, 0);
		try {
		    return ctx.getImageData(0, 0, result.width, result.height);
		} catch (e) {
		    console.log(e);
		}
	    }),
	    
	    new Step('drawCircles', ['j'], function(result){
		var s = 0;
		var x = 0, y = 0;
		var ret = [];
		var canvas = document.getElementById('canvas')
		
		var r = 12;
		for (i = 0; i < (4 * result.width * result.height); i += 4) {

		    var c = chroma.hsl(360 * result.data[i] / 255, 1, 0.5)
		    
		    svg = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
		    var c = chroma(result.data[i], result.data[i + 1], result.data[i + 2])
		    
		    svg.setAttribute('ry', 0.5 * r * ( 1 - result.data[i] / 255 ));
		    svg.setAttribute('rx', 0.5 * r * ( 1 - result.data[i] / 255 ));	    
		    
		    svg.setAttribute('cx', x * r + r / 2);
		    svg.setAttribute('cy', y * r + r / 2);
		    svg.setAttribute('fill', c.hex())
		    ret.push(svg)
		    
		
		    x++;
		    if (x >= result.width) {
			y++;
			// console.log(svg);
			x = 0;
		    }
		}
		return ret;
	    }),
	    
	    new Step('a', [], function(){
		var r = 20;
		var x = 4, y = 4; 
		svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		svg.setAttribute('width', r * 0.7);
		svg.setAttribute('height', r * 0.7);
		svg.setAttribute('x', x * r);
		svg.setAttribute('y', y * r);
		svg.setAttribute('fill', 'red')
		return svg;
	    }),
	    new Step('b', ['a'], function(a){
		var r = [a];
		for(var i = 0; i < 5; i++) {
		    r.push(a.cloneNode(true));
		}
		return r;
	    }),
	    new Step('c', ['b'], function(a){
		return document.getElementById('path')
	    }),
	    new Step('d', ['b', 'c'], function(a){
		[].slice.call(arguments[0]).forEach(function(e, i){
		    var x = parseInt(e.getAttribute('x'))
		    e.setAttribute('x', x + 30 * i);
		})
		return a
	    }),
	    new Step('e', ['b', 'c', 'getImage'], function(a){
		var nodeList = [].slice.call(arguments[0]);
		var p = arguments[1];
		var l = p.getTotalLength()
		l = l / (nodeList.length - 1)

		nodeList.forEach(function(e, i){
		    var xy = p.getPointAtLength(l * i)
		    xy = [ xy.x - e.getAttribute('width') / 2, xy.y - e.getAttribute('height') / 2 ] 
		    
		    e.setAttribute('x', xy[0]);
		    e.setAttribute('y', xy[1]);	
		})
		return nodeList
	    })
	    
	    
	];
	
	const flow = new Flow(steps);

	var canvas = document.getElementById('canvas')
	flow.render()
    }
    
    test();
    
})
