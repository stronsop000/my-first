# Implementation Plan

## Infrastructure and Core Setup

- [ ] 1. Set up Next.js 14 project structure with App Router
  - Create new Next.js 14 project with TypeScript
  - Configure App Router directory structure
  - Set up basic layout and page components
  - _Requirements: 1.1, 8.2_

- [ ] 2. Configure development tools and dependencies
  - Install and configure Tailwind CSS + shadcn/ui
  - Set up Zustand for state management
  - Install Zod for schema validation
  - Configure ESLint, Prettier, and TypeScript strict mode
  - _Requirements: 1.1, 8.2_

- [ ] 3. Implement core game engine interface
  - Create GameDefinition TypeScript interface
  - Implement GameEvent and GameState types
  - Create base game engine utility functions
  - _Requirements: 2.1, 2.2_

- [ ] 4. Create reusable GameHost component
  - Build GameHost component that consumes GameDefinition
  - Implement game lifecycle management (start, pause, end)
  - Add error boundary for game-specific errors
  - _Requirements: 2.1, 2.2_

## State Management and Data Layer

- [ ] 5. Implement Zustand store architecture
  - Create main app store with user, game, and progress state
  - Implement state persistence to IndexedDB
  - Add state hydration and dehydration logic
  - Write unit tests for store actions
  - _Requirements: 2.2, 6.4_

- [ ] 6. Create data models and validation schemas
  - Implement User, GameProgress, and GameSession interfaces
  - Create Zod schemas for all data models
  - Add data migration utilities for version compatibility
  - _Requirements: 6.4, 9.4_

- [ ] 7. Implement local storage and IndexedDB persistence
  - Create storage abstraction layer
  - Implement IndexedDB for game progress and sessions
  - Add localStorage fallback for unsupported browsers
  - Create data export/import functionality
  - _Requirements: 6.4, 8.3_

## User Interface and Accessibility

- [ ] 8. Build core UI components with shadcn/ui
  - Set up shadcn/ui component library
  - Create custom theme with finance-appropriate colors
  - Build reusable components: Button, Card, Modal, Progress
  - Implement responsive grid system
  - _Requirements: 1.1, 6.1, 7.4_

- [ ] 9. Implement comprehensive HUD component
  - Create game HUD with timer, score, progress bar
  - Add hint system with usage tracking
  - Implement pause/resume functionality
  - Add restart and quit options
  - _Requirements: 6.1, 2.5_

- [ ] 10. Create accessible tutorial modal system
  - Build TutorialModal component with step navigation
  - Implement skip functionality with confirmation
  - Add screen reader support with ARIA labels
  - Create replayable tutorial from pause menu
  - _Requirements: 6.2, 7.1, 7.2_

- [ ] 11. Implement WCAG 2.1 AA accessibility features
  - Add comprehensive keyboard navigation support
  - Implement focus management for complex components
  - Create high contrast mode support
  - Add prefers-reduced-motion handling
  - Write accessibility unit tests
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

## NPV Builder Game Implementation

- [ ] 12. Create NPV Builder game definition and state
  - Implement NPVBuilderState interface and initial state
  - Create cash flow and project data models
  - Write NPV calculation logic with unit tests
  - _Requirements: 3.1, 3.3, 10.1_

- [ ] 13. Build NPV Builder UI components
  - Create cash flow card component with drag-and-drop
  - Implement interactive timeline grid
  - Build discount rate slider with real-time updates
  - Create investment decision indicator
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 14. Implement NPV Builder drag-and-drop system
  - Create accessible drag-and-drop with keyboard support
  - Add visual feedback for drag operations
  - Implement drop zones with validation
  - Add keyboard alternatives (arrow keys + enter)
  - _Requirements: 3.1, 3.4, 7.1_

- [ ] 15. Add NPV Builder tutorial and progression system
  - Create 6-step tutorial covering discounting concepts
  - Implement three levels: single project, mutually exclusive, capital rationing
  - Add mastery assessment logic
  - Write E2E tests for keyboard-only completion
  - _Requirements: 3.5, 3.6, 10.2_

- [ ] 16. Implement NPV Builder offline functionality
  - Configure service worker for NPV Builder assets
  - Add offline state detection and UI
  - Implement offline data synchronization
  - Test complete offline functionality
  - _Requirements: 1.5, 3.7_

## Budget Battle Game Implementation

- [ ] 17. Create Budget Battle game definition and state
  - Implement BudgetBattleState interface
  - Create budget category and event data models
  - Write budget validation and variance calculation logic
  - _Requirements: 4.1, 4.2, 10.1_

- [ ] 18. Build Budget Battle UI components
  - Create budget category allocation interface
  - Implement constraint validation with visual feedback
  - Build event notification system
  - Create variance analysis dashboard
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 19. Implement Budget Battle event system
  - Create random event generation logic
  - Build event impact calculation system
  - Implement time-limited rebalancing interface
  - Add consequence system for next rounds
  - _Requirements: 4.3, 4.4_

- [ ] 20. Add Budget Battle mastery system
  - Implement 3-round consecutive success tracking
  - Create rolling trend analysis
  - Add mastery achievement logic
  - Write comprehensive unit tests
  - _Requirements: 4.4, 4.5_

## Elasticity Explorer Game Implementation

- [ ] 21. Create Elasticity Explorer game definition and state
  - Implement ElasticityExplorerState interface
  - Create demand curve and quest data models
  - Write elasticity calculation algorithms
  - _Requirements: 5.1, 5.2, 10.1_

- [ ] 22. Build interactive demand curve component
  - Create responsive graph with price/quantity axes
  - Implement draggable price/quantity point
  - Add real-time elasticity calculation display
  - Show elastic/inelastic zone highlighting
  - _Requirements: 5.1, 5.2_

