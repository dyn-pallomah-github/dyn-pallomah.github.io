function transmit() {
  function t(a, b, dir, def) {
    if(dir=== 25) return [a+ 1, b];
    if(dir=== 26) return [a, b- 1];
    if(dir=== 27) return [a- 1, b];
    if(dir=== 28) return [a, b+ 1];
    if(dir=== 29) return [def[0], def[1]];
  }
  for(var i= 0; i< b.map.length; i++) {
    for(var j= 0; j< b.map[i].length; j++) {
      if(b.map[i][j]=== 25) {
        count++;
        for(var a= i- 1; a>= 0; a--) {
          if(b.receiver.includes(b.map[a][j])) {
            var d= t(a, j, b.map[a][j], [a+ 1, j]);
            if(
              b.map[a+ 1]!== undefined && !b.solid.includes(b.map[a+ 1][j]) &&
              b.map[i+ 1]!== undefined &&
              b.solid.includes(b.map[i+ 1][j]) && !b.immune.includes(b.map[i+ 1][j])
            ) {
              b.next[d[0]][d[1]]= b.map[i+ 1][j];
              b.next[i+ 1][j]= 0;
              m.change= false;
            }
            break;
          }
        }
        continue;
      }
      if(b.map[i][j]=== 26) {
        count++;
        for(var a= j+ 1; a< b.map[i].length; a++) {
          if(b.receiver.includes(b.map[i][a])) {
            var d= t(i, a, b.map[i][a], [i, a- 1]);
            if(b.map[i][a- 1]!== undefined && !b.solid.includes(b.map[i][a- 1]) &&
            b.map[i][j- 1]!== undefined &&
            b.solid.includes(b.map[i][j- 1]) && !b.immune.includes(b.map[i][j- 1])
            ) {
              b.next[d[0]][d[1]]= b.map[i][j- 1];
              b.next[i][j- 1]= 0;
              m.change= false;
            }
            break;
          }
        }
        continue;
      }
      if(b.map[i][j]=== 27) {
        count++;
        for(var a= i+ 1; a< b.map.length; a++) {
          if(b.receiver.includes(b.map[a][j])) {
            var d= t(a, j, b.map[a][j], [a- 1, j]);
            if(
              b.map[a- 1]!== undefined && !b.solid.includes(b.map[a- 1][j]) &&
              b.map[i- 1]!== undefined &&
              b.solid.includes(b.map[i- 1][j]) && !b.immune.includes(b.map[i- 1][j])
            ) {
              b.next[d[0]][d[1]]= b.map[i- 1][j];
              b.next[i- 1][j]= 0;
              m.change= false;
            }
            break;
          }
        }
        continue;
      }
      if(b.map[i][j]=== 28) {
        count++;
        for(var a= j- 1; a>= 0; a--) {
          if(b.receiver.includes(b.map[i][a])) {
            var d= t(i, a, b.map[i][a], [i, a+ 1]);
            if(
              b.map[i][a+ 1]!== undefined && !b.solid.includes(b.map[i][a+ 1]) &&
              b.map[i][j+ 1]!== undefined &&
              b.solid.includes(b.map[i][j+ 1]) && !b.immune.includes(b.map[i][j+ 1])
            ) {
              b.next[d[0]][d[1]]= b.map[i][j+ 1];
              b.next[i][j+ 1]= 0;
              m.change= false;
            }
            break;
          }
        }
        continue;
      }
    }
  }
}
