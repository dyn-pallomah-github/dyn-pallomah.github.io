var $electroBall= ()=> entity.electroBall= {
	x: [],
	y: [],

	add: (x, y)=> {
		var it= entity.electroBall;
		it.x.push(x);
		it.y.push(y);
	},
	rdr: ()=> {
		var it= entity.electroBall;
		for(var i= 0; i< it.x.length; i++) {
			
		}
	},
}
