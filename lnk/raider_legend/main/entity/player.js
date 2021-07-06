var entity= {};
var $player= ()=> entity.player= {
	x: 0,
	y: 0,
	d: 0,
	f: 0,
	last: [],
	dchange: 0,
	moving: 0,
	step: 0,
	coin: 0,
	star: 0,
	celebrate: 1,
	onBarrier: 0,
	collide: (target, id, offX= 0, offY= 0, strict= 0)=> {
		var player= entity.player;
		if(id=== undefined || id< 0)
			return Math.abs(player.x+ offX- target.x)< 12 && Math.abs(player.y+ offY- target.y)< 12 &&
				(strict? !(player.x% 12 || player.y% 12): 1) &&
				(strict? !(target.x[id]% 12 || target.y[id]% 12): 1);
		return Math.abs(player.x+ offX- target.x[id])< 12 && Math.abs(player.y+ offY- target.y[id])< 12 &&
			(strict? !(player.x% 12 || player.y% 12): 1) &&
			(strict? !(target.x[id]% 12 || target.y[id]% 12): 1);
	},
	land: (blk, last, f)=> {
		var player= entity.player;
		for(var i= 0; i< blk.x.length; i++)
			if(player.collide(blk, i) && (f=== undefined || blk.f && blk.f[i]=== f)) {
				[player.x, player.y]= last;
				if(player.step> 0 && !player.onBarrier) {
					if(blk!== entity.elevator || player.step> 1) entity.dust.add(player.x, player.y, player.d);
					entity.dustParticle.add(player.x, player.y, player.d);
				}
				player.moving= 0;
				if(player.step> 0) entity.wheel.playerStep.push([player.x, player.y]);
				if(player.dchange && player.step<= 1) {
					if(player.d=== 0) c.screen.offY= -3;
					if(player.d=== 1) c.screen.offX= 3;
					if(player.d=== 2) c.screen.offY= 3;
					if(player.d=== 3) c.screen.offX= -3;
					entity.dustParticle.add(player.x, player.y, player.d);
				}
				player.step= 0;
				player.obscatle= 1;
			}
	},
	crash: blk=> {
		var player= entity.player;
		for(var i= 0; i< blk.x.length; i++)
			if(player.collide(blk, i)) {
				c.state= 4;
				setTimeout(()=> c.state= 2, 1000/ 12* 13);
				$particle();
				$dustParticle();
				$spark();
			}
	},
	die: ()=> {
		c.state= 4;
		setTimeout(()=> c.state= 2, 1000/ 12* 13);
		$particle();
		$dustParticle();
		$spark();
	},
	repos: ()=> {
		c.screen.offX/= 1.1;
		c.screen.offY/= 1.1;
	},

	add: (x, y, d)=> {
		var player= entity.player;
		player.x= x;
		player.y= y;
		player.d= d;
		player.f= 0;
		player.last= [x, y];
	},
	rdr: ()=> {
		var player= entity.player;
		c.ctx.save();
		c.ctx.globalAlpha= 1;
		if(c.state=== 1) {
			c.rdr('playerFinish', player.f* 60, 156- 24+ c.screen.offX, 96- 24+ c.screen.offY, 60, 60);
			if(!(c.clockCycle% 10)) player.f++;
		}
		else if(c.state=== 4) {
			c.rdr('playerDeath', player.f* 110, 156- 49+ c.screen.offX, 96- 1+ c.screen.offY, 110, 14);
			if(!(c.clockCycle% 10)) player.f++;
		}
		else {
			player.f= 0;
			if(c.state!== 2) {
				if(player.moving) c.rdr('playerTrail', c.frame% 4* 12, 156+ c.screen.offX, 96+ c.screen.offY, 12, 12, player.d);
				else c.rdr('player', c.frame% 8* 14, 156+ c.screen.offX- 1, 96+ c.screen.offY- 1, 14, 14, player.d);
			}
		}
		c.ctx.restore();
	},
	run: ()=> {
		if(c.state=== 0 || c.state=== 3) {
			var player= entity.player;
			var last= [...player.last];
			if(!(player.x% 12 || player.y% 12)) {
				last= [player.x, player.y];
				player.last= [player.x, player.y];
			}

			if(player.coin=== (level[c.lv].match(/,3/g) || []).length && player.celebrate && (level[c.lv].match(/3/g) || []).length> 0) {
				for(var i= 0; i< 30; i++)
					for(var j= 0; j< 30; j++)
						entity.spark.add(c.cvs.width/ 29* i+ (Math.random()- 0.5)* c.cvs.width/ 29,
														 c.cvs.height/ 29* j+ (Math.random()- 0.5)* c.cvs.height/ 29,
														 Math.floor(Math.random()* 80), Math.random()* 0.6+ 0.1);
				player.celebrate= 0;
			}
			player.onBarrier= 0;
			for(var i= 0; i< entity.barrier.x.length; i++) {
				var barrier= entity.barrier;
				if(player.collide(barrier, i, 0, 0, 1) && Math.abs(barrier.d[i]- player.d)=== 2) {
					if(player.step> 1) {
						entity.dust.add(player.x, player.y, player.d);
						entity.dustParticle.add(player.x, player.y, player.d);
					}
					if(player.dchange && player.step<= 1) {
						if(player.d=== 0) c.screen.offY= -3;
						if(player.d=== 1) c.screen.offX= 3;
						if(player.d=== 2) c.screen.offY= 3;
						if(player.d=== 3) c.screen.offX= -3;
						entity.dustParticle.add(player.x, player.y, player.d);
					}
					player.moving= 0;
					player.onBarrier= 1;
					player.step= -1;
					player.repos();
					if(player.onElevator> 0) {
						var it= entity.elevator;
						it.landTime[i]= 50;
						it.d[i]+= 2;
						it.d[i]= it.d[i]> 3? it.d[i]- 4: it.d[i];
					}
				}
			}
			if(!player.onBarrier) {
				if(player.d=== 0) {
					if(player.moving)
						c.screen.offY= Math.min(30, 1.5* player.step);
					else player.repos();
					player.y+= 4;
				}
				if(player.d=== 1) {
					if(player.moving)
						c.screen.offX= -Math.min(30, 1.5* player.step);
					else player.repos();
					player.x-= 4;
				}
				if(player.d=== 2) {
					if(player.moving)
						c.screen.offY= -Math.min(30, 1.5* player.step);
					else player.repos();
					player.y-= 4;
				}
				if(player.d=== 3) {
					if(player.moving)
						c.screen.offX= Math.min(30, 1.5* player.step);
					else player.repos();
					player.x+= 4;
				}
			}
			if(player.onBarrier) player.moving= 0;
			else player.moving= 1;
			if(!(player.x% 12 || player.y% 12)) player.step++;

			player.crash(entity.spike);

			if(player.collide(entity.escape, -1, 0, 0, 1)) {
				c.win= 1;
				c.state= 1;
				if(c.lv< level.length- 1)
					setTimeout(()=> c.state= 2, 1000/ 12* 10);
				else {
					setTimeout(()=> {
						c.trans= 0;
						c.action.home();
						c.entity.reset();
						[entity.player.x, entity.player.y]= [c.screen.midX- 7.5, c.screen.midY];
						[c.screen.offX, c.screen.offY]= [0, 0];
						entity.levelButton.add();
						c.ctx.globalAlpha= 1;
						c.state= -3;
					}, 1000/ 12* 18);
				}
				$particle();
				$dustParticle();
				$spark();
				for(var i= 0; i< 30; i++)
					for(var j= 0; j< 30; j++)
						entity.spark.add(c.cvs.width/ 29* i+ (Math.random()- 0.5)* c.cvs.width/ 29,
														 c.cvs.height/ 29* j+ (Math.random()- 0.5)* c.cvs.height/ 29,
														 Math.floor(Math.random()* 80), Math.random()* 0.3+ 0.1);
				c.froze--;
			}
			player.land(entity.wall, last);
			player.land(entity.bladeTrap, last);
			player.land(entity.blaster, last);
			player.land(entity.elevator, last);
			player.land(entity.dragonTrap, last);

			for(var i= 0; i< entity.flip.x.length; i++) {
				var flip= entity.flip;
				if(flip.f[i]=== 2) {
					flip.t[i]--;
					if(player.collide(flip, i)) {
						[player.x, player.y]= last;
						if(player.step> 0 && !player.onBarrier) {
							entity.dust.add(player.x, player.y, player.d);
							entity.dustParticle.add(player.x, player.y, player.d);
						}
						player.moving= 0;
						if(player.dchange && player.step<= 1) {
							if(player.d=== 0) c.screen.offY= -3;
							if(player.d=== 1) c.screen.offX= 3;
							if(player.d=== 2) c.screen.offY= 3;
							if(player.d=== 3) c.screen.offX= -3;
							entity.dustParticle.add(player.x, player.y, player.d);
						}
						player.step= 0;
						player.obscatle= 1;
						if(flip.t[i]<= 1) flip.t[i]= 1;
					}
				}
			}

			for(var i= 0; i< entity.coin.x.length; i++) {
				var coin= entity.coin;
				if(player.collide(coin, i) && coin.t[i]=== 0) {
					player.coin++;
					coin.t[i]= 1;
					coin.d[i]= player.d;
					for(var j= 0; j< 2; j++)
						for(var k= 0; k< 2; k++)
							entity.spark.add(20/ 2* j+ 2+ Math.floor(Math.random()- 0.5)* 20/ 2/ 2, 20/ 2* k+ 2+ Math.floor(Math.random()- 0.5)* 20/ 2/ 2,
															 Math.floor(Math.random()* 40), Math.random()* 0.3+ 0.1);
				}
			}
			for(var i= 0; i< entity.star.x.length; i++) {
				var it= entity.star;
				if(player.collide(it, i)) {
					player.star++;
					entity.explosion.add(it.x[i], it.y[i]);
					for(var j= 0; j< 18; j++)
						entity.particle.add(it.x[i]+ 3, it.y[i], (j- 8.5)* 0.2, Math.random()* 1.3- 0.9);
					for(var j= 0; j< 2; j++)
						for(var k= 0; k< 2; k++)
							entity.spark.add(20/ 2* j+ 2+ Math.floor(Math.random()- 0.5)* 20/ 2/ 2, 20/ 2* k+ 2+ Math.floor(Math.random()- 0.5)* 20/ 2/ 2,
															 Math.floor(Math.random()* 40), Math.random()* 0.3+ 0.1);

					it.x.splice(i, 1);
					it.y.splice(i, 1);
				}
			}
			for(var i= 0; i< entity.barrier.x.length; i++) {
				var barrier= entity.barrier;
				if(player.collide(barrier, i) && barrier.d[i]=== player.d && (
					player.d=== 0 && player.collide(barrier, i, 0, 12) ||
					player.d=== 1 && player.collide(barrier, i, -12) ||
					player.d=== 2 && player.collide(barrier, i, 0, -12) ||
					player.d=== 3 && player.collide(barrier, i, 12)
				)) {
					[player.x, player.y]= last;
					if(player.step> 0) {
						entity.dust.add(player.x, player.y, player.d);
						entity.dustParticle.add(player.x, player.y, player.d);
					}
					if(player.dchange && player.step<= 1) {
						if(player.d=== 0) c.screen.offY= -3;
						if(player.d=== 1) c.screen.offX= 3;
						if(player.d=== 2) c.screen.offY= 3;
						if(player.d=== 3) c.screen.offX= -3;
						entity.dustParticle.add(player.x, player.y, player.d);
					}
					player.moving= 0;
					player.step= 0;
					player.obscatle= 1;
					player.repos();
				}
			}
			for(var i= 0; i< entity.glass.x.length; i++) {
				var glass= entity.glass;
				if(player.collide(glass, i)) {
					entity.explosion.add(glass.x[i], glass.y[i]);
					for(var j= 0; j< 18; j++)
						entity.particle.add(glass.x[i]+ 3, glass.y[i], (j- 8.5)* 0.2, Math.random()* 1.3- 0.9);
					glass.del(i);
					i--;
				}
			}

			if(player.moving && player.step> 1) {
				if(player.d=== 0) entity.playerTrail.add(player.x, player.y- 12, player.d);
				if(player.d=== 1) entity.playerTrail.add(player.x+ 12, player.y, player.d);
				if(player.d=== 2) entity.playerTrail.add(player.x, player.y+ 12, player.d);
				if(player.d=== 3) entity.playerTrail.add(player.x- 12, player.y, player.d);
			}
		}
	},
}
