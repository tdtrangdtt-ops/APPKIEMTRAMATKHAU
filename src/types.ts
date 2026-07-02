export interface Planet {
  id: string;
  name: string;
  englishName: string;
  diameter: number; // in km
  mass: string; // in kg (scientific notation e.g. 5.97e24)
  gravity: number; // m/s^2
  dayDuration: number; // Earth days or hours
  orbitRadius: number; // relative size for canvas
  orbitSpeed: number; // speed coefficient
  color: string;
  secondaryColor?: string;
  description: string;
  funFact: string;
  arDetails: {
    coreTemperature: string;
    atmosphere: string;
    moonsCount: number;
    yearDuration: string;
  };
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  activePlanet: string;
  gazeX: number; // simulated interactive focal point on canvas
  gazeY: number;
  attentionRate: number; // percentage (dynamic)
  flashcardsCollected: number;
  connected: boolean;
  quizAnswers: { [quizId: string]: number }; // questionIndex -> selectedOptionIndex
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SystemInstructionParams {
  grade: number;
  mainFocus: string;
  pedagogicalFramework: string;
  narratorVoice: string;
}

export interface LessonPlan {
  title: string;
  objectives: string[];
  arSequence: {
    step: string;
    action: string;
    dialogue: string;
  }[];
  assessment: string[];
}
