function Flow(){
    this.p = undefined; // previous result

    this.do = function(n, ...args){
	// console.log('inside do');		
	// console.log(n);	
	// console.log(args);
	// console.log(this.p);
	// console.log('-----------------');
	var r;

	// handle here
	// if p is an array, then do for each
	
	if(args.length) {
	    var r = n.call(this, args, this.p);
	} else {
	    var r = n.call(this, this.p);
	}
	this.p = r;
	return this;
    };

    this.init = function(a) {
	this.p = a;
	return this
    }
    this.log = function(){
	console.log(this.p)
	return this
    }

    this.render = function(target){
	this.p.forEach(function(e, i){
	    target.appendChild(e);
	})
    }
}
