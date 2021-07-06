var $particle= ()=> entity.particle= {
	x: [],
	y: [],
	vx: [],
	vy: [],
	f: [],
	w: [],

	add: (x, y, vx, vy, f= 0, w= 1)=> {
		var p= entity.particle;
		p.x.push(x);
		p.y.push(y);
		p.vx.push(vx);
		p.vy.push(vy);
		p.f.push(f);
		p.w.push(w);
	},
	run: ()=> {
		var p= entity.particle;
		for(var i= 0; i< p.x.length; i++) {
			p.x[i]+= p.vx[i];
			p.y[i]+= p.vy[i];
			p.vx[i]*= 0.98;
			p.vy[i]+= 0.055* p.w[i];
		}
	},
	rdr: ()=> {
		var p= entity.particle;
		for(var i= 0; i< p.x.length; i++) {
			c.rdr('particle', p.f[i], ...c.relPos(p.x[i], p.y[i]), 1, 1);
			if(c.relPos(p.x[i], p.y[i])[1]> c.cvs.height) {
				p.x.splice(i, 1);
				p.y.splice(i, 1);
				p.vx.splice(i, 1);
				p.vy.splice(i, 1);
				p.f.splice(i, 1);
				p.w.splice(i, 1);
				i--;
			}
		}
	},
}
