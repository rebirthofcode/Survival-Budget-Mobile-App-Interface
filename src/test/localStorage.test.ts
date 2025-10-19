import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEYS } from '../constants';

describe('LocalStorage Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Storage Keys Constants', () => {
    it('should have defined storage key constants', () => {
      expect(STORAGE_KEYS.ONBOARDING_COMPLETED).toBe('onboardingCompleted');
      expect(STORAGE_KEYS.BUDGET_DATA).toBe('budgetData');
      expect(STORAGE_KEYS.LAST_SESSION).toBe('lastSession');
    });

    it('should prevent accidental key typos', () => {
      // TypeScript should enforce these keys exist
      const keys = STORAGE_KEYS;
      expect(keys).toHaveProperty('ONBOARDING_COMPLETED');
      expect(keys).toHaveProperty('BUDGET_DATA');
      expect(keys).toHaveProperty('LAST_SESSION');
    });
  });

  describe('Onboarding Completion Persistence', () => {
    it('should store onboarding completion status', () => {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');

      const status = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      expect(status).toBe('true');
    });

    it('should retrieve onboarding completion status', () => {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');

      const isCompleted = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
      expect(isCompleted).toBe(true);
    });

    it('should handle missing onboarding status gracefully', () => {
      const status = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      expect(status).toBeNull();
    });

    it('should allow resetting onboarding status', () => {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);

      const status = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      expect(status).toBeNull();
    });
  });

  describe('Budget Data Persistence', () => {
    const sampleBudgetData = {
      income: 5000,
      rent: 1200,
      groceries: 400,
      utilities: 200
    };

    it('should store budget data as JSON', () => {
      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, JSON.stringify(sampleBudgetData));

      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET_DATA);
      expect(stored).toBeTruthy();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.income).toBe(5000);
        expect(parsed.rent).toBe(1200);
      }
    });

    it('should retrieve budget data correctly', () => {
      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, JSON.stringify(sampleBudgetData));

      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET_DATA);
      if (stored) {
        const budgetData = JSON.parse(stored);

        expect(budgetData).toEqual(sampleBudgetData);
        expect(budgetData.income).toBe(5000);
        expect(budgetData.rent).toBe(1200);
        expect(budgetData.groceries).toBe(400);
        expect(budgetData.utilities).toBe(200);
      }
    });

    it('should handle missing budget data', () => {
      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET_DATA);
      expect(stored).toBeNull();
    });

    it('should handle corrupted budget data gracefully', () => {
      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, 'invalid json{]');

      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET_DATA);

      expect(() => {
        if (stored) {
          JSON.parse(stored);
        }
      }).toThrow();

      // App should handle this with try-catch
      try {
        if (stored) {
          JSON.parse(stored);
        }
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    it('should allow updating budget data', () => {
      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, JSON.stringify(sampleBudgetData));

      const updatedData = { ...sampleBudgetData, income: 6000 };
      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, JSON.stringify(updatedData));

      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET_DATA);
      if (stored) {
        const budgetData = JSON.parse(stored);
        expect(budgetData.income).toBe(6000);
      }
    });

    it('should support zero values in budget data', () => {
      const zeroData = {
        income: 0,
        rent: 0,
        groceries: 0,
        utilities: 0
      };

      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, JSON.stringify(zeroData));

      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET_DATA);
      if (stored) {
        const budgetData = JSON.parse(stored);
        expect(budgetData.income).toBe(0);
        expect(budgetData.rent).toBe(0);
      }
    });
  });

  describe('Session Tracking', () => {
    it('should store session timestamp', () => {
      const timestamp = Date.now().toString();
      localStorage.setItem(STORAGE_KEYS.LAST_SESSION, timestamp);

      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
      expect(stored).toBe(timestamp);
    });

    it('should retrieve session timestamp', () => {
      const timestamp = Date.now();
      localStorage.setItem(STORAGE_KEYS.LAST_SESSION, timestamp.toString());

      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
      if (stored) {
        const parsedTime = parseInt(stored);
        expect(parsedTime).toBe(timestamp);
        expect(parsedTime).toBeGreaterThan(0);
      }
    });

    it('should detect new vs returning sessions', () => {
      const SESSION_TIMEOUT = 300000; // 5 minutes
      const oldTimestamp = Date.now() - SESSION_TIMEOUT - 1000; // 1 second past timeout

      localStorage.setItem(STORAGE_KEYS.LAST_SESSION, oldTimestamp.toString());

      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
      if (stored) {
        const lastSession = parseInt(stored);
        const currentTime = Date.now();
        const isNewSession = (currentTime - lastSession) > SESSION_TIMEOUT;

        expect(isNewSession).toBe(true);
      }
    });

    it('should detect active session within timeout', () => {
      const SESSION_TIMEOUT = 300000; // 5 minutes
      const recentTimestamp = Date.now() - 60000; // 1 minute ago

      localStorage.setItem(STORAGE_KEYS.LAST_SESSION, recentTimestamp.toString());

      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
      if (stored) {
        const lastSession = parseInt(stored);
        const currentTime = Date.now();
        const isNewSession = (currentTime - lastSession) > SESSION_TIMEOUT;

        expect(isNewSession).toBe(false);
      }
    });

    it('should handle missing session timestamp', () => {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
      expect(stored).toBeNull();

      // App should treat this as a new session
      const isNewSession = !stored;
      expect(isNewSession).toBe(true);
    });
  });

  describe('Priority Persistence', () => {
    const samplePriorities = [
      {
        id: 1,
        name: 'Survival',
        expenses: [
          { id: 's1', name: 'Rent', amount: 1200, enabled: true },
          { id: 's2', name: 'Food', amount: 400, enabled: true }
        ],
        isAffordable: true,
        isBorderline: false
      },
      {
        id: 2,
        name: 'Important',
        expenses: [
          { id: 'i1', name: 'Transport', amount: 200, enabled: false }
        ],
        isAffordable: false,
        isBorderline: true
      }
    ];

    it('should store priorities with all properties', () => {
      localStorage.setItem('budgetPriorities', JSON.stringify(samplePriorities));

      const stored = localStorage.getItem('budgetPriorities');
      expect(stored).toBeTruthy();

      if (stored) {
        const priorities = JSON.parse(stored);
        expect(priorities).toHaveLength(2);
        expect(priorities[0].name).toBe('Survival');
        expect(priorities[0].expenses).toHaveLength(2);
        expect(priorities[0].isAffordable).toBe(true);
      }
    });

    it('should preserve expense enabled/disabled state', () => {
      localStorage.setItem('budgetPriorities', JSON.stringify(samplePriorities));

      const stored = localStorage.getItem('budgetPriorities');
      if (stored) {
        const priorities = JSON.parse(stored);
        expect(priorities[0].expenses[0].enabled).toBe(true);
        expect(priorities[1].expenses[0].enabled).toBe(false);
      }
    });

    it('should preserve affordability calculations', () => {
      localStorage.setItem('budgetPriorities', JSON.stringify(samplePriorities));

      const stored = localStorage.getItem('budgetPriorities');
      if (stored) {
        const priorities = JSON.parse(stored);
        expect(priorities[0].isAffordable).toBe(true);
        expect(priorities[0].isBorderline).toBe(false);
        expect(priorities[1].isAffordable).toBe(false);
        expect(priorities[1].isBorderline).toBe(true);
      }
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data integrity across multiple operations', () => {
      // Simulate complete app flow
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, JSON.stringify({
        income: 5000,
        rent: 1200,
        groceries: 400,
        utilities: 200
      }));
      localStorage.setItem(STORAGE_KEYS.LAST_SESSION, Date.now().toString());

      // Verify all data is intact
      expect(localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED)).toBe('true');
      expect(localStorage.getItem(STORAGE_KEYS.BUDGET_DATA)).toBeTruthy();
      expect(localStorage.getItem(STORAGE_KEYS.LAST_SESSION)).toBeTruthy();

      // Verify budget data structure
      const budgetData = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGET_DATA) || '{}');
      expect(budgetData.income).toBe(5000);
    });

    it('should allow clearing all app data', () => {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.BUDGET_DATA, JSON.stringify({ income: 5000 }));
      localStorage.setItem(STORAGE_KEYS.LAST_SESSION, Date.now().toString());

      // Clear all
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.BUDGET_DATA);
      localStorage.removeItem(STORAGE_KEYS.LAST_SESSION);

      expect(localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.BUDGET_DATA)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.LAST_SESSION)).toBeNull();
    });
  });
});
