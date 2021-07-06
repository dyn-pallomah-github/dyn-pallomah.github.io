var exit= {
	sl: false,
	st: false,
	x: [],
	y: [],

	setblk: function(x, y) {
		exit.x.push(x);
		exit.y.push(y);
	},
	rdr: function() {
		for(var i= 0; i< exit.x.length; i++)
			if(exit.x[i]+ c.px> -16 && exit.x[i]+ c.px< c.w && exit.y[i]+ c.py> -16 && exit.y[i]+ c.py< c.h)
				c.rdr('exit', c.f% 4* 16, 16, 16, exit.x[i]+ c.px, exit.y[i]+ c.py);
	},
}
