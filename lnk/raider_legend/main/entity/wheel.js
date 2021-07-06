var $wheel= ()=> entity.wheel= {
	x: [],
	y: [],
	f: [],
	dist: [],
	step: [],
	playerStep: [],
	landTime: [],
	crash: (blk, i, f)=> {
		var wheel= entity.wheel;
		for(var j= 0; j< blk.x.length; j++)
			if(Math.abs(wheel.x[i]- blk.x[j])< 12 && Math.abs(wheel.y[i]- blk.y[j])< 12 &&
				 (f=== undefined || (blk.f!== undefined && blk.f[j]=== f))) {
				entity.explosion.add(wheel.x[i], wheel.y[i]);
				for(var k= 0; k< 12; k++)
					entity.particle.add(wheel.x[i]+ 3, wheel.y[i], (k- 5.5)* 0.2, Math.random()* 1.3- 1.3, 1, 1.4);

				wheel.x.splice(i, 1);
				wheel.y.splice(i, 1);
				wheel.f.splice(i, 1);
				wheel.dist.splice(i, 1);
				wheel.step.splice(i, 1);
				wheel.landTime.splice(i, 1);
				break;
			}
	},

	add: (x, y)=> {
		var wheel= entity.wheel;
		wheel.x.push(x);
		wheel.y.push(y);
		wheel.f.push(0);
		wheel.dist.push(0);
		wheel.step.push(0);
		wheel.landTime.push(0);
	},
	rdr: ()=> {
		var wheel= entity.wheel;
		for(var i= 0; i< wheel.x.length; i++) {
			c.rdr('wheel', wheel.f[i]* 14, ...c.relPos(wheel.x[i]- 1, wheel.y[i]- 1), 14, 14);
			if(wheel.f[i]> 0 && !(c.clockCycle% 10)) wheel.f[i]= wheel.f[i]=== 3? 1: wheel.f[i]+ 1;
		}
	},
	run: ()=> {
		var wheel= entity.wheel;
		for(var i= 0; i< wheel.x.length; i++) {
			if(entity.player.collide(wheel, i)) {
				entity.player.die();
				return;
			}
			var test= (x, y)=> {
				var ox= wheel.x[i];
				var oy= wheel.y[i];
				for(var a= 0; a< 12; a++) {
					var wall= entity.wall;
					var brk= 0;
					for(var b= 0; b< wall.x.length; b++)
						if(Math.abs(wheel.x[i]- wall.x[b])< 12 && Math.abs(wheel.y[i]- wall.y[b])< 12) {
							brk= 1;
							break;
						}
					if(brk) break;

					if(entity.player.collide(wheel, i, x, y, 1)) {
						wheel.f[i]= 1;
						wheel.playerStep.push([wheel.x[i]- x, wheel.y[i]- y]);
						wheel.step[i]= wheel.playerStep.length- 1;
						wheel.landTime[i]= 30;
						break;
					}
					else {
						wheel.x[i]+= x;
						wheel.y[i]+= y;
					}
				}
				wheel.x[i]= ox;
				wheel.y[i]= oy;
			}
			if(wheel.f[i]=== 0) {
				test(0, -12);
				test(12, 0);
				test(0, 12);
				test(-12, 0);
			}
			else {
				if(wheel.landTime[i]> 0) wheel.landTime[i]--;
				if(
					wheel.x[i]=== wheel.playerStep[wheel.step[i]][0] &&
					wheel.y[i]=== wheel.playerStep[wheel.step[i]][1] &&
					wheel.step[i]!== wheel.playerStep.length- 1
				) {
					wheel.step[i]++;
					wheel.landTime[i]= Math.max(0, 9* ((6- wheel.dist[i]+ 1)- 2* (wheel.playerStep.length- wheel.step[i]- 1)));
					wheel.dist[i]= 0;
				}
				if(wheel.landTime[i]=== 0) {
					if(wheel.playerStep[wheel.step[i]][1]- wheel.y[i]> 0) {
						wheel.y[i]+= 1.5;
						if(!(wheel.y[i]% 12)) wheel.dist[i]++;
					}
					if(wheel.playerStep[wheel.step[i]][1]- wheel.y[i]< 0) {
						wheel.y[i]-= 1.5;
						if(!(wheel.y[i]% 12)) wheel.dist[i]++;
					}
					if(wheel.playerStep[wheel.step[i]][0]- wheel.x[i]> 0) {
						wheel.x[i]+= 1.5;
						if(!(wheel.x[i]% 12)) wheel.dist[i]++;
					}
					if(wheel.playerStep[wheel.step[i]][0]- wheel.x[i]< 0) {
						wheel.x[i]-= 1.5;
						if(!(wheel.x[i]% 12)) wheel.dist[i]++;
					}
				}
				wheel.crash(entity.wall, i);
				wheel.crash(entity.glass, i);
				wheel.crash(entity.flip, i, 2);
			}
		}
	},
}
