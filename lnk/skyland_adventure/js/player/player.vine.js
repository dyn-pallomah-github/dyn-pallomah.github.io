function player_vine() {
	for(var i= 0; i< vine.x.length; i++) {
		if(Math.abs(vine.x[i]- player.x)< 16 && Math.abs(vine.y[i]- player.y)<= 16) {
			player.g= 1;
			if(c.k[38] || c.k[87]) {
				player.g= -2;
				if(vine.p[i]=== 1 && vine.y[i]- player.y>= 0) {
					player.y= vine.y[i];
					player.g= 0;
				}
			}
		}
	}
}
