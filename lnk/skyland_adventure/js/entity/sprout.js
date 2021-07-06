var sprout= {
	x: [],
	y: [],
	c: [],

	gen: function(x, y) {
		sprout.x.push(x);
		sprout.y.push(y);
		sprout.c.push(Math.floor(Math.random()* 4));
	},
	rdr: function() {
		for(var i= 0; i< sprout.x.length; i++)
			if(sprout.x[i]+ c.px> -16 && sprout.x[i]+ c.px< c.w && sprout.y[i]+ c.py> -16 && sprout.y[i]+ c.py< c.h){
				var costume= c.f% 8+ sprout.c[i]>= 8? c.f% 8+ sprout.c[i]- 8: c.f% 8+ sprout.c[i];
				c.rdr('sprout', costume* 16, 16, 16, sprout.x[i]+ c.px, sprout.y[i]+ c.py);
			}
	},
}
