# Changelog

All notable changes to Survival Budget will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-beta.3] - 2025-10-28 to 2025-10-31

### Session: Beta Feedback Collection & Bug Fixes

### Fixed - Critical Data Loss Bug
- **Data Persistence Issue** (Reported by beta tester)
  - Users were losing all expenses except Survival items when returning to app
  - Root cause: Onboarding data was prioritized over saved localStorage data
  - Fix: Reversed priority order to check localStorage first, then onboarding data
  - Impact: All returning users now retain their data across sessions
  - Discovered via first beta feedback response

### Changed - Onboarding Messaging
- **OnboardingComplete Component** - Updated copy for accuracy
  - "Your essentials are set" (was: unclear what was accomplished)
  - "You've added your income, rent, groceries, and utilities — your core Survival Budget"
  - Clearer expectations about what comes next
  - More specific about what can be edited
  - Better framing of savings as "Future Building"

### Added - Beta Feedback System
- **Google Form Survey** (11 questions, 3-5 minutes)
  - User context validation (budgeting habits, interest drivers)
  - Core experience metrics (affordability clarity, priority system)
  - Feature prioritization (History, Savings, Reminders, Templates)
  - Messaging validation ("tracking burnout" resonance)
  - Open feedback collection
- **Email Templates** for beta tester outreach
- **LinkedIn Follow-up Strategy** for Wave 2 recruitment

### Changed - Accessibility Improvements
- **Contrast Ratios** (WCAG 2.1 compliant)
  - Coming Soon badges: text-gray-700 on bg-gray-200 (4.5:1+)
  - Disabled nav items: text-gray-500 (improved visibility)
  - Section headers: text-gray-600 (better readability)
- **Softer Black Text**
  - Changed all text-gray-900 → text-gray-800
  - Reduced eye strain, more professional appearance
- **Typography**
  - Added leading-relaxed to Privacy page body text
  - Ensures 1.5+ line height for better readability

### Changed - Beta Gate Refinements
- "Contact us" → "Reach us" (more conversational)
- Consistent text-gray-800 for all headings

### Security - Intellectual Property Protection
- **Comprehensive .gitignore** updates
  - Protected design process documentation (.sessions/, audits/)
  - Protected deployment scripts (*.bat files)
  - Protected strategy documents (PRD, BRIEF, roadmap files)
  - Protected inspiration/reference materials
  - Kept source code and public documentation visible

---

## [1.0.0-beta.2] - 2025-10-22

### Session: Beta Feedback Implementation

### Added - Privacy & Transparency
- **Privacy Statement Page** (`/privacy`)
  - Clear, jargon-free explanation of data handling
  - Explains localStorage approach (no server storage)
  - Lists third-party services (Formspree, Netlify)
  - Provides data deletion instructions
  - Contact email for privacy questions
- **Privacy Navigation**
  - Added Privacy link to slide-out navigation menu (More section)
  - Added Privacy link to budget screen footer
  - Shield icon for visual consistency

### Added - Expense Management
- **Move Expenses Between Priorities**
  - Priority dropdown in expense edit modal
  - Shows all 4 priority levels (Survival, Important, Quality of Life, Future Building)
  - Visual warning when selecting different priority
  - Preserves expense data (name, amount, category, enabled state) during move
  - Maintains expense ID for reference integrity

### Added - Navigation Improvements
- **Coming Soon Badges**
  - Added to non-functional navigation items:
    - Budget History
    - Savings
    - Profile
    - Settings
    - Help & Support
  - Visual feedback: grayed out icons/text, disabled state
  - Prevents user confusion in MVP
  - Shows roadmap transparently

### Changed - Strategic Messaging
- **Beta Access Gate Messaging**
  - Hero statement: "Budget without the tracking burnout"
  - Removed jargon ("priority-based budgeting" → positioning statement)
  - Added 3 benefit bullets:
    - ✓ No endless expense tracking
    - ✓ See what's affordable at a glance
    - ✓ Your data stays on your device
  - Anti-value subtext: "Stop tracking. Start prioritizing."
  - Simplified welcome: "Help us test a simpler way to budget"
  - **Strategic goal**: Target overwhelmed budgeters (Type 1 users), repel detailed trackers

### Technical Details
- All changes deployed to Netlify (survivalbudget.com)
- Privacy page uses simple pathname routing (no React Router dependency)
- Expense move logic handles savings goal updates correctly
- Navigation properly disables non-functional items with `disabled` attribute

---

## Session Context & Decisions

### Beta Feedback Priorities (Addressed)
1. ✅ **Privacy Statement** (Highest Priority)
   - Rationale: Financial tool requires trust signal
   - Implementation: Full page with clear language

2. ✅ **Move Expenses Between Categories** (High Priority)
   - Rationale: Core UX improvement for budget flexibility
   - Implementation: Priority dropdown in edit modal