- [ ] 23. Implement revenue analysis overlay
  - Create revenue curve visualization
  - Add marginal revenue calculation and display
  - Implement MR sign flip highlighting
  - Add toggle for revenue/demand curve views
  - _Requirements: 5.3_

- [ ] 24. Create Elasticity Explorer quest system
  - Implement quest objectives for |E| targets
  - Create quest progress tracking
  - Add quest completion validation
  - Build quest UI with clear objectives
  - _Requirements: 5.4_

- [ ] 25. Add keyboard navigation for Elasticity Explorer
  - Implement arrow key navigation for price/quantity
  - Create keyboard shortcuts for curve interaction
  - Add input field alternatives for precise values
  - Write keyboard accessibility tests
  - _Requirements: 5.5, 7.1_

## Application Pages and Navigation

- [ ] 26. Create home page and game catalog
  - Build responsive home page with game overview
  - Implement game catalog with difficulty indicators
  - Add game preview and estimated time display
  - Create game selection and navigation logic
  - _Requirements: 6.1, 11.2_

- [ ] 27. Implement progress tracking page
  - Create comprehensive progress dashboard
  - Show completion status for all games
  - Display XP, level, and achievement progress
  - Add learning objective mastery tracking
  - _Requirements: 6.3, 12.1_

- [ ] 28. Build glossary page with search
  - Create searchable finance terms glossary
  - Include NPV, IRR, Payback, Elasticity definitions
  - Add practical examples for each concept
  - Implement responsive glossary layout
  - _Requirements: 6.3_

- [ ] 29. Create sharing and URL state functionality
  - Implement game state encoding in URLs
  - Create share functionality with native Web Share API
  - Add clipboard fallback for unsupported browsers
  - Build challenge link system
  - _Requirements: 6.5_

## Testing Implementation

- [ ] 30. Set up testing infrastructure
  - Configure Vitest for unit testing
  - Set up Playwright for E2E testing
  - Configure testing coverage reporting
  - Create CI/CD pipeline with test automation
  - _Requirements: 10.1, 10.4_

- [ ] 31. Write comprehensive unit tests
  - Test all financial calculation functions (NPV, elasticity, budget)
  - Test Zustand store state management
  - Test component rendering and interaction logic
  - Test utility functions and data validation
  - _Requirements: 10.1_

- [ ] 32. Implement E2E test suite with Playwright
  - Write complete game playthrough tests for all three games
  - Test keyboard-only navigation flows
  - Add device emulation tests (iPhone 14, Pixel 7, iPad, desktop)
  - Test offline functionality for NPV Builder
  - _Requirements: 10.2, 10.3_

- [ ] 33. Add performance and accessibility testing
  - Configure Lighthouse CI with performance thresholds
  - Set up automated axe-core accessibility scanning
  - Add bundle size monitoring and alerts
  - Create performance regression testing
  - _Requirements: 10.4, 10.5_

## Analytics and Privacy

- [ ] 34. Implement privacy-first analytics system
  - Create consent management interface
  - Build event tracking with local queuing
  - Implement pseudonymization for user data
  - Add analytics dashboard for educational metrics
  - _Requirements: 9.1, 9.2, 9.5_

- [ ] 35. Add educational effectiveness tracking
  - Track learning objective completion
  - Implement time-on-task measurement
  - Add hint usage pattern analysis
  - Create drop-off point identification
  - _Requirements: 9.5, 12.1, 12.3, 12.4_

## PWA and Performance Optimization

- [ ] 36. Implement PWA functionality
  - Create comprehensive service worker
  - Configure web app manifest for installation
  - Implement background sync for offline events
  - Add update notification system
  - _Requirements: 1.5_

- [ ] 37. Optimize performance and loading
  - Implement code splitting for all routes
  - Add lazy loading for game definitions
  - Optimize images and assets with Next.js Image
  - Configure caching strategies for static assets
  - _Requirements: 8.1, 8.2_

- [ ] 38. Add error handling and monitoring
  - Implement comprehensive error boundaries
  - Create graceful degradation for unsupported features
  - Add error reporting and monitoring
  - Build fallback UI components
  - _Requirements: 8.3, 8.4_

## Deployment and Production

- [ ] 39. Configure Vercel deployment
  - Set up Vercel project with environment variables
  - Configure custom domain (my-first-black.vercel.app)
  - Set up PWA headers and caching rules
  - Configure build optimization settings
  - _Requirements: 11.1, 11.2_

- [ ] 40. Production deployment and testing
  - Deploy to production environment
  - Run full test suite against production
  - Verify PWA installation on multiple devices
  - Test performance with real user conditions
  - Monitor and fix any production issues
  - _Requirements: 11.3, 11.4, 11.5_

- [ ] 41. Create comprehensive documentation
  - Write detailed README with setup instructions
  - Document deployment process and configuration
  - Create PRD compliance report mapping
  - Add troubleshooting guide and FAQ
  - _Requirements: 11.4_

## Quality Assurance and Launch

- [ ] 42. Conduct final QA testing
  - Execute complete manual testing checklist
  - Verify keyboard-only completion for all games
  - Test mobile Safari touch interactions
  - Validate screen reader compatibility
  - _Requirements: 7.1, 10.2, 10.5_

- [ ] 43. Performance validation and optimization
  - Run final Lighthouse audits on all pages
  - Verify mobile performance scores ≥ 90
  - Test loading times on various connection speeds
  - Optimize any performance bottlenecks
  - _Requirements: 8.1, 10.4_

- [ ] 44. Launch preparation and monitoring
  - Set up production monitoring and alerting
  - Create backup and rollback procedures
  - Prepare launch communication materials
  - Schedule soft launch with limited user testing
  - _Requirements: 12.2, 12.5_