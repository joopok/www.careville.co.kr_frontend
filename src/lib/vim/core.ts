import { VimState, VimMode, VimPosition, VimSelection } from './types';
import { RegisterManager } from './registers';
import { CommandProcessor } from './commands';
import { TextBuffer } from './motions';

export class VimCore {
  private state: VimState;
  private registerManager: RegisterManager;
  private commandProcessor: CommandProcessor;
  private buffer: TextBuffer;
  private visualStartPosition: VimPosition | null = null;

  constructor(buffer: TextBuffer) {
    this.buffer = buffer;
    this.registerManager = new RegisterManager();
    this.commandProcessor = new CommandProcessor(buffer, this.registerManager);
    this.state = this.initializeState();
  }

  private initializeState(): VimState {
    return {
      mode: 'normal',
      position: { line: 0, column: 0 },
      selection: null,
      registers: this.registerManager.getAll(),
      lastCommand: '',
      count: 0,
      pendingOperator: null,
      searchPattern: '',
      marks: {}
    };
  }

  handleKey(key: string): VimState {
    // Handle mode transitions
    if (this.state.mode === 'insert') {
      return this.handleInsertMode(key);
    } else if (this.state.mode === 'visual' || this.state.mode === 'visual-line') {
      return this.handleVisualMode(key);
    } else if (this.state.mode === 'normal') {
      return this.handleNormalMode(key);
    }

    return this.state;
  }

  private handleNormalMode(key: string): VimState {
    // Mode changes
    if (key === 'i') {
      return this.enterInsertMode();
    } else if (key === 'v') {
      return this.enterVisualMode('visual');
    } else if (key === 'V') {
      return this.enterVisualMode('visual-line');
    } else if (key === 'Escape') {
      this.commandProcessor.reset();
      return this.state;
    }

    // Process vim commands
    const newState = this.commandProcessor.processKey(key, this.state);
    if (newState) {
      this.state = newState;
    }

    return this.state;
  }

  private handleInsertMode(key: string): VimState {
    if (key === 'Escape') {
      return this.enterNormalMode();
    }
    // In insert mode, keys would normally be inserted into the buffer
    return this.state;
  }

  private handleVisualMode(key: string): VimState {
    if (key === 'Escape') {
      return this.enterNormalMode();
    }

    // Handle yank in visual mode
    if (key === 'y') {
      return this.yankVisualSelection();
    }

    // Handle delete in visual mode
    if (key === 'd' || key === 'x') {
      return this.deleteVisualSelection();
    }

    // Handle change in visual mode
    if (key === 'c') {
      return this.changeVisualSelection();
    }

    // Movement keys update selection
    this.updateVisualSelection(key);

    return this.state;
  }

  private enterInsertMode(): VimState {
    this.state = {
      ...this.state,
      mode: 'insert'
    };
    return this.state;
  }

  private enterNormalMode(): VimState {
    this.state = {
      ...this.state,
      mode: 'normal',
      selection: null
    };
    this.visualStartPosition = null;
    return this.state;
  }

  private enterVisualMode(mode: 'visual' | 'visual-line'): VimState {
    this.visualStartPosition = { ...this.state.position };
    this.state = {
      ...this.state,
      mode,
      selection: {
        start: { ...this.state.position },
        end: { ...this.state.position },
        mode: mode === 'visual-line' ? 'line' : 'char'
      }
    };
    return this.state;
  }

  private updateVisualSelection(key: string): void {
    if (!this.state.selection || !this.visualStartPosition) return;

    // Update position based on movement key
    let newPosition = { ...this.state.position };
    
    switch (key) {
      case 'h':
        newPosition.column = Math.max(0, newPosition.column - 1);
        break;
      case 'l':
        newPosition.column = newPosition.column + 1;
        break;
      case 'j':
        newPosition.line = newPosition.line + 1;
        break;
      case 'k':
        newPosition.line = Math.max(0, newPosition.line - 1);
        break;
    }

    this.state = {
      ...this.state,
      position: newPosition,
      selection: {
        start: this.visualStartPosition,
        end: newPosition,
        mode: this.state.selection.mode
      }
    };
  }

  private yankVisualSelection(): VimState {
    if (!this.state.selection) return this.state;

    const { start, end } = this.normalizeSelection(this.state.selection);
    const isLinewise = this.state.mode === 'visual-line';
    const text = this.getSelectedText(start, end, isLinewise);

    this.registerManager.set('"', text, isLinewise);

    return this.enterNormalMode();
  }

  private deleteVisualSelection(): VimState {
    if (!this.state.selection) return this.state;

    const { start, end } = this.normalizeSelection(this.state.selection);
    const isLinewise = this.state.mode === 'visual-line';
    const text = this.getSelectedText(start, end, isLinewise);

    this.registerManager.set('"', text, isLinewise);

    // Delete would happen here in a real implementation
    return this.enterNormalMode();
  }

  private changeVisualSelection(): VimState {
    if (!this.state.selection) return this.state;

    const { start, end } = this.normalizeSelection(this.state.selection);
    const isLinewise = this.state.mode === 'visual-line';
    const text = this.getSelectedText(start, end, isLinewise);

    this.registerManager.set('"', text, isLinewise);

    // Delete and enter insert mode
    return this.enterInsertMode();
  }

  private normalizeSelection(selection: VimSelection): { start: VimPosition; end: VimPosition } {
    const { start, end } = selection;
    
    if (start.line < end.line || (start.line === end.line && start.column <= end.column)) {
      return { start, end };
    } else {
      return { start: end, end: start };
    }
  }

  private getSelectedText(start: VimPosition, end: VimPosition, isLinewise: boolean): string {
    if (isLinewise) {
      const lines = [];
      for (let i = Math.min(start.line, end.line); i <= Math.max(start.line, end.line); i++) {
        lines.push(this.buffer.getLine(i));
      }
      return lines.join('\n');
    } else {
      return this.buffer.getText(start, end);
    }
  }

  getState(): VimState {
    return this.state;
  }

  getRegisters(): RegisterManager {
    return this.registerManager;
  }
}