function subcycle() {
  b.map= Array(b.next.length);
  for(var i= 0; i< b.next.length; i++) {
    b.map[i]= Array(b.next[0].length);
    for(var j= 0; j< b.next[0].length; j++) {
      if(b.next[i][j]=== -1) b.next[i][j]= 0;
      b.map[i][j]= b.pool[b.next[i][j]];
    }
  }
}

var count= 0;
function cycle(loop) {
  b.reset_xy();
  if(b.next=== undefined) {
    b.next= Array(b.map.length);
    for(var i= 0; i< b.map.length; i++) {
      b.next[i]= Array(b.map[0].length);
      for(var j= 0; j< b.map[0].length; j++) {
        if(b.map[i][j]=== 1) b.map[i][j]= 0;
        b.next[i][j]= b.pool[b.map[i][j]];
      }
    }
  }
  m.test= true;
  m.change= true;
  
  count= 0;
  var run= b.cycle+ 1;
  
  test();
  rotate();
  push();
  subcycle();
  
  move();
  subcycle();
  
  repeat();
  subcycle();
  
  transmit();
  erase();
  subcycle();
  
  update();
  
  if((m.test && m.level>= 0) || m.change) {
    if(b.run=== undefined) skip(m.test && m.level>= 0? 1: 0);
    else {
      clearTimeout(b.run);
      delete b.run;
    }
    debug();
    return;
  }
  if(loop)
    b.run= setTimeout(function() {
      cycle(true);
    }, 1000/ b.clock_rate);

  b.count= count;
  b.cycle= run;
  debug();
}
