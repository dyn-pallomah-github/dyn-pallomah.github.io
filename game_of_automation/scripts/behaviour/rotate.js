function rotate() {
  function r(i, j, blk) {
    b.next[i][j]= blk;
    m.change= false;
  }
  for(var i= 0; i< b.map.length; i++) {
    for(var j= 0; j< b.map[i].length; j++) {
      
      if(b.map[i][j]=== 7) {
        count++;
        if(b.map[i- 1]!== undefined && b.map[i- 1][j]=== 4) r(i- 1, j, 5);
        if(b.map[i][j+ 1]!== undefined && b.map[i][j+ 1]=== 5) r(i, j+ 1, 2);
        if(b.map[i+ 1]!== undefined && b.map[i+ 1][j]=== 2) r(i+ 1, j, 3);
        if(b.map[i][j- 1]!== undefined && b.map[i][j- 1]=== 3) r(i, j- 1, 4);
        continue;
      }
      if(b.map[i][j]=== 8) {
        count++;
        if(b.map[i- 1]!== undefined && b.map[i- 1][j]=== 4) r(i- 1, j, 3);
        if(b.map[i][j+ 1]!== undefined && b.map[i][j+ 1]=== 5) r(i, j+ 1, 4);
        if(b.map[i+ 1]!== undefined && b.map[i+ 1][j]=== 2) r(i+ 1, j, 5);
        if(b.map[i][j- 1]!== undefined && b.map[i][j- 1]=== 3) r(i, j- 1, 2);
        continue;
      }
    }
  }
}
