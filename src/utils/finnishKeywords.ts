
const FINNISH_STOPWORDS = [
  'että', 'olla', 'se', 'hän', 'ja', 'tämä', 'kun', 'niin', 'kuin', 'jos', 
  'ei', 'ole', 'saada', 'minä', 'sinä', 'hän', 'me', 'te', 'he', 'on', 
  'en', 'et', 'emme', 'ette', 'eivät', 'oli', 'olit', 'olimme', 'olitte', 
  'olivat', 'olen', 'olet', 'olemme', 'olette', 'ovat', 'mutta', 'tai', 
  'sekä', 'vaan', 'kuitenkin', 'siis', 'eli', 'myös', 'vielä', 'jo', 
  'aina', 'koskaan', 'joskus', 'nyt', 'sitten', 'ensin', 'vihdoin'
];

export interface FinnishKeyword {
  keyword: string;
  relevance: number;
  isCompound?: boolean;
}

export function extractFinnishKeywords(text: string, originalKeyword: string): FinnishKeyword[] {
  const words = text.toLowerCase()
    .replace(/[^\wäöå\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !FINNISH_STOPWORDS.includes(word));
  
  // Count word frequency
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Detect compound words (words longer than 10 characters are likely compounds in Finnish)
  const compoundWords = words.filter(word => word.length > 10);
  
  // Calculate relevance scores
  const keywordResults = Object.entries(wordCount)
    .map(([word, count]) => {
      let relevance = count / words.length;
      
      // Boost relevance for words related to original keyword
      if (word.includes(originalKeyword.toLowerCase()) || originalKeyword.toLowerCase().includes(word)) {
        relevance *= 2.5;
      }
      
      // Boost compound words as they're often more specific
      const isCompound = compoundWords.includes(word);
      if (isCompound) {
        relevance *= 1.5;
      }
      
      return { keyword: word, relevance, isCompound };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 15);
  
  return keywordResults;
}

export function detectLanguage(text: string): 'fi' | 'sv' | 'en' {
  const finnishIndicators = ['että', 'olla', 'hän', 'minä', 'sinä', 'kuitenkin', 'siis'];
  const swedishIndicators = ['att', 'och', 'är', 'jag', 'du', 'han', 'hon'];
  const englishIndicators = ['the', 'and', 'is', 'are', 'that', 'this', 'with'];
  
  const lowercaseText = text.toLowerCase();
  
  const finnishScore = finnishIndicators.filter(word => lowercaseText.includes(word)).length;
  const swedishScore = swedishIndicators.filter(word => lowercaseText.includes(word)).length;
  const englishScore = englishIndicators.filter(word => lowercaseText.includes(word)).length;
  
  if (finnishScore >= swedishScore && finnishScore >= englishScore) {
    return 'fi';
  } else if (swedishScore >= englishScore) {
    return 'sv';
  } else {
    return 'en';
  }
}
