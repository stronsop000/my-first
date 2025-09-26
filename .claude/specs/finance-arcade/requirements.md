# Requirements Document

## Introduction

Finance Arcade is a comprehensive, responsive web application that teaches finance concepts through interactive mini-games. The platform targets BYU undergrad students (ages 18-25) taking ECON/FIN 201 courses, providing hands-on practice to internalize finance principles. The application must be production-ready, fully responsive, accessible, and deployable to Vercel with PWA capabilities.

## Requirements

### Requirement 1: Core Platform Architecture
**User Story:** As a student, I want to access a responsive finance learning platform on any device, so that I can learn financial concepts anywhere.

#### Acceptance Criteria
1. WHEN accessing the application on desktop, tablet, or mobile THEN the interface SHALL adapt responsively using mobile-first design
2. WHEN using touch or mouse interactions THEN all controls SHALL respond appropriately to the input method
3. IF the device supports keyboard navigation THEN all game features SHALL be accessible via keyboard-only interaction
4. WHEN the application loads THEN it SHALL achieve Lighthouse performance score ≥ 90 on mobile
5. WHEN installed as PWA THEN the application SHALL function offline for core features and at least NPV Builder game

### Requirement 2: Game Engine Framework
**User Story:** As a developer, I want a reusable game engine architecture, so that all games follow consistent patterns and behaviors.

#### Acceptance Criteria
1. WHEN creating a new game THEN it SHALL implement the GameDefinition interface with typed state management
2. WHEN a game runs THEN it SHALL use the GameHost component for consistent UX patterns
3. IF a game event occurs THEN the system SHALL track telemetry events (game_start, level_complete, hint_used, quit, time_on_task, concept_mastered)
4. WHEN game state changes THEN it SHALL persist to IndexedDB every 5 seconds and on visibility change
5. IF the player requests a hint THEN the system SHALL provide contextual help and track usage

### Requirement 3: NPV Builder Game Implementation
**User Story:** As a student, I want to learn time value of money through interactive NPV calculations, so that I understand cash flow discounting.

#### Acceptance Criteria
1. WHEN adding cash flows THEN I SHALL be able to drag-and-drop yearly cash flow cards onto a timeline
2. WHEN adjusting discount rate (1-30%) THEN NPV SHALL update in real-time with per-year discount factors displayed
3. WHEN NPV is calculated THEN the system SHALL display "Invest/Indifferent/Reject" based on NPV > 0, = 0, < 0
4. IF using keyboard navigation THEN all drag-and-drop actions SHALL have keyboard equivalents
5. WHEN completing tutorial THEN it SHALL explain discounting in ≤ 6 steps with accessible narration
6. WHEN progressing through levels THEN I SHALL encounter: single project → mutually exclusive projects → capital rationing scenarios
7. IF playing offline THEN the complete NPV Builder game SHALL function without internet connection

### Requirement 4: Budget Battle Game Implementation
**User Story:** As a student, I want to practice budgeting skills with realistic constraints, so that I understand fixed vs. variable costs and financial tradeoffs.

#### Acceptance Criteria
1. WHEN creating budget categories THEN I SHALL distinguish between fixed and variable costs visually
2. WHEN allocating monthly budget THEN I SHALL meet constraints: savings ≥ X%, debt payments ≥ Y
3. WHEN random financial events occur THEN I SHALL manage budget buffers and reprioritize spending
4. WHEN completing a budget round THEN I SHALL receive feedback on variance vs. plan and rolling 3-month trends
5. IF maintaining positive cash balance and target savings for 3 consecutive rounds THEN mastery SHALL be achieved
6. WHEN using accessibility features THEN all budget allocation controls SHALL be operable via keyboard

### Requirement 5: Elasticity Explorer Game Implementation
**User Story:** As a student, I want to explore price elasticity concepts interactively, so that I understand demand curves and revenue implications.

#### Acceptance Criteria
1. WHEN adjusting price/quantity THEN I SHALL move along a demand curve with real-time elasticity computation
2. WHEN elasticity is calculated THEN the system SHALL display point elasticity formula and highlight elastic/inelastic zones
3. WHEN viewing revenue analysis THEN I SHALL see revenue curve overlay with MR sign flip near unit elasticity
4. WHEN completing quests THEN I SHALL achieve targets: |E| > 1, < 1, = 1 at marked curve points
5. IF using keyboard navigation THEN price/quantity adjustments SHALL be controllable via arrow keys or input fields

### Requirement 6: User Interface and Experience
**User Story:** As a student, I want consistent, intuitive game controls and clear progress tracking, so that I can focus on learning rather than navigating the interface.

