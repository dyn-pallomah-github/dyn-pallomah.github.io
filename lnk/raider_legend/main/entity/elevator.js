var $elevator= ()=> entity.elevator= {
	x: [],
	y: [],
	d: [],
	landTime: [],
	last: [],
	land: (blk, i)=> {
		var it= entity.elevator;
		for(var j= 0; j< blk.x.length; j++)
			if(Math.abs(it.x[i]- blk.x[j])< 12 && Math.abs(it.y[i]- blk.y[j])< 12) {
				[it.x[i], it.y[i]]= [...it.last[i]];
				it.landTime[i]= 30;
				it.d[i]+= 2;
				it.d[i]= it.d[i]> 3? it.d[i]- 4: it.d[i];
				break;
			}
	},

	add: (x, y, d)=> {
		var it= entity.elevator;
		it.x.push(x);
		it.y.push(y);
		it.d.push(d);
		it.landTime.push(0);
		it.last.push([x, y]);
	},
	rdr: ()=> {
		var it= entity.elevator;
		for(var i= 0; i< it.x.length; i++)
			c.rdr('elevator', c.frame% 7* 12, ...c.relPos(it.x[i], it.y[i]), 12, 12);
	},
	run: ()=> {
		var it= entity.elevator,
				player= entity.player;
		for(var i= 0; i< it.x.length; i++) {
			it.last[i]= [it.x[i], it.y[i]];
			if(it.landTime[i]<= 0) {
				entity.dustParticle.add(it.x[i], it.y[i], it.d[i]> 1? it.d[i]- 2: it.d[i]+ 2);
				switch(it.d[i]) {
					case 0:
						it.y[i]-= 4;
						if(!(it.x[i]% 12 || it.y[i]% 12)) it.landTime[i]= 30;
						break;
					case 1:
						it.x[i]+= 4;
						if(!(it.x[i]% 12 || it.y[i]% 12)) it.landTime[i]= 30;
						break;
					case 2:
						it.y[i]+= 4;
						if(!(it.x[i]% 12 || it.y[i]% 12)) it.landTime[i]= 30;
						break;
					case 3:
						it.x[i]-= 4;
						if(!(it.x[i]% 12 || it.y[i]% 12)) it.landTime[i]= 30;
						break;
				}
			}
			it.landTime[i]--;
			it.land(entity.wall, i);
			if(player.collide(it, i)) {
				[it.x[i], it.y[i]]= [...it.last[i]];
				it.landTime[i]= 30;
				it.d[i]+= 2;
				it.d[i]= it.d[i]> 3? it.d[i]- 4: it.d[i];
			}
		}
	},
}
