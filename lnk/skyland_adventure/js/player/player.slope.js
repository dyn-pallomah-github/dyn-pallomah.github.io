function player_slope() {
	for(var i= 0; i< soil_slope.x.length; i++) {
		if(soil_slope.y[i]- player.y<= 16 && soil_slope.y[i]- player.y> 0 && Math.abs(soil_slope.x[i]- player.x)< 16) {
			player.y= soil_slope.y[i]- 16;
			player.g= 0;
			if((c.k[38] || c.k[87]) && !(c.oldk[38] || c.oldk[87])) player.g= player.j;
		}
	}
}
