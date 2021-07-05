function debug() {
  if(document.getElementById('debug')) {
    document.getElementById('debug').textContent=
`\
version:          ${version}
field size:       ${document.getElementById('canvas').width}* ${document.getElementById('canvas').height}
window size:      ${window.screen.availWidth}* ${window.screen.availHeight}
screen size:      ${window.screen.width}* ${window.screen.height}
clock rate:       about ${b.clock_rate}/ s

level:            ${m.level}/ ${m.map.length- 1}
cycling:          ${b.next=== undefined? false: true}
reset next cycle: ${(m.test && m.level>= 0) || m.change? true: false}
cells processed:  ${b.count}
clock cycle:      ${b.cycle}

swapping cell:    ${b.swap}
selected cell:    ${b.map[b.y]=== undefined || b.map[b.y][b.x]=== undefined? 'none': b.list[b.map[b.y][b.x]* 2]}
targeting cell:   ${b.map[b.hy]=== undefined || b.map[b.hy][b.hx]=== undefined? 'none': b.list[b.map[b.hy][b.hx]* 2]}
cell id:          ${b.map[b.hy]=== undefined || b.map[b.hy][b.hx]=== undefined? -1: b.map[b.hy][b.hx]}

camera position:  (${c.x}, ${c.y})
saved viewpoint:  (${localStorage.viewpoint.split(',').join(', ')})

mouse position:   (${c.mx}, ${c.my})
targeting tile:   (${c.tx> 14 || c.tx=== undefined? -1: c.tx}, ${c.ty> 12 || c.ty=== undefined? -1: c.ty})
`;
    if(c.debug) document.getElementById('debug').style.display= 'block';
    else document.getElementById('debug').style.display= 'none';
  }
  else window.addEventListener('load', function() {
    debug();
  });
}
