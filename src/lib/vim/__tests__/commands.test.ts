import { describe, it, expect, beforeEach } from 'vitest';
import { CommandProcessor } from '../commands';
import { RegisterManager } from '../registers';
import { TextBuffer } from '../motions';
import { VimState } from '../types';

class MockTextBuffer implements TextBuffer {
  private lines: string[] = [
    'First line of text',
    'Second line here',
    'Third line content',
    'Fourth line text',
    'Fifth and final line'
  ];

  getLine(lineNumber: number): string {
    return this.lines[lineNumber] || '';
  }

  getLineCount(): number {
    return this.lines.length;
  }

  getText(start: any, end: any): string {
    if (start.line === end.line) {
      const line = this.lines[start.line];
      return line.substring(start.column, end.column + 1);
    }
    
    let result = '';
    for (let i = start.line; i <= end.line; i++) {
      if (i === start.line) {
        result += this.lines[i].substring(start.column);
      } else if (i === end.line) {
        result += '\n' + this.lines[i].substring(0, end.column + 1);
      } else {
        result += '\n' + this.lines[i];
      }
    }
    return result;
  }
}

describe('CommandProcessor', () => {
  let processor: CommandProcessor;
  let registerManager: RegisterManager;
  let buffer: TextBuffer;
  let initialState: VimState;

  beforeEach(() => {
    buffer = new MockTextBuffer();
    registerManager = new RegisterManager();
    processor = new CommandProcessor(buffer, registerManager);
    
    initialState = {
      mode: 'normal',
      position: { line: 1, column: 0 },
      selection: null,
      registers: registerManager.getAll(),
      lastCommand: '',
      count: 0,
      pendingOperator: null,
      searchPattern: '',
      marks: {}
    };
  });

  describe('yank commands', () => {
    it('should handle yy (yank line)', () => {
      const result = processor.processKey('y', initialState);
      expect(result).toBe(initialState); // Waiting for second 'y'
      
      const finalResult = processor.processKey('y', initialState);
      expect(finalResult?.lastCommand).toBe('yy');
      expect(registerManager.get('"')?.content).toBe('Second line here');
      expect(registerManager.get('"')?.isLinewise).toBe(true);
    });

    it('should handle yw (yank word)', () => {
      processor.processKey('y', initialState);
      const result = processor.processKey('w', initialState);
      expect(result?.lastCommand).toBe('yw');
      expect(registerManager.get('"')?.content).toBeTruthy();
    });

    it('should handle count with yank', () => {
      processor.processKey('3', initialState);
      processor.processKey('y', initialState);
      const result = processor.processKey('y', initialState);
      expect(result?.lastCommand).toBe('3yy');
    });
  });

  describe('register selection', () => {
    it('should handle named register selection', () => {
      processor.processKey('"', initialState);
      processor.processKey('a', initialState);
      processor.processKey('y', initialState);
      const result = processor.processKey('y', initialState);
      
      expect(registerManager.get('a')?.content).toBe('Second line here');
      expect(registerManager.get('"')?.content).toBe('Second line here'); // Also in unnamed
    });

    it('should handle uppercase register append', () => {
      // First yank
      processor.processKey('"', initialState);
      processor.processKey('a', initialState);
      processor.processKey('y', initialState);
      processor.processKey('y', initialState);
      
      // Second yank with append
      processor.reset();
      processor.processKey('"', initialState);
      processor.processKey('A', initialState);
      processor.processKey('y', initialState);
      processor.processKey('y', initialState);
      
      const result = registerManager.get('a');
      expect(result?.content).toContain('Second line here');
    });
  });

  describe('delete commands', () => {
    it('should handle dd (delete line) and yank', () => {
      processor.processKey('d', initialState);
      const result = processor.processKey('d', initialState);
      expect(result?.lastCommand).toBe('dd');
      expect(registerManager.get('"')?.content).toBe('Second line here');
      expect(registerManager.get('"')?.isLinewise).toBe(true);
    });

    it('should handle dw (delete word) and yank', () => {
      processor.processKey('d', initialState);
      const result = processor.processKey('w', initialState);
      expect(result?.lastCommand).toBe('dw');
      expect(registerManager.get('"')?.content).toBeTruthy();
    });
  });

  describe('change commands', () => {
    it('should handle cc (change line) and enter insert mode', () => {
      processor.processKey('c', initialState);
      const result = processor.processKey('c', initialState);
      expect(result?.lastCommand).toBe('cc');
      expect(result?.mode).toBe('insert');
      expect(registerManager.get('"')?.content).toBe('Second line here');
    });

    it('should handle cw (change word) and enter insert mode', () => {
      processor.processKey('c', initialState);
      const result = processor.processKey('w', initialState);
      expect(result?.lastCommand).toBe('cw');
      expect(result?.mode).toBe('insert');
      expect(registerManager.get('"')?.content).toBeTruthy();
    });
  });

  describe('paste commands', () => {
    it('should handle p (paste after)', () => {
      // Setup: yank some text first
      registerManager.set('"', 'pasted text', false);
      
      const result = processor.processKey('p', initialState);
      expect(result?.lastCommand).toBe('p');
    });

    it('should handle P (paste before)', () => {
      // Setup: yank some text first
      registerManager.set('"', 'pasted text', false);
      
      const result = processor.processKey('P', initialState);
      expect(result?.lastCommand).toBe('P');
    });

    it('should paste from specific register', () => {
      registerManager.set('x', 'from register x', false);
      
      processor.processKey('"', initialState);
      processor.processKey('x', initialState);
      const result = processor.processKey('p', initialState);
      
      expect(result?.lastCommand).toBe('p');
    });
  });

  describe('reset functionality', () => {
    it('should reset pending keys and register', () => {
      processor.processKey('"', initialState);
      processor.processKey('a', initialState);
      processor.reset();
      
      // After reset, should start fresh
      processor.processKey('y', initialState);
      const result = processor.processKey('y', initialState);
      expect(result?.lastCommand).toBe('yy');
      expect(registerManager.get('"')?.content).toBeTruthy();
      expect(registerManager.get('a')).toBeNull(); // 'a' was not used
    });
  });
});