var $explosion= ()=> entity.explosion= {
	x: [],
	y: [],
	t: [],

	add: (x, y)=> {
		var exp= entity.explosion;
		exp.x.push(x);
		exp.y.push(y);
		exp.t.push(0);
	},
	rdr: ()=> {
		var exp= entity.explosion;
		for(var i= 0; i< exp.x.length; i++) {
			if(exp.t[i]>= 12) {
				exp.x.splice(i, 1);
				exp.y.splice(i, 1);
				exp.t.splice(i, 1);
				i--;
				continue;
			}
			c.rdr('explosion', Math.floor(exp.t[i]/ 4)* 24, ...c.relPos(exp.x[i], exp.y[i], 24, 24), 24, 24);
			exp.t[i]++;
		}
	},
}
