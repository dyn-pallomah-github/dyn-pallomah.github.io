var flag= {
	x: [],
	y: [],
	id: [],

	o: [0, 0, 1, 1, 2, 2, 0, 0, 3, 3, 4, 4, ],
	setblk: function(x, y) {
		flag.x.push(x);
		flag.y.push(y);
	},
	rdr: function() {
		for(var i= 0; i< flag.x.length; i++)
			if(flag.x[i]+ c.px> -16 && flag.x[i]+ c.px< c.w && flag.y[i]+ c.py> -16 && flag.y[i]+ c.py< c.h)
			c.rdr('flag', flag.o[c.f% flag.o.length]* 16, 16, 24, flag.x[i]+ c.px, flag.y[i]+ c.py- 8);
	},
}
