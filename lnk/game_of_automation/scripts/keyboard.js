function reset_key() {
  b.key= false;
  setTimeout(function() {
    b.key= true;
  }, 1/ b.clock_rate* 1000);
}
window.addEventListener('keydown', function() {
  if(b.key && !b.swap) {
    if(event.key=== 'ArrowUp') c.y++;
    if(event.key=== 'ArrowRight') c.x--;
    if(event.key=== 'ArrowDown') c.y--;
    if(event.key=== 'ArrowLeft') c.x++;
    if(event.key=== 'c') {
      c.x= parseInt(localStorage.viewpoint.split(',')[0]);
      c.y= parseInt(localStorage.viewpoint.split(',')[1]);
    }
    if(event.key=== 'v') localStorage.viewpoint= [c.x, c.y];
    if(event.key=== 'Escape') c.debug= c.debug? false: true;
    if(event.key=== 'Enter' && b.run=== undefined) {
      if((m.test && m.level>= 0) || m.change)
        cycle(false);
      else cycle(true);
    }
    if(event.key=== ' ') {
      if(b.run=== undefined) cycle(false);
      else {
        clearTimeout(b.run);
        delete b.run;
      }
    }
    if(event.key=== 'Backspace') skip(0);
  }
  if(b.key) reset_key();
  if(b.swap) b.swap= false;
  update();
  debug();
});
