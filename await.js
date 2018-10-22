function Step(name, requires, callback) {
    var me = this;

    this.name = name;
    this.requires = requires;
    this.requiredBy = [];
    this.input  = []; 

    this.callback = callback || function(){
	var n = Math.random();
	var t = 0;
	me.input.forEach(function(i){ t = t + i })
	t = t ? t : n;
	me.result = t;
	return t 
    }
    this.result = undefined;
};

function Flow(models) {
    this.steps = steps || [];
    this.map = {};
    var map;
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
	    e.promise = new Promise(function(resolve, reject){
		var r = e.callback(e.input)
		e.requiredBy.forEach(function(n){
		    e.map[n].input.push(r)
		})
		resolve(r);
	    }).then(function(r){
		e.result = r
	    })
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
	new Step('top a', []),
	new Step('top b', []),
	new Step('mid a', ['mid b']),
	new Step('mid b', ['top a', 'top b']),
	new Step('bottom', ['top b', 'mid b'])
    ];

    var map = {};

	.forEach(function(e){
	    console.log(e.name);
	    console.log(e.result);		    
	    console.log(e.requires);		    
	    console.log(e.input);
	})
}

test();
