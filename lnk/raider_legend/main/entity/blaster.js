var $blaster= ()=> entity.blaster= {
	x: [],
	y: [],
	d: [],
	f: 0,

	add: (x, y, d)=> {
		var blaster= entity.blaster;
		blaster.x.push(x);
		blaster.y.push(y);
		blaster.d.push(d);
	},
	run: ()=> {
		var blaster= entity.blaster;
		blaster.f++;
		if(blaster.f> 140) blaster.f= 0;
	},
	rdr: ()=> {
		var blaster= entity.blaster;
		for(var i= 0; i< blaster.x.length; i++) {
			c.rdr('blaster', 12* Math.max(0, Math.round(blaster.f/ 10)- 10), ...c.relPos(blaster.x[i], blaster.y[i]), 12, 12, blaster.d[i],
						blaster.d[i]=== 2? -1: 1, blaster.d[i]=== 1? -1: 1);
			if(blaster.f=== 120 && (c.state=== 0 || c.state=== 3)) {
				switch(blaster.d[i]) {
					case 0:
						entity.blast.add(blaster.x[i], blaster.y[i]- 8, 0);
						entity.dart.add(blaster.x[i], blaster.y[i]- 12, 0);
						break;
					case 1:
						entity.blast.add(blaster.x[i]+ 8, blaster.y[i], 1);
						entity.dart.add(blaster.x[i]+ 12, blaster.y[i], 1);
						break;
					case 2:
						entity.blast.add(blaster.x[i], blaster.y[i]+ 8, 2);
						entity.dart.add(blaster.x[i], blaster.y[i]+ 12, 2);
						break;
					case 3:
						entity.blast.add(blaster.x[i]- 8, blaster.y[i], 3);
						entity.dart.add(blaster.x[i]- 12, blaster.y[i], 3);
						break;
				}
			}
		}
	},
}
