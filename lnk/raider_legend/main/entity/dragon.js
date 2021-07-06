var $dragon= ()=> entity.dragon= {
	x: [],
	y: [],
	d: [],
	f: [],
	p: [],

	add: id=> {
		var it= entity.dragon;
		var trap= entity.dragonTrap;
		it.x.push(trap.x[id]);
		it.y.push(trap.y[id]);
		it.d.push(trap.d[id]);
		it.f.push(0);
		
	},
	rdr: ()=> {
		var it= entity.dragon;
		for(var i= 0; i< it.x.length; i++) {
			c.rdr('dragon', );
		}
	},
	run: ()=> {
		var it= entity.dragon;
		for(var i= 0; i< it.x.length; i++) {
			if(it.p[i]< 3) {
				
			}
		}
	},
}
