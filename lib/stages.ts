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
    description: 'Every story has a beginning. Ours started in the simplest place—where we built a life together, one moment at a time.',
    clue: 'Protocol initiated. Return to coordinates where SYSTEM.HOME was first established. Memory file 2012.01 awaits decryption.',
    unlockType: 'gps',
    unlockRadius: 200, // Increased for testing - adjust after field test
    coordinates: { lat: 39.1031, lng: -84.5120 }, // TODO: Update with your actual home address
    hints: [
      'The first checkpoint is always where you rest your head.',
      'Think about the place where we said "I love you" for the first time.',
      'Home. Our home. Start there.'
    ],
    status: 'active', // First stage starts active
  },
  {
    id: 2,
    title: 'Stage 02',
    subtitle: 'The Hive',
    location: 'Sleepy Bee Cafe',
    time: '09:30 AM',
    description: 'Sunday mornings, iced coffee, and conversations that lasted for hours. This is where we learned that breakfast could be a ritual, not just a meal.',
    clue: 'LOCATION: The place where lazy Sundays began. SCAN TARGET: The illuminated centerpiece that hangs above where we always sat.',
    unlockType: 'scan',
    coordinates: { lat: 39.1001217, lng: -84.5123038 }, // 8 E 4th St, Downtown Cincinnati
    hints: [
      'We came here every weekend when we first moved downtown.',
      'Look up—there\'s something hanging that caught your eye on our first visit.',
      'The chandelier at Sleepy Bee. Scan it.'
    ],
    status: 'locked',
  },
  {
    id: 3,
    title: 'Stage 03',
    subtitle: 'Virtual Radio',
    location: 'Covington Core',
    time: '11:30 AM',
    description: 'Static and noise, until suddenly—clarity. 2014 was the year everything changed. The year I realized you were the signal I\'d been searching for.',
    clue: 'Cross the river. RADIO FREQUENCY DETECTED. Tune to the year we moved in together. Format: 20XX.XX MHz. Decode the transmission.',
    unlockType: 'puzzle',
    coordinates: { lat: 39.0677, lng: -84.5164 }, // Downtown Covington, KY
    hints: [
      'The frequency corresponds to a year. A special year for us.',
      'Think about when we first moved in together. That year, in MHz format.',
      '2014 → 20.14 MHz. But wait... something\'s not quite right. Try 20.50 MHz.'
    ],
    status: 'locked',
  },
  {
    id: 4,
    title: 'Stage 04',
    subtitle: 'Gelato Dreams',
    location: 'Covington Core',
    time: '11:45 AM',
    description: 'Every adventure needs a moment of sweetness. Remember summer afternoons, trying every flavor, laughing at our indecision? Some memories taste like pistachio and salted caramel.',
    clue: 'MAINSTRASSE VILLAGE. Seek the Italian confectionery where summer lives year-round. COORDINATES: Riverside district. The sweet spot.',
    unlockType: 'gps',
    unlockRadius: 30,
    coordinates: { lat: 39.0872, lng: -84.5089 }, // Mainstrasse Village, Covington
    hints: [
      'We crossed the river for this. Something cold, something Italian.',
      'Mainstrasse Village. You always got pistachio. I always got something different.',
      'Gelato. The place with the striped awning. You know the one.'
    ],
    status: 'locked',
  },
  {
    id: 5,
    title: 'Stage 05',
    subtitle: 'Crystal Vision',
    location: 'Dimitridon Studios',
    time: '12:15 PM',
    description: 'Crystals hold energy, they say. Some for love, some for clarity, some for healing. You always believed in their power more than I did. But I believe in you, so I believe in them too.',
    clue: 'DIMITRIDON STUDIOS. Covington. SCAN TARGET: Two specific crystals. One for unconditional love (rose). One for joy and abundance (citrine). Find them. See them. Capture them.',
    unlockType: 'scan',
    coordinates: { lat: 39.0680, lng: -84.5120 }, // Covington area
    hints: [
      'A crystal shop in Covington. You dragged me there once, and I pretended not to be fascinated.',
      'Rose Quartz—pink, for love. Citrine—golden, for happiness. Look for both.',
      'Dimitridon Studios. Find the Rose Quartz and Citrine. Scan them together.'
    ],
    status: 'locked',
  },
  {
    id: 6,
    title: 'Stage 06',
    subtitle: 'The Bridge',
    location: 'Roebling Suspension Bridge',
    time: '01:00 PM',
    description: 'Every relationship is a bridge—a crossing between two separate shores, two lives, two hearts. This one spans water. Ours spans time. Walk it with me.',
    clue: 'ROEBLING SUSPENSION BRIDGE. The original connection. OBJECTIVE: Reach the midpoint. Stand where two states meet. Where Kentucky kisses Ohio. Where past meets present.',
    unlockType: 'gps',
    unlockRadius: 50,
    coordinates: { lat: 39.0953, lng: -84.5089 }, // Roebling Bridge midpoint
    hints: [
      'The blue suspension bridge. We\'ve walked it before, hand in hand.',
      'Start on one side, walk to the middle. Kentucky to Ohio. Or Ohio to Kentucky.',
      'Roebling Bridge. Center point. Where the cables converge overhead.'
    ],
    status: 'locked',
  },
  {
    id: 7,
    title: 'Stage 07',
    subtitle: 'Artifact Recovery',
    location: 'Cincinnati Art Museum',
    time: '02:00 PM',
    description: 'Free admission. Priceless memories. Quiet Sunday afternoons wandering galleries, pretending to understand modern art, actually understanding each other a little better with each visit.',
    clue: 'EDEN PARK. The museum on the hill. MISSION: Enter the galleries. You\'re not here for the paintings. You\'re here for what comes next. Just get inside. Proximity unlock.',
    unlockType: 'gps',
    unlockRadius: 100,
    coordinates: { lat: 39.1145, lng: -84.4968 }, // 953 Eden Park Dr
    hints: [
      'Eden Park. The art museum. Free to enter, like always.',
      'We\'ve been here dozens of times. You know the way.',
      'Cincinnati Art Museum. 953 Eden Park Drive. Just walk in the main entrance.'
    ],
    status: 'locked',
  },
  {
    id: 8,
    title: 'Stage 08',
    subtitle: 'Damascus Cipher',
    location: 'Cincinnati Art Museum',
    time: '02:30 PM',
    description: 'Like the folds in Damascus steel, our relationship has layers—strength through complexity, beauty through pattern, meaning woven into every line.',
    clue: 'CIPHER DETECTED: Examine Damascus steel artifact. Pattern contains geographic data. Decode waveform to extract next waypoint.',
    unlockType: 'puzzle',
    coordinates: { lat: 39.1145, lng: -84.4968 }, // Same as Stage 7
    hints: [
      'Damascus steel has a distinctive wavy pattern. Study it closely.',
      'The waves aren\'t random—they form shapes. Maybe... letters? Numbers?',
      'The pattern reveals coordinates. (Dev mode: Just complete the puzzle to proceed.)'
    ],
    status: 'locked',
  },
  {
    id: 9,
    title: 'Stage 09',
    subtitle: 'Museum Exit',
    location: 'Cincinnati Art Museum',
    time: '03:30 PM',
    description: 'Every gallery visit has an ending. But not every ending is final. The art stays behind. The memories come with us. Time to move forward.',
    clue: 'DEPARTURE PROTOCOL. Exit the museum. The next destination awaits. GEOFENCE: Leave the museum grounds. Movement detected = stage unlocked.',
    unlockType: 'gps',
    unlockRadius: 100,
    coordinates: { lat: 39.1145, lng: -84.4968 }, // Exit triggers nearby
    hints: [
      'You\'ve spent enough time with the art. It\'s time to go.',
      'Walk out the main entrance and head toward the parking lot.',
      'Just leave the museum. That\'s it. The app will detect your departure.'
    ],
    status: 'locked',
  },
  {
    id: 10,
    title: 'Stage 10',
    subtitle: 'The 420 Protocol',
    location: 'The Landing',
    time: '04:20 PM',
    description: 'Sometimes the path gets hazy. Sometimes we need to pause, breathe, recalibrate. Clear the fog. Find clarity. 4:20—not just a time, but a moment of perspective.',
    clue: 'THE LANDING. 4029 Smith Road. Riverside coordinates. SCAN OBJECTIVE: VPS marker at riverfront. Clear the visual interference. Purify the signal. Engage scanning protocol.',
    unlockType: 'scan',
    coordinates: { lat: 39.1515, lng: -84.4460 }, // 4029 Smith Rd
    hints: [
      'The Landing. By the river. You know this place—we\'ve been here before.',
      'Look for something to scan. A marker. A sign. Something that stands out.',
      'Use the scan function when you get there. Trust the app. It knows what to look for.'
    ],
    status: 'locked',
  },
  {
    id: 11,
    title: 'Stage 11',
    subtitle: 'Safe House',
    location: 'Home',
    time: '05:00 PM',
    description: 'Even the longest journeys need a moment to breathe. Come home. Rest. The night is still young, and the best is yet to come.',
    clue: 'RECHARGE PROTOCOL ACTIVE. Return to SYSTEM.HOME at 17:00. Locate vintage pharmacist bottle in honor system area. Enter coordinates found within.',
    unlockType: 'time',
    coordinates: { lat: 39.1031, lng: -84.5120 }, // TODO: Update with your actual home address
    hints: [
      'You can\'t proceed until 5:00 PM. Take a break. Have a snack. Recharge.',
      'When it\'s time, look in our honor system area—where we leave little surprises for each other.',
      'The vintage pharmacist bottle. Inside are coordinates. Enter them to unlock the next stage.'
    ],
    status: 'locked',
  },
  {
    id: 12,
    title: 'Stage 12',
    subtitle: 'The Master Builder',
    location: 'Art of the Brick',
    time: '06:00 PM',
    description: 'We\'ve built something together, haven\'t we? Brick by brick, moment by moment, a life made of small pieces that somehow became something beautiful.',
    clue: 'DOWNTOWN. West 4th Street. LEGO exhibition. Seek the masterwork—the piece that took millions of bricks to create. Art from childhood toys. Magic from patience.',
    unlockType: 'gps',
    unlockRadius: 75,
    coordinates: { lat: 39.1000, lng: -84.5120 }, // 18 W 4th St, Downtown
    hints: [
      'Remember when we talked about seeing this exhibit? It\'s finally here.',
      'Art made from LEGO. Downtown. Near where we had brunch earlier.',
      'Art of the Brick. 18 West 4th Street. Find the most intricate sculpture.'
    ],
    status: 'locked',
  },
  {
    id: 13,
    title: 'Stage 13',
    subtitle: 'Fungal Glow',
    location: 'Krohn Conservatory',
    time: '07:15 PM',
    description: 'Even in darkness, there is light. Even in winter, there is growth. The mushrooms glow not because they must, but because they can—like love.',
    clue: 'EDEN PARK. Glass structure. Seek the bioluminescent exhibit. SCAN TARGET: The mushroom grid—proof that even in darkness, nature finds a way to shine.',
    unlockType: 'scan',
    coordinates: { lat: 39.1158, lng: -84.4938 }, // 1501 Eden Park Dr
    hints: [
      'We\'ve been here before, haven\'t we? In Eden Park. The conservatory.',
      'There\'s a special exhibit with glowing mushrooms. It\'s otherworldly.',
      'Krohn Conservatory. Find and scan the bioluminescent mushroom display.'
    ],
    status: 'locked',
  },
  {
    id: 14,
    title: 'Stage 14',
    subtitle: 'The Glitch Tracker',
    location: 'Over-the-Rhine',
    time: '08:30 PM',
    description: 'Not all who wander are lost. Sometimes we\'re just recalibrating. Finding our signal in the noise. Purifying the glitches so we can see what really matters.',
    clue: 'ANOMALY ALERT: Over-the-Rhine grid corruption detected. Navigate to central OTR coordinates. PROXIMITY REQUIRED: 15-meter radius for purification protocol.',
    unlockType: 'gps',
    unlockRadius: 15,
    coordinates: { lat: 39.1100, lng: -84.5150 }, // OTR neighborhood center
    hints: [
      'Head to the heart of Over-the-Rhine. The exact spot doesn\'t matter—just get close.',
      'This is more about the journey through OTR than a specific destination.',
      'Anywhere in central OTR will work. Just navigate through the neighborhood at night.'
    ],
    status: 'locked',
  },
  {
    id: 15,
    title: 'Stage 15',
    subtitle: 'Protocol Omega',
    location: "Nicola's Ristorante",
    time: '09:45 PM',
    description: 'Fourteen years. Fifteen stages. One journey. And here we are, at the end and the beginning, where every story worth telling deserves to be celebrated.',
    clue: 'FINAL PROTOCOL: Over-the-Rhine. Sycamore Street. Where fine wine flows and candles flicker. Where this story reaches its conclusion—or perhaps, its next chapter.',
    unlockType: 'gps',
    unlockRadius: 30,
    coordinates: { lat: 39.1122, lng: -84.5106 }, // 1420 Sycamore St, OTR
    hints: [
      'Our favorite place for special occasions. The one that never disappoints.',
      'Italian. Romantic. In OTR. You know this place.',
      'Nicola\'s. 1420 Sycamore. I\'ll be waiting.'
    ],
    status: 'locked',
  },
];
