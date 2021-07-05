function update() {
  c.canvas.clearRect(0, 0, 576, 540);
  c.write(`level ${m.level}`, 18, 18/ 2- 10/ 2+ 18);
  for(var i= 0; i< 13; i++) {
    for(var j= 0; j< 15; j++) {
      if(b.map[i+ c.y]=== undefined || b.map[i+ c.y][j+ c.x]=== undefined) {
        if(b.swap) c.render('border_darken', 0, 0, 18, 18, (j+ 1)* 18, (i+ 2)* 18);
        else c.render('border', 0, 0, 18, 18, (j+ 1)* 18, (i+ 2)* 18);
      }
      else c.render('grid', 0, 0, 18, 18, (j+ 1)* 18, (i+ 2)* 18);
      
      if(b.map[i+ c.y]!== undefined && b.map[i+ c.y][j+ c.x]!== undefined && !(
      b.swap && i=== b.y && j=== b.x && b.drag)) {
        var loc= b.map[i+ c.y][j+ c.x]* 2;
        if(b.map[i+ c.y][j+ c.x]!== 1 || b.swap)
          c.render(b.list[loc], b.list[loc+ 1]* 16, 0, 16, 16, (j+ 1)* 18+ 1, (i+ 2)* 18+ 1);
      }
    }
  }
  m.update_map();
}

document.getElementById('canvas').style.display= 'block';
window.addEventListener('load', update);
window.addEventListener('mousemove', function() {
  b.drag= true;
  update();
  
  var x= event.clientX>= 18? Math.floor((event.clientX- 36)/ 36)+ c.x: -1;
  var y= event.clientY>= 36? Math.floor((event.clientY- 72)/ 36)+ c.y: -1;
  if(b.swap) {
    var locb= b.map[b.y][b.x]* 2;
    
    if(b.map[y]=== undefined || b.map[y][x]=== undefined || b.immune.includes(b.map[y][x]))
      c.render(b.list[locb], b.list[locb+ 1]* 16, 0, 16, 16, (b.x+ 1- c.x)* 18+ 1, (b.y+ 2- c.y)* 18+ 1);
    else {
      var loc= b.map[y][x]* 2;
      c.render(b.list[locb], b.list[locb+ 1]* 16, 0, 16, 16, (x+ 1- c.x)* 18+ 1, (y+ 2- c.y)* 18+ 1);
      c.render(b.list[loc], b.list[loc+ 1]* 16, 0, 16, 16, (b.x+ 1- c.x)* 18+ 1, (b.y+ 2- c.y)* 18+ 1);
    }
  }
  b.hx= x;
  b.hy= y;
  if(debug) {
    c.mx= event.clientX;
    c.my= event.clientY;
    c.tx= x;
    c.ty= y;
    debug();
  }
});
window.addEventListener('mousedown', function() {
  if(b.next=== undefined) {
    var x= Math.floor((event.clientX- 36)/ 36)+ c.x;
    var y= Math.floor((event.clientY- 72)/ 36)+ c.y;
  
    if(b.swap && b.map[y]!== undefined && b.map[y][x]!== undefined && !b.immune.includes(b.map[y][x])) {
      var blk= b.map[y][x];
      b.map[y][x]= b.map[b.y][b.x];
      b.map[b.y][b.x]= blk;
    }
    else b.swap= false;
  
    if(b.map[y]!== undefined && b.map[y][x]!== undefined &&
    !b.immune.includes(b.map[y][x]) && b.map[y][x]!== 1)
      b.swap= b.swap? false: true;
  
    b.x= x;
    b.y= y;
    b.drag= false;
    update();
    if(debug) debug();
  }
});
