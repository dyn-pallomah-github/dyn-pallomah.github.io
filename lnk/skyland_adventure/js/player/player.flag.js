function player_flag() {
	for(var i= 0; i< flag.x.length; i++) {
		if(Math.abs(flag.x[i]- player.x)< 16 && Math.abs(flag.y[i]- player.y)< 16) {
			c.cp= i;
		}
	}
}
