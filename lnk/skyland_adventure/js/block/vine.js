var vine= {
	sl: false,
	st: false,
	x: [],
	y: [],
	p: [],

	setblk: function(x, y, p) {
		vine.x.push(x);
		vine.y.push(y);
		vine.p.push(p);
	},
	rdr: function() {
		for(var i= 0; i< vine.x.length; i++)
			if(vine.x[i]+ c.px> -16 && vine.x[i]+ c.px< c.w && vine.y[i]+ c.py> -16 && vine.y[i]+ c.py< c.h)
				c.rdr('vine', vine.p[i]* 16, 16, 16, vine.x[i]+ c.px, vine.y[i]+ c.py);
	},
}
