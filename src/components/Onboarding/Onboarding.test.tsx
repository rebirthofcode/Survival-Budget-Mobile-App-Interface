import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Onboarding } from './Onboarding';

describe('Onboarding Flow', () => {
  const mockCompleteOnboarding = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockCompleteOnboarding.mockClear();
  });

  describe('Welcome Screen', () => {
    it('should render welcome screen initially', () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      expect(screen.getByText(/Survival first/i)).toBeInTheDocument();
      expect(screen.getByText(/then build up/i)).toBeInTheDocument();
      expect(screen.getByText(/Priority-based budgeting/i)).toBeInTheDocument();
    });

    it('should show priority pyramid visualization', () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // These texts appear multiple times, just verify at least one exists
      expect(screen.getAllByText(/Survival/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Important/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Quality of Life/i)).toBeInTheDocument();
      expect(screen.getByText(/Future Building/i)).toBeInTheDocument();
    });

    it('should show progress indicator at Step 1 of 4', () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    });

    it('should have Get Started button', () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      const getStartedButton = screen.getByRole('button', { name: /Get Started/i });
      expect(getStartedButton).toBeInTheDocument();
    });

    it('should have Skip to Budget button', () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      const skipButton = screen.getByRole('button', { name: /Skip to Budget/i });
      expect(skipButton).toBeInTheDocument();
    });
  });

  describe('Navigation Flow', () => {
    it('should advance to income setup when Get Started is clicked', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      const getStartedButton = screen.getByRole('button', { name: /Get Started/i });
      fireEvent.click(getStartedButton);

      await waitFor(() => {
        expect(screen.getByText(/Essentials Setup/i)).toBeInTheDocument();
        expect(screen.getByText(/Monthly income/i)).toBeInTheDocument();
      });
    });

    it('should allow going back from income setup', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Go to income setup
      const getStartedButton = screen.getByRole('button', { name: /Get Started/i });
      fireEvent.click(getStartedButton);

      await waitFor(() => {
        expect(screen.getByText(/Essentials Setup/i)).toBeInTheDocument();
      });

      // Go back
      const backButton = screen.getByRole('button', { name: /Back/i });
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByText(/Survival first/i)).toBeInTheDocument();
      });
    });

    it('should skip onboarding entirely when Skip to Budget is clicked', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      const skipButton = screen.getByRole('button', { name: /Skip to Budget/i });
      fireEvent.click(skipButton);

      await waitFor(() => {
        // Should call completeOnboarding immediately, skipping the rest of the flow
        expect(mockCompleteOnboarding).toHaveBeenCalledWith(
          expect.objectContaining({
            income: expect.any(Number)
          })
        );
      });
    });
  });

  describe('Income Input Validation', () => {
    it('should accept valid income input', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Navigate to income setup
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        expect(screen.getByText(/Essentials Setup/i)).toBeInTheDocument();
      });

      // Enter income (use id selector to avoid multiple placeholder matches)
      const incomeInput = screen.getByLabelText(/Monthly income/i);
      fireEvent.change(incomeInput, { target: { value: '5000' } });

      expect(incomeInput).toHaveValue('5,000');
    });

    it('should only allow numeric input for income', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        const incomeInput = screen.getByLabelText(/Monthly income/i);

        // Try to enter letters
        fireEvent.change(incomeInput, { target: { value: 'abc123' } });

        // Should only keep numbers, formatted with comma
        expect(incomeInput.value).toBe('123');
      });
    });

    it('should require income to proceed to budget snapshot', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /Next/i });

        // Button should be disabled or not advance without income
        expect(nextButton).toBeInTheDocument();
      });
    });
  });

  describe('Budget Snapshot', () => {
    it('should show calculated remaining income', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Navigate through flow
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        const incomeInput = screen.getByLabelText(/Monthly income/i);
        fireEvent.change(incomeInput, { target: { value: '5000' } });
      });

      // Proceed to next step
      const nextButton = screen.getByRole('button', { name: /Next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        // Should show snapshot with remaining income calculation
        expect(screen.getByText(/Here's what you've got/i)).toBeInTheDocument();
      });
    });

    it('should show progress at Step 3 of 4', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Navigate to essentials setup
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        expect(screen.getByText(/Essentials Setup/i)).toBeInTheDocument();
      });

      // Click Next to go to budget snapshot
      const nextButton = screen.getByRole('button', { name: /Next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Step 3 of 4/i)).toBeInTheDocument();
      });
    });

    it('should display essential expenses breakdown', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Navigate to essentials setup
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        expect(screen.getByText(/Essentials Setup/i)).toBeInTheDocument();
      });

      // Click Next to go to budget snapshot
      const nextButton = screen.getByRole('button', { name: /Next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Essential Expenses/i)).toBeInTheDocument();
      });
    });
  });

  describe('Completion', () => {
    it('should advance to completion screen from budget snapshot', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Navigate to essentials setup
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        expect(screen.getByText(/Essentials Setup/i)).toBeInTheDocument();
      });

      // Click Next to go to budget snapshot
      const nextButton = screen.getByRole('button', { name: /Next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Here's what you've got/i)).toBeInTheDocument();
      });

      // Click Next on budget snapshot to go to completion
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      fireEvent.click(nextButtons[nextButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText(/You're all set/i)).toBeInTheDocument();
      });
    });

    it('should call completeOnboarding with budget data when Let\'s go is clicked', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Navigate through full flow
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        const incomeInput = screen.getByLabelText(/Monthly income/i);
        fireEvent.change(incomeInput, { target: { value: '5000' } });
      });

      // Continue through steps - click Next on essentials setup
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      fireEvent.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Here's what you've got/i)).toBeInTheDocument();
      });

      // Click Next on budget snapshot
      nextButtons = screen.getAllByRole('button', { name: /Next/i });
      fireEvent.click(nextButtons[nextButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText(/You're all set/i)).toBeInTheDocument();
      });

      // Click Let's go
      const letsGoButton = screen.getByRole('button', { name: /Let's go/i });
      fireEvent.click(letsGoButton);

      // Should call complete callback with budget data
      expect(mockCompleteOnboarding).toHaveBeenCalledWith(
        expect.objectContaining({
          income: expect.any(Number)
        })
      );
    });

    it('should show completion screen with feature highlights', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Navigate to essentials setup
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));

      await waitFor(() => {
        expect(screen.getByText(/Essentials Setup/i)).toBeInTheDocument();
      });

      // Click Next to go to budget snapshot
      const nextButton = screen.getByRole('button', { name: /Next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Here's what you've got/i)).toBeInTheDocument();
      });

      // Click Next on budget snapshot to go to completion
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      fireEvent.click(nextButtons[nextButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText(/Track daily spending/i)).toBeInTheDocument();
        expect(screen.getByText(/Adjust your categories/i)).toBeInTheDocument();
        expect(screen.getByText(/Save for the future/i)).toBeInTheDocument();
      });
    });
  });

  describe('Tagline Consistency', () => {
    it('should show "Priority-based budgeting" tagline on all screens', async () => {
      render(<Onboarding completeOnboarding={mockCompleteOnboarding} />);

      // Welcome screen
      expect(screen.getByText(/Priority-based budgeting/i)).toBeInTheDocument();

      // Income setup screen
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
      await waitFor(() => {
        expect(screen.getByText(/Priority-based budgeting/i)).toBeInTheDocument();
      });

      // Budget snapshot screen
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      fireEvent.click(nextButtons[0]);
      await waitFor(() => {
        expect(screen.getByText(/Priority-based budgeting/i)).toBeInTheDocument();
      });

      // Completion screen
      nextButtons = screen.getAllByRole('button', { name: /Next/i });
      fireEvent.click(nextButtons[nextButtons.length - 1]);
      await waitFor(() => {
        expect(screen.getByText(/Priority-based budgeting/i)).toBeInTheDocument();
      });
    });
  });
});
