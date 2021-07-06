var $bladeTrap= ()=> entity.bladeTrap= {
	x: [],
	y: [],
	d: [],
	f: [],

	add: (x, y, d, f)=> {
		var trap= entity.bladeTrap;
		trap.x.push(x);
		trap.y.push(y);
		trap.d.push(d);
		trap.f.push(f);
	},
	rdr: ()=> {
		var trap= entity.bladeTrap;
		for(var i= 0; i< trap.x.length; i++)
			c.rdr('bladeTrap', (trap.f[i]+ (c.frame% 4<= 1)* 6)* 12, ...c.relPos(trap.x[i], trap.y[i]), 12, 12, trap.d[i]);
	},
	run: ()=> {
		var player= entity.player;
		var trap= entity.bladeTrap;
		var blade= entity.blade;
		for(var i= 0; i< trap.x.length; i++) {
			if(c.state=== 0 || c.state=== 3) {
				if(player.collide(trap, i, 0, -12, 1))
					blade.add(player.x, player.y, 2);
				else if(player.collide(trap, i, 12, 0, 1))
					blade.add(player.x, player.y, 3);
				else if(player.collide(trap, i, 0, 12, 1))
					blade.add(player.x, player.y, 0);
				else if(player.collide(trap, i, -12, 0, 1))
					blade.add(player.x, player.y, 1);
			}
		}
	},
}
