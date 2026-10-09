import { describe, it, expect } from 'vitest';
import {
  slugify,
  truncate,
  formatDate,
  formatProjectName,
  classNames,
  getTechCategoryColor,
  getTechCategoryLabel,
} from '@/utils/helpers';

describe('helpers', () => {
  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test_Project')).toBe('test-project');
      expect(slugify('Special!!!Chars')).toBe('specialchars');
    });

    it('handles edge cases', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
      expect(slugify('---')).toBe('');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('Hello World', 8)).toBe('Hello W…');
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('handles edge cases', () => {
      expect(truncate('', 5)).toBe('');
      expect(truncate('Hi', 2)).toBe('Hi');
    });
  });

  describe('formatDate', () => {
    it('formats valid dates', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toMatch(/Jan 15, 2024/);
    });

    it('returns original string for invalid dates', () => {
      expect(formatDate('invalid')).toBe('invalid');
    });
  });

  describe('classNames', () => {
    it('joins valid class names', () => {
      expect(classNames('a', 'b', 'c')).toBe('a b c');
    });

    it('filters out falsy values', () => {
      expect(classNames('a', false && 'b', null, undefined, 'c')).toBe('a c');
    });
  });

  describe('getTechCategoryColor', () => {
    it('returns correct colors for known categories', () => {
      expect(getTechCategoryColor('language')).toBe('#3178c6');
      expect(getTechCategoryColor('framework')).toBe('#e34c26');
      expect(getTechCategoryColor('tool')).toBe('#f0db4f');
    });

    it('returns default for unknown categories', () => {
      expect(getTechCategoryColor('unknown')).toBe('#6e6e73');
    });
  });

  describe('getTechCategoryLabel', () => {
    it('returns correct labels for known categories', () => {
      expect(getTechCategoryLabel('language')).toBe('Languages');
      expect(getTechCategoryLabel('framework')).toBe('Frameworks');
    });

    it('returns category name for unknown', () => {
      expect(getTechCategoryLabel('unknown')).toBe('unknown');
    });
  });

  /* The six real names from projects.json. Four of them carry capitals on purpose and must survive
     byte for byte; a general title-case would turn them into Linkio, Qentry and Nauticacademy. This
     group is the only thing standing between the rule and that regression. */
  describe('formatProjectName', () => {
    it('escribe con espacios y mayusculas los nombres que tienen guion', () => {
      expect(formatProjectName('car-expense-tracker')).toBe('Car Expense Tracker');
      expect(formatProjectName('cash-counter')).toBe('Cash Counter');
    });

    it('no toca los nombres sin guion, ni siquiera los que estan en minuscula', () => {
      expect(formatProjectName('trash2treasure')).toBe('trash2treasure');
      expect(formatProjectName('LinkIO')).toBe('LinkIO');
      expect(formatProjectName('QEntry')).toBe('QEntry');
      expect(formatProjectName('NauticAcademy')).toBe('NauticAcademy');
    });

    it('no deja espacios fantasma con guiones al principio o al final', () => {
      /* Sin el filtro de segmentos vacios, '-leading' devolvia ' Leading' y 'trailing-' devolvia
         'Trailing ', y eso se ve como texto indentado dentro de la tarjeta. */
      expect(formatProjectName('-leading')).toBe('Leading');
      expect(formatProjectName('trailing-')).toBe('Trailing');
      expect(formatProjectName('x--y')).toBe('X Y');
    });

    it('tolera la cadena vacia y no lanza', () => {
      expect(formatProjectName('')).toBe('');
    });

    it('deja intacto un nombre que ya viene escrito', () => {
      expect(formatProjectName('Test Project')).toBe('Test Project');
      expect(formatProjectName('UPPER-CASE')).toBe('UPPER CASE');
    });
  });
});
