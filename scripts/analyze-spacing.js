const SURAH_PILLARS = {
  // Shahada (19 surahs)
  1: 'shahada', 50: 'shahada', 54: 'shahada', 56: 'shahada', 67: 'shahada',
  69: 'shahada', 71: 'shahada', 75: 'shahada', 77: 'shahada', 78: 'shahada',
  79: 'shahada', 81: 'shahada', 82: 'shahada', 84: 'shahada', 85: 'shahada',
  89: 'shahada', 99: 'shahada', 101: 'shahada', 112: 'shahada',
  // Salah (20 surahs)
  2: 'salah', 4: 'salah', 17: 'salah', 29: 'salah', 30: 'salah', 32: 'salah',
  33: 'salah', 51: 'salah', 52: 'salah', 53: 'salah', 62: 'salah', 68: 'salah',
  73: 'salah', 74: 'salah', 76: 'salah', 87: 'salah', 93: 'salah', 96: 'salah',
  107: 'salah', 108: 'salah',
  // Zakat (18 surahs)
  3: 'zakat', 5: 'zakat', 9: 'zakat', 13: 'zakat', 15: 'zakat', 22: 'zakat',
  24: 'zakat', 42: 'zakat', 47: 'zakat', 57: 'zakat', 58: 'zakat', 59: 'zakat',
  63: 'zakat', 64: 'zakat', 90: 'zakat', 92: 'zakat', 102: 'zakat', 104: 'zakat',
  // Sawm (12 surahs)
  8: 'sawm', 70: 'sawm', 80: 'sawm', 83: 'sawm', 86: 'sawm', 88: 'sawm',
  91: 'sawm', 94: 'sawm', 95: 'sawm', 97: 'sawm', 100: 'sawm', 103: 'sawm',
  // Hajj (8 surahs)
  48: 'hajj', 49: 'hajj', 55: 'hajj', 60: 'hajj', 61: 'hajj', 65: 'hajj',
  105: 'hajj', 106: 'hajj',
  // General (8 surahs - will be filtered out)
  66: 'general', 72: 'general', 98: 'general', 109: 'general', 110: 'general',
  111: 'general', 113: 'general', 114: 'general'
};

const counts = {};
Object.values(SURAH_PILLARS).forEach(p => {
  counts[p] = (counts[p] || 0) + 1;
});

console.log('Node distribution per pillar:');
Object.entries(counts).forEach(([pillar, count]) => {
  console.log(`  ${pillar}: ${count} surahs`);
});

// Calculate circumference per node with current radii
const currentRadii = {
  shahada: 20,
  salah: 36,
  zakat: 52,
  sawm: 68,
  hajj: 84
};

console.log('\nCurrent spacing (circumference per node):');
Object.entries(currentRadii).forEach(([pillar, radius]) => {
  const count = counts[pillar] || 0;
  const circumference = 2 * Math.PI * radius;
  const spacing = circumference / count;
  console.log(`  ${pillar} (R=${radius}): ${spacing.toFixed(2)} units/node`);
});

// Propose better radii based on target spacing of ~8-10 units per node
console.log('\nProposed improved radii (target: 8-10 units/node):');
const targetSpacing = 9;
Object.entries(counts).forEach(([pillar, count]) => {
  if (pillar === 'general') return; // Skip general
  const targetCircumference = count * targetSpacing;
  const proposedRadius = targetCircumference / (2 * Math.PI);
  console.log(`  ${pillar}: R=${proposedRadius.toFixed(1)} (${count} nodes)`);
});
