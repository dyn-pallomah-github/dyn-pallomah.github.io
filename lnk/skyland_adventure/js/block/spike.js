var spike= {
	sl: true,
	st: false,
	x: [],
	y: [],

	setblk: function(x, y) {
		spike.x.push(x);
		spike.y.push(y);
	},
	rdr: function() {
		for(var i= 0; i< spike.x.length; i++)
			if(spike.x[i]+ c.px> -16 && spike.x[i]+ c.px< c.w && spike.y[i]+ c.py> -16 && spike.y[i]+ c.py< c.h)
				c.rdr('spike', 0, 16, 16, spike.x[i]+ c.px, spike.y[i]+ c.py);
	},
}
