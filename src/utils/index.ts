export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function checkAnswer(userAnswer: string, correctAnswer: string, difficulty: 'easy' | 'normal' | 'hard'): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  if (difficulty === 'easy') {
    // For multiple choice, exact match
    return normalize(userAnswer) === normalize(correctAnswer);
  } else {
    // For text input, more flexible matching
    const userNormalized = normalize(userAnswer);
    const correctNormalized = normalize(correctAnswer);
    
    // Check if the key words are present
    const correctWords = correctNormalized.split(/\s+/);
    const userWords = userNormalized.split(/\s+/);
    
    // Simple scoring: if most key words are present, consider it correct
    const matchedWords = correctWords.filter(word => 
      word.length > 2 && userWords.some(userWord => 
        userWord.includes(word) || word.includes(userWord)
      )
    );
    
    return matchedWords.length >= Math.ceil(correctWords.length * 0.7);
  }
}