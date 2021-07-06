var soil= {
	sl: true,
	st: true,
	x: [],
	y: [],

	setblk: function(x, y) {
		soil.x.push(x);
		soil.y.push(y);
	},
	rdr: function() {
		for(var i= 0; i< soil.x.length; i++)
			if(soil.x[i]+ c.px> -16 && soil.x[i]+ c.px< c.w && soil.y[i]+ c.py> -16 && soil.y[i]+ c.py< c.h)
				c.rdr('soil', 0, 16, 16, soil.x[i]+ c.px, soil.y[i]+ c.py);
	},
}
