# Changelog

All notable changes to Survival Budget will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-beta] - 2025-01-22

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
