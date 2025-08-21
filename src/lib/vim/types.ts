export type VimMode = 'normal' | 'insert' | 'visual' | 'visual-line' | 'visual-block' | 'command';

export interface VimRegister {
  content: string;
  isLinewise: boolean;
}

export interface VimRegisters {
  unnamed: VimRegister;
  named: Record<string, VimRegister>;
  numbered: VimRegister[];
  readonly: Record<string, VimRegister>;
}

export interface VimPosition {
  line: number;
  column: number;
}

export interface VimSelection {
  start: VimPosition;
  end: VimPosition;
  mode: 'char' | 'line' | 'block';
}

export interface VimState {
  mode: VimMode;
  position: VimPosition;
  selection: VimSelection | null;
  registers: VimRegisters;
  lastCommand: string;
  count: number;
  pendingOperator: string | null;
  searchPattern: string;
  marks: Record<string, VimPosition>;
}

export interface VimMotion {
  type: 'char' | 'line' | 'word' | 'paragraph' | 'document';
  count: number;
  inclusive: boolean;
}

export interface VimCommand {
  operator: string;
  motion?: VimMotion;
  register?: string;
  count: number;
  raw: string;
}

export type VimKeyHandler = (key: string, state: VimState) => VimState | null;