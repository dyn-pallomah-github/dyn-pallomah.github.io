var $bouncePad= ()=> entity.bouncePad= {
	x: [],
	y: [],
	d: [],
	f: [],

	add: (x, y, d)=> {
		var pad= entity.bouncePad;
		pad.x.push(x);
		pad.y.push(y);
		pad.d.push(d);
		pad.f.push(0);
	},
	rdr: ()=> {
		var pad= entity.bouncePad;
		for(var i= 0; i< pad.x.length; i++) {
			if(pad.f[i]> 0) pad.f[i]++;
			if(pad.f[i]>= 50) pad.f[i]= 0;
			if(Math.floor(pad.f[i]/ 10)=== 4)
				c.rdr('bouncePad', (1+ (c.frame% 4<= 1)* 3)* 12, ...c.relPos(pad.x[i], pad.y[i]), 12, 12, pad.d[i]);
			else
				c.rdr('bouncePad', (Math.min(2, Math.floor(pad.f[i]/ 10))+ (c.frame% 4<= 1)* 3)* 12, ...c.relPos(pad.x[i], pad.y[i]), 12, 12, pad.d[i]);
		}
	},
	run: ()=> {
		var pad= entity.bouncePad;
		var player= entity.player;
		for(var i= 0; i< pad.x.length; i++) {
			if(player.collide(pad, i, 0, 0, 1) && player.moving) {
				if(pad.d[i]=== 0) {
					switch(player.d) {
						case 0:
							player.d= 3;
							break;
						case 1:
							player.d= 2;
							break;
						case 2:
							player.d= 1;
							break;
						case 3:
							player.d= 0;
							break;
					}
				}
				else {
					switch(player.d) {
						case 0:
							player.d= 1;
							break;
						case 1:
							player.d= 0;
							break;
						case 2:
							player.d= 3;
							break;
						case 3:
							player.d= 2;
							break;
					}
				}
				pad.f[i]= 1;
				player.step= 0;
				entity.wheel.playerStep.push([player.x, player.y]);
				break;
			}
		}
	},
}
