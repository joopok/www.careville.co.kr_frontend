import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterManager } from '../registers';

describe('RegisterManager', () => {
  let registerManager: RegisterManager;

  beforeEach(() => {
    registerManager = new RegisterManager();
  });

  describe('unnamed register', () => {
    it('should store content in unnamed register by default', () => {
      registerManager.set(null, 'test content');
      const result = registerManager.get(null);
      expect(result?.content).toBe('test content');
      expect(result?.isLinewise).toBe(false);
    });

    it('should store content in unnamed register with " key', () => {
      registerManager.set('"', 'test content');
      const result = registerManager.get('"');
      expect(result?.content).toBe('test content');
    });

    it('should handle linewise content', () => {
      registerManager.set(null, 'line content', true);
      const result = registerManager.get(null);
      expect(result?.content).toBe('line content');
      expect(result?.isLinewise).toBe(true);
    });
  });

  describe('named registers', () => {
    it('should store in lowercase named register', () => {
      registerManager.set('a', 'content a');
      const result = registerManager.get('a');
      expect(result?.content).toBe('content a');
    });

    it('should replace content in lowercase register', () => {
      registerManager.set('b', 'first');
      registerManager.set('b', 'second');
      const result = registerManager.get('b');
      expect(result?.content).toBe('second');
    });

    it('should append to uppercase named register', () => {
      registerManager.set('c', 'first');
      registerManager.set('C', 'second');
      const result = registerManager.get('c');
      expect(result?.content).toBe('firstsecond');
    });

    it('should append with newline for linewise content', () => {
      registerManager.set('d', 'line1', true);
      registerManager.set('D', 'line2', true);
      const result = registerManager.get('d');
      expect(result?.content).toBe('line1\nline2');
      expect(result?.isLinewise).toBe(true);
    });
  });

  describe('numbered registers', () => {
    it('should store in specific numbered register', () => {
      registerManager.set('0', 'yanked text');
      const result = registerManager.get('0');
      expect(result?.content).toBe('yanked text');
    });

    it('should shift numbered registers on new yank', () => {
      registerManager.set(null, 'first');
      registerManager.set(null, 'second');
      registerManager.set(null, 'third');
      
      expect(registerManager.get('1')?.content).toBe('third');
      expect(registerManager.get('2')?.content).toBe('second');
      expect(registerManager.get('3')?.content).toBe('first');
    });
  });

  describe('clear operation', () => {
    it('should clear specific register', () => {
      registerManager.set('e', 'content');
      registerManager.clear('e');
      const result = registerManager.get('e');
      expect(result).toBeNull();
    });

    it('should clear all registers', () => {
      registerManager.set('f', 'content1');
      registerManager.set('g', 'content2');
      registerManager.set(null, 'unnamed');
      
      registerManager.clear();
      
      expect(registerManager.get('f')).toBeNull();
      expect(registerManager.get('g')).toBeNull();
      expect(registerManager.get(null)?.content).toBe('');
    });
  });

  describe('getAll operation', () => {
    it('should return all registers', () => {
      registerManager.set('h', 'test');
      const all = registerManager.getAll();
      
      expect(all.unnamed).toBeDefined();
      expect(all.named).toBeDefined();
      expect(all.numbered).toBeDefined();
      expect(all.readonly).toBeDefined();
    });
  });
});