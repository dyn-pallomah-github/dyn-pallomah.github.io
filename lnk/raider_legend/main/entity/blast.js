var $blast= ()=> entity.blast= {
	x: [],
	y: [],
	d: [],
	f: [],

	add: (x, y, d)=> {
		var blast= entity.blast;
		blast.x.push(x);
		blast.y.push(y);
		blast.d.push(d);
		blast.f.push(0);
	},
	del: id=> {
		var blast= entity.blast;
		blast.x.splice(id, 1);
		blast.y.splice(id, 1);
		blast.d.splice(id, 1);
		blast.f.splice(id, 1);
	},
	rdr: ()=> {
		var blast= entity.blast;
		for(var i= 0; i< blast.x.length; i++) {
			if(blast.f[i]>= 5) {
				blast.del(i);
				i--;
				continue;
			}
			c.rdr('blast', blast.f[i]* 24, ...c.relPos(blast.x[i], blast.y[i], 24, 3), 24, 3, blast.d[i]);
			if(!(c.clockCycle% 10)) blast.f[i]++;
		}
	},
}
