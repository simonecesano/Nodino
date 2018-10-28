$(function(){
    function test() {
	const steps = [
	    new Step('getImage', [], new Promise((resolve, reject) => {
		    var img = new Image();
		    img.src = './air.jpg';
		    img.onload = function(){
			resolve(img)
		    }
	    })),
	    new Step('drawCanvas', ['getImage'], function(result){
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
	    
	    new Step('drawCircles', ['drawCanvas'], function(result){
		var s = 0;
		var x = 0, y = 0;
		var ret = [];
		var canvas = document.getElementById('canvas')
		
		var r = 12;
		for (i = 0; i < (4 * result.width * result.height); i += 4) {

		    // var c = chroma.hsl(360 * result.data[i] / 255, 1, 0.5)
		    var c = chroma(result.data[i], result.data[i + 1], result.data[i + 2])
		    
		    svg = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
		    var c = chroma(result.data[i], result.data[i + 1], result.data[i + 2])
		    c = c.hsl()
		    var cr = (0.2  + Math.random()) * r / 2;
		    // cr = 0.4 * r;
		    var c = chroma.hsl(c[0], c[1] * 0.5, c[2])

		    svg.setAttribute('ry', cr);
		    svg.setAttribute('rx', cr);	    
		    

		    
		    svg.setAttribute('cx', x * r + r / 2);
		    svg.setAttribute('cy', y * r + r / 2);
		    svg.setAttribute('fill', c.hex())
		    ret.push(svg)
		    
		
		    x++;
		    if (x >= result.width) { y++; x = 0 }
		}
		return ret;
	    }),
	];
	
	const flow = new Flow(steps);

	var canvas = document.getElementById('canvas')
	flow.render(undefined, canvas)
    }
    
    test();
    
})
