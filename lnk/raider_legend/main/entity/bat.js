var $bat= ()=> entity.bat= {
	x: [],
	y: [],
	d: [],
	default: [],
	landTime: [],
	step: [],
	land: (blk, last, i)=> {
		var bat= entity.bat;
		for(var j= 0; j< blk.x.length; j++)
			if(Math.abs(bat.x[i]- blk.x[j])< 12 && Math.abs(bat.y[i]- blk.y[j])< 12) {
				[bat.x[i], bat.y[i]]= last;
				bat.landTime[i]= 70;
				bat.step[i]= 0;
				bat.d[i]+= 2;
				bat.d[i]= bat.d[i]> 3? bat.d[i]- 4: bat.d[i];
				entity.dustParticle.add(bat.x[i], bat.y[i], bat.d[i]);
				break;
			}
	},

	add: (x, y, d)=> {
		var bat= entity.bat;
		bat.x.push(x);
		bat.y.push(y);
		bat.d.push(d);
		bat.default.push(d);
		bat.landTime.push(0);
		bat.step.push(0);
	},
	rdr: ()=> {
		var bat= entity.bat;
		for(var i= 0; i< bat.x.length; i++) {
			c.rdr('bat', c.frame% 8* 14, ...c.relPos(bat.x[i]- 1, bat.y[i]), 14, 12, 0,
						bat.d[i]% 2? (bat.d[i]=== 3? 1: -1): (bat.d[i]=== bat.default[i]? 1: -1));
		}
	},
	run: ()=> {
		var bat= entity.bat;
		for(var i= 0; i< bat.x.length; i++) {
			if(entity.player.collide(entity.bat, i)) entity.player.die();
			if(bat.landTime[i]<= 0) {
				if(!(bat.x[i]% 12 || bat.y[i]% 12)) bat.step[i]++;
				var last= [bat.x[i], bat.y[i]];
				switch(bat.d[i]) {
					case 0:
						bat.y[i]-= 1;
						break;
					case 1:
						bat.x[i]+= 1;
						break;
					case 2:
						bat.y[i]+= 1;
						break;
					case 3:
						bat.x[i]-= 1;
						break;
				}
				if(bat.step[i]> 1) {
					if(bat.d[i]=== 0) entity.enemyTrail.add(bat.x[i], bat.y[i]+ 12, bat.d[i]);
					if(bat.d[i]=== 1) entity.enemyTrail.add(bat.x[i]- 12- 1, bat.y[i], bat.d[i]);
					if(bat.d[i]=== 2) entity.enemyTrail.add(bat.x[i], bat.y[i]- 12, bat.d[i]);
					if(bat.d[i]=== 3) entity.enemyTrail.add(bat.x[i]+ 12+ 1, bat.y[i], bat.d[i]);
				}
			}
			bat.landTime[i]--;
			bat.land(entity.wall, last, i);
			bat.land(entity.spike, last, i);
			bat.land(entity.bladeTrap, last, i);
			bat.land(entity.blaster, last, i);
			bat.land(entity.glass, last, i);
		}
	},
}
