// A simple function to get a color name from a hex code.
// This is not exhaustive and is a very simplified mapping.
// For a real-world app, a more robust library would be better.

const colorMap: { [key: string]: string } = {
  // Reds
  '#ff0000': 'Red',
  '#dc143c': 'Crimson',
  '#b22222': 'Firebrick',
  // Oranges
  '#ffa500': 'Orange',
  '#ff8c00': 'Dark Orange',
  '#ff4500': 'Orange Red',
  // Yellows
  '#ffff00': 'Yellow',
  '#ffd700': 'Gold',
  // Greens
  '#008000': 'Green',
  '#00ff00': 'Lime',
  '#228b22': 'Forest Green',
  // Cyans
  '#00ffff': 'Aqua',
  '#00ced1': 'Dark Turquoise',
  // Blues
  '#0000ff': 'Blue',
  '#00008b': 'Dark Blue',
  '#4169e1': 'Royal Blue',
  // Purples/Magentas
  '#800080': 'Purple',
  '#9400d3': 'Dark Violet',
  '#ff00ff': 'Fuchsia',
  '#ee82ee': 'Violet',
  // Pinks
  '#ffc0cb': 'Pink',
  '#ff1493': 'Deep Pink',
  // Whites/Grays/Blacks
  '#ffffff': 'White',
  '#808080': 'Gray',
  '#000000': 'Black',
};

// Function to find the closest color name
function findClosestColor(hex: string): string {
    const r1 = parseInt(hex.substring(1, 3), 16);
    const g1 = parseInt(hex.substring(3, 5), 16);
    const b1 = parseInt(hex.substring(5, 7), 16);

    let closestColor = '';
    let minDistance = Infinity;

    for (const [colorHex, colorName] of Object.entries(colorMap)) {
        const r2 = parseInt(colorHex.substring(1, 3), 16);
        const g2 = parseInt(colorHex.substring(3, 5), 16);
        const b2 = parseInt(colorHex.substring(5, 7), 16);

        // Simple Euclidean distance in RGB space
        const distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = colorName;
        }
    }

    return closestColor;
}


export function getColorName(hex: string): string {
  const lowerHex = hex.toLowerCase();
  
  if (colorMap[lowerHex]) {
    return colorMap[lowerHex];
  }
  
  return findClosestColor(lowerHex);
}
