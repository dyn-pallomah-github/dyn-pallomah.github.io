var $escape= ()=> entity.escape= {
	x: 0,
	y: 0,

	add: (x, y)=> {
		var esc= entity.escape;
		esc.x= x;
		esc.y= y;
	},
	rdr: ()=> c.rdr('escape', c.frame% 4* 12, ...c.relPos(entity.escape.x, entity.escape.y), 12, 12),
}
