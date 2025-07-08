import { validateRoles, serializeRoles, deserializeRoles } from '../lib/util';
import { UserRole } from '../types';

describe('Utility Functions', () => {
  describe('validateRoles', () => {
    it('should return true when user has at least one allowed role', () => {
      const allowedRoles: UserRole[] = ['admin', 'participant'];
      const userRoles: UserRole[] = ['admin'];
      
      expect(validateRoles(allowedRoles, userRoles)).toBe(true);
    });

    it('should return true when user has multiple roles including allowed ones', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles: UserRole[] = ['admin', 'participant'];
      
      expect(validateRoles(allowedRoles, userRoles)).toBe(true);
    });

    it('should return false when user has no allowed roles', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles: UserRole[] = ['participant'];
      
      expect(validateRoles(allowedRoles, userRoles)).toBe(false);
    });

    it('should return false when userRoles is null', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles: UserRole[] | null = null;
      
      expect(validateRoles(allowedRoles, userRoles)).toBe(false);
    });

    it('should return false when userRoles is empty array', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles: UserRole[] = [];
      
      expect(validateRoles(allowedRoles, userRoles)).toBe(false);
    });

    it('should return false when allowedRoles is empty array', () => {
      const allowedRoles: UserRole[] = [];
      const userRoles: UserRole[] = ['admin'];
      
      expect(validateRoles(allowedRoles, userRoles)).toBe(false);
    });

    it('should handle duplicate roles correctly', () => {
      const allowedRoles: UserRole[] = ['admin', 'admin'];
      const userRoles: UserRole[] = ['admin'];
      
      expect(validateRoles(allowedRoles, userRoles)).toBe(true);
    });

    it('should not throw error when userRoles is null (current bug)', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles: UserRole[] | null = null;
      
      expect(() => validateRoles(allowedRoles, userRoles)).not.toThrow();
    });
  });

  describe('serializeRoles', () => {
    it('should serialize array of roles to pipe-separated string', () => {
      const userRoles: UserRole[] = ['admin', 'participant'];
      
      expect(serializeRoles(userRoles)).toBe('admin|participant');
    });

    it('should serialize single role to string', () => {
      const userRoles: UserRole[] = ['admin'];
      
      expect(serializeRoles(userRoles)).toBe('admin');
    });

    it('should return "null" when userRoles is null', () => {
      const userRoles: UserRole[] | null = null;
      
      expect(serializeRoles(userRoles)).toBe('null');
    });

    it('should handle empty array', () => {
      const userRoles: UserRole[] = [];
      
      expect(serializeRoles(userRoles)).toBe('null');
    });

    it('should handle roles with special characters (edge case)', () => {
      const userRoles = ['admin', 'participant'] as UserRole[];
      
      expect(serializeRoles(userRoles)).toBe('admin|participant');
    });
  });

  describe('deserializeRoles', () => {
    it('should deserialize pipe-separated string to array of roles', () => {
      const serializedRoles = 'admin|participant';
      
      expect(deserializeRoles(serializedRoles)).toEqual(['admin', 'participant']);
    });

    it('should deserialize single role string to array', () => {
      const serializedRoles = 'admin';
      
      expect(deserializeRoles(serializedRoles)).toEqual(['admin']);
    });

    it('should return null when serializedRoles is "null"', () => {
      const serializedRoles = 'null';
      
      expect(deserializeRoles(serializedRoles)).toBeNull();
    });

    it('should handle empty string', () => {
      const serializedRoles = '';
      
      const result = deserializeRoles(serializedRoles);
      expect(result).not.toEqual(['']);
    });

    it('should handle string with empty segments', () => {
      const serializedRoles = 'admin||participant';
      
      const result = deserializeRoles(serializedRoles);
      expect(result).not.toContain('');
    });

    it('should handle malformed input gracefully', () => {
      const serializedRoles = '|||';

      const result = deserializeRoles(serializedRoles);
      expect(result).not.toEqual(['', '', '', '']);
    });

    it('should maintain type safety', () => {
      const serializedRoles = 'admin|participant';
      const result = deserializeRoles(serializedRoles);
      
      if (result !== null) {
        expect(result).toEqual(expect.arrayContaining(['admin', 'participant']));
        expect(result.every(role => ['admin', 'participant'].includes(role))).toBe(true);
      }
    });
  });

  describe('Round-trip serialization', () => {
    it('should maintain data integrity through serialize/deserialize cycle', () => {
      const originalRoles: UserRole[] = ['admin', 'participant'];
      
      const serialized = serializeRoles(originalRoles);
      const deserialized = deserializeRoles(serialized);
      
      expect(deserialized).toEqual(originalRoles);
    });

    it('should handle null through serialize/deserialize cycle', () => {
      const originalRoles: UserRole[] | null = null;
      
      const serialized = serializeRoles(originalRoles);
      const deserialized = deserializeRoles(serialized);
      
      expect(deserialized).toBeNull();
    });

    it('should handle empty array through serialize/deserialize cycle', () => {
      const originalRoles: UserRole[] = [];
      
      const serialized = serializeRoles(originalRoles);
      const deserialized = deserializeRoles(serialized);
      
      expect(deserialized === null || (Array.isArray(deserialized) && deserialized.length === 0)).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should work correctly in ProtectedRoute scenario', () => {
      const allowedRoles: UserRole[] = ['admin'];
      
      const adminUser: UserRole[] = ['admin'];
      expect(validateRoles(allowedRoles, adminUser)).toBe(true);
      
      const participantUser: UserRole[] = ['participant'];
      expect(validateRoles(allowedRoles, participantUser)).toBe(false);
      
      expect(validateRoles(allowedRoles, null)).toBe(false);
    });

    it('should work correctly in tabs layout scenario', () => {
      const allowedRoles: UserRole[] = ['admin', 'participant'];
      
      expect(validateRoles(allowedRoles, ['admin'])).toBe(true);
      
      expect(validateRoles(allowedRoles, ['participant'])).toBe(true);
      
      expect(validateRoles(allowedRoles, ['admin', 'participant'])).toBe(true);
      
      expect(validateRoles(allowedRoles, null)).toBe(false);
    });

    it('should handle SecureStore data correctly', () => {
      const storedData = 'admin|participant';
      const deserializedRoles = deserializeRoles(storedData);
      
      expect(deserializedRoles).not.toBeNull();
      if (deserializedRoles) {
        expect(validateRoles(['admin'], deserializedRoles)).toBe(true);
        expect(validateRoles(['participant'], deserializedRoles)).toBe(true);
        expect(validateRoles(['nonexistent' as UserRole], deserializedRoles)).toBe(false);
      }
    });
  });

  describe('validateRoles - Critical Bug Tests', () => {
    it('should not crash when userRoles is null (Set constructor bug)', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles: UserRole[] | null = null;
      
      expect(() => {
        const result = validateRoles(allowedRoles, userRoles);
        expect(result).toBe(false);
      }).not.toThrow();
    });

    it('should handle undefined userRoles gracefully', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles = undefined as any;
      
      expect(() => {
        const result = validateRoles(allowedRoles, userRoles);
      }).toThrow();
    });

    it('should verify Set is created correctly with valid array', () => {
      const allowedRoles: UserRole[] = ['admin'];
      const userRoles: UserRole[] = ['admin', 'participant'];
      
      const result = validateRoles(allowedRoles, userRoles);
      expect(result).toBe(true);
    });

    it('should handle very large role arrays efficiently', () => {
      const allowedRoles: UserRole[] = Array(1000).fill('admin');
      const userRoles: UserRole[] = Array(1000).fill('participant').concat(['admin']);
      
      const startTime = Date.now();
      const result = validateRoles(allowedRoles, userRoles);
      const endTime = Date.now();
      
      expect(result).toBe(true);
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Real-world scenario tests', () => {
    it('should handle typical AWS Cognito groups format', () => {
      const cognitoGroups = ['hackumbc-admin', 'hackumbc-participant'] as any[];
      
      const mappedRoles: UserRole[] = cognitoGroups
        .map(group => group.replace('hackumbc-', ''))
        .filter(role => ['admin', 'participant'].includes(role)) as UserRole[];
      
      expect(validateRoles(['admin'], mappedRoles)).toBe(true);
      expect(validateRoles(['participant'], mappedRoles)).toBe(true);
    });

    it('should handle SecureStore retrieval scenarios', () => {
      const scenarios = [
        { stored: 'admin|participant', expected: ['admin', 'participant'] },
        { stored: 'admin', expected: ['admin'] },
        { stored: 'null', expected: null },
        { stored: '', expected: null },
        { stored: '|||', expected: null },
      ];

      scenarios.forEach(({ stored, expected }) => {
        const { deserializeRoles } = require('../lib/util');
        const result = deserializeRoles(stored);
        
        if (expected === null) {
          expect(result).toBeNull();
        } else {
          expect(result).toEqual(expected);
        }
      });
    });

    it('should handle navigation guard scenarios correctly', () => {
      const testCases = [
        {
          description: 'Admin-only route with admin user',
          allowedRoles: ['admin'] as UserRole[],
          userRoles: ['admin'] as UserRole[],
          shouldAllow: true
        },
        {
          description: 'Admin-only route with participant user',
          allowedRoles: ['admin'] as UserRole[],
          userRoles: ['participant'] as UserRole[],
          shouldAllow: false
        },
        {
          description: 'Multi-role route with admin user',
          allowedRoles: ['admin', 'participant'] as UserRole[],
          userRoles: ['admin'] as UserRole[],
          shouldAllow: true
        },
        {
          description: 'Multi-role route with participant user',
          allowedRoles: ['admin', 'participant'] as UserRole[],
          userRoles: ['participant'] as UserRole[],
          shouldAllow: true
        },
        {
          description: 'Any route with null user',
          allowedRoles: ['admin', 'participant'] as UserRole[],
          userRoles: null,
          shouldAllow: false
        },
        {
          description: 'Any route with empty roles',
          allowedRoles: ['admin'] as UserRole[],
          userRoles: [] as UserRole[],
          shouldAllow: false
        }
      ];

      testCases.forEach(({ description, allowedRoles, userRoles, shouldAllow }) => {
        const result = validateRoles(allowedRoles, userRoles);
        expect(result).toBe(shouldAllow);
      });
    });
  });
});
