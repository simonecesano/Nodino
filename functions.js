var createRect = function(bbox) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.setAttribute('width', bbox[0]);
    svg.setAttribute('height', bbox[1]);
    return svg;
}

var multiply = function(node, count) {
    var r = [];
    n = 0;
    while (n < count) { r.push(node.cloneNode(true)); n++ }    
    return r;
}

var style = function(style, node) {
    node.setAttribute('style', style);
    return node;
}

var position = function(callback, nodeList) {
    var x = 80;
    nodeList.forEach(function(e, i){
	var xy = callback[0](e, i);
	e.setAttribute('x', xy[0]);
	e.setAttribute('y', xy[1]);	
    })
    return nodeList;
}

var positionAlong = function(path, nodeList) {
    var p = path;
    var l = p.getTotalLength()
    l = l / (nodeList.length - 1)

    nodeList.forEach(function(e, i){
	var xy = p.getPointAtLength(l * i)
	xy = [ xy.x - e.getAttribute('width') / 2, xy.y - e.getAttribute('height') / 2 ] 

	e.setAttribute('x', xy[0]);
	e.setAttribute('y', xy[1]);	
    })
    return nodeList
}

var positionEvery = function(path, nodeList) {
    var p = path;
    var max_l = p.getTotalLength()
    
    var i = 0, cx = 0, l = 0;
    while (l < max_l) {
	var xy = p.getPointAtLength(l);

	var e = nodeList[i]
	var w = parseFloat(e.getAttribute('width'));
	if (xy.x > (cx + w)) {
	    e.setAttribute('x', xy.x - w);
	    e.setAttribute('y', xy.y - e.getAttribute('height') / 2);	
	    cx = cx + w + 2
	    i++;
	}
	l++;
    }
    console.log(nodeList.length, i);
    return nodeList.slice(0, i);
}


var rasterToArray = function(url) {
    var img = new Image();
    img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-8m7xEbwfCLF-GBeBKK3gGw-vgUjMfxh-0lGfWNCqLo3U6tFK';
    
}
