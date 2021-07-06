var $spike= ()=> entity.spike= {
	x: [],
	y: [],
	d: [],
	f: [],

	add: (x, y, d, f)=> {
		var spike= entity.spike;
		spike.x.push(x);
		spike.y.push(y);
		spike.d.push(d);
		spike.f.push(f);
	},
	rdr: ()=> {
		var spike= entity.spike;
		for(var i= 0; i< spike.x.length; i++)
			c.rdr('spike', spike.f[i]* 12, ...c.relPos(spike.x[i], spike.y[i]), 12, 12, spike.d[i]);
	},
}
