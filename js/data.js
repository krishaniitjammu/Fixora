/* Fixora sample data. All names, prices and timings are illustrative. */

// Local-shop labour is assumed ~35% higher than Fixora's fixed labour rate.
var LOCAL_LABOUR_MARKUP = 1.35;
var VISIT_FEE = 149; // inspection fee, waived when the repair is done

var APPLIANCES = [
  {
    id: "ac", name: "Air Conditioner", short: "AC",
    icon: '<rect x="3" y="5" width="18" height="8" rx="2"/><path d="M6 10h12M8 16v2M12 16v3M16 16v2"/>',
    issues: [
      { id: "ac-cooling", title: "Not cooling properly", cause: "Usually low refrigerant from a slow leak, or a choked filter and coil.", labour: 499, parts: ["ac-gas"], mins: 90, kw: ["cool", "warm", "hot air", "gas", "cooling"] },
      { id: "ac-start", title: "Compressor not starting", cause: "A weak run capacitor is the most common reason the outdoor unit hums but does not start.", labour: 349, parts: ["ac-cap"], mins: 45, kw: ["start", "humming", "hum", "outdoor", "compressor", "trip"] },
      { id: "ac-dead", title: "No power / display blank", cause: "Indoor PCB failure, often after a voltage spike.", labour: 599, parts: ["ac-pcb"], mins: 75, kw: ["dead", "power", "display", "blank", "pcb", "remote"] },
      { id: "ac-noise", title: "Loud noise or weak airflow", cause: "Worn blower motor bearings or a loose fan wheel.", labour: 449, parts: ["ac-fanmotor"], mins: 60, kw: ["noise", "sound", "airflow", "vibrat", "rattle"] }
    ]
  },
  {
    id: "fridge", name: "Refrigerator", short: "Fridge",
    icon: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 9h12M9 5v2M9 12v3"/>',
    issues: [
      { id: "fr-cooling", title: "Not cooling", cause: "Faulty thermostat or compressor relay stops the compressor from cycling on.", labour: 399, parts: ["fr-thermo", "fr-relay"], mins: 60, kw: ["cool", "warm", "spoil", "cooling"] },
      { id: "fr-comp", title: "Compressor dead / clicking", cause: "Compressor has failed and needs replacement with gas charging.", labour: 999, parts: ["fr-comp"], mins: 150, kw: ["click", "compressor", "dead", "not running"] },
      { id: "fr-door", title: "Door not sealing / ice build-up", cause: "A hardened door gasket lets warm air in, causing frost and higher bills.", labour: 249, parts: ["fr-gasket"], mins: 40, kw: ["door", "seal", "ice", "frost", "gasket", "water"] }
    ]
  },
  {
    id: "wm", name: "Washing Machine", short: "Washer",
    icon: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M7.5 5.5h.01M11 5.5h5"/>',
    issues: [
      { id: "wm-spin", title: "Drum not spinning", cause: "A worn or snapped drive belt. The motor runs but the drum stays still.", labour: 349, parts: ["wm-belt"], mins: 45, kw: ["spin", "drum", "rotate", "belt"] },
      { id: "wm-drain", title: "Water not draining", cause: "Drain pump is jammed or burnt out.", labour: 399, parts: ["wm-pump"], mins: 60, kw: ["drain", "water stays", "standing water", "pump"] },
      { id: "wm-fill", title: "Water not filling", cause: "Inlet valve solenoid has failed or its mesh filter is blocked.", labour: 299, parts: ["wm-inlet"], mins: 40, kw: ["fill", "inlet", "no water", "tap"] },
      { id: "wm-dead", title: "Not turning on / error code", cause: "Control PCB fault, often from moisture or voltage fluctuation.", labour: 549, parts: ["wm-pcb"], mins: 75, kw: ["error", "dead", "power", "display", "code", "pcb"] }
    ]
  },
  {
    id: "mw", name: "Microwave Oven", short: "Microwave",
    icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><path d="M18 9h.01M18 12h.01M18 15h.01"/>',
    issues: [
      { id: "mw-heat", title: "Runs but does not heat", cause: "Magnetron has reached end of life, or the HV diode has failed.", labour: 399, parts: ["mw-magnetron"], mins: 60, kw: ["heat", "cold", "warm", "magnetron"] },
      { id: "mw-dead", title: "Completely dead", cause: "Blown HV fuse, usually triggered by a door switch fault.", labour: 299, parts: ["mw-fuse"], mins: 40, kw: ["dead", "power", "fuse", "not turning"] },
      { id: "mw-plate", title: "Turntable broken / not rotating", cause: "Cracked glass plate or worn roller ring.", labour: 149, parts: ["mw-plate"], mins: 20, kw: ["plate", "turntable", "rotate", "glass"] }
    ]
  },
  {
    id: "ro", name: "Water Purifier", short: "RO",
    icon: '<rect x="6" y="2" width="12" height="16" rx="2"/><path d="M10 18v3h4v-3M12 6c-1.5 2-2.5 3.2-2.5 4.5a2.5 2.5 0 0 0 5 0C14.5 9.2 13.5 8 12 6z"/>',
    issues: [
      { id: "ro-taste", title: "Bad taste or smell", cause: "Sediment and carbon filters are overdue for replacement.", labour: 199, parts: ["ro-filterkit"], mins: 30, kw: ["taste", "smell", "odour", "odor", "dirty"] },
      { id: "ro-flow", title: "Very slow water flow", cause: "RO membrane is choked with dissolved solids.", labour: 299, parts: ["ro-membrane"], mins: 45, kw: ["slow", "flow", "tds", "membrane", "less water"] },
      { id: "ro-dead", title: "Not turning on / no water", cause: "Failed SMPS adapter or booster pump.", labour: 349, parts: ["ro-smps", "ro-pump"], mins: 50, kw: ["dead", "power", "no water", "pump", "adapter"] }
    ]
  },
  {
    id: "gy", name: "Geyser", short: "Geyser",
    icon: '<rect x="7" y="2" width="10" height="15" rx="5"/><path d="M10 17v4M14 17v4"/><circle cx="12" cy="11" r="1.5"/>',
    issues: [
      { id: "gy-heat", title: "Water not heating", cause: "Heating element is burnt out, usually from hard-water scaling.", labour: 349, parts: ["gy-element"], mins: 50, kw: ["heat", "cold", "hot water", "element"] },
      { id: "gy-over", title: "Overheating / keeps tripping", cause: "Thermostat is stuck and not cutting off at the set temperature.", labour: 299, parts: ["gy-thermostat"], mins: 40, kw: ["overheat", "trip", "too hot", "thermostat", "mcb"] },
      { id: "gy-leak", title: "Leaking from the valve", cause: "Worn pressure-release safety valve.", labour: 249, parts: ["gy-valve"], mins: 30, kw: ["leak", "drip", "valve", "water coming"] }
    ]
  },
  {
    id: "tv", name: "Television", short: "TV",
    icon: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    issues: [
      { id: "tv-dark", title: "Sound but no picture", cause: "LED backlight strips have failed. The panel itself is usually fine.", labour: 699, parts: ["tv-backlight"], mins: 120, kw: ["picture", "black", "dark", "backlight", "sound but", "screen"] },
      { id: "tv-dead", title: "Not turning on", cause: "Power supply board fault, often swollen capacitors.", labour: 499, parts: ["tv-psu"], mins: 75, kw: ["dead", "power", "standby", "red light", "not turning"] },
      { id: "tv-remote", title: "Remote not working", cause: "Remote is worn out. A compatible replacement fixes it.", labour: 0, parts: ["tv-remote"], mins: 5, kw: ["remote", "button"] }
    ]
  },
  {
    id: "ch", name: "Kitchen Chimney", short: "Chimney",
    icon: '<path d="M9 2h6v7H9zM4 17l5-8h6l5 8v3H4z"/>',
    issues: [
      { id: "ch-suction", title: "Poor suction / smoke stays", cause: "Baffle filters are clogged with grease.", labour: 399, parts: ["ch-filter"], mins: 60, kw: ["suction", "smoke", "grease", "filter", "oil"] },
      { id: "ch-motor", title: "Motor noisy or not running", cause: "Motor bearings have seized from grease ingress.", labour: 549, parts: ["ch-motor"], mins: 80, kw: ["motor", "noise", "not running", "sound", "dead"] }
    ]
  },
  {
    id: "fan", name: "Ceiling Fan", short: "Fan",
    icon: '<circle cx="12" cy="12" r="2"/><path d="M12 10c-2-2-3-5-1-7s5 0 4 3-3 4-3 4zM13.7 13c2.7-.7 5.8 0 6.6 2.7s-2.5 4.3-4.6 2-2-4.7-2-4.7zM10.3 13c-.7 2.7-2.9 5-5.6 4.3s-2.5-4.3.6-5 5 .7 5 .7z"/>',
    issues: [
      { id: "fan-slow", title: "Running slow", cause: "Weak capacitor. A two-minute swap restores full speed.", labour: 149, parts: ["fan-cap"], mins: 20, kw: ["slow", "speed", "capacitor"] },
      { id: "fan-noise", title: "Noisy or wobbling", cause: "Dry or worn bearings.", labour: 249, parts: ["fan-bearing"], mins: 45, kw: ["noise", "wobbl", "sound", "bearing", "shake"] },
      { id: "fan-reg", title: "Speed control not working", cause: "Faulty regulator.", labour: 99, parts: ["fan-reg"], mins: 15, kw: ["regulator", "control", "speed not chang"] }
    ]
  },
  {
    id: "mx", name: "Mixer Grinder", short: "Mixer",
    icon: '<path d="M8 3h8l-1 9H9zM7 12h10l1 9H6zM16 5h2v4h-2"/>',
    issues: [
      { id: "mx-jar", title: "Jar not rotating", cause: "Rubber coupler between motor and jar is worn out.", labour: 99, parts: ["mx-coupler"], mins: 15, kw: ["jar", "rotate", "coupler", "spin"] },
      { id: "mx-spark", title: "Sparking / burning smell", cause: "Carbon brushes are worn down to the holder.", labour: 199, parts: ["mx-brush"], mins: 30, kw: ["spark", "smell", "burn", "brush", "smoke"] },
      { id: "mx-blade", title: "Not grinding properly", cause: "Blunt or loose jar blade assembly.", labour: 99, parts: ["mx-blade"], mins: 15, kw: ["grind", "blade", "leak", "blunt"] }
    ]
  }
];

