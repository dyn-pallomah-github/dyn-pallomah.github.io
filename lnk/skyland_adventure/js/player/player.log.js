function player_log() {
	for(var i= 0; i< log.x.length; i++) {
		if(log.y[i]- Math.round(player.y)<= 16 && log.y[i]- Math.round(player.y)> 8 && player.g> 0) {
			if(Math.abs(log.x[i]- player.x)< (log.p[i]> 0? 12: 16)) {
				player.y= log.y[i]- 16;
				player.g= 0;
				if(c.k[38] || c.k[87]) player.g= player.j;
			}
		}
	}
}
