export type OpenAIResponse = {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type OpenAIError = {
  type: 'api_error' | 'rate_limit' | 'timeout' | 'validation' | 'unknown';
  message: string;
  code?: string;
  param?: string;
};

export type GenerationResult = {
  success: boolean;
  data?: OpenAIResponse;
  error?: OpenAIError;
}; 