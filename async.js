var asyncFn = async function(){
    var p = new Promise(function(resolve, reject) {
	var img = new Image();
	img.src = './air.jpg';
	img.onload = function(){
	    res = this;
	    resolve(this);
	}
    })
    res = await p;
    console.log('---------------------');
    console.log(res);
    console.log('---------------------');
    return res;

};
console.log(asyncFn[Symbol.toStringTag])
console.log(asyncFn[Symbol.toStringTag] === 'AsyncFunction')

asyncFn()
