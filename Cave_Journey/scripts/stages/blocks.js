var blocks= {
  wall: [
    '*',
    '#',
    '_',
    '\"',
  ],
  fullSolid: [
    '*',
    '#',
    '+',
  ],
  solid: [
    '-',
    '|',
  ],
  deflect: [
    '<',
    '>',
  ],
  danger: [
    '#',
    '_',
    '\"',
  ],
};
blocks.solid= blocks.solid.concat(blocks.fullSolid);
