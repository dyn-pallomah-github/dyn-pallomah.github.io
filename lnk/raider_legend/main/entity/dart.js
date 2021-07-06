var $dart= ()=> entity.dart= {
	x: [],
	y: [],
	d: [],
	f: [],
	land: (blk, i, f)=> {
		var it= entity.dart;
		for(var j= 0; j< blk.x.length; j++)
			if(Math.abs(it.x[i]- blk.x[j])< 12 && Math.abs(it.y[i]- blk.y[j])< 12 && it.f[i]=== 0 &&
				 (f=== undefined || blk.f!== undefined && blk.f[j]=== f)) {
				it.f[i]= 1;
				for(var k= 0; k< 3; k++)
					entity.particle.add(it.x[i]+ 3, it.y[i], (k- 1)* 0.5, Math.random()* 1.3- 1.2, 1, 0.9);
				entity.dustParticle.add(it.x[i], it.y[i], it.d[i]> 1? it.d[i]- 2: it.d[i]+ 2);
				break;
			}
	},

	add: (x, y, d)=> {
		var it= entity.dart;
		it.x.push(x);
		it.y.push(y);
		it.d.push(d);
		it.f.push(0);
	},
	rdr: ()=> {
		var it= entity.dart;
		for(var i= 0; i< it.x.length; i++) {
			if(it.f[i]> 4) {
				it.x.splice(i, 1);
				it.y.splice(i, 1);
				it.d.splice(i, 1);
				it.f.splice(i, 1);
				i--;
				continue;
			}
			c.rdr('blaster', 12* (5+ it.f[i]), ...c.relPos(it.x[i], it.y[i]), 12, 12, it.d[i]);
			if(it.f[i]> 0 && !(c.clockCycle% 6)) it.f[i]++;
		}
	},
	run: ()=> {
		var it= entity.dart;
		for(var i= 0; i< it.x.length; i++) {
			if(it.f[i]=== 0) {
				if(entity.player.collide(it, i)) entity.player.die();
				switch(it.d[i]) {
					case 0:
						if(it.f[i]=== 0) it.y[i]-= 2;
						break;
					case 1:
						if(it.f[i]=== 0) it.x[i]+= 2;
						break;
					case 2:
						if(it.f[i]=== 0) it.y[i]+= 2;
						break;
					case 3:
						if(it.f[i]=== 0) it.x[i]-= 2;
						break;
				}
				it.land(entity.wall, i);
				it.land(entity.spike, i);
				it.land(entity.bladeTrap, i);
				it.land(entity.blaster, i);
				it.land(entity.glass, i);
				it.land(entity.flip, i, 2);
			}
		}
	},
}