3. ⏸️ **Utility Breakdown** (Skipped)
   - Rationale: Contradicts core value prop ("stop tracking")
   - Decision: Breaking utilities into line items encourages granular tracking, which causes burnout for target users
   - Recommendation: Wait for more beta feedback before implementing

### Strategic Value Proposition
**Target User: Type 1 (Overwhelmed Budgeters)**
- People drowning in expense tracking
- Need simple "can I afford this?" answers
- Want stress-free budgeting without daily maintenance

**Anti-Target: Type 2 (Organized Trackers)**
- Already comfortable with detailed tracking
- Want granular categorization
- Prefer tools like YNAB, Mint

**Core Message**: "Budget without the tracking burnout"

### MVP Philosophy
- Only show functional features
- Be transparent about what's coming
- Don't waste user time with placeholder pages
- Clear, supportive, marketing-rooted copy
- No walls of text

---

## Future Considerations

### Features Marked "Coming Soon"
- Budget History (snapshot tracking over time)
- Savings Tracker (goal-based savings)
- Profile (user preferences, customization)
- Settings (app configuration)
- Help & Support (documentation, tutorials)

### Open Questions for Beta Testing
1. Do users actually want utility breakdown?
2. Is the expense moving feature discoverable?
3. Does the value prop messaging attract the right users?
4. Are "Coming Soon" badges effective or frustrating?

---

## [1.0.0-beta.1] - 2025-10-19 to 2025-10-20

### Session: Beta Deployment & Polish

### Added - Beta Access System
- **Beta Access Gate** (BetaAccessGate component)
  - Name and email capture form with validation
  - Formspree integration (endpoint: xanpkalq)
  - Email notifications: "New Beta Tester: [Name]"
  - Custom Survival Budget logo (replaced generic shield icon)
  - Graceful degradation: user gets access even if Formspree fails
  - Stores user info in localStorage (betaAccessGranted, betaUserInfo)
  - "Built by Articulate Digital" branding with link
  - Contact email: hello@articulatedigital.co

### Added - Income Management
- **Edit Income Button**
  - Pencil icon next to "Monthly Income" in budget summary
  - Opens bottom sheet modal for editing
  - Prevents accidental income changes
  - Desktop-friendly controls for expense management

### Added - Categories Screen
- **ExpenseCategories Component**
  - Visual display of expense categories
  - Integrated into navigation flow
  - Helps users understand priority system

### Fixed - Critical Build Issues
- **HapticFeedback Export Error**
  - Fixed missing useHapticFeedback export
  - Resolved TypeScript compilation errors
- **Navigation System**
  - Fixed screen transitions
  - Improved routing logic
- **Test Suite**
  - All 59 tests passing (was 57/59)
  - Updated failing tests for new components
  - 100% test coverage maintained

### Fixed - Onboarding Data Flow
- **Data Persistence Bug**
  - Prioritize fresh onboarding data over stale localStorage
  - Pass rent, groceries, utilities from onboarding to BudgetApp
  - Fix completion messaging accuracy
  - Prevent data loss when completing onboarding

### Fixed - UI Polish
- **Beta Gate Design**
  - Removed drop shadow for seamless look
  - Removed border from card
  - Cleaner, more professional appearance

### Changed - Configuration
- **Session Timeout**: Extended from 5 minutes to 24 hours
  - Better UX for beta testers
  - Reduces re-onboarding friction
- **Income Validation**
  - Added max limits and warning messages
  - Prevents unrealistic income values
- **Over-Budget Messaging**
  - Removed duplicate warning messages
  - Cleaner budget summary display

### Technical Improvements
- **Linting**: Fixed all 8 linting errors
- **Bundle Size**: 242.69 KB (69.17 KB gzipped)
- **Deployment Configs**: Added Netlify and Vercel configurations
- **Line Endings**: Added .gitattributes for normalization
- **Documentation**: Comprehensive deployment guide created

---

## [1.0.0-beta] - 2025-10-15

### Session: Mobile UI Cleanup & Structure

### Changed - Mobile Interface
- Cleaned up Survival Budget mobile UI
- Improved component structure
- Removed old/unused screens
- File cleanup and organization

### Infrastructure
- Updated .gitignore
- Cleanup of legacy files
- Merge from prod-pin branch

---

## Repository Information
- **Main Branch**: `main`
- **Deployment**: Netlify (survivalbudget.com)
- **Beta Access**: Email capture via Formspree
- **Tech Stack**: React 18.3.1, TypeScript, Vite 7.1.10, Tailwind CSS

---

## Notes for Future Sessions
- All commits include detailed messages (search with `git log --grep="Claude"`)
- Privacy policy last updated: October 21, 2025
- Contact for beta feedback: hello@articulatedigital.co
