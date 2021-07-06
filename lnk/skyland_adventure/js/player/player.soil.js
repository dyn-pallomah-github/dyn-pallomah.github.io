function player_soil() {
	for(var i= 0; i< soil.x.length; i++) {
		if(soil.y[i]- player.y> -16 && soil.y[i]- player.y< 0 && Math.abs(soil.x[i]- player.x)< 16) {
			player.y= soil.y[i]+ 16;
			player.g= 0;
		}
		if(soil.y[i]- player.y<= 16 && soil.y[i]- player.y> 0 && Math.abs(soil.x[i]- player.x)< 16) {
			player.y= soil.y[i]- 16;
			player.g= 0;
			if((c.k[38] || c.k[87]) && !(c.oldk[38] || c.oldk[87])) player.g= player.j;
		}
		if(Math.abs(soil.y[i]- Math.round(player.y))< 16) {
			if(soil.x[i]- player.x<= 16 && soil.x[i]- player.x>= 0 && player.d=== 1) {
				player.x= soil.x[i]- 16;
				player.d= 0;
			}
			if(soil.x[i]- player.x>= -16 && soil.x[i]- player.x<= 0 && player.d=== -1) {
				player.x= soil.x[i]+ 16;
				player.d= 0;
			}
		}
	}
}
