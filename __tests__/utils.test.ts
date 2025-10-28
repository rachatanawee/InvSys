import { describe, it, expect } from 'vitest';
import { cnLite } from '../lib/utils';

describe('Utils', () => {
  describe('cnLite', () => {
    it('combines class names', () => {
      const result = cnLite('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles undefined values', () => {
      const result = cnLite('class1', undefined, 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles empty string', () => {
      const result = cnLite('class1', '', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cnLite('base', isActive && 'active');
      expect(result).toBe('base active');
    });
  });
});