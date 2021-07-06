var player= {
	sx: 16,
	sy: c.h- 32,
	x: 16,
	y: c.h- 32,
	d: 0,
	j: -5.675,
	g: 0,
	pause: 0,

	o: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, ],
	rdr: function() {
		c.rdr('player', player.o[c.f% player.o.length]* 16, 16, 16, c.cx, player.y<= c.h* 2? c.cy: player.y- c.h* 2+ c.cy);
	},
	death: function(effect) {
		if(c.g<= 1 && effect) {
			for(var i= 0; i< 12; i++) player_death.gen(player.x+ 8, player.y+ 16, -2- 0.2, -2.5+ i/ 2);
			for(var i= 0; i< 13; i++) player_death.gen(player.x+ 8, player.y+ 16, -2- 0.1, -2.75+ i/ 2);
			for(var i= 0; i< 14; i++) player_death.gen(player.x+ 8, player.y+ 16, -2, -3+ i/ 2);
			for(var i= 0; i< 13; i++) player_death.gen(player.x+ 8, player.y+ 16, -2+ 0.1, -2.75+ i/ 2);
			for(var i= 0; i< 12; i++) player_death.gen(player.x+ 8, player.y+ 16, -2+ 0.2, -2.5+ i/ 2);
		}
		player.x= player.sx;
		player.y= player.sy;
		player.g= 0;
		c.trs= 1;
	},
	dprc: function() {
		player_spike();
		if(player.y> c.h* 2.5+ 16) player.death(false);
	},
	prc: function() {
		player.x+= player.d* (2+ (c.k[32]? -1: 0));
		player.d= 0;
		if(c.k[37] || c.k[65]) player.d= -1;
		if(c.k[39] || c.k[68]) player.d= 1;
		player.g+= 0.4;
		if(player.g>= 8) player.g= 8;
		player.y+= player.g;

		player_flag();
		player_vine();
		player_slope();
		player_soil();
		player_log();
		player_slime();

		c.px= -player.x+ c.cx;
		c.py= -player.y+ c.cy;
	},
}
