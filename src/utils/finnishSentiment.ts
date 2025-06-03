
export interface FinnishSentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  intensity: number;
}

const POSITIVE_WORDS = [
  'hyvä', 'loistava', 'mahtava', 'upea', 'erinomainen', 'fantastinen', 
  'sairaan hyvä', 'huippu', 'kova', 'siisti', 'mukava', 'kaunis', 
  'ihana', 'täydellinen', 'hienoa', 'positiivinen', 'onnellinen'
];

const NEGATIVE_WORDS = [
  'huono', 'kamala', 'hirveä', 'syvältä', 'paska', 'kurja', 'perseestä', 
  'älytön', 'typerä', 'säälittävä', 'ikävä', 'väärä', 'vaikea', 
  'surullinen', 'vihainen', 'pettynyt', 'harmillinen'
];

const EMOTION_WORDS = {
  suru: ['surullinen', 'murhe', 'suru', 'itku', 'menetys', 'kaiho'],
  ilo: ['iloinen', 'onnellinen', 'riemu', 'nauru', 'hymy', 'riemastus'],
  viha: ['vihainen', 'suuttunut', 'raivo', 'ärsyttää', 'kiukku', 'ärtymys'],
  pelko: ['pelko', 'pelottaa', 'kauhu', 'jännitys', 'huoli', 'ahdistus'],
  yllätys: ['yllätys', 'hämmästys', 'ihme', 'uskomaton', 'odottamaton'],
  inho: ['inho', 'vastenmielinen', 'kuvottava', 'iljettävä', 'ruma']
};

const INTENSIFIERS = ['sika', 'tosi', 'ihan', 'aivan', 'helvetin', 'saatanan', 'todella', 'erittäin', 'hyvin'];

export function analyzeFinnishSentiment(text: string): FinnishSentimentResult {
  const lowercaseText = text.toLowerCase();
  const words = lowercaseText.split(/\s+/);
  
  let positiveScore = 0;
  let negativeScore = 0;
  let intensityMultiplier = 1;
  const detectedEmotions: string[] = [];
  
  // Check for intensifiers first
  INTENSIFIERS.forEach(intensifier => {
    if (lowercaseText.includes(intensifier)) {
      intensityMultiplier += 0.3;
    }
  });
  
  // Count positive words
  POSITIVE_WORDS.forEach(word => {
    const occurrences = (lowercaseText.match(new RegExp(word, 'g')) || []).length;
    positiveScore += occurrences;
  });
  
  // Count negative words
  NEGATIVE_WORDS.forEach(word => {
    const occurrences = (lowercaseText.match(new RegExp(word, 'g')) || []).length;
    negativeScore += occurrences;
  });
  
  // Detect emotions
  Object.entries(EMOTION_WORDS).forEach(([emotion, emotionWords]) => {
    const hasEmotion = emotionWords.some(word => lowercaseText.includes(word));
    if (hasEmotion) {
      detectedEmotions.push(emotion);
    }
  });
  
  // Apply intensity multiplier
  positiveScore *= intensityMultiplier;
  negativeScore *= intensityMultiplier;
  
  // Determine sentiment
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0.5;
  
  if (positiveScore > negativeScore) {
    sentiment = 'positive';
    confidence = Math.min(0.95, 0.5 + (positiveScore - negativeScore) * 0.1);
  } else if (negativeScore > positiveScore) {
    sentiment = 'negative';
    confidence = Math.min(0.95, 0.5 + (negativeScore - positiveScore) * 0.1);
  }
  
  return {
    sentiment,
    confidence,
    emotions: detectedEmotions,
    intensity: intensityMultiplier
  };
}
