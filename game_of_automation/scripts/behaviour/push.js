function push() {
  for(var i= 0; i< b.map.length; i++) {
    for(var j= 0; j< b.map[i].length; j++) {
      
      if(b.map[i][j]=== 35 && b.map[i- 1]!== undefined && b.solid.includes(b.map[i- 1][j])) {
        var max= i;
        for(var a= i; a>= 0; a--) {
          if(b.map[a- 1]=== undefined || b.up.includes(b.map[a- 1][j]) || b.immune.includes(b.map[a- 1][j])) {
            max= a;
            break;
          }
        }
        for(var a= max; a< i; a++) {
          if(b.map[a- 1]=== undefined || b.up.includes(b.map[a- 1][j])) break;
          count++;
          b.next[a- 1][j]= b.map[a][j];
          if(a!== i- 1) {
            b.next[a][j]= b.map[a+ 1][j];
            b.next[a+ 1][j]= 0;
          }
          else b.next[a][j]= 0;
          m.change= false;
        }
        continue;
      }
      if(b.map[i][j]=== 36 && b.map[i][j+ 1]!== undefined && b.solid.includes(b.map[i][j+ 1])) {
        var max= j;
        for(var a= max; a< b.map[0].length; a++) {
          if(b.map[i][a+ 1]=== undefined || b.right.includes(b.map[i][a+ 1]) || b.immune.includes(b.map[i][a+ 1])) {
            max= a;
            break;
          }
        }
        for(var a= max; a> j; a--) {
          if(b.map[i][a+ 1]=== undefined || b.right.includes(b.map[i][a+ 1])) break;
          count++;
          b.next[i][a+ 1]= b.map[i][a];
          if(a!== j+ 1) {
            b.next[i][a]= b.map[i][a- 1];
            b.next[i][a- 1]= 0;
          }
          else b.next[i][a]= 0;
          m.change= false;
        }
        continue;
      }
      if(b.map[i][j]=== 37 && b.map[i+ 1]!== undefined && b.solid.includes(b.map[i+ 1][j])) {
        var max= i;
        for(var a= max; a< b.map.length; a++) {
          if(b.map[a+ 1]=== undefined || b.down.includes(b.map[a+ 1][j]) || b.immune.includes(b.map[a+ 1][j])) {
            max= a;
            break;
          }
        }
        for(var a= max; a> i; a--) {
          if(b.map[a+ 1]=== undefined || b.down.includes(b.map[a+ 1][j])) break;
          count++;
          b.next[a+ 1][j]= b.map[a][j];
          if(a!== i+ 1) {
            b.next[a][j]= b.map[a- 1][j];
            b.next[a- 1][j]= 0;
          }
          else b.next[a][j]= 0;
          m.change= false;
        }
        continue;
      }
      if(b.map[i][j]=== 38 && b.map[i][j- 1]!== undefined && b.solid.includes(b.map[i][j- 1])) {
        var max= j;
        for(var a= max; a>= 0; a--) {
          if(b.map[i][a- 1]=== undefined || b.left.includes(b.map[i][a- 1]) || b.immune.includes(b.map[i][a- 1])) {
            max= a;
            break;
          }
        }
        for(var a= max; a< j; a++) {
          if(b.map[i][a- 1]=== undefined || b.left.includes(b.map[i][a- 1])) break;
          count++;
          b.next[i][a- 1]= b.map[i][a];
          if(a!== j- 1) {
            b.next[i][a]= b.map[i][a+ 1];
            b.next[i][a+ 1]= 0;
          }
          else b.next[i][a]= 0;
          m.change= false;
        }
        continue;
      }
    }
  }
}
