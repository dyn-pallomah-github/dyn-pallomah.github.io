var $dustParticle= ()=> entity.dustParticle= {
	x: [],
	y: [],
	vx: [],
	vy: [],
	t: [],
	d: [],

	add: (x, y, d)=> {
		var p= entity.dustParticle;
		switch(d) {
			case 0:
				for(var i= 0; i< 8; i++) {
					p.x.push(Math.random()* 8- 4+ (x+ 6+ (i- 3.5)));
					p.y.push(Math.random()* 8- 4+ y+ 13);
					p.vx.push((i- 3.5)* 0.025);
					p.vy.push(-0.5);
					p.t.push(1);
					p.d.push(d);
				}
				break;
			case 1:
				for(var i= 0; i< 8; i++) {
					p.x.push(Math.random()* 8- 4+ x);
					p.y.push(Math.random()* 8- 4+ (y+ 6+ (i- 3.5)));
					p.vx.push(0.5);
					p.vy.push((i- 3.5)* 0.025);
					p.t.push(1);
					p.d.push(d);
				}
				break;
			case 2:
				for(var i= 0; i< 8; i++) {
					p.x.push(Math.random()* 8- 4+ (x+ 6+ (i- 3.5)));
					p.y.push(Math.random()* 8- 4+ y);
					p.vx.push((i- 3.5)* 0.025);
					p.vy.push(0.5);
					p.t.push(1);
					p.d.push(d);
				}
				break;
			case 3:
				for(var i= 0; i< 8; i++) {
					p.x.push(Math.random()* 8- 4+ x+ 13);
					p.y.push(Math.random()* 8- 4+ (y+ 6+ (i- 3.5)));
					p.vx.push(-0.5);
					p.vy.push((i- 3.5)* 0.025);
					p.t.push(1);
					p.d.push(d);
				}
				break;
		}
	},
	run: ()=> {
		var p= entity.dustParticle;
		for(var i= 0; i< p.x.length; i++) {
			if(p.t[i]< 0) {
				p.x.splice(i, 1);
				p.y.splice(i, 1);
				p.vx.splice(i, 1);
				p.vy.splice(i, 1);
				p.t.splice(i, 1);
				p.d.splice(i, 1);
			}
			p.x[i]+= p.vx[i];
			p.y[i]+= p.vy[i];
			if(p.d[i]% 2) p.vx[i]*= 0.98; 
			else p.vy[i]*= 0.98;
			p.t[i]-= 1/ 120;
		}
	},
	rdr: ()=> {
		var p= entity.dustParticle;
		c.ctx.save();
		for(var i= 0; i< p.x.length; i++) {
			if(c.state!== 0 && c.state!== 5) c.ctx.globalAlpha= 0.1;
			else c.ctx.globalAlpha= p.t[i]< 0? 0: p.t[i];
			c.rdr('particle', 2, ...c.relPos(p.x[i], p.y[i]), 1, 1);
		}
		c.ctx.restore();
	},
}
