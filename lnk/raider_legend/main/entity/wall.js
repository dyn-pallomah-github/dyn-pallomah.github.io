var $wall= ()=> entity.wall= {
	x: [],
	y: [],
	d: [],
	f: [],

	add: (x, y, d, f)=> {
		var wall= entity.wall;
		wall.x.push(x);
		wall.y.push(y);
		wall.d.push(d);
		wall.f.push(f);
	},
	rdr: ()=> {
		var wall= entity.wall;
		for(var i= 0; i< wall.x.length; i++)
			c.rdr('wall', wall.f[i]* 12, ...c.relPos(wall.x[i], wall.y[i]), 12, 12, wall.d[i]);
	},
}
