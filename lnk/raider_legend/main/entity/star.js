var $star= ()=> entity.star= {
	x: [],
	y: [],

	add: (x, y)=> {
		var it= entity.star;
		it.x.push(x);
		it.y.push(y);
	},
	rdr: ()=> {
		var it= entity.star;
		for(var i= 0; i< it.x.length; i++)
			c.rdr('star', c.frame% 16* 12, ...c.relPos(it.x[i], it.y[i]), 12, 12);
	},
}
