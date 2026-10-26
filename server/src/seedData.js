const V = (label, stock = 20) => ({ label, stock });

export const categories = [
  { name: 'Home & Kitchen' },
  { name: 'Desk & Stationery' },
  { name: 'Tech Accessories' },
  { name: 'Personal Care' },
  { name: 'Bags & Carry' },
];

// price / was are in dollars here; the seed script converts to cents
export const products = [
  // Home & Kitchen
  { cat: 'Home & Kitchen', title: 'Stoneware Pour-Over Set', price: 38, desc: 'A hand-glazed dripper and matching carafe. Brews two strong cups and goes straight into the dishwasher.', variants: [V('Oat'), V('Charcoal', 12)] },
  { cat: 'Home & Kitchen', title: 'Walnut Serving Board', price: 29, was: 36, desc: 'Solid walnut with a leather loop. Sized for bread and cheese, or a Sunday breakfast spread.', variants: [V('Medium'), V('Large', 8)] },
  { cat: 'Home & Kitchen', title: 'Linen Tea Towels, Set of 3', price: 18, desc: 'Stonewashed linen that gets softer every wash and dries faster than cotton.', variants: [V('Natural'), V('Sage')] },
  { cat: 'Home & Kitchen', title: 'Double-Wall Glass Mugs, Set of 2', price: 22, desc: 'Keeps tea hot and fingers cool. Borosilicate glass, 300 ml each.', variants: [V('Clear', 30)] },
  { cat: 'Home & Kitchen', title: 'Beeswax Taper Candles, Box of 6', price: 16, desc: 'Slow-burning and lightly honey-scented. About 7 hours per candle.', variants: [V('Natural', 40)] },

  // Desk & Stationery
  { cat: 'Desk & Stationery', title: 'Hardcover Dot-Grid Notebook', price: 14, desc: '160 pages of 100 gsm paper that handles fountain pens. Lays flat, with a ribbon marker.', variants: [V('Forest'), V('Terracotta'), V('Ink', 3)] },
  { cat: 'Desk & Stationery', title: 'Brass Click Pen', price: 19, desc: 'Solid brass body that develops a patina as you use it. Takes standard refills.', variants: [V('Brass', 25)] },
  { cat: 'Desk & Stationery', title: 'Cork Desk Mat', price: 32, was: 40, desc: 'Natural cork with a stitched edge. Warm under the wrists and quiet under a keyboard.', variants: [V('60 x 30 cm'), V('80 x 40 cm', 10)] },
  { cat: 'Desk & Stationery', title: 'Pencil Tin, Set of 12', price: 11, desc: 'Twelve HB pencils in a reusable tin. Smooth lead that sharpens cleanly.', variants: [V('Default', 50)] },
  { cat: 'Desk & Stationery', title: 'Weekly Desk Planner Pad', price: 12, desc: '52 tear-off weeks with a priorities box and a space for tomorrow. No dates, so start any day.', variants: [V('Default', 35)] },

  // Tech Accessories
  { cat: 'Tech Accessories', title: 'Braided USB-C Cable, 1.5 m', price: 15, desc: 'Fast-charge rated and tangle-resistant, with reinforced ends where cables usually fail.', variants: [V('Sand'), V('Black')] },
  { cat: 'Tech Accessories', title: 'Wool Felt Laptop Sleeve', price: 36, desc: 'Pressed wool felt with a soft lining and a snug magnetic flap.', variants: [V('13-inch'), V('15-inch', 9)] },
  { cat: 'Tech Accessories', title: 'Aluminium Laptop Stand', price: 42, was: 52, desc: 'Raises the screen to eye level and folds flat enough for a bag. Silicone pads protect the base.', variants: [V('Silver', 14), V('Graphite', 6)] },
  { cat: 'Tech Accessories', title: 'Wireless Charging Pad', price: 28, desc: '15 W Qi pad with a fabric top that grips your phone. Cable included.', variants: [V('Grey', 18)] },
  { cat: 'Tech Accessories', title: 'Cable Tidy Clips, Pack of 6', price: 9, desc: 'Adhesive silicone clips that keep cables on the desk where you left them.', variants: [V('Mixed', 60)] },

  // Personal Care
  { cat: 'Personal Care', title: 'Shea & Oat Hand Cream', price: 13, desc: 'Rich but not greasy, absorbs in a minute. 75 ml, lightly scented with chamomile.', variants: [V('75 ml', 45)] },
  { cat: 'Personal Care', title: 'Bamboo Toothbrush Set of 4', price: 10, desc: 'Plant-based handles and soft bristles. One for each person, or one per season.', variants: [V('Soft', 30), V('Medium', 22)] },
  { cat: 'Personal Care', title: 'Cold-Pressed Soap Bar Trio', price: 17, desc: 'Oat and honey, cedar, and plain olive oil. Cured for six weeks, wrapped in paper.', variants: [V('Trio', 28)] },
  { cat: 'Personal Care', title: 'Cedar Wood Comb', price: 12, desc: 'Wide-toothed and polished smooth. Gentle on wet hair and static-free.', variants: [V('Default', 33)] },
  { cat: 'Personal Care', title: 'Reed Diffuser, Cedar & Fig', price: 24, desc: 'A quiet woody scent that lasts around ten weeks in a small room.', variants: [V('100 ml', 16)] },

  // Bags & Carry
  { cat: 'Bags & Carry', title: 'Waxed Canvas Tote', price: 34, desc: 'Water-resistant waxed canvas with an inside zip pocket. Fits a laptop and groceries.', variants: [V('Olive'), V('Tan'), V('Black', 4)] },
  { cat: 'Bags & Carry', title: 'Everyday Backpack, 18L', price: 64, was: 78, desc: 'Padded laptop compartment, a hidden back pocket, and straps that stay comfortable all day.', variants: [V('Charcoal', 15), V('Moss', 11)] },
  { cat: 'Bags & Carry', title: 'Zip Pouch, Set of 2', price: 18, desc: 'One large, one small. For chargers, pens, or the things that always sink to the bottom of a bag.', variants: [V('Sand', 24), V('Rust', 17)] },
  { cat: 'Bags & Carry', title: 'Leather Card Holder', price: 22, desc: 'Vegetable-tanned leather with four slots and a centre pocket. Slim enough for a front pocket.', variants: [V('Tan', 20), V('Dark Brown', 13)] },
];