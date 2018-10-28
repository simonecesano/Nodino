Function.prototype.signature = function() {
    return this.toString()
	.replace (/[\r\n\s]+/g, ' ')
        .match (/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/)
        .slice (1, 3)
        .join ('')
        .split (/\s*,\s*/);
}

var f = function (uno, due, tre) {
    console.log(arguments);
    return uno[0] + uno[1] + uno[2]
}

var args = function(f) {
    return f.toString()
	.replace (/[\r\n\s]+/g, ' ').
        match (/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/).
        slice (1, 3).
        join ('').
        split (/\s*,\s*/);
}

p = t => { 'foo' }

console.log(args(f));

console.log(f.signature());

console.log(p.signature());

console.log(p.toString());
