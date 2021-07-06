c.skip= function(skip, to) {
	c.l+= skip;
	if(c.l>= world.length) c.l= world.length- 1;
	if(to!== undefined) c.l= to;
	newLv();
}
