var theStage= {
  width: 0,
  height: 0,
  layer1: new Array(),
  layer2: new Array(),
};
var currentLevel= maps.layer1.length- 1;
var spawn= [0, 0];

var $1= (row, col, rValue)=> theStage.layer1[row] && theStage.layer1[row][col]? theStage.layer1[row][col]: rValue;
var $2= (row, col, rValue)=> theStage.layer2[row] && theStage.layer2[row][col]? theStage.layer2[row][col]: rValue;
var inc= (el, type)=> blocks[type].includes(el);
var r= (c, a, b)=> theStage.layer1[player.cy+ c].substring(a, b);

function compress(n) {
  var s= '';
  for(var i= 0; i< n.length; i++) {
    if(n[i]!== '\n') s+= n[i];
    else s+= ';';
  }
  
  var count= 0;
  var newStage= '';
  for(var i= 0; i< s.length; i++) {
    if(s[i]=== s[i- 1] || i=== 0) count++;
      else {
      if(count> 1) newStage+= count+ s[i- 1];
      else newStage+= s[i- 1];
      count= 1;
    }
  }
  if(count> 1) newStage+= count+ s[i- 1];
  else newStage+= s[i- 1];

  return newStage;
}
function decompress(n, c, s, reset) {
  if(reset) statistics.reset();

  if(n=== '') {
    var emptyStage= new Array(theStage.height);
    for(var i= 0; i< theStage.height; i++) emptyStage[i]= ' '.repeat(theStage.width);
    return emptyStage;
  }

  var count= '';
  var lineCount= 0;
  var newStage= [''];
  for(var i= 0; i< n.length; i++) {
    if(n[i]=== ';') {
      newStage[newStage.length]= '';
      if(c && theStage.width=== 0) theStage.width= lineCount;
      theStage.height++;
    }
    else {
      if(/[0-9]/.test(n[i])) count+= n[i];
      else {
        if(!/[0-9]/.test(n[i- 1])) {
          newStage[newStage.length- 1]+= n[i];
          if(s && statistics.name.includes(n[i])) statistics.value[statistics.name.indexOf(n[i])]+= 1;
          statistics.value[0]+= 1;
          lineCount+= 1;
        }
        else {
          for(var j= 0; j< parseInt(count); j++) newStage[newStage.length- 1]+= n[i];
          if(s && statistics.name.includes(n[i])) statistics.value[statistics.name.indexOf(n[i])]+= parseInt(count);
          statistics.value[0]+= parseInt(count);
          lineCount+= parseInt(count);
        }
        count= '';
      }
    }
  }
  return newStage;
}

function generate(newLevel) {
  if(currentLevel< 0 || currentLevel>= maps.layer1.length) {
    newEvent('illegalLevel');
    return;
  }

  clear();
  if(newLevel) {
    theStage.layer1= maps.layer1[currentLevel].split('\n');
    //theStage.layer2= maps.layer2[currentLevel].split('\n');

    teleport.key= new Array();
    teleport.p1x= new Array();
    teleport.p1y= new Array();
    teleport.p2x= new Array();
    teleport.p2y= new Array();
    for(var i= 0; i< theStage.layer1.length; i++) {
      for(var j= 0; j< theStage.layer1[i].length; j++) {
        if(/[a-z]/.test($1(i, j, ''))) {
          if(!teleport.key.includes($1(i, j))) {
            teleport.key[teleport.key.length]= $1(i, j);
            teleport.p1x[teleport.p1x.length]= j;
            teleport.p1y[teleport.p1y.length]= i;
            teleport.p2x[teleport.p2x.length]= '';
            teleport.p2y[teleport.p2y.length]= '';
          }
          else {
            teleport.p2x[teleport.key.indexOf($1(i, j))]= j;
            teleport.p2y[teleport.key.indexOf($1(i, j))]= i;
          }
        }
      }
    }
  }

  for(var i= 0; i< theStage.layer1.length; i++) if(theStage.layer1[i].includes('@')) {
    spawn= [i, theStage.layer1[i].indexOf('@')];
    break;
  }
  var x= 0;
  var y= 0;
  for(var i= player.cy- 9; i< player.cy- 9+ 19; i++) {
    for(var j= player.cx- 9; j< player.cx- 9+ 19; j++) {
      var costume= 0;

      if($1(i, j)=== '!') d('finish', finishX* 32, (player.star=== 3)* 32, x, y);
      if($1(i, j)=== '@') d('spawn', finishX* 32, 0, x, y);
      if($1(i, j)=== '$') d('star', 0, 0, x, y);

      if($1(i, j)=== '<') d('deflect', toggle< 2? 0: 32, 0, x, y);
      if($1(i, j)=== '>') d('deflect', toggle< 2? 0: 32, 32, x, y);

      if(/[a-z]/.test($1(i, j, ''))) d('teleport', teleportX* 32, 0, x, y);
      if($1(i, j)=== '~') d('revert', 0, 0, x, y);
      if($1(i, j)=== '+') d('revert', 32, 0, x, y);
      if($1(i, j)=== '%') d('invert', toggle< 2? 0: 32, 0, x, y);
      if($1(i, j)=== '|') d('barrier', 0, 0, x, y);
      if($1(i, j)=== '-') d('barrier', 32, 0, x, y);

      if(inc($1(i, j), 'wall')) {
        if(!inc($1(i- 1, j+ 1, '*'), 'wall') && inc($1(i- 1, j), 'wall') && inc($1(i, j+ 1), 'wall'))
          d('wall', 0* 32, 32, x, y);
        if(!inc($1(i+ 1, j+ 1, '*'), 'wall') && inc($1(i+ 1, j), 'wall') && inc($1(i, j+ 1), 'wall'))
          d('wall', 1* 32, 32, x, y);
        if(!inc($1(i+ 1, j- 1, '*'), 'wall') && inc($1(i+ 1, j), 'wall') && inc($1(i, j- 1), 'wall'))
          d('wall', 2* 32, 32, x, y);
        if(!inc($1(i- 1, j- 1, '*'), 'wall') && inc($1(i- 1, j), 'wall') && inc($1(i, j- 1), 'wall'))
          d('wall', 3* 32, 32, x, y);
      }
      if($1(i, j)=== '*') {
        if(!inc($1(i- 1, j, '*'), 'wall')) d('wall', 0* 32, 0, x, y);
        if(!inc($1(i, j+ 1, '*'), 'wall')) d('wall', 1* 32, 0, x, y);
        if(!inc($1(i+ 1, j, '*'), 'wall')) d('wall', 2* 32, 0, x, y);
        if(!inc($1(i, j- 1, '*'), 'wall')) d('wall', 3* 32, 0, x, y);
      }
      if($1(i, j)=== '#') {
        if(!inc($1(i- 1, j, '*'), 'wall')) d('spike', 0* 32, 0, x, y);
        if(!inc($1(i, j+ 1, '*'), 'wall')) d('spike', 1* 32, 0, x, y);
        if(!inc($1(i+ 1, j, '*'), 'wall')) d('spike', 2* 32, 0, x, y);
        if(!inc($1(i, j- 1, '*'), 'wall')) d('spike', 3* 32, 0, x, y);
      }
      x+= 32;
    }
    x= 0;
    y+= 32;
  }
  var dots= Math.floor(player.star/ 3* 96/ 2)* 2;
  draw('starBar', 0, 0, 96* 2, 24, 2, 2);
  draw('starBar', 0, 24, dots, 24, 96+ 2, 2);
  if(player.star=== 3) draw('starBar', 0, 48, 96, 24, 200, 2);
  else draw('starBar', 0, 72, 96, 24, 200, 2);
}
