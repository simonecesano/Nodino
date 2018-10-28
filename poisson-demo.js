
$(document).ready(function() {

	// Constants
    var	  CANVAS_WIDTH = 1200
    , CANVAS_HEIGHT = 700;
    
    // Add canvas to page
    var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
    window.canvas = canvasElement.get(0).getContext("2d");
    canvasElement.appendTo('body');
    
    
    
    var sampler = new PoissonDiskSampler( CANVAS_WIDTH, CANVAS_HEIGHT, 60, 10 );
    // sampler.grid.drawGrid( canvas );
    
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

    console.log(coordinates);

    if (0) {
	canvas.strokeStyle = '#aaaaaa';
	coordinates.forEach(function(e){
	    canvas.beginPath();
	    canvas.moveTo(e[0].x, e[0].y);
	    canvas.lineTo(e[1].x, e[1].y);
	    canvas.lineTo(e[2].x, e[2].y);
	    canvas.stroke();
	    // canvas.fill();
	})
    } else {
	let roughCanvas = rough.canvas(canvasElement.get(0));

	
	coordinates.forEach(function(e){
	    var fill = ['cross-hatch', 'hachure', 'zigzag', 'dots' ][Math.floor(Math.random()*3)];
	    var hachure; hachure = (fill === 'hachure') ? 4 : 8;
	    roughCanvas.polygon([[e[0].x, e[0].y], [e[1].x, e[1].y], [e[2].x, e[2].y]],
				   {
				       stroke: '#ffffff',
				       strokeWidth: 1,
				       roughness: 1,
				       fillStyle: fill,
				       hachureGap: hachure,
				       hachureAngle: Math.random() * 360,
				       fill: '#888888'
				   });
	})

	solution.forEach(function(e){
	    roughCanvas.arc (e.x, e.y, 10, 10, 0, Math.PI * 2, false, { stroke: '#444444', roughness: 1.5, strokeWidth: 1 })	    
	})
    }
});



PoissonDiskSampler.prototype.drawOutputList = function( canvas ){
	for ( var i = 0; i < this.outputList.length; i++ ){
		this.grid.drawPoint( this.outputList[ i ], "#444", canvas );
	}
}

Grid.prototype.drawPoint = function( point, color, canvas ){
	// Default color
	color =  color || '#aaa';
	// Draw a circle
	canvas.beginPath();
	// arc(x, y, radius, startAngle, endAngle, anticlockwise)
	canvas.arc( point.x, point.y, this.pointSize, 0, 2 * Math.PI, false);
	canvas.fillStyle = color;
	canvas.fill();
}
