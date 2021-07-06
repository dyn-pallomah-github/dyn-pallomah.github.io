function erase() {
  function e(i, j) {
    b.next[i][j]= 0;
    m.change= false;
  }
  for(var i= 0; i< b.map.length; i++) {
    for(var j= 0; j< b.map[i].length; j++) {
      
      if(b.map[i][j]=== 30) {
        count++;
        if(b.map[i- 1]!== undefined) e(i- 1, j);
        if(b.map[i][j+ 1]!== undefined) e(i, j+ 1);
        if(b.map[i+ 1]!== undefined) e(i+ 1, j);
        if(b.map[i][j- 1]!== undefined) e(i, j- 1);
        continue;
      }
      if(b.map[i][j]=== 31 && b.map[i- 1]!== undefined) {
        count++;
        e(i- 1, j);
        continue;
      }
      if(b.map[i][j]=== 32 && b.map[i][j+ 1]!== undefined) {
        count++;
        e(i, j+ 1);
        continue;
      }
      if(b.map[i][j]=== 33 && b.map[i+ 1]!== undefined) {
        count++;
        e(i+ 1, j);
        continue;
      }
      if(b.map[i][j]=== 34 && b.map[i][j- 1]!== undefined) {
        count++;
        e(i, j- 1);
        continue;
      }
    }
  }
}
