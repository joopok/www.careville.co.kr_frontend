import { useState, useEffect, useCallback, useRef } from 'react';
import { VimCore } from '@/lib/vim/core';
import { VimState, VimPosition } from '@/lib/vim/types';
import { TextBuffer } from '@/lib/vim/motions';

interface UseVimModeOptions {
  initialMode?: 'normal' | 'insert';
  onStateChange?: (state: VimState) => void;
  textAreaRef?: React.RefObject<HTMLTextAreaElement>;
}

class TextAreaBuffer implements TextBuffer {
  private textArea: HTMLTextAreaElement;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
  }

  getLine(lineNumber: number): string {
    const lines = this.textArea.value.split('\n');
    return lines[lineNumber] || '';
  }

  getLineCount(): number {
    return this.textArea.value.split('\n').length;
  }

  getText(start: VimPosition, end: VimPosition): string {
    const lines = this.textArea.value.split('\n');
    
    if (start.line === end.line) {
      const line = lines[start.line] || '';
      return line.substring(start.column, end.column + 1);
    }
    
    let result = '';
    for (let i = start.line; i <= end.line; i++) {
      if (i === start.line) {
        result += (lines[i] || '').substring(start.column);
      } else if (i === end.line) {
        result += '\n' + (lines[i] || '').substring(0, end.column + 1);
      } else {
        result += '\n' + (lines[i] || '');
      }
    }
    return result;
  }
}

export function useVimMode(options: UseVimModeOptions = {}) {
  const { initialMode = 'normal', onStateChange, textAreaRef } = options;
  const [vimState, setVimState] = useState<VimState | null>(null);
  const vimCoreRef = useRef<VimCore | null>(null);

  // Initialize VimCore when textarea is available
  useEffect(() => {
    if (textAreaRef?.current) {
      const buffer = new TextAreaBuffer(textAreaRef.current);
      vimCoreRef.current = new VimCore(buffer);
      setVimState(vimCoreRef.current.getState());
    }
  }, [textAreaRef]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!vimCoreRef.current) return;

    let key = event.key;
    
    // Handle special keys
    if (event.key === 'Escape') {
      key = 'Escape';
    } else if (event.ctrlKey) {
      // Handle Ctrl combinations
      if (event.key === 'c') {
        key = 'Escape'; // Ctrl+C as escape
      } else if (event.key === 'v') {
        // Ctrl+V for visual block (future enhancement)
        return;
      }
    }

    // Don't intercept keys in insert mode except Escape
    if (vimState?.mode === 'insert' && key !== 'Escape') {
      return;
    }

    // Prevent default for vim commands
    event.preventDefault();

    // Process key through VimCore
    const newState = vimCoreRef.current.handleKey(key);
    setVimState(newState);
    
    if (onStateChange) {
      onStateChange(newState);
    }
  }, [vimState, onStateChange]);

  // Attach keyboard listener
  useEffect(() => {
    if (!textAreaRef?.current) return;

    const textArea = textAreaRef.current;
    textArea.addEventListener('keydown', handleKeyDown);

    return () => {
      textArea.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, textAreaRef]);

  // Public API
  const getRegisters = useCallback(() => {
    return vimCoreRef.current?.getRegisters();
  }, []);

  const setMode = useCallback((mode: 'normal' | 'insert' | 'visual') => {
    if (!vimCoreRef.current) return;
    
    let key = '';
    if (mode === 'normal') {
      key = 'Escape';
    } else if (mode === 'insert') {
      key = 'i';
    } else if (mode === 'visual') {
      key = 'v';
    }
    
    const newState = vimCoreRef.current.handleKey(key);
    setVimState(newState);
  }, []);

  const executeCommand = useCallback((command: string) => {
    if (!vimCoreRef.current) return;
    
    for (const char of command) {
      vimCoreRef.current.handleKey(char);
    }
    
    const newState = vimCoreRef.current.getState();
    setVimState(newState);
  }, []);

  return {
    state: vimState,
    mode: vimState?.mode || 'normal',
    position: vimState?.position || { line: 0, column: 0 },
    registers: vimState?.registers,
    getRegisters,
    setMode,
    executeCommand,
  };
}