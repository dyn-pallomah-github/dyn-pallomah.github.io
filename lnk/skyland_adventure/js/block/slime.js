var slime= {
	x: [],
	y: [],

	setblk: function(x, y) {
		slime.x.push(x);
		slime.y.push(y);
	},
	rdr: function() {
		for(var i= 0; i< slime.x.length; i++)
			if(slime.x[i]+ c.px> -16 && slime.x[i]+ c.px< c.w && slime.y[i]+ c.py> -16 && slime.y[i]+ c.py< c.h)
				c.rdr('slime', 0, 16, 16, slime.x[i]+ c.px, slime.y[i]+ c.py);
	},
}
