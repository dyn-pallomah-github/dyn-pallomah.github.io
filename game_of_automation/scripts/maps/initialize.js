var m= new Object();
if(!localStorage.level) localStorage.level= 0;
m.level= parseInt(localStorage.level);

function skip(index, to) {
  clearTimeout(b.run);
  
  if(to=== undefined) m.level+= index;
  else m.level= to;
  if(m.level>= m.map.length) m.level= 0;
  localStorage.level= m.level;
  
  b.map= m.map[m.level];
  delete b.run;
  delete b.next;
  
  b.count= 0;
  b.cycle= 0;
  m.test= false;
  m.change= false;
  update();
  debug();
}
