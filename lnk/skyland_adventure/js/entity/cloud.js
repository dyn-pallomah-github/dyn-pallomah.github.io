var cloud= {
	x: [],
	y: [],
	c: [],

	gen: function(x) {
		cloud.x.push(x);
		cloud.y.push(Math.floor(Math.random()* 16+ 1)+ 20);
		cloud.c.push(Math.floor(Math.random()* 4)* 48);
		c.e++;
	},
	rdr: function() {
		for(var i= 0; i< cloud.c.length; i++) {
			c.rdr('cloud', cloud.c[i], 48, 16, cloud.x[i], cloud.y[i]);
			cloud.x[i]-= 0.1;
			if(cloud.x[i]< -c.w/ 6) {
				cloud.x.splice(i, 1);
				cloud.y.splice(i, 1);
				cloud.c.splice(i, 1);
				cloud.gen(c.w);
				i--;
			}
		}
	},
}
