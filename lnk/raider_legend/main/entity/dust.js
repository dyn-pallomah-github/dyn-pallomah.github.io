var $dust= ()=> entity.dust= {
	x: [],
	y: [],
	d: [],
	f: [],

	add: (x, y, d)=> {
		var dust= entity.dust;
		dust.x.push(x);
		dust.y.push(y);
		dust.d.push(d);
		dust.f.push(0);
	},
	rdr: ()=> {
		var dust= entity.dust;
		for(var i= 0; i< dust.x.length; i++) {
			if(dust.f[i]>= 36) {
				dust.x.splice(i, 1);
				dust.y.splice(i, 1);
				dust.d.splice(i, 1);
				dust.f.splice(i, 1);
				i--;
				continue;
			}
			c.rdr('dust', Math.floor(dust.f[i]/ 6)* 20, ...c.relPos(dust.x[i], dust.y[i], 20), 20, 12, dust.d[i]);
			dust.f[i]++;
		}
	},
}
