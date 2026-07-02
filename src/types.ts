export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  criteria: string;
}

export interface CrackMethod {
  id: string;
  name: string;
  timeToCrack: string;
  description: string;
  iconName: string;
  isVulnerable: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface SensitivePattern {
  name: string;
  detected: boolean;
  reason: string;
  suggestion: string;
}
