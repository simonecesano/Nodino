
$(document).ready(function() {

    // Constants
    var	CANVAS_WIDTH = 1200,
	CANVAS_HEIGHT = 700;
    
    
    
    
    var sampler = new PoissonDiskSampler( CANVAS_WIDTH, CANVAS_HEIGHT, 60, 10 );
    
    var solution = sampler.sampleUntilSolution();
    console.log(solution);

    
    const delaunay = Delaunator.from(solution,
				     function(p){ return p.x },
				     function(p){ return p.y }
				    );

    var triangles = delaunay.triangles;
    
    var coordinates = [];
    
    for (let i = 0; i < triangles.length; i += 3) {
	coordinates.push([
            solution[triangles[i]],
            solution[triangles[i + 1]],
            solution[triangles[i + 2]]
	]);
    }

    var svg =  document.getElementsByTagName('svg').item(0)
    const rc = rough.svg(svg);

    if (0) {
    } else {
	coordinates.forEach(function(e){
	    // var fill = ['cross-hatch', 'hachure', 'zigzag', 'dots' ][Math.floor(Math.random()*3)];
	    var fill = 'cross-hatch';
	    var hachure; hachure = (fill === 'hachure') ? 4 : 8;
	    let node = rc.polygon([[e[0].x, e[0].y], [e[1].x, e[1].y], [e[2].x, e[2].y]],
				   {
				       stroke: '#ffffff',
				       strokeWidth: 1,
				       roughness: 1.5,
				       fillStyle: fill,
				       hachureGap: hachure,
				       hachureAngle: Math.random() * 360,
				       fill: '#888888'
				   });
	    svg.appendChild(node);
	})

	solution.forEach(function(e){
	    let node = rc.arc (e.x, e.y, 2, 2, 0, Math.PI * 2, false, { stroke: '#444444', roughness: 1.5, strokeWidth: 1 })	    
	    svg.appendChild(node);
	})
    }
});


