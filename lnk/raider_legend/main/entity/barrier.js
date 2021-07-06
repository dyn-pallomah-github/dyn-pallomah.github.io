var $barrier= ()=> entity.barrier= {
	x: [],
	y: [],
	d: [],

	add: (x, y, d)=> {
		var barrier= entity.barrier;
		barrier.x.push(x);
		barrier.y.push(y);
		barrier.d.push(d);
	},
	rdr: ()=> {
		var barrier= entity.barrier;
		for(var i= 0; i< barrier.x.length; i++)
			c.rdr('barrier', 0, ...c.relPos(barrier.x[i], barrier.y[i]- 2), 12, 16, barrier.d[i]);
	},
}
