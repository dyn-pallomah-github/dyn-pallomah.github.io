var $dragonTrap= ()=> entity.dragonTrap= {
	x: [],
	y: [],
	d: [],
	f: [],
	o: [],
	t: [],

	add: (x, y, d, f, o)=> {
		var it= entity.dragonTrap;
		it.x.push(x);
		it.y.push(y);
		it.d.push(d);
		it.f.push(f);
		it.o.push(0);
		it.t.push(90);
	},
	rdr: ()=> {
		var it= entity.dragonTrap;
		for(var i= 0; i< it.x.length; i++) {
			if(it.t[i]< 90 && c.frame% 4< 2) c.rdr('dragonTrap', it.f[i]* 12, ...c.relPos(it.x[i], it.y[i]), 12, 12, it.d[i]);
			else c.rdr('wall', it.f[i]* 12, ...c.relPos(it.x[i], it.y[i]), 12, 12, it.d[i]);
		}
	},
	run: ()=> {
		var it= entity.dragonTrap;
		for(var i= 0; i< it.x.length; i++) {
			if(it.t[i]< 0) {
				entity.wall.add(it.x[i], it.y[i], it.d[i], it.f[i]);
				it.x.splice(i, 1);
				it.y.splice(i, 1);
				it.d.splice(i, 1);
				it.f.splice(i, 1);
				it.o.splice(i, 1);
				it.t.splice(i, 1);
				i--;
				continue;
			}
			var col= entity.player.collide;
			if(it.t[i]< 90) it.t[i]--;
			else switch(it.o[i]) {
				case 1:
					for(var a= 1; a< 18; a++) {
						var brk= 0;
						for(var b= 0; b< entity.wall.length; b++)
							if(Math.abs(it.x[i]- entity.wall.x[b])< 12 && Math.abs(it.y[i]- a* 12- entity.wall.y[b])< 12) {
								brk= 1;
								break;
							}
						if(brk) break;
						if(col(it, i, 0, 12* a)) {
							it.t[i]--;
							break;
						}
					}
					break;
				case 2:
					for(var a= 1; a< 18; a++) {
						var brk= 0;
						for(var b= 0; b< entity.wall.length; b++)
							if(Math.abs(it.x[i]+ a* 12- entity.wall.x[b])< 12 && Math.abs(it.y[i]- entity.wall.y[b])< 12) {
								brk= 1;
								break;
							}
						if(brk) break;
						if(col(it, i, -12* a)) {
							it.t[i]--;
							break;
						}
					}
					break;
				case 3:
					for(var a= 1; a< 18; a++) {
						var brk= 0;
						for(var b= 0; b< entity.wall.length; b++)
							if(Math.abs(it.x[i]- entity.wall.x[b])< 12 && Math.abs(it.y[i]+ a* 12- entity.wall.y[b])< 12) {
								brk= 1;
								break;
							}
						if(brk) break;
						if(col(it, i, 0, -12* a)) {
							it.t[i]--;
							break;
						}
					}
					break;
				case 0:
					for(var a= 1; a< 18; a++) {
						var brk= 0;
						for(var b= 0; b< entity.wall.length; b++)
							if(Math.abs(it.x[i]- a* 12- entity.wall.x[b])< 12 && Math.abs(it.y[i]- entity.wall.y[b])< 12) {
								brk= 1;
								break;
							}
						if(brk) break;
						if(col(it, i, 12* a)) {
							it.t[i]--;
							break;
						}
					}
					break;
			}
		}
	},
}
