var $wormhole= ()=> entity.wormhole= {
	x: [],
	y: [],
	goto: [],
	d: [],
	f: [],

	add: (x, y, goto)=> {
		var hole= entity.wormhole;
		hole.x.push(x);
		hole.y.push(y);
		hole.goto.push(goto);
		hole.d.push(0);
		hole.f.push(0);
	},
	rdr: ()=> {
		var hole= entity.wormhole;
		for(var i= 0; i< hole.x.length; i++) {
			if(hole.f[i]> 10) hole.f[i]= 0;
			c.rdr('wormhole', c.frame% 8* 12, ...c.relPos(hole.x[i], hole.y[i]), 12, 12);
			if(hole.f[i]> 0) {
				c.rdr('playerDeath', (hole.f[i]- 1)* 110, ...c.relPos(hole.x[i], hole.y[i], 110, 14), 110, 14, hole.d[i]);
				if(!(c.clockCycle% 10)) hole.f[i]++;
			}
		}
	},
	run: ()=> {
		var hole= entity.wormhole;
		var player= entity.player;
		for(var i= 0; i< hole.x.length; i++) {
			if(player.collide(hole, i, 0, 0, 1) && (player.moving || player.dchange)) {
				[player.x, player.y, player.step]= [hole.x[hole.goto[i]], hole.y[hole.goto[i]], 0];
				hole.d[i]= player.d;
				hole.d[hole.goto[i]]= player.d;
				hole.f[i]= 1;
				hole.f[hole.goto[i]]= 1;
				break;
			}
		}
	},
}
