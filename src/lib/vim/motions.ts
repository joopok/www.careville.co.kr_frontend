import { VimPosition, VimMotion } from './types';

export interface TextBuffer {
  getLine(lineNumber: number): string;
  getLineCount(): number;
  getText(start: VimPosition, end: VimPosition): string;
}

export class MotionParser {
  private buffer: TextBuffer;

  constructor(buffer: TextBuffer) {
    this.buffer = buffer;
  }

  parseMotion(keys: string, position: VimPosition): VimMotion | null {
    const motionMap: Record<string, VimMotion> = {
      'h': { type: 'char', count: 1, inclusive: false },
      'l': { type: 'char', count: 1, inclusive: false },
      'j': { type: 'line', count: 1, inclusive: true },
      'k': { type: 'line', count: 1, inclusive: true },
      'w': { type: 'word', count: 1, inclusive: false },
      'W': { type: 'word', count: 1, inclusive: false },
      'b': { type: 'word', count: 1, inclusive: false },
      'B': { type: 'word', count: 1, inclusive: false },
      'e': { type: 'word', count: 1, inclusive: true },
      'E': { type: 'word', count: 1, inclusive: true },
      '$': { type: 'line', count: 1, inclusive: true },
      '^': { type: 'line', count: 1, inclusive: false },
      '0': { type: 'line', count: 1, inclusive: false },
      'G': { type: 'document', count: 1, inclusive: true },
      'gg': { type: 'document', count: 1, inclusive: true },
    };

    return motionMap[keys] || null;
  }

  calculateMotionEnd(start: VimPosition, motion: VimMotion): VimPosition {
    switch (motion.type) {
      case 'char':
        return this.charMotion(start, motion);
      case 'line':
        return this.lineMotion(start, motion);
      case 'word':
        return this.wordMotion(start, motion);
      case 'document':
        return this.documentMotion(start, motion);
      default:
        return start;
    }
  }

  private charMotion(pos: VimPosition, motion: VimMotion): VimPosition {
    const line = this.buffer.getLine(pos.line);
    const newColumn = Math.max(0, Math.min(line.length - 1, pos.column + motion.count));
    return { line: pos.line, column: newColumn };
  }

  private lineMotion(pos: VimPosition, motion: VimMotion): VimPosition {
    const lineCount = this.buffer.getLineCount();
    const newLine = Math.max(0, Math.min(lineCount - 1, pos.line + motion.count));
    return { line: newLine, column: pos.column };
  }

  private wordMotion(pos: VimPosition, motion: VimMotion): VimPosition {
    let currentPos = { ...pos };
    let remaining = motion.count;

    while (remaining > 0) {
      currentPos = this.findNextWord(currentPos);
      remaining--;
    }

    return currentPos;
  }

  private documentMotion(pos: VimPosition, motion: VimMotion): VimPosition {
    if (motion.count === 1) {
      return { line: 0, column: 0 };
    } else {
      const targetLine = Math.min(motion.count - 1, this.buffer.getLineCount() - 1);
      return { line: targetLine, column: 0 };
    }
  }

  private findNextWord(pos: VimPosition): VimPosition {
    const line = this.buffer.getLine(pos.line);
    let col = pos.column;

    // Skip current word
    while (col < line.length && !this.isWhitespace(line[col])) {
      col++;
    }

    // Skip whitespace
    while (col < line.length && this.isWhitespace(line[col])) {
      col++;
    }

    // If at end of line, move to next line
    if (col >= line.length) {
      if (pos.line < this.buffer.getLineCount() - 1) {
        return { line: pos.line + 1, column: 0 };
      }
    }

    return { line: pos.line, column: col };
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  getTextForMotion(start: VimPosition, end: VimPosition, isLinewise: boolean): string {
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
}