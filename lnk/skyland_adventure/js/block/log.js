var log= {
	sl: false,
	st: true,
	x: [],
	y: [],
	p: [],

	setblk: function(x, y, p) {
		log.x.push(x);
		log.y.push(y);
		log.p.push(p);
	},
	rdr: function() {
		for(var i= 0; i< log.x.length; i++)
			if(log.x[i]+ c.px> -16 && log.x[i]+ c.px< c.w && log.y[i]+ c.py> -16 && log.y[i]+ c.py< c.h)
				c.rdr('log', log.p[i]* 16, 16, 16, log.x[i]+ c.px, log.y[i]+ c.py- 1);
	},
}
