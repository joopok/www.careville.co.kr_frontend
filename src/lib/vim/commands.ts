import { VimState, VimPosition, VimCommand } from './types';
import { RegisterManager } from './registers';
import { MotionParser, TextBuffer } from './motions';

export class CommandProcessor {
  private registerManager: RegisterManager;
  private motionParser: MotionParser;
  private buffer: TextBuffer;
  private pendingKeys: string = '';
  private currentRegister: string | null = null;

  constructor(buffer: TextBuffer, registerManager: RegisterManager) {
    this.buffer = buffer;
    this.registerManager = registerManager;
    this.motionParser = new MotionParser(buffer);
  }

  processKey(key: string, state: VimState): VimState | null {
    this.pendingKeys += key;

    // Handle register selection
    if (this.pendingKeys === '"') {
      return state; // Wait for register name
    }

    if (this.pendingKeys.startsWith('"') && this.pendingKeys.length === 2) {
      this.currentRegister = this.pendingKeys[1];
      this.pendingKeys = '';
      return state;
    }

    // Parse command
    const command = this.parseCommand(this.pendingKeys);
    if (!command) {
      if (this.pendingKeys.length > 3) {
        // Invalid command, reset
        this.pendingKeys = '';
        this.currentRegister = null;
      }
      return state;
    }

    // Execute command
    const newState = this.executeCommand(command, state);
    this.pendingKeys = '';
    this.currentRegister = null;
    return newState;
  }

  private parseCommand(keys: string): VimCommand | null {
    // Extract count
    let count = 0;
    let idx = 0;
    while (idx < keys.length && /\d/.test(keys[idx])) {
      count = count * 10 + parseInt(keys[idx], 10);
      idx++;
    }
    count = count || 1;

    const remaining = keys.slice(idx);

    // Yank commands
    if (remaining === 'yy') {
      return {
        operator: 'y',
        motion: { type: 'line', count: 1, inclusive: true },
        register: this.currentRegister || '"',
        count,
        raw: keys
      };
    }

    if (remaining.startsWith('y')) {
      const motionKeys = remaining.slice(1);
      const motion = this.motionParser.parseMotion(motionKeys, { line: 0, column: 0 });
      if (motion) {
        return {
          operator: 'y',
          motion,
          register: this.currentRegister || '"',
          count,
          raw: keys
        };
      }
    }

    // Paste commands
    if (remaining === 'p' || remaining === 'P') {
      return {
        operator: remaining,
        register: this.currentRegister || '"',
        count,
        raw: keys
      };
    }

    // Delete commands (also yank)
    if (remaining === 'dd') {
      return {
        operator: 'd',
        motion: { type: 'line', count: 1, inclusive: true },
        register: this.currentRegister || '"',
        count,
        raw: keys
      };
    }

    if (remaining.startsWith('d')) {
      const motionKeys = remaining.slice(1);
      const motion = this.motionParser.parseMotion(motionKeys, { line: 0, column: 0 });
      if (motion) {
        return {
          operator: 'd',
          motion,
          register: this.currentRegister || '"',
          count,
          raw: keys
        };
      }
    }

    // Change commands (also yank)
    if (remaining === 'cc') {
      return {
        operator: 'c',
        motion: { type: 'line', count: 1, inclusive: true },
        register: this.currentRegister || '"',
        count,
        raw: keys
      };
    }

    if (remaining.startsWith('c')) {
      const motionKeys = remaining.slice(1);
      const motion = this.motionParser.parseMotion(motionKeys, { line: 0, column: 0 });
      if (motion) {
        return {
          operator: 'c',
          motion,
          register: this.currentRegister || '"',
          count,
          raw: keys
        };
      }
    }

    return null;
  }

  private executeCommand(command: VimCommand, state: VimState): VimState {
    const newState = { ...state };

    switch (command.operator) {
      case 'y':
        return this.executeYank(command, newState);
      case 'd':
        return this.executeDelete(command, newState);
      case 'c':
        return this.executeChange(command, newState);
      case 'p':
      case 'P':
        return this.executePaste(command, newState);
      default:
        return newState;
    }
  }

  private executeYank(command: VimCommand, state: VimState): VimState {
    if (!command.motion) return state;

    const start = state.position;
    const end = this.motionParser.calculateMotionEnd(start, command.motion);
    const isLinewise = command.motion.type === 'line';
    const text = this.motionParser.getTextForMotion(start, end, isLinewise);

    this.registerManager.set(command.register || '"', text, isLinewise);

    return {
      ...state,
      lastCommand: command.raw
    };
  }

  private executeDelete(command: VimCommand, state: VimState): VimState {
    if (!command.motion) return state;

    const start = state.position;
    const end = this.motionParser.calculateMotionEnd(start, command.motion);
    const isLinewise = command.motion.type === 'line';
    const text = this.motionParser.getTextForMotion(start, end, isLinewise);

    // Yank deleted text
    this.registerManager.set(command.register || '"', text, isLinewise);

    // Delete would happen here in a real implementation
    // For now, we just update the state
    return {
      ...state,
      lastCommand: command.raw
    };
  }

  private executeChange(command: VimCommand, state: VimState): VimState {
    if (!command.motion) return state;

    const start = state.position;
    const end = this.motionParser.calculateMotionEnd(start, command.motion);
    const isLinewise = command.motion.type === 'line';
    const text = this.motionParser.getTextForMotion(start, end, isLinewise);

    // Yank changed text
    this.registerManager.set(command.register || '"', text, isLinewise);

    // Enter insert mode
    return {
      ...state,
      mode: 'insert',
      lastCommand: command.raw
    };
  }

  private executePaste(command: VimCommand, state: VimState): VimState {
    const register = this.registerManager.get(command.register || '"');
    if (!register) return state;

    // Calculate paste position
    let pastePosition = state.position;
    if (command.operator === 'p') {
      // Paste after cursor
      if (register.isLinewise) {
        pastePosition = { line: state.position.line + 1, column: 0 };
      } else {
        pastePosition = { line: state.position.line, column: state.position.column + 1 };
      }
    } else {
      // Paste before cursor (P)
      if (register.isLinewise) {
        pastePosition = { line: state.position.line, column: 0 };
      }
    }

    // Actual paste would happen here in a real implementation
    // For now, we just update the state
    return {
      ...state,
      lastCommand: command.raw
    };
  }

  reset(): void {
    this.pendingKeys = '';
    this.currentRegister = null;
  }
}