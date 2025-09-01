export interface PanchangData {
  date: Date
  tithi: {
    name: string
    lord: string
    endTime: Date
  }
  nakshatra: {
    name: string
    lord: string
    endTime: Date
  }
  yoga: {
    name: string
    endTime: Date
  }
  karana: {
    name: string
    endTime: Date
  }
  sunrise: Date
  sunset: Date
  moonrise: Date
  moonset: Date
  rahu: {
    start: Date
    end: Date
  }
  gulika: {
    start: Date
    end: Date
  }
  yamaganda: {
    start: Date
    end: Date
  }
}

const TITHIS = [
  'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
]

const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu' },
  { name: 'Bharani', lord: 'Venus' },
  { name: 'Krittika', lord: 'Sun' },
  { name: 'Rohini', lord: 'Moon' },
  { name: 'Mrigashira', lord: 'Mars' },
  { name: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', lord: 'Jupiter' },
  { name: 'Pushya', lord: 'Saturn' },
  { name: 'Ashlesha', lord: 'Mercury' },
  { name: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', lord: 'Venus' },
  { name: 'Uttara Phalguni', lord: 'Sun' },
  { name: 'Hasta', lord: 'Moon' },
  { name: 'Chitra', lord: 'Mars' },
  { name: 'Swati', lord: 'Rahu' },
  { name: 'Vishakha', lord: 'Jupiter' },
  { name: 'Anuradha', lord: 'Saturn' },
  { name: 'Jyeshtha', lord: 'Mercury' },
  { name: 'Mula', lord: 'Ketu' },
  { name: 'Purva Ashadha', lord: 'Venus' },
  { name: 'Uttara Ashadha', lord: 'Sun' },
  { name: 'Shravana', lord: 'Moon' },
  { name: 'Dhanishtha', lord: 'Mars' },
  { name: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati', lord: 'Mercury' }
]

const YOGAS = [
  'Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
]

const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada',
  'Naga', 'Kimstughna'
]

export async function calculatePanchang(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string = 'Asia/Kolkata'
): Promise<PanchangData> {
  // Mock calculation - in production, this would use precise astronomical calculations
  const sunLongitude = ((date.getTime() / (1000 * 60 * 60 * 24)) % 365.25) * 360 / 365.25
  const moonLongitude = ((date.getTime() / (1000 * 60 * 60 * 24 * 29.53)) % 1) * 360
  
  // Calculate Tithi (lunar day)
  const tithiIndex = Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 12)
  const tithi = TITHIS[Math.min(tithiIndex, TITHIS.length - 1)]
  
  // Calculate Nakshatra
  const nakshatraIndex = Math.floor((moonLongitude % 360) / (360 / 27))
  const nakshatra = NAKSHATRAS[nakshatraIndex]
  
  // Calculate Yoga
  const yogaIndex = Math.floor(((sunLongitude + moonLongitude) % 360) / (360 / 27))
  const yoga = YOGAS[yogaIndex % YOGAS.length]
  
  // Calculate Karana
  const karanaIndex = Math.floor(((moonLongitude - sunLongitude + 360) % 360) / 6) % 60
  const karana = KARANAS[Math.min(karanaIndex % 7, KARANAS.length - 1)]
  
  // Calculate sunrise/sunset times (simplified)
  const sunrise = new Date(date)
  sunrise.setHours(6, 0, 0, 0)
  
  const sunset = new Date(date)
  sunset.setHours(18, 0, 0, 0)
  
  const moonrise = new Date(date)
  moonrise.setHours(19, 30, 0, 0)
  
  const moonset = new Date(date)
  moonset.setHours(7, 30, 0, 0)
  
  // Calculate inauspicious times
  const dayDuration = sunset.getTime() - sunrise.getTime()
  const oneEighth = dayDuration / 8
  
  const rahu = {
    start: new Date(sunrise.getTime() + oneEighth * 7),
    end: new Date(sunrise.getTime() + oneEighth * 8)
  }
  
  const gulika = {
    start: new Date(sunrise.getTime() + oneEighth * 6),
    end: new Date(sunrise.getTime() + oneEighth * 7)
  }
  
  const yamaganda = {
    start: new Date(sunrise.getTime() + oneEighth * 4),
    end: new Date(sunrise.getTime() + oneEighth * 5)
  }
  
  return {
    date,
    tithi: {
      name: tithi,
      lord: 'Moon', // Simplified
      endTime: new Date(date.getTime() + 24 * 60 * 60 * 1000)
    },
    nakshatra: {
      name: nakshatra.name,
      lord: nakshatra.lord,
      endTime: new Date(date.getTime() + 24 * 60 * 60 * 1000)
    },
    yoga: {
      name: yoga,
      endTime: new Date(date.getTime() + 24 * 60 * 60 * 1000)
    },
    karana: {
      name: karana,
      endTime: new Date(date.getTime() + 12 * 60 * 60 * 1000)
    },
    sunrise,
    sunset,
    moonrise,
    moonset,
    rahu,
    gulika,
    yamaganda
  }
}

export function getPanchangInterpretation(panchang: PanchangData): {
  tithi: string
  nakshatra: string
  yoga: string
  karana: string
  overall: string
} {
  return {
    tithi: `${panchang.tithi.name} is ruled by ${panchang.tithi.lord}`,
    nakshatra: `${panchang.nakshatra.name} nakshatra brings the influence of ${panchang.nakshatra.lord}`,
    yoga: `${panchang.yoga.name} yoga influences the day's activities`,
    karana: `${panchang.karana.name} karana affects the first half of the lunar day`,
    overall: 'A balanced day with mixed influences from various cosmic factors'
  }
}