function player_exit() {
	for(var i= 0; i< exit.x.length; i++) {
		if(Math.abs(exit.x[i]- player.x)< 10 && Math.abs(exit.y[i]- player.y)< 14) {
			c.l++;
			if(c.l>= world.length) c.l= 0;
			player.death(false);
			break;
		}
	}
}