#### Acceptance Criteria
1. WHEN playing any game THEN the HUD SHALL display: timer, score, objective status, restart button, hints (limited), progress bar
2. WHEN starting a game THEN tutorial SHALL be skippable, accessible with narration, and replayable from pause
3. WHEN accessing glossary THEN I SHALL find definitions for NPV, IRR, Payback, Elasticity with short examples
4. WHEN viewing progress THEN I SHALL see completion status stored in local storage/IndexedDB with export/import JSON capability
5. WHEN sharing progress THEN I SHALL copy URL with game + level state encoded (zlib + base64) for small payloads

### Requirement 7: Accessibility Compliance (WCAG 2.1 AA)
**User Story:** As a user with disabilities, I want full access to all game features, so that I can learn finance concepts regardless of my abilities.

#### Acceptance Criteria
1. WHEN navigating with keyboard THEN all interactive elements SHALL be reachable via Tab with visible focus rings
2. WHEN using screen readers THEN all content SHALL have proper semantic HTML and ARIA labels for dynamic parts
3. WHEN pressing Escape THEN modals SHALL close; when pressing Enter/Space THEN focused controls SHALL activate
4. IF user prefers reduced motion THEN animations SHALL respect prefers-reduced-motion setting
5. WHEN viewing content THEN color contrast SHALL meet ≥ 4.5:1 ratio requirements
6. IF audio content exists THEN captions SHALL be provided

### Requirement 8: Performance and Technical Standards
**User Story:** As a user on any device, I want fast loading times and reliable performance, so that my learning experience is not interrupted.

#### Acceptance Criteria
1. WHEN loading on mobile over 4G THEN Time to Interactive SHALL be ≤ 2.5 seconds
2. WHEN navigating between routes THEN code SHALL be split and heavy assets lazy-loaded
3. WHEN experiencing errors THEN error boundaries SHALL provide graceful fallbacks for each game
4. IF WebGL/canvas is unsupported THEN fallback interfaces SHALL maintain functionality
5. WHEN third-party scripts load THEN no blocking SHALL occur before user consent

### Requirement 9: Data Privacy and Analytics
**User Story:** As a user, I want control over my data and privacy, so that I can learn without unwanted tracking.

#### Acceptance Criteria
1. WHEN first visiting THEN no tracking SHALL occur until explicit user consent
2. WHEN providing consent THEN minimal telemetry SHALL track: game_start, level_complete, hint_used, quit, time_on_task, concept_mastered
3. WHEN storing progress THEN data SHALL remain local unless user opts into cloud sync
4. WHEN exporting data THEN users SHALL download JSON with checksum verification
5. IF analytics are enabled THEN data SHALL be pseudonymized and aggregated

### Requirement 10: Testing and Quality Assurance
**User Story:** As a developer, I want comprehensive test coverage, so that the application maintains quality and reliability.

#### Acceptance Criteria
1. WHEN running unit tests THEN all financial calculations (NPV, elasticity, budget variance) SHALL be verified for correctness
2. WHEN executing E2E tests THEN each game's happy path and keyboard-only flow SHALL be covered using Playwright
3. WHEN testing across devices THEN iPhone 14, Pixel 7, iPad, and 1280×800 laptop SHALL be emulated
4. WHEN running Lighthouse CI THEN Mobile performance threshold ≥ 90 SHALL be maintained
5. WHEN scanning with Axe THEN zero critical accessibility issues SHALL be reported

### Requirement 11: Deployment and Infrastructure
**User Story:** As a product owner, I want reliable deployment to Vercel with proper configuration, so that users can access the application consistently.

#### Acceptance Criteria
1. WHEN deploying to Vercel THEN the application SHALL be accessible at my-first-black.vercel.app or designated subdomain
2. WHEN configuring PWA THEN vercel.json SHALL include proper headers for caching and offline functionality
3. WHEN building for production THEN environment variables SHALL be properly configured in Vercel settings
4. IF deployment fails THEN CI/CD pipeline SHALL provide clear error reporting and rollback capability
5. WHEN monitoring production THEN version and build SHA SHALL be visible in application footer

### Requirement 12: Educational Effectiveness
**User Story:** As an instructor, I want measurable learning outcomes, so that I can integrate the platform into my curriculum.

#### Acceptance Criteria
1. WHEN students complete tutorials THEN D1 playthrough rate SHALL achieve ≥ 70%
2. WHEN students engage with platform THEN average of two games SHALL be started per visit
3. WHEN measuring learning impact THEN concept mastery (pre/post quiz delta) SHALL show ≥ +25% improvement
4. WHEN tracking engagement THEN median session time SHALL be ≥ 6 minutes
5. IF instructors embed games THEN at least 1 instructor SHALL use iframe integration within 2 weeks of launch