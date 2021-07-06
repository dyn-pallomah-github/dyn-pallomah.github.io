var area= document.createElement('canvas');
area.width= 19* 32;
area.height= 19* 32;
var context= area.getContext('2d');
document.body.appendChild(area);
context.fillRect(0, 0, area.width, area.height);

var clear= ()=> {
  context.clearRect(0, 0, area.width, area.height);
  context.fillRect(0, 0, area.width, area.height);
}
var draw= (name, sx, sy, sw, sh, x, y)=> {
  var w, h;
  w= sw=== 'auto'? document.getElementById(name).width: sw;
  h= sh=== 'auto'? document.getElementById(name).height: sh;

  context.drawImage(document.getElementById(name), sx, sy, w, h, x, y, w, h);
}
var d= (name, sx, sy, x, y)=> draw(name, sx, sy, 32, 32, x, y);
