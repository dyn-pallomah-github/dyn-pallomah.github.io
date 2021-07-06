function player_slime() {
	for(var i= 0; i< slime.x.length; i++) {
		if(slime.y[i]- player.y> -16 && slime.y[i]- player.y< 0 && Math.abs(slime.x[i]- player.x)< 16) {
			player.y= slime.y[i]+ 16;
			player.g= 0;
		}
		if(slime.y[i]- player.y<= 16 && slime.y[i]- player.y> 0 && Math.abs(slime.x[i]- player.x)< 16) {
			player.y= slime.y[i]- 16;
			player.g= 0;
			if((c.k[38] || c.k[87]) && !(c.oldk[38] || c.oldk[87])) player.g= player.j- 1.135;
		}
		if(Math.abs(slime.y[i]- Math.round(player.y))< 16) {
			if(slime.x[i]- player.x<= 16 && slime.x[i]- player.x>= 0 && player.d=== 1) {
				player.x= slime.x[i]- 16;
				player.d= 0;
			}
			if(slime.x[i]- player.x>= -16 && slime.x[i]- player.x<= 0 && player.d=== -1) {
				player.x= slime.x[i]+ 16;
				player.d= 0;
			}
		}
	}
}
