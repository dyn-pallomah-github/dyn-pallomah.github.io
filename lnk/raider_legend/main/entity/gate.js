var $gate= ()=> entity.gate= {
	x: [],
	y: [],
	f: [],

	add: (x, y)=> {
		var gate= entity.gate;
		gate.x.push(x);
		gate.y.push(y);
		gate.f.push(0);
	},
	rdr: ()=> {
		var gate= entity.gate;
		for(var i= 0; i< gate.x.length; i++) {
			c.rdr('gate', (c.frame% 4<= 1)* 12, ...c.relPos(gate.x[i], gate.y[i]), 12, 12);
		}
	},
	run: ()=> {
		var gate= entity.gate;
		var col= i=> entity.player.collide(gate, i);
		for(var i= 0; i< gate.x.length; i++) {
			if(gate.f[i]=== 0 && col(i)) gate.f[i]= 1;
			if(gate.f[i]=== 1 && !col(i)) {
				entity.explosion.add(gate.x[i], gate.y[i]);
				for(var j= 0; j< 18; j++)
					entity.particle.add(gate.x[i]+ 3, gate.y[i], (j- 8.5)* 0.2, Math.random()* 1.3- 0.9);
				entity.wall.add(gate.x[i], gate.y[i], 0, 6);
				gate.x.splice(i, 1);
				gate.y.splice(i, 1);
				gate.f.splice(i, 1);
				i--;
			}
		}
	},
}