var PARTS = [
  { id: "ac-gas", app: "ac", name: "R32 Gas Refill (full charge)", brand: "Fits 1–1.5 ton split ACs", price: 2199, local: 3000, warranty: 3 },
  { id: "ac-cap", app: "ac", name: "AC Run Capacitor 45+5 µF", brand: "Universal, 440V", price: 349, local: 520, warranty: 6 },
  { id: "ac-pcb", app: "ac", name: "Inverter AC Indoor PCB", brand: "Universal programmable", price: 3499, local: 4800, warranty: 6 },
  { id: "ac-fanmotor", app: "ac", name: "Indoor Blower Motor", brand: "Fits 1–1.5 ton split ACs", price: 1899, local: 2600, warranty: 6 },
  { id: "ac-remote", app: "ac", name: "Universal AC Remote", brand: "Works with 20+ brands", price: 299, local: 450, warranty: 3 },
  { id: "fr-thermo", app: "fridge", name: "Refrigerator Thermostat", brand: "Direct-cool, single door", price: 449, local: 650, warranty: 6 },
  { id: "fr-relay", app: "fridge", name: "Compressor Relay + Overload", brand: "Universal PTC type", price: 249, local: 400, warranty: 6 },
  { id: "fr-comp", app: "fridge", name: "Compressor 165–260 L", brand: "R600a, with gas charging", price: 4299, local: 5800, warranty: 12 },
  { id: "fr-gasket", app: "fridge", name: "Door Gasket", brand: "Cut to size, single door", price: 599, local: 900, warranty: 6 },
  { id: "wm-belt", app: "wm", name: "Drive Belt", brand: "Top and front load", price: 199, local: 350, warranty: 3 },
  { id: "wm-pump", app: "wm", name: "Drain Pump Motor", brand: "Universal 30W", price: 649, local: 950, warranty: 6 },
  { id: "wm-inlet", app: "wm", name: "Water Inlet Valve", brand: "Single / double solenoid", price: 399, local: 600, warranty: 6 },
  { id: "wm-pcb", app: "wm", name: "Washing Machine Control PCB", brand: "Fully automatic models", price: 2799, local: 3900, warranty: 6 },
  { id: "mw-magnetron", app: "mw", name: "Magnetron", brand: "900W, 2M series", price: 1499, local: 2100, warranty: 6 },
  { id: "mw-fuse", app: "mw", name: "HV Fuse + Diode Kit", brand: "5kV universal", price: 199, local: 350, warranty: 3 },
  { id: "mw-plate", app: "mw", name: "Glass Turntable Plate", brand: "245 / 270 / 315 mm", price: 449, local: 650, warranty: 0 },
  { id: "ro-filterkit", app: "ro", name: "Sediment + Carbon Filter Kit", brand: "Fits all standard RO units", price: 499, local: 800, warranty: 0 },
  { id: "ro-membrane", app: "ro", name: "RO Membrane 80 GPD", brand: "Up to 2000 TDS", price: 1199, local: 1700, warranty: 6 },
  { id: "ro-pump", app: "ro", name: "Booster Pump 100 GPD", brand: "24V DC", price: 1399, local: 1900, warranty: 6 },
  { id: "ro-smps", app: "ro", name: "SMPS Power Adapter 24V", brand: "2.5A", price: 349, local: 550, warranty: 6 },
  { id: "gy-element", app: "gy", name: "Heating Element 2 kW", brand: "Copper, 15–25 L geysers", price: 549, local: 800, warranty: 6 },
  { id: "gy-thermostat", app: "gy", name: "Geyser Thermostat", brand: "Capillary type with cut-out", price: 299, local: 450, warranty: 6 },
  { id: "gy-valve", app: "gy", name: "Safety Release Valve", brand: "8 bar, multi-function", price: 249, local: 400, warranty: 6 },
  { id: "tv-backlight", app: "tv", name: "LED Backlight Strip Set", brand: "32–43 inch panels", price: 1299, local: 1900, warranty: 6 },
  { id: "tv-psu", app: "tv", name: "Power Supply Board", brand: "32–43 inch LED TVs", price: 1799, local: 2500, warranty: 6 },
  { id: "tv-remote", app: "tv", name: "Smart TV Remote", brand: "Compatible replacement", price: 249, local: 400, warranty: 3 },
  { id: "ch-filter", app: "ch", name: "Baffle Filter (pair)", brand: "60 cm chimneys", price: 899, local: 1300, warranty: 0 },
  { id: "ch-motor", app: "ch", name: "Chimney Motor", brand: "1000–1200 m³/h", price: 1599, local: 2300, warranty: 12 },
  { id: "fan-cap", app: "fan", name: "Fan Capacitor 2.5 µF", brand: "440V", price: 79, local: 150, warranty: 6 },
  { id: "fan-bearing", app: "fan", name: "Fan Bearing Set", brand: "6202 + 6201", price: 149, local: 250, warranty: 6 },
  { id: "fan-reg", app: "fan", name: "Step Regulator", brand: "5-speed, modular", price: 249, local: 380, warranty: 12 },
  { id: "mx-coupler", app: "mx", name: "Mixer Coupler", brand: "Motor + jar side", price: 99, local: 180, warranty: 0 },
  { id: "mx-brush", app: "mx", name: "Carbon Brush (pair)", brand: "500–750W mixers", price: 89, local: 160, warranty: 0 },
  { id: "mx-blade", app: "mx", name: "Jar Blade Assembly", brand: "Wet / dry / chutney jar", price: 199, local: 320, warranty: 3 }
];

var SLOTS = ["9:00 – 11:00 AM", "11:00 AM – 1:00 PM", "2:00 – 4:00 PM", "4:00 – 6:00 PM", "6:00 – 8:00 PM"];

var EXPERTS = [
  { name: "Rakesh Sharma", role: "AC and refrigeration specialist", years: 11 },
  { name: "Imran Wani", role: "Washing machine and RO specialist", years: 8 },
  { name: "Sunita Devi", role: "Kitchen appliance specialist", years: 7 }
];
