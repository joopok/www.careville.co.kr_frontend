import { VimRegister, VimRegisters } from './types';

export class RegisterManager {
  private registers: VimRegisters;

  constructor() {
    this.registers = this.initializeRegisters();
  }

  private initializeRegisters(): VimRegisters {
    return {
      unnamed: { content: '', isLinewise: false },
      named: {},
      numbered: Array(10).fill(null).map(() => ({ content: '', isLinewise: false })),
      readonly: {
        '%': { content: '', isLinewise: false }, // current file name
        '#': { content: '', isLinewise: false }, // alternate file name
        '.': { content: '', isLinewise: false }, // last inserted text
        ':': { content: '', isLinewise: false }, // last command
        '/': { content: '', isLinewise: false }, // last search pattern
      }
    };
  }

  set(register: string | null, content: string, isLinewise: boolean = false): void {
    if (!register || register === '"') {
      // Default register
      this.registers.unnamed = { content, isLinewise };
      this.pushToNumberedRegisters(content, isLinewise);
    } else if (register >= 'a' && register <= 'z') {
      // Named lowercase register (replace)
      this.registers.named[register] = { content, isLinewise };
    } else if (register >= 'A' && register <= 'Z') {
      // Named uppercase register (append)
      const lowerReg = register.toLowerCase();
      const existing = this.registers.named[lowerReg];
      if (existing) {
        this.registers.named[lowerReg] = {
          content: existing.content + (isLinewise ? '\n' : '') + content,
          isLinewise: existing.isLinewise || isLinewise
        };
      } else {
        this.registers.named[lowerReg] = { content, isLinewise };
      }
    } else if (register >= '0' && register <= '9') {
      // Numbered register
      const index = parseInt(register, 10);
      this.registers.numbered[index] = { content, isLinewise };
    } else if (register === '+' || register === '*') {
      // System clipboard registers
      this.setSystemClipboard(content);
      this.registers.named[register] = { content, isLinewise };
    }

    // Always update unnamed register
    if (register !== '"') {
      this.registers.unnamed = { content, isLinewise };
    }
  }

  get(register: string | null): VimRegister | null {
    if (!register || register === '"') {
      return this.registers.unnamed;
    } else if (register >= 'a' && register <= 'z') {
      return this.registers.named[register] || null;
    } else if (register >= '0' && register <= '9') {
      const index = parseInt(register, 10);
      return this.registers.numbered[index];
    } else if (register === '+' || register === '*') {
      // Get from system clipboard
      const content = this.getSystemClipboard();
      return { content, isLinewise: false };
    } else if (this.registers.readonly[register]) {
      return this.registers.readonly[register];
    }
    return null;
  }

  private pushToNumberedRegisters(content: string, isLinewise: boolean): void {
    // Shift numbered registers (1-9)
    for (let i = 9; i > 1; i--) {
      this.registers.numbered[i] = this.registers.numbered[i - 1];
    }
    this.registers.numbered[1] = { content, isLinewise };
  }

  private async setSystemClipboard(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error('Failed to write to clipboard:', err);
      }
    }
  }

  private getSystemClipboard(): string {
    // Note: Reading clipboard requires user interaction in browsers
    // This is a placeholder - actual implementation would need to handle this async
    return '';
  }

  clear(register?: string): void {
    if (!register) {
      this.registers = this.initializeRegisters();
    } else if (register >= 'a' && register <= 'z') {
      delete this.registers.named[register];
    }
  }

  getAll(): VimRegisters {
    return this.registers;
  }
}