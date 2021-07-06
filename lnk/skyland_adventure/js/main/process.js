window.addEventListener('load', function() {
	for(var i= 0; i< 7; i++) cloud.gen(i* c.w/ 6- 24);
	c.tscr= setInterval(function() {
		c.clr();
		c.ctx.globalAlpha= 1;
		c.ctx.fillStyle= '#0080ff';
		c.ctx.fillRect(0, 0, c.w* 2, c.h* 2);

		cloud.rdr();
		c.rdr('logo', 0, 117, 36, c.w/ 2- 116/ 2, c.h/ 2- 36/ 2- 32);
		w.prt(c.w/ 2- 9* 6, c.h/ 2- 36/ 2+ 32, 'push any key');

		c.ctx.globalAlpha= 1/ 8;
		c.ctx.fillStyle= '#ffffff';
		c.ctx.fillRect(0, 0, c.w* 2, c.h* 2);
	}, 1000/ c.fps);

	window.addEventListener('keydown', routine);
});
function routine() {
	if(!parseInt(localStorage.savedLevel)) localStorage.savedLevel= 0;
	c.l= parseInt(localStorage.savedLevel);
	c.trs= 1;
	clearInterval(c.tscr);
	delete c.tscr;

	c.rt= setInterval(function() {
		if(c.trs=== 60) {
			setInterval(function() {
				c.f++;
			}, 100);
			newLv();
			setInterval(function() {
				player_exit();
				player.dprc();

				c.k= [...c.tempk];
				if(!player.pause) {
					if(c.k[82] && !c.oldk[82] && (player.x!== player.sx || player.y!== player.sy))
						player.death(false);
				}
				if(c.k[70] && !c.oldk[70])
					player.pause= 1- player.pause;
				if((c.k[84] || c.k[122]) && !(c.oldk[84] || c.oldk[122])) {
					if(document.fullscreen && document.exitFullscreen) document.exitFullscreen();
					else if(!document.fullscreen && c.cvs.requestFullscreen) c.cvs.requestFullscreen();
				}
				if(document.fullscreen && document.fullscreenElement!== c.cvs)
					c.cvs.requestFullscreen();

				if(c.trs=== 0) {
					if(!player.pause) {
						player.prc();
						mouse.prc();
					}

					c.clr();
					c.ctx.globalAlpha= 1;
					c.ctx.fillStyle= '#0080ff';
					c.ctx.fillRect(0, 0, c.w* 2, c.h* 2);

					if(player.pause) c.ctx.globalAlpha= 1/ 3;
					cloud.rdr();
					sprout.rdr();
					exit.rdr();
					log.rdr();
					soil.rdr();
					soil_slope.rdr();
					slime.rdr();
					player.rdr();
					flag.rdr();
					vine.rdr();
					spike.rdr();
					mouse.rdr();
					moss.rdr();
					player_death.rdr();
				}
				c.ctx.globalAlpha= 1/ 8;
				c.ctx.fillStyle= '#ffffff';
				if(c.trs> 0) {
					c.trs= c.trs<= 60? c.trs+ 1: 0;
					c.ctx.globalAlpha= 1/ 15;
				}
				c.ctx.fillRect(0, 0, c.w* 2, c.h* 2);
				c.ctx.globalAlpha= 1;

				var level= `level ${c.l+ 1}${c.test? ' test': ''}\nprogress saved`;
				w.prt(2, 2, level);
				c.rdr('button.guide', 9* 15, 15, 15, 2, 24);

				c.rdr('button.guide', 0* 15, 15, 15, c.w- 60, c.h- 75);
				c.rdr('button.guide', 1* 15, 15, 15, c.w- 75, c.h- 60);
				c.rdr('button.guide', 2* 15, 15, 15, c.w- 45, c.h- 60);
				c.rdr('button.guide', 6* 15, 15, 15, c.w- 60, c.h- 60);
				c.rdr('button.guide', 3* 15, 15, 15, 60, c.h- 75);
				c.rdr('button.guide', 4* 15, 15, 15, 75, c.h- 60);
				c.rdr('button.guide', 5* 15, 15, 15, 45, c.h- 60);
				c.rdr('button.guide', 6* 15, 15, 15, 60, c.h- 60);
				c.rdr('button.guide', 7* 15, 15, 15, 45, c.h- 30);
				c.rdr('button.guide', 7* 15, 15, 15, c.w- 75, c.h- 30);
				c.rdr('button.guide', 8* 15, 15, 15, 75, c.h- 30);
				c.rdr('button.guide', 8* 15, 15, 15, c.w- 45, c.h- 30);
				if(player.pause)
					c.rdr('pause.text', 0, 248, 15, c.w/ 2- 248/ 2, c.cy- 32);

				c.rdr('cursor', c.md* 17, 17, 22, c.x- 5, c.y);
				c.oldk= [...c.k];
				if(c.trs=== 60) newLv();
			}, 1000/ c.fps);
			clearInterval(c.rt);
		}
		else {
			c.trs++;
			c.ctx.fillStyle= '#ffffff';
			c.ctx.globalAlpha= 1/ 20;
			c.ctx.fillRect(0, 0, c.w* 2, c.h* 2);
		}
		window.removeEventListener('keydown', routine);
	}, 1000/ c.fps);
}
