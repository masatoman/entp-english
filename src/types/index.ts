export type Category = 
  | 'basic-grammar'
  | 'tenses' 
  | 'modals'
  | 'passive'
  | 'relative'
  | 'subjunctive'
  | 'comparison'
  | 'participle'
  | 'infinitive';

export interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}