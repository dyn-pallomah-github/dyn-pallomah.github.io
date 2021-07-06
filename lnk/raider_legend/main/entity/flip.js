var $flip= ()=> entity.flip= {
	x: [],
	y: [],
	f: [],
	t: [],

	add: (x, y)=> {
		var flip= entity.flip;
		flip.x.push(x);
		flip.y.push(y);
		flip.f.push(0);
		flip.t.push(0);
	},
	rdr: ()=> {
		var flip= entity.flip;
		for(var i= 0; i< flip.x.length; i++) {
			c.rdr('flip', flip.f[i]=== 2? 12* 8: c.frame% 8* 12, ...c.relPos(flip.x[i], flip.y[i]), 12, 12);
		}
	},
	run: ()=> {
		var flip= entity.flip;
		var col= i=> entity.player.collide(flip, i);
		for(var i= 0; i< flip.x.length; i++) {
			if(flip.f[i]=== 0 && col(i)) flip.f[i]= 1;
			if(flip.f[i]=== 1 && !col(i)) {
				flip.f[i]= 2;
				flip.t[i]= 180;
			}
			if(flip.f[i]=== 2 && flip.t[i]<= 0) flip.f[i]= 0;
		}
	},
}
