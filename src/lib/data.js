// Static knowledge used by the UI. Rainfall figures are approximate long-term monthly
// averages for Kolkata (IMD station normals), rounded for display.

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHLY_RAIN_MM = [12, 28, 34, 59, 140, 295, 351, 341, 292, 143, 25, 9];

export const SEASONS = [
  {
    key: "summer",
    name: "Summer",
    months: [2, 3, 4],
    range: "March to May",
    rain: "About 230 mm",
    text: "Hot and sticky. Kal Baisakhi thunderstorms bring short, violent bursts that can flood a street within an hour.",
  },
  {
    key: "monsoon",
    name: "Monsoon",
    months: [5, 6, 7, 8],
    range: "June to September",
    rain: "About 1,280 mm",
    text: "Roughly three-quarters of the year's rain. Long wet spells combined with high tide cause the worst waterlogging.",
  },
  {
    key: "post",
    name: "Post-monsoon",
    months: [9, 10],
    range: "October to November",
    rain: "About 170 mm",
    text: "The retreating monsoon and Bay of Bengal cyclones (Bulbul in 2019, Amphan in 2020) can still deliver heavy rain.",
  },
  {
    key: "winter",
    name: "Winter",
    months: [11, 0, 1],
    range: "December to February",
    rain: "About 50 mm",
    text: "Mostly dry. Waterlogging is rare, which makes this the window for desilting drains before the next monsoon.",
  },
];

// mult: how much more (or less) vulnerable than the city average. Illustrative values
// based on areas commonly reported in local news, not official municipal data.
export const HOTSPOTS = [
  { name: "Behala", zone: "South", mult: 1.3, why: "Low ground and drains that empty slowly into canals." },
  { name: "Tollygunge", zone: "South", mult: 1.2, why: "Silting in Tolly's Nullah reduces how fast water leaves." },
  { name: "Gariahat and Ballygunge", zone: "South", mult: 1.15, why: "Dense paving and busy junctions with old drains." },
  { name: "Garden Reach", zone: "South", mult: 1.35, why: "Close to the river, so high tide holds back drainage." },
  { name: "College Street and Burrabazar", zone: "Central", mult: 1.25, why: "Heavy plastic and market waste blocks gullies." },
  { name: "Esplanade and BBD Bagh", zone: "Central", mult: 1.1, why: "Underpasses and low crossings collect water first." },
  { name: "Park Circus and Topsia", zone: "East", mult: 1.2, why: "Low-lying and packed with built-up land." },
  { name: "Beliaghata", zone: "East", mult: 1.25, why: "Canal-side lanes depend on pumping stations." },
  { name: "Ultadanga and Maniktala", zone: "North", mult: 1.2, why: "Flat terrain where the main sewer runs over capacity." },
  { name: "Shyambazar and Hatibagan", zone: "North", mult: 1.15, why: "Some of the city's oldest drainage lines." },
  { name: "Salt Lake", zone: "East", mult: 0.8, why: "Planned township with better drainage design." },
];

export const CAUSES = [
  {
    title: "Flat land, barely above the sea",
    text: "Kolkata sits only a few metres above sea level on the Ganges delta. Water has almost no slope to run down.",
  },
  {
    title: "Century-old drains",
    text: "Large parts of the sewer network were laid for a far smaller city. Today's population and paved area overwhelm it.",
  },
  {
    title: "High tide blocks the outflow",
    text: "When heavy rain meets high tide, canals and the river cannot take more water, so the city waits for the tide to fall.",
  },
  {
    title: "Lost wetlands and silted canals",
    text: "Filled-in ponds and silted channels used to hold and carry rainwater. Fewer of them work today.",
  },
  {
    title: "Plastic and solid waste",
    text: "Plastic bags and rubbish choke gully inlets, so even a short shower can pool on the road.",
  },
];

export const TIPS = [
  {
    when: "Before the rain",
    items: [
      "Check the forecast and the risk score before you leave.",
      "Charge phones and power banks. Power cuts often follow floods.",
      "Lift electronics, documents and valuables off the floor.",
    ],
  },
  {
    when: "While it rains",
    items: [
      "Avoid underpasses and low roads. Water is deeper than it looks.",
      "Stay clear of electric poles, loose wires and open manholes.",
      "Do not drive through standing water. Wait or take another route.",
    ],
  },
  {
    when: "After the water drops",
    items: [
      "Drink boiled or purified water for a few days.",
      "Wash cuts and wounds that touched floodwater, and see a doctor if fever follows.",
      "Call 112 in an emergency.",
    ],
  },
];
