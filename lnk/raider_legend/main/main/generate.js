c.genBlock= (blk, x, y, lv)=> {
	var dir= [0, 0, 0, 0];
	if(lv[y- 1] && lv[y- 1][x] && !c.wall.includes(lv[y- 1] && lv[y- 1][x])) dir[0]= 1;
	if(lv[y][x+ 1] && !c.wall.includes(lv[y][x+ 1])) dir[1]= 1;
	if(lv[y+ 1] && lv[y+ 1][x] && !c.wall.includes(lv[y+ 1] && lv[y+ 1][x])) dir[2]= 1;
	if(lv[y][x- 1] && !c.wall.includes(lv[y][x- 1])) dir[3]= 1;

	if(dir.filter(v=> v).length=== 4)
		blk.add(x* 12, y* 12, 0, 4);
	else if(dir.filter(v=> v).length=== 3) {
		if(dir[0] && dir[1] && dir[3])
			blk.add(x* 12, y* 12, 0, 3);
		if(dir[0] && dir[1] && dir[2])
			blk.add(x* 12, y* 12, 1, 3);
		if(dir[1] && dir[2] && dir[3])
			blk.add(x* 12, y* 12, 2, 3);
		if(dir[0] && dir[2] && dir[3])
			blk.add(x* 12, y* 12, 3, 3);
	}
	else if(dir.filter(v=> v).length=== 2) {
		if(dir[0] && dir[1])
			blk.add(x* 12, y* 12, 0, 1);
		else if(dir[1] && dir[2])
			blk.add(x* 12, y* 12, 1, 1);
		else if(dir[2] && dir[3])
			blk.add(x* 12, y* 12, 2, 1);
		else if(dir[0] && dir[3])
			blk.add(x* 12, y* 12, 3, 1);

		else if(dir[0] && dir[2])
			blk.add(x* 12, y* 12, 0, 2);
		else if(dir[1] && dir[3])
			blk.add(x* 12, y* 12, 1, 2);
	}
	else if(dir.filter(v=> v).length=== 1)
		blk.add(x* 12, y* 12, dir.indexOf(1), 0);

	if(!dir[0] && lv[y- 1] && lv[y- 1][x] && !dir[1] && lv[y][x+ 1] && !c.wall.includes(lv[y- 1] && lv[y- 1][x+ 1]))
		blk.add(x* 12, y* 12, 0, 5);
	if(!dir[1] && lv[y][x+ 1] && !dir[2] && lv[y+ 1] && lv[y+ 1][x] && !c.wall.includes(lv[y+ 1] && lv[y+ 1][x+ 1]))
		blk.add(x* 12, y* 12, 1, 5);
	if(!dir[2] && lv[y+ 1] && lv[y+ 1][x] && !dir[3] && lv[y][x- 1] && !c.wall.includes(lv[y+ 1] && lv[y+ 1][x- 1]))
		blk.add(x* 12, y* 12, 2, 5);
	if(!dir[0] && lv[y- 1] && lv[y- 1][x] && !dir[3] && lv[y][x- 1] && !c.wall.includes(lv[y- 1] && lv[y- 1][x- 1]))
		blk.add(x* 12, y* 12, 3, 5);
}
c.genLv= ()=> {
	c.entity.reset();
	c.ctx.globalAlpha= 1;
	c.screen.offX= 0;
	c.screen.offY= 0;

	var x= 0;
	var y= 0;
	var lv= level[c.lv].split('\n');
	lv.forEach((v, x)=> lv[x]= v.split(','));
	var count= {
		wormhole: 0,
	}

	for(var i= 0; i< lv.length; i++) {
		for(var j= 0; j< lv[i].length; j++)
			switch(c.list[lv[i][j]]) {
				case 'player':
					var dir= [];
					if(c.wall.includes(lv[i+ 1] && lv[i+ 1][j])) dir.push(0);
					if(c.wall.includes(lv[i- 1] && lv[i- 1][j])) dir.push(2);
					if(c.wall.includes(lv[i][j- 1])) dir.push(1);
					if(c.wall.includes(lv[i][j+ 1])) dir.push(3);
					entity.player.add(j* 12, i* 12, dir[Math.floor(Math.random()* dir.length)]);
					break;
				case 'escape':
					entity.escape.add(j* 12, i* 12);
					break;
				case 'coin':
					entity.coin.add(j* 12, i* 12);
					break;
				case 'star':
					entity.star.add(j* 12, i* 12);
					break;
				case 'wall':
					c.genBlock(entity.wall, j, i, lv);
					break;
				case 'spike':
					c.genBlock(entity.spike, j, i, lv);
					break;
				case 'bladeTrap':
					c.genBlock(entity.bladeTrap, j, i, lv);
					break;
				case 'blasterU':
					entity.blaster.add(j* 12, i* 12, 0);
					break;
				case 'blasterR':
					entity.blaster.add(j* 12, i* 12, 1);
					break;
				case 'blasterD':
					entity.blaster.add(j* 12, i* 12, 2);
					break;
				case 'blasterL':
					entity.blaster.add(j* 12, i* 12, 3);
					break;
				case 'bouncePadL':
					entity.bouncePad.add(j* 12, i* 12, 1);
					break;
				case 'bouncePadR':
					entity.bouncePad.add(j* 12, i* 12, 0);
					break;
				case 'wormhole':
					entity.wormhole.add(j* 12, i* 12, levelMeta.wormhole[c.lv][count.wormhole]);
					count.wormhole++;
					break;
				case 'batU':
					entity.bat.add(j* 12, i* 12, 0);
					break;
				case 'batR':
					entity.bat.add(j* 12, i* 12, 1);
					break;
				case 'batD':
					entity.bat.add(j* 12, i* 12, 2);
					break;
				case 'batL':
					entity.bat.add(j* 12, i* 12, 3);
					break;
				case 'barrierU':
					entity.barrier.add(j* 12, i* 12, 0);
					break;
				case 'barrierR':
					entity.barrier.add(j* 12, i* 12, 1);
					break;
				case 'barrierD':
					entity.barrier.add(j* 12, i* 12, 2);
					break;
				case 'barrierL':
					entity.barrier.add(j* 12, i* 12, 3);
					break;
				case 'glass':
					entity.glass.add(j* 12, i* 12);
					break;
				case 'gate':
					entity.gate.add(j* 12, i* 12);
					break;
				case 'wheel':
					entity.wheel.add(j* 12, i* 12);
					break;
				case 'flip':
					entity.flip.add(j* 12, i* 12);
					break;
				case 'elevatorU':
					entity.elevator.add(j* 12, i* 12, 0);
					break;
				case 'elevatorR':
					entity.elevator.add(j* 12, i* 12, 1);
					break;
				case 'elevatorD':
					entity.elevator.add(j* 12, i* 12, 2);
					break;
				case 'elevatorL':
					entity.elevator.add(j* 12, i* 12, 3);
					break;
				case 'dragonU':
					c.genBlock(entity.dragonTrap, j, i, lv);
					entity.dragonTrap.o[entity.dragonTrap.o.length- 1]= 1;
					break;
				case 'dragonR':
					c.genBlock(entity.dragonTrap, j, i, lv);
					entity.dragonTrap.o[entity.dragonTrap.o.length- 1]= 2;
					break;
				case 'dragonD':
					c.genBlock(entity.dragonTrap, j, i, lv);
					entity.dragonTrap.o[entity.dragonTrap.o.length- 1]= 3;
					break;
				case 'dragonL':
					c.genBlock(entity.dragonTrap, j, i, lv);
					entity.dragonTrap.o[entity.dragonTrap.o.length- 1]= 0;
					break;
			}
	}
}
var toggle= 0;
window.addEventListener('load', e=> {
	c.state= -99;
	c.clock= setInterval(()=> {
		c.ctx.clearRect(0, 0, c.cvs.width, c.cvs.height);
		c.rdr('gameLogo', toggle* 152, c.cvs.width/ 2/ 3- 152/ 2, c.cvs.height/ 2/ 3- 30/ 2, 152, 30);
		toggle= 1- toggle;
	}, 1000/ 6);

	setTimeout(()=> {
		clearInterval(c.clock);
		c.clock= setInterval(()=> {
			c.ctx.clearRect(0, 0, c.cvs.width, c.cvs.height);
			c.rdr('gameLogo', toggle* 152, c.cvs.width/ 2/ 3- 152/ 2, c.cvs.height/ 2/ 3- 30/ 2, 152, 30);
			toggle= 1- toggle;
			if(c.trans> 0) c.trans-= 0.015;
			c.cover();
		}, 1000/ 120);
	}, 1000/ 6* 8);

	setTimeout(()=> {
		clearInterval(c.clock);
		c.genLv();
		c.state= 3;
		c.trans= 0;
		c.clock= setInterval(()=> {
			c.buttonX= [];
			c.buttonY= [];
			for(var i= 0; i< document.getElementById('actionFigure').width/ 10; i++) {
				c.buttonX.push([]);
				c.buttonY.push([]);
			}

			c.ctx.clearRect(0, 0, c.cvs.width, c.cvs.height);
			if(c.state< 0 && c.state!== -2) {
				entity.levelButton.rdr();

				if(c.state=== -3) {
					if(c.trans< 1) c.trans+= 0.015;
					else {
						c.trans= 1;
						c.state= -1;
					}
				}
			}
			else {
				if(c.state=== 0 || c.state=== 3) {
					entity.bladeTrap.run();
					entity.blade.run();
					entity.blaster.run();
					entity.dart.run();
					entity.wheel.run();
					entity.bat.run();
					entity.dragonTrap.run();
					entity.player.run();
					entity.bouncePad.run();
					entity.wormhole.run();
					entity.flip.run();
					entity.gate.run();
					entity.elevator.run();
					entity.dustParticle.run();
					entity.particle.run();
				}
				if(entity.player.dchange) entity.player.dchange= 0;

				c.ctx.globalAlpha= 1;
				if(c.state=== 2) c.ctx.globalAlpha= 0.1;
				if(c.state=== 1 || c.state=== 4) {
					c.ctx.globalAlpha= 0.1;
					c.ctx.save();
					c.ctx.fillStyle= '#ffff00';
					c.ctx.globalAlpha= Math.max(0, 1/ entity.player.f/ 2- 0.04);
					c.ctx.fillRect(0, 0, c.cvs.width, c.cvs.height);
					c.ctx.restore();
				}
				entity.spark.rdr();
				entity.playerTrail.rdr();
				entity.wall.rdr();
				entity.spike.rdr();
				entity.bladeTrap.rdr();
				entity.blaster.rdr();
				entity.glass.rdr();
				entity.escape.rdr();
				entity.gate.rdr();
				entity.dragonTrap.rdr();
				entity.coin.rdr();
				entity.star.rdr();
				entity.enemyTrail.rdr();
				entity.wormhole.rdr();
				entity.bouncePad.rdr();
				entity.flip.rdr();
				entity.elevator.rdr();
				entity.dragonTrap.rdr();
				entity.dustParticle.rdr();
				if(c.state!== 1 && c.state!== 4) entity.player.rdr();
				entity.barrier.rdr();
				entity.blade.rdr();
				entity.dust.rdr();
				entity.blast.rdr();
				entity.bat.rdr();
				entity.dart.rdr();
				entity.wheel.rdr();
				entity.dragon.rdr();
				entity.particle.rdr();
				entity.explosion.rdr();
				if(c.state=== 1 || c.state=== 4) entity.player.rdr();
				entity.overlay.rdr();

				if(c.state=== 2 || c.state=== -2) {
					if(c.trans> 0) c.trans-= 0.015;
					else {
						if(c.win) {
							if(c.froze<= 0) {
								if(c.lv< level.length- 1) c.lv++;
								else c.action.home();
							}
							localStorage['rl.lv']= c.lv;
							c.win= 0;
						}
						if(c.state=== 2) {
							c.trans= 0;
							c.genLv();
							c.state= 3;
						}
						else {
							c.trans= 0;
							c.entity.reset();
							[entity.player.x, entity.player.y]= [c.screen.midX- 7.5, c.screen.midY];
							[c.screen.offX, c.screen.offY]= [0, 0];
							entity.levelButton.add();
							c.state= -3;
						}
					}
				}
				if(c.state=== 3) {
					if(c.trans< 1) c.trans+= 0.015;
					else {
						c.trans= 1;
						c.state= 0;
					}
				}

				if(c.state=== 5) {
					c.ctx.save();
					c.ctx.fillStyle= '#000000';
					c.ctx.globalAlpha= 0.6;
					c.ctx.fillRect(0, 0, c.cvs.width, c.cvs.height);

					c.ctx.fillStyle= '#ffff00';
					c.ctx.globalAlpha= 1;
					c.ctx.fillRect(0, c.cvs.height/ 2- 40* 3/ 2, c.cvs.width, 40* 3);
					c.write('paused', c.cvs.width/ 2/ 3- 7* 2* 5/ 2, c.cvs.height/ 2/ 3- 40/ 2+ 7, 2, 1);

					c.button(2, c.cvs.width/ 2/ 3- 14/ 2- 30, c.cvs.height/ 2/ 3+ 9- 14/ 2);
					c.button(1, c.cvs.width/ 2/ 3- 14/ 2- 10, c.cvs.height/ 2/ 3+ 9- 14/ 2);
					c.button(3, c.cvs.width/ 2/ 3- 14/ 2+ 10, c.cvs.height/ 2/ 3+ 9- 14/ 2);
					c.button(4, c.cvs.width/ 2/ 3- 14/ 2+ 30, c.cvs.height/ 2/ 3+ 9- 14/ 2);
					c.ctx.restore();
				}
				c.ctx.save();
				c.ctx.globalAlpha= 1;
				c.ctx.fillStyle= '#ffff00';

				c.rdr('coinLogo', c.frame% 16* 12, 4, 4, 12, 12);
				c.write(Math.floor((entity.player.coin/ ((level[c.lv].match(/,3/g) || []).length || 1))* 100)+ '%', 18, 6, 1);
				c.rdr('star', c.frame% 16* 12, 4, 18, 12, 12);
				c.write(Math.floor((entity.player.star/ ((level[c.lv].match(/,4/g) || []).length || 1))* 100)+ '%', 18, 20, 1);

				var clv= 'level '+ (c.lv+ 1);
				c.rdr('dashLine', 0, c.cvs.width/ 2/ 3- clv.length/ 2* 6- 1- 37- 4, 8, 37, 3);
				c.rdr('dashLine', 0, c.cvs.width/ 2/ 3+ clv.length/ 2* 6- 1+ 4, 8, 37, 3, 0, -1);
				c.write(clv, c.cvs.width/ 2/ 3- clv.length/ 2* 6- 1, 6);
				if(c.lv=== level.length- 1) c.write('last level', c.cvs.width/ 2/ 3- 10/ 2* 6, 16);

				if(c.state!== 1 && c.state!== 2 && c.state!== 4) {
					if(c.state=== 5) c.button(1, c.cvs.width/ 3- 14- 4, 4);
					else c.button(0, c.cvs.width/ 3- 14- 4, 4);
				}
				c.ctx.restore();

				if(c.state!== 0 && c.state!== 3 && c.state!== 5) entity.player.repos();
				if(c.state!== 5) {
					if(c.screen.offX!== 0 && !(entity.player.d% 2)) c.screen.offX/= 1.1;
					if(c.screen.offY!== 0 && entity.player.d% 2) c.screen.offY/= 1.1;
				}
			}
			if(c.state!== 5) {
				c.clockCycle++;
				if(!(c.clockCycle% 10)) c.frame++;
			}
			c.cover();
		}, 1000/ 120);
	}, 1000/ 6* 8+ 1000/ 120* (1/ 0.015));
});
