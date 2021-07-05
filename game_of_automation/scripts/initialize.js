var c= {
  canvas: document.getElementById('canvas').getContext('2d'),
  render: function(img, sx, sy, sw, sh, x, y) {
    var src= document.getElementById(img);
    c.canvas.drawImage(src, sx* 2, sy* 2, sw* 2, sh* 2, x* 2, y* 2, sw* 2, sh* 2);
  },
  write: function(text, x, y) {
    for(var i= 0; i< text.length; i++) {
      if(c.letter.indexOf(text[i])< 0)
        c.render('font', 0, 0, 8, 10, i* 10+ x, y);
      else
        c.render('font', (c.letter.indexOf(text[i])+ 1)* 8, 0, 8, 10, i* 10+ x, y);
    }
  },
  last_frame: 0,
  fps: 0,
  debug: false,
  letter: 'abcdefghijklmnopqrstuvwxyz0123456789 -',

  x: 0,
  y: 0,
  mx: 0,
  my: 0,
};
if(localStorage.viewpoint=== undefined) localStorage.viewpoint= [0, 0];

var b= {
  pool: [0],
  reset_pool: function() {
    for(var i= 2; i< b.list.length; i+= 2)
      b.pool[b.pool.length]= b.pool[b.pool.length- 1]+ 1;
  },
  reset_xy: function() {
    b.y= b.map.length;
    b.x= b.map[0].length;
  },
  
  list: [
    'blank', 0,
    'space', 0,
    'mover_cell', 0,
    'mover_cell', 1,
    'mover_cell', 2,
    'mover_cell', 3,
    'target_cell', 0,
    'rotator_cell', 0,
    'rotator_cell', 1,
    'directed_target_cell', 0,
    'directed_target_cell', 1,
    'directed_target_cell', 2,
    'directed_target_cell', 3,
    'immobile_cell', 0,
    'push_cell', 0,
    'conditional_mover_cell', 0,
    'conditional_mover_cell', 1,
    'conditional_mover_cell', 2,
    'conditional_mover_cell', 3,
    'slide_cell', 0,
    'slide_cell', 1,
    'repeater_cell', 0,
    'repeater_cell', 1,
    'repeater_cell', 2,
    'repeater_cell', 3,
    'transmitter_cell', 0,
    'transmitter_cell', 1,
    'transmitter_cell', 2,
    'transmitter_cell', 3,
    'receiver_cell', 0,
    'eraser_cell', 0,
    'directed_eraser_cell', 0,
    'directed_eraser_cell', 1,
    'directed_eraser_cell', 2,
    'directed_eraser_cell', 3,
    'pusher_cell', 0,
    'pusher_cell', 1,
    'pusher_cell', 2,
    'pusher_cell', 3,
    'custom_cell', 0,
    'custom_cell', 1,
    'custom_cell', 2,
    'custom_cell', 3,
    'custom_cell', 4,
    'custom_cell', 5,
  ],
  immune: [
    0, 6, 9, 10, 11, 12,
  ],
  solid: [
    -1,
    2, 3, 4, 5,
    7, 8,
    13, 14,
    15, 16, 17, 18,
    19, 20,
    21, 22, 23, 24,
    25, 26, 27, 28, 29,
    30, 31, 32, 33, 34,
    35, 36, 37, 38,
  ],
  up: [
    10, 11, 12, 13, 20, 25, 26, 27, 28, 29, 
  ],
  right: [
    9, 11, 12, 13, 19, 25, 26, 27, 28, 29, 
  ],
  down: [
    9, 10, 12, 13, 20, 25, 26, 27, 28, 29, 
  ],
  left: [
    9, 10, 11, 13, 19, 25, 26, 27, 28, 29, 
  ],
  target: [
    6, 9, 10, 11, 12, 
  ],
  receiver: [
    25, 26, 27, 28, 29, 
  ],
  
  map: m.map[m.level],
  swap: false,
  drag: false,
  key: true,
  count: 0,
  cycle: 0,
  clock_rate: 8,
}
b.reset_pool();
b.reset_xy();
m.update_map();
