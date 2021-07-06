var $playerTrail= ()=> entity.playerTrail= {
	x: [],
	y: [],
	d: [],
	t: [],
	land: [],

	add: (x, y, d)=> {
		var trail= entity.playerTrail;
		trail.x.push(x);
		trail.y.push(y);
		trail.d.push(d);
		trail.t.push(0);
		trail.land.push(1);
	},
	rdr: ()=> {
		var trail= entity.playerTrail;
		for(var i= 0; i< trail.x.length; i++) {
			if(!entity.player.moving && trail.land[i]) {
				trail.t[i]+= 8;
				trail.land[i]= 0;
			}
			c.rdr('playerTrail', (4+ Math.max(0, Math.floor(trail.t[i]/ 8)))* 12, ...c.relPos(trail.x[i], trail.y[i]), 12, 12, trail.d[i]);
			if(c.state!== 5) trail.t[i]++;
			if(trail.t[i]>= 24) {
				trail.x.splice(i, 1);
				trail.y.splice(i, 1);
				trail.d.splice(i, 1);
				trail.t.splice(i, 1);
				trail.land.splice(i, 1);
				i--;
			}
		}
	},
}
