function Step(name, requires, callback) {
    this.name = name;
    this.requires = requires;
    this.callback = callback || function(){
	var n = name + ' ' + Math.random();
	console.log( 'processing ' + n );
	return n 
    }
    this.input  = undefined; 
    this.result = undefined;
};


// this function is available as `Promise.delay` when using bluebird
function delay(x, v) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(v); }, x);
  });
}

Step.prototype.process = function () {
    var me = this;
    var p = new Promise(function(resolve, reject) {
	resolve(me.callback(me.input))
    }).then(function(r){
	return me.result = Math.random();
	return me
    })
    return p;
};

function Flow(models) {
    this.processMap = {};
    this.models = models;
    this.results = {};
    
    models.forEach(m => {
	this.processMap[m.name] = {
	    promise: null,
	    model: m
	};
    });
}

Flow.prototype.processDependencies = function(model) {
    return Promise.all(model.requires.map(r => this.processByName(r)));
};

Flow.prototype.process = function(model) {
    var me = this;
    const process = this.processMap[model.name];
    if (!process.promise) {
	process.promise = this.processDependencies(model)
	    .then(function(r){
		return model.process(r)
	    });
    }
    process.promise.then(function(r){
	console.log(model.name);
	model.result = r;
	me.results[model.name] = r;
    })
    return process.promise;
};

Flow.prototype.processByName = function(modelName) {
    var me = this;
    var map = this.processMap
    var req = this.processMap[modelName].model.requires;
    console.log('-'.repeat(80))
    console.log(modelName);
    console.log(req);
    console.log(req.map(function(e){ return map[e].model.result }));
    // console.log('-'.repeat(80))
    return this.process(this.processMap[modelName].model);
};


function test() {
    const steps = [
	new Step('top a', []),
	new Step('top b', ['top a']),
	new Step('mid a', ['top b']),
	new Step('mid b', ['top a']),
	new Step('bottom', ['top a'])
    ];
    
    const processor = new Flow(steps);
    
    Promise.all(
	steps.map(m => processor.process(m))
    ).then(allResults => {
	console.log("All process finished");
	console.log(processor.results);
    }, e => {
	console.error(e);
    });
}

test();
