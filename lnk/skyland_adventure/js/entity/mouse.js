var mouse= {
	x: [],
	y: [],
	g: [],
	d: [],
	alive: [],

	gen: function(x, y, d) {
		mouse.x.push(x);
		mouse.y.push(y);
		mouse.g.push(0);
		mouse.d.push(d);
		mouse.alive.push(true);
	},
	rdr: function() {
		for(var i= 0; i< mouse.x.length; i++)
			if(mouse.x[i]+ c.px> -16 && mouse.x[i]+ c.px< c.w && mouse.y[i]+ c.py> -16 && mouse.y[i]+ c.py< c.h)
				c.rdr('mouse', (1- mouse.alive[i])* 16, 16, 16, mouse.x[i]+ c.px, mouse.y[i]+ c.py);
	},
	prc: function() {
		for(var i= 0; i< mouse.x.length; i++) {
			mouse.g[i]+= 0.2;
			if(mouse.g[i]>= 6) mouse.g[i]= 6;
			mouse.y[i]+= mouse.g[i];
			if(mouse.alive[i]) {
				mouse.x[i]+= 1.6* mouse.d[i];
				if(mouse.x[i]> c.w- 16) {
					mouse.x[i]= c.w- 16;
					mouse.d[i]*= -1;
				}
				if(mouse.x[i]< 0) {
					mouse.x[i]= 0;
					mouse.d[i]*= -1;
				}
				if(mouse.y[i]- player.y<= 16 && mouse.y[i]- player.y> 0 && Math.abs(mouse.x[i]- player.x)< 16 && player.g> 0) {
					mouse.alive[i]= false;
					c.rdr('mouse', 16, 0, 16, 16, Math.round(mouse.x[i]), Math.round(mouse.y[i]+ 2));
					continue;
				}
				if(Math.abs(player.x- mouse.x[i]) < 16 && Math.abs(player.y- mouse.y[i])< 16)
					player.death(false);

				for(var a= 0; a< bl.length; a++) {
					if(bl[a]=== 'null') continue;
					var block= eval(bl[a]);
					for(var b= 0; b< block.x.length; b++) {
						if(block.y[b]- mouse.y[i]<= 16 && block.y[b]- mouse.y[i]> 0 && Math.abs(block.x[b]- mouse.x[i])<= 16 && block.st) {
							mouse.y[i]= block.y[b]- 16;
							mouse.g[i]= 0;
						}
						if(Math.abs(block.y[b]- mouse.y[i])< 16 && block.sl) {
							if(block.x[b]- mouse.x[i]>= -16 && block.x[b]- mouse.x[i]< 0) {
								mouse.x[i]= block.x[b]+ 16;
								mouse.d[i]*= -1;
							}
							if(block.x[b]- mouse.x[i]<= 16 && block.x[b]- mouse.x[i]> 0) {
								mouse.x[i]= block.x[b]- 16;
								mouse.d[i]*= -1;
							}
						}
					}
				}
			}
			if(mouse.y[i]> c.h) {
				mouse.x.splice(i, 1);
				mouse.y.splice(i, 1);
				mouse.g.splice(i, 1);
				mouse.d.splice(i, 1);
				mouse.alive.splice(i, 1);
				i--;
			}
		}
	},
}
