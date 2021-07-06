function player_spike() {
	for(var i= 0; i< spike.x.length; i++) {
		if(Math.abs(spike.x[i]- player.x)< 16 && Math.abs(spike.y[i]- player.y)< 16) {
			player.death(true);
			break;
		}
	}
}
