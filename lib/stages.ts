export type StageStatus = 'locked' | 'active' | 'completed';

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  time: string;
  description: string;
  clue: string;
  unlockType: 'gps' | 'puzzle' | 'scan' | 'time';
  unlockRadius?: number; // meters, for GPS-based stages
  coordinates?: { lat: number; lng: number };
  hints: [string, string, string]; // 3 progressive hints
  status: StageStatus;
}

// Placeholder stages - will be populated with real data in E3-S2
export const INITIAL_STAGES: Stage[] = [
  {
    id: 1,
    title: 'Stage 01',
    subtitle: 'The Origin',
    location: 'Home',
    time: '09:00 AM',
    description: 'Where it all began...',
    clue: 'The first memory awaits at the place we call home.',
    unlockType: 'gps',
    unlockRadius: 50,
    coordinates: { lat: 39.1031, lng: -84.5120 }, // TODO: Update with your actual home address
    hints: [
      'Think about the beginning...',
      'Where did our story start?',
      'Home is where the heart is.'
    ],
    status: 'active', // First stage starts active
  },
  {
    id: 2,
    title: 'Stage 02',
    subtitle: 'The Hive',
    location: 'Sleepy Bee Cafe',
    time: '09:30 AM',
    description: 'Sweet beginnings and morning light.',
    clue: 'Seek the chandelier that caught your eye.',
    unlockType: 'scan',
    coordinates: { lat: 39.1001217, lng: -84.5123038 }, // 8 E 4th St, Downtown Cincinnati
    hints: [
      'Look up in the cafe...',
      'Something is hanging and shining...',
      'The chandelier holds a secret.'
    ],
    status: 'locked',
  },
  {
    id: 3,
    title: 'Stage 03',
    subtitle: 'Virtual Radio',
    location: 'Covington Core',
    time: '11:30 AM',
    description: 'Tune into the frequency of memory.',
    clue: 'Find the signal at 20.50 MHz.',
    unlockType: 'puzzle',
    coordinates: { lat: 39.0677, lng: -84.5164 }, // Downtown Covington, KY
    hints: [
      'Try different frequencies...',
      'The year 2014 holds the answer...',
      'Exactly 20.50 MHz will unlock the memory.'
    ],
    status: 'locked',
  },
  {
    id: 4,
    title: 'Stage 04',
    subtitle: 'Gelato Dreams',
    location: 'Covington Core',
    time: '11:45 AM',
    description: 'A sweet interlude.',
    clue: 'Taste the flavors of Italy on the river.',
    unlockType: 'gps',
    unlockRadius: 30,
    coordinates: { lat: 39.0872, lng: -84.5089 }, // Mainstrasse Village, Covington
    hints: [
      'Look for Italian treats...',
      'Something cold and sweet...',
      'Gelato by the riverside.'
    ],
    status: 'locked',
  },
  {
    id: 5,
    title: 'Stage 05',
    subtitle: 'Crystal Vision',
    location: 'Dimitridon Studios',
    time: '12:15 PM',
    description: 'Spectral analysis reveals hidden truths.',
    clue: 'Identify the Rose Quartz and Citrine.',
    unlockType: 'scan',
    coordinates: { lat: 39.0680, lng: -84.5120 }, // Covington area
    hints: [
      'Look for crystals with special properties...',
      'Rose and lemon colors...',
      'Rose Quartz and Citrine hold the key.'
    ],
    status: 'locked',
  },
  {
    id: 6,
    title: 'Stage 06',
    subtitle: 'The Bridge',
    location: 'Roebling Suspension Bridge',
    time: '01:00 PM',
    description: 'Crossing between worlds.',
    clue: 'Walk the path between two shores.',
    unlockType: 'gps',
    unlockRadius: 50,
    coordinates: { lat: 39.0953, lng: -84.5089 }, // Roebling Bridge midpoint
    hints: [
      'A connection spans the river...',
      'Cross from Kentucky to Ohio...',
      'The bridge is the link.'
    ],
    status: 'locked',
  },
  {
    id: 7,
    title: 'Stage 07',
    subtitle: 'Artifact Recovery',
    location: 'Cincinnati Art Museum',
    time: '02:00 PM',
    description: 'Ancient secrets in modern halls.',
    clue: 'Navigate the galleries to find the target.',
    unlockType: 'gps',
    unlockRadius: 100,
    coordinates: { lat: 39.1145, lng: -84.4968 }, // 953 Eden Park Dr
    hints: [
      'The museum holds many treasures...',
      'Look for the Damascus steel...',
      'Follow the path through the galleries.'
    ],
    status: 'locked',
  },
  {
    id: 8,
    title: 'Stage 08',
    subtitle: 'Damascus Cipher',
    location: 'Cincinnati Art Museum',
    time: '02:30 PM',
    description: 'Decode the ancient pattern.',
    clue: 'The steel holds a message in its waves.',
    unlockType: 'puzzle',
    coordinates: { lat: 39.1145, lng: -84.4968 }, // Same as Stage 7
    hints: [
      'Look at the pattern in the steel...',
      'The waves form letters...',
      'The cipher reveals the next coordinates.'
    ],
    status: 'locked',
  },
  {
    id: 9,
    title: 'Stage 09',
    subtitle: 'Museum Exit',
    location: 'Cincinnati Art Museum',
    time: '03:30 PM',
    description: 'Time to depart before closing.',
    clue: 'The museum closes soon. Proceed to the next location.',
    unlockType: 'gps',
    unlockRadius: 100,
    coordinates: { lat: 39.1145, lng: -84.4968 }, // Exit triggers nearby
    hints: [
      'Head toward the exit...',
      'Time is running out...',
      'Leave before 5:00 PM.'
    ],
    status: 'locked',
  },
  {
    id: 10,
    title: 'Stage 10',
    subtitle: 'The 420 Protocol',
    location: 'The Landing',
    time: '04:20 PM',
    description: 'A foggy interlude.',
    clue: 'Cleanse the fog at the riverside.',
    unlockType: 'scan',
    coordinates: { lat: 39.1515, lng: -84.4460 }, // 4029 Smith Rd
    hints: [
      'The fog obscures the path...',
      'Use your device to clear the view...',
      'The Landing holds the answer.'
    ],
    status: 'locked',
  },
  {
    id: 11,
    title: 'Stage 11',
    subtitle: 'Safe House',
    location: 'Home',
    time: '05:00 PM',
    description: 'Recharge protocol initiated.',
    clue: 'Find the vintage pharmacist bottle in the honor system area.',
    unlockType: 'time',
    coordinates: { lat: 39.1031, lng: -84.5120 }, // TODO: Update with your actual home address
    hints: [
      'Return home for a brief respite...',
      'Look in the honor system area...',
      'The bottle contains coordinates.'
    ],
    status: 'locked',
  },
  {
    id: 12,
    title: 'Stage 12',
    subtitle: 'The Master Builder',
    location: 'Art of the Brick',
    time: '06:00 PM',
    description: 'Constructed memories in plastic form.',
    clue: 'Find the masterpiece built from 1x1 bricks.',
    unlockType: 'gps',
    unlockRadius: 75,
    coordinates: { lat: 39.1000, lng: -84.5120 }, // 18 W 4th St, Downtown
    hints: [
      'LEGO art awaits...',
      'Look for the most intricate piece...',
      'The master builder\'s work is on display.'
    ],
    status: 'locked',
  },
  {
    id: 13,
    title: 'Stage 13',
    subtitle: 'Fungal Glow',
    location: 'Krohn Conservatory',
    time: '07:15 PM',
    description: 'Bioluminescence in the greenhouse.',
    clue: 'Harvest the glowing mushrooms from the grid.',
    unlockType: 'scan',
    coordinates: { lat: 39.1158, lng: -84.4938 }, // 1501 Eden Park Dr
    hints: [
      'Look for the special exhibit...',
      'Fungi that glow in the dark...',
      'The mushroom grid holds your next clue.'
    ],
    status: 'locked',
  },
  {
    id: 14,
    title: 'Stage 14',
    subtitle: 'The Glitch Tracker',
    location: 'Over-the-Rhine',
    time: '08:30 PM',
    description: 'Anomalies detected in the urban grid.',
    clue: 'Purify the glitches within the 15-meter radius.',
    unlockType: 'gps',
    unlockRadius: 15,
    coordinates: { lat: 39.1100, lng: -84.5150 }, // OTR neighborhood center
    hints: [
      'Something is wrong in OTR...',
      'Track down the anomalies...',
      'Get within 15 meters to purify.'
    ],
    status: 'locked',
  },
  {
    id: 15,
    title: 'Stage 15',
    subtitle: 'Protocol Omega',
    location: "Nicola's Ristorante",
    time: '09:45 PM',
    description: 'The final destination.',
    clue: 'All protocols converge at the final location.',
    unlockType: 'gps',
    unlockRadius: 30,
    coordinates: { lat: 39.1122, lng: -84.5106 }, // 1420 Sycamore St, OTR
    hints: [
      'The journey ends where celebrations begin...',
      'A place of fine dining...',
      'Nicola\'s awaits your arrival.'
    ],
    status: 'locked',
  },
];
