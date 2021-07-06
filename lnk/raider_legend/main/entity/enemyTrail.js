var $enemyTrail= ()=> entity.enemyTrail= {
	x: [],
	y: [],
	d: [],
	t: [],

	add: (x, y, d)=> {
		var trail= entity.enemyTrail;
		trail.x.push(x);
		trail.y.push(y);
		trail.d.push(d);
		trail.t.push(0);
	},
	rdr: ()=> {
		var trail= entity.enemyTrail;
		for(var i= 0; i< trail.x.length; i++) {
			c.rdr('enemyTrail', Math.floor(trail.t[i]/ 6)* 10, ...c.relPos(trail.x[i]+ 1, trail.y[i]), 10, 12, trail.d[i]);
			if(c.state!== 5) trail.t[i]++;
			if(trail.t[i]>= 18) {
				trail.x.splice(i, 1);
				trail.y.splice(i, 1);
				trail.d.splice(i, 1);
				trail.t.splice(i, 1);
				i--;
			}
		}
	},
}
