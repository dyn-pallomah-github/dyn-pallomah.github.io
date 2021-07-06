var $blade= ()=> entity.blade= {
	x: [],
	y: [],
	d: [],
	f: [],

	add: (x, y, d)=> {
		var blade= entity.blade;
		for(var i= 0; i< blade.x.length; i++)
			if(x=== blade.x[i] && y=== blade.y[i] && d=== blade.d[i]) return;
		blade.x.push(x);
		blade.y.push(y);
		blade.d.push(d);
		blade.f.push(0);
	},
	run: ()=> {
		var blade= entity.blade;
		for(var i= 0; i< blade.x.length; i++)
			if(!(c.clockCycle% 10)) blade.f[i]++;
	},
	rdr: ()=> {
		var blade= entity.blade;
		for(var i= 0; i< blade.x.length; i++) {
			if(blade.f[i]>= 21) {
				blade.x.splice(i, 1);
				blade.y.splice(i, 1);
				blade.d.splice(i, 1);
				blade.f.splice(i, 1);
				i--;
				continue;
			}
			if(blade.f[i]>= 8) {
				if(blade.f[i]>= 16) c.rdr('bladeTrap', (12+ 20- blade.f[i])* 12, ...c.relPos(blade.x[i], blade.y[i]), 12, 12, blade.d[i]);
				else {
					c.rdr('bladeTrap', 16* 12, ...c.relPos(blade.x[i], blade.y[i]), 12, 12, blade.d[i]);
					if(entity.player.collide(blade, i, 0, 0, 1) && c.state=== 0) entity.player.die();
				}
			}
			else if(blade.f[i]>= 3) c.rdr('bladeTrap', Math.min(16, 12+ blade.f[i]- 3)* 12, ...c.relPos(blade.x[i], blade.y[i]), 12, 12, blade.d[i]);
		}
	},
}
