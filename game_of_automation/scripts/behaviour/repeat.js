function repeat() {  
  for(var i= 0; i< b.map.length; i++) {
    for(var j= 0; j< b.map[i].length; j++) {
      
      if(b.map[i][j]=== 21) {
        count++;
        if(b.map[i- 1][j]!== undefined && b.map[i+ 1]!== undefined && !b.immune.includes(b.map[i+ 1][j])) {
          for(var a= i- 1; a>= 0; a--) {
            if(!b.solid.includes(b.map[a][j])) {
              b.next[a][j]= b.map[i+ 1][j];
              m.change= false;
              break;
            }
          }
        }
        continue;
      }
      if(b.map[i][j]=== 22) {
        count++;
        if(b.map[i][j+ 1]!== undefined && b.map[i][j- 1]!== undefined && !b.immune.includes(b.map[i][j- 1])) {
          for(var a= j+ 1; a< b.map[i].length; a++) {
            if(!b.solid.includes(b.map[i][a])) {
              b.next[i][a]= b.map[i][j- 1];
              m.change= false;
              break;
            }
          }
        }
        continue;
      }
      if(b.map[i][j]=== 23) {
        count++;
        if(b.map[i+ 1][j]!== undefined && b.map[i- 1]!== undefined && !b.immune.includes(b.map[i- 1][j])) {
          for(var a= i+ 1; a< b.map.length; a++) {
            if(!b.solid.includes(b.map[a][j])) {
              b.next[a][j]= b.map[i- 1][j];
              m.change= false;
              break;
            }
          }
        }
        continue;
      }
      if(b.map[i][j]=== 24) {
        count++;
        if(b.map[i][j- 1]!== undefined && b.map[i][j+ 1]!== undefined && !b.immune.includes(b.map[i][j+ 1])) {
          for(var a= j- 1; a>= 0; a--) {
            if(!b.solid.includes(b.map[i][a])) {
              b.next[i][a]= b.map[i][j+ 1];
              m.change= false;
              break;
            }
          }
        }
        continue;
      }
    }
  }
}
