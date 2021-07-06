var $spark= ()=> entity.spark= {
	x: [],
	y: [],
	f: [],
	t: [],
	a: [],

	add: (x, y, t= 0, a= 0.2)=> {
		var spark= entity.spark;
		spark.x.push(x);
		spark.y.push(y);
		spark.f.push(0);
		spark.t.push(t);
		spark.a.push(a);
	},
	rdr: ()=> {
		var spark= entity.spark;
		c.ctx.save();
		for(var i= 0; i< spark.x.length; i++) {
			c.ctx.globalAlpha= spark.a[i];
			if(spark.f[i]> 5) {
				spark.x.splice(i, 1);
				spark.y.splice(i, 1);
				spark.f.splice(i, 1);
				spark.t.splice(i, 1);
				spark.a.splice(i, 1);
				i--;
				continue;
			}
			if(spark.t[i]<= 0) {
				c.rdr('spark', spark.f[i]* 11, spark.x[i], spark.y[i], 11, 11);
				if(!(c.clockCycle% 10)) spark.f[i]++;
			}
			else spark.t[i]--;
		}
		c.ctx.restore();
	},
}
