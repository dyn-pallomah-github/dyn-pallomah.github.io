var $glass= ()=> entity.glass= {
	x: [],
	y: [],

	add: (x, y)=> {
		var glass= entity.glass;
		glass.x.push(x);
		glass.y.push(y);
	},
	del: id=> {
		var glass= entity.glass;
		glass.x.splice(id, 1);
		glass.y.splice(id, 1);
	},
	rdr: ()=> {
		var glass= entity.glass;
		for(var i= 0; i< glass.x.length; i++)
			c.rdr('glass', (c.frame% 4<= 1)* 12, ...c.relPos(glass.x[i], glass.y[i]), 12, 12);
	},
}
