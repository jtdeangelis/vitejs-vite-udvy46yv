export const COSTS = {
  flooring: {
    carpet: 5,
    hardwood: 12,
    'engineered-hardwood': 10,
    laminate: 7,
    vinyl: 4,
    tile: 8,
    concrete: 5,
    epoxy: 10,
    stone: 15,
    'luxury-vinyl': 6
  },
  paint: {
    standard: 0.75,
    premium: 1.5
  },
  cabinets: {
    stock: 200,
    'semi-custom': 350,
    custom: 500
  },
  countertops: {
    laminate: 30,
    quartz: 75,
    granite: 100,
    marble: 125
  },
  appliances: {
    basic: 3000,
    'mid-range': 6000,
    'high-end': 10000
  },
  backsplash: {
    ceramic: 15,
    glass: 25,
    stone: 35
  },
  trim: {
    baseboards: 5,
    crown: 7,
    both: 12
  },
  lighting: {
    ceiling: 150,
    recessed: 200,
    decorative: 300,
    chandelier: 800,
    pendant: 250
  },
  windows: {
    standard: 600,
    large: 1200,
    sliding: 1800
  },
  doors: {
    interior: {
      'hollow-core': 100,
      'solid-core': 200,
      panel: 250,
      french: 400,
      pocket: 500,
      barn: 600
    },
    exterior: {
      'exterior-steel': 500,
      'exterior-fiberglass': 800
    }
  },
  vanity: {
    basic: 150,
    custom: 350,
    floating: 400
  },
  shower: {
    standard: 1500,
    'walk-in': 3000,
    'tub-combo': 2500
  },
  toilet: {
    standard: 300,
    'comfort-height': 500,
    'dual-flush': 600
  },
  faucet: {
    'single-handle': 150,
    widespread: 250,
    waterfall: 300
  },
  fan: {
    '42-inch': 150,
    '52-inch': 200,
    '60-inch': 300
  },
  closet: {
    basic: 500,
    'walk-in': 2000,
    custom: 3500
  },
  fireplace: {
    gas: 3500,
    electric: 2000,
    wood: 5000
  },
  builtIns: {
    bookcase: 300,
    entertainment: 400,
    storage: 350
  },
  siding: {
    vinyl: 7,
    'fiber-cement': 10,
    brick: 15,
    stucco: 9
  },
  roof: {
    asphalt: 4,
    metal: 10,
    tile: 15
  },
  landscaping: {
    basic: 5,
    moderate: 10,
    extensive: 20
  },
  driveway: {
    asphalt: 5,
    concrete: 8,
    pavers: 15
  },
  hvac: {
    standard: 3000,
    'high-efficiency': 5000,
    'heat-pump': 7000
  }
} as const;

export type MaterialCosts = typeof COSTS;