
export const FINNISH_REGIONS = {
  'Uusimaa': ['Helsinki', 'Espoo', 'Vantaa', 'Kauniainen', 'Kirkkonummi', 'Kerava', 'Järvenpää'],
  'Pirkanmaa': ['Tampere', 'Nokia', 'Ylöjärvi', 'Kangasala', 'Orivesi', 'Valkeakoski'],
  'Varsinais-Suomi': ['Turku', 'Kaarina', 'Naantali', 'Raisio', 'Salo', 'Loimaa'],
  'Pohjois-Pohjanmaa': ['Oulu', 'Kempele', 'Ii', 'Muhos', 'Tyrnävä', 'Liminka'],
  'Keski-Suomi': ['Jyväskylä', 'Äänekoski', 'Jämsä', 'Saarijärvi', 'Keuruu'],
  'Pohjois-Savo': ['Kuopio', 'Siilinjärvi', 'Iisalmi', 'Varkaus', 'Suonenjoki'],
  'Satakunta': ['Pori', 'Rauma', 'Ulvila', 'Kankaanpää', 'Harjavalta'],
  'Päijät-Häme': ['Lahti', 'Hollola', 'Heinola', 'Nastola', 'Sysmä'],
  'Kymenlaakso': ['Kotka', 'Kouvola', 'Hamina', 'Pyhtää'],
  'Lappi': ['Rovaniemi', 'Tornio', 'Kemi', 'Kemijärvi', 'Sodankylä']
};

export interface LocationData {
  region?: string;
  city?: string;
  confidence: number;
}

export function detectFinnishLocation(text: string): LocationData {
  const lowercaseText = text.toLowerCase();
  let bestMatch: LocationData = { confidence: 0 };
  
  // Check for cities and their regions
  Object.entries(FINNISH_REGIONS).forEach(([region, cities]) => {
    cities.forEach(city => {
      const cityLower = city.toLowerCase();
      if (lowercaseText.includes(cityLower)) {
        const confidence = cityLower.length / text.length; // Simple confidence based on match length
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            region,
            city,
            confidence: Math.min(confidence * 10, 1) // Scale up but cap at 1
          };
        }
      }
    });
    
    // Also check for region names directly
    const regionLower = region.toLowerCase();
    if (lowercaseText.includes(regionLower)) {
      const confidence = regionLower.length / text.length;
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          region,
          confidence: Math.min(confidence * 8, 1)
        };
      }
    }
  });
  
  return bestMatch;
}
