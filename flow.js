function Step(name, requires, callback) {
    var me = this;
    me.name = name;
    me.requires = requires;
    me.result = undefined;

    me.input = [];
    me.requiredBy = [];
    me.requiredByName = [];
    
    me.callback = callback || function(a){
	if (me.input.length) {
	    var t = 0;
	    me.input.forEach(function(v){
		t = t + v;
	    })
	    return t;
	} else {
	    return Math.random()
	}
    }
};

Step.prototype.setInput = function(key, value) {
    var i = this.requires.indexOf(key);
    this.input[i] = value;
}

Step.prototype.process = function () {
    var me = this;
    if (me.callback.then) {
	return me.callback.then(function(r){
	    me.result = r
	    me.requiredBy.forEach(function(e){
		e.setInput(me.name, r);
	    })
	})
    } else if(typeof me.callback === "function") {
	return Promise.resolve().then(() => {
	    me.result = me.callback.apply(this, me.input)
	    me.requiredBy.forEach(function(e){
		e.setInput(me.name, me.result);
	    })
	});
    } else {
	return Promise.resolve().then(() => {
	    me.result = me.callback
	    me.requiredBy.forEach(function(e){
		e.setInput(me.name, me.result);
	    })
	});
    }
};

function Flow(steps) {
    var me = this;
    
    me.processMap = {};
    me.steps = steps;
    
    steps.forEach(function(m) {
	me.processMap[m.name] = {
	    promise: null,
	    step: m
	};
    });

    steps.forEach(function(m) {
	m.requires.forEach(function(e){
	    me.processMap[e].step.requiredByName.push(m.name)
	    me.processMap[e].step.requiredBy.push(me.processMap[m.name].step)
	});
    });

}

Flow.prototype.processByName = function(stepName) {
  return this.process(this.processMap[stepName].step);
};

Flow.prototype.processDependencies = function(step) {
  return Promise.all(step.requires.map(r => this.processByName(r)));
};

Flow.prototype.process = function(step) {
  const process = this.processMap[step.name];
    if (!process.promise) {
	process.promise = this
	    .processDependencies(step)
	    .then(() => step.process());
  }
  return process.promise;
};

Flow.prototype.render = function(callback){
    var steps = this.steps;
    var flow = this;

    callback = callback ? callback :
	function(e){
	    var canvas = document.getElementsByTagName('svg').item(0)
	    var append = function(e, c){
		try { c.appendChild(e) }  catch(e) { console.log(e) }
	    };
	    if (Array.isArray(e)) {
		e.forEach(function(r){ append(r, canvas) })
	    } else {
		append(r, canvas);
	    }
	}
    
    return Promise.all(
	steps.map(m => flow.process(m))
    ).then(allResults => {
	var r = [];
	flow.results().forEach(function(e){
	    callback(e.result);
	})
    }, e => {
	console.error(e);
    });
};

Flow.prototype.results = function(){
    return this.steps.filter(function(e){
	return e.requiredBy.length == 0;
    })
}


