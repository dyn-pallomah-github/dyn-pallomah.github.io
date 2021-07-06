var soil_slope= {
	x: [],
	y: [],
	d: [],

	setblk: function(x, y, d) {
		soil_slope.x.push(x);
		soil_slope.y.push(y);
		soil_slope.d.push(d);
	},
	rdr: function() {
		for(var i= 0; i< soil_slope.x.length; i++)
			if(soil_slope.x[i]+ c.px> -16 && soil_slope.x[i]+ c.px< c.w && soil_slope.y[i]+ c.py> -16 && soil_slope.y[i]+ c.py< c.h)
				c.rdr('soil_slope', soil_slope.d[i]* 16, 16, 16, soil_slope.x[i]+ c.px, soil_slope.y[i]+ c.py);
	},
}
