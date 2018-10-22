function Step(name, requires, callback) {
    var me = this;

    this.name = name;
    this.requires = requires;
    this.requiredBy = [];
    this.input  = []; 

    this.callback = callback ?
	function(){
	    me.result = callback(me.input);
	    return me.result;
	} : 
	function(){
	    var n = Math.random();
	    var t = 0;
	    me.input.forEach(function(i){ t = t + i })
	    t = t ? t : n;
	    me.result = t;
	    return t 
	}
    this.result = undefined;
};

function Flow(steps) {
    this.steps = steps || [];
    this.map = {};
    var map = {};
    steps
	.map(function(e){
	    map[e.name] = e;
	    e.map = map;
	    return e
	})
	.map(function(e){
	    e.requires.forEach(function(r){
		map[r].requiredBy.push(e.name);
	    })
	    return e;
	})
	.map(function(e){
	    if (e.callback instanceof Promise) {
		e.promise = e.callback;
	    } else {
		e.promise = new Promise(function(resolve, reject){
		    var r = e.callback(e.input)
		    e.requiredBy.forEach(function(n){
			e.map[n].input.push(r)
		    })
		    resolve(r);
		}).then(function(r){
		    e.result = r
		})
	    }
	    return e;
	})
	.map(function(e){
	    e.requires.forEach(function(r){
		async function f(){
		    await map[r].promise
		    e.input.push(map[r].result)
		}
		f()
	    })
	    return e;
	})
    this.map = map;
}


function test() {
    const steps = [
	new Step('top a', [], function(){
	    var res;
	    var p = new Promise(function(resolve, reject) {
		var img = new Image();
		img.src = './air.jpg';
		img.onload = function(){
		    res = this;
		    resolve(this);
		}
	    }).then(function(f){
		console.log(f);
	    })
	    return Math.random();
	}),

	new Step('top b', []),
	new Step('mid a', ['mid b']),
	new Step('mid b', ['top a', 'top b'], function(a) {
	    return a[0] * a[1]
	}),
	new Step('bottom', ['top b', 'mid b'])
    ];

    var flow = new Flow(steps);

    flow.steps
	.forEach(function(e){
	    console.log(e.name);
	    console.log(e.requires);		    
	    console.log(e.input);
	    console.log(e.result);		    
	})
}

test();
