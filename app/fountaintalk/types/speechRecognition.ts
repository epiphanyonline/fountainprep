export type SpeechRecognitionAlternativeLike = {
  transcript: string;
  confidence?: number;
};

export type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;

  [index: number]: SpeechRecognitionAlternativeLike;
};

export type SpeechRecognitionResultListLike = {
  length: number;

  [index: number]: SpeechRecognitionResultLike;
};

export type SpeechRecognitionEventLike = {
  results: SpeechRecognitionResultListLike;
};

export type SpeechRecognitionErrorEventLike = {
  error: string;
  message?: string;
};

export interface SpeechRecognitionLike {
  lang: string;

  continuous: boolean;

  interimResults: boolean;

  maxAlternatives: number;

  start(): void;

  stop(): void;

  abort(): void;

  onaudiostart: (() => void) | null;

  onaudioend: (() => void) | null;

  onsoundstart: (() => void) | null;

  onsoundend: (() => void) | null;

  onspeechstart: (() => void) | null;

  onspeechend: (() => void) | null;

  onstart: (() => void) | null;

  onend: (() => void) | null;

  onresult:
    | ((
        event: SpeechRecognitionEventLike
      ) => void)
    | null;

  onerror:
    | ((
        event: SpeechRecognitionErrorEventLike
      ) => void)
    | null;

  onnomatch: (() => void) | null;
}

export interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}