var player_death= {
	x: [],
	y: [],
	g: [],
	vx: [],

	rdr: function() {
		for(var i= 0; i< player_death.x.length; i++) {
			player_death.x[i]+= player_death.vx[i];
			player_death.y[i]+= player_death.g[i];
			player_death.g[i]+= 0.2;
			player_death.vx[i]*= 0.96;
			if(player_death.x[i]> -4 && player_death.x< c.w && player_death.y[i]> -4 && player_death.y[i]< c.h)
				c.rdr('player.death', 0, 0, 4, 4, Math.round(player_death.x[i]+ c.px), Math.round(player_death.y[i]+ c.py));

			if(player_death.y[i]>= c.h) {
				player_death.x.splice(i, 1);
				player_death.y.splice(i, 1);
				player_death.g.splice(i, 1);
				player_death.vx.splice(i, 1);
				i--;
				c.e--;
			}
		}
	},
	gen: function(x, y, g, vx) {
		player_death.x.push(x);
		player_death.y.push(y);
		player_death.g.push(g);
		player_death.vx.push(vx);
		c.e++;
	}
}
