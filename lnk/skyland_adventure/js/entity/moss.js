var moss= {
	x: [],
	y: [],
	f: [],

	o: [0, 0, 0, 0, 8, 8, 8, 8, ],
	gen: function(x, y, f) {
		moss.x.push(x);
		moss.y.push(y);
		moss.f.push(f);
	},
	rdr: function() {
		for(var i= 0; i< moss.x.length; i++) {
			if(moss.x[i]+ c.px> -16 && moss.x[i]+ c.px< c.w && moss.y[i]+ c.py> -16 && moss.y[i]+ c.py< c.h) {
				if(moss.f[i]< 4)
					c.rdr('moss', (moss.f[i]+ moss.o[c.f% moss.o.length])* 16, 16, 16, moss.x[i]+ c.px, moss.y[i]+ c.py);
				else
					c.rdr('moss', moss.f[i]* 16, 16, 16, moss.x[i]+ c.px, moss.y[i]+ c.py);
			}
		}
	},
}
