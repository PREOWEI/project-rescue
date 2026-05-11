export type Classification = 'functional' | 'non-functional';
export type Priority = 'high' | 'medium' | 'low';
export type LevelMode = 'mixed' | 'classify-all' | 'prioritise-only' | 'identify-only';

export interface Statement {
  id: string;
  text: string;
  speaker: string;
  speakerRole: string;
  isRequirement: boolean;
  correctType?: Classification;
  correctClassification?: Classification;
  correctPriority?: Priority;
  explanation: string;
}

export interface Level {
  id: string;
  number: number;
  title: string;
  projectName: string;
  scenarioDescription: string;
  taskDescription: string;
  clientName: string;
  industry: string;
  mode: LevelMode;
  statements: Statement[];
}

export interface UserAnswer {
  statementId: string;
  selected: boolean;
  classification?: Classification;
  priority?: Priority;
}

export interface GameState {
  levelId: string;
  answers: UserAnswer[];
  submitted: boolean;
  statementOrder?: string[];
  timeLeft?: number;
  score?: number;
}

export interface BreakdownEntry {
  selectionCorrect: boolean;
  classificationCorrect: boolean;
  priorityCorrect: boolean;
}

export const STORAGE_KEY_SELECTED_LEVEL = 'project_rescue_selected_level';
export const STORAGE_KEY_GAME_STATE = 'project_rescue_game_state';
export const STORAGE_KEY_BEST_SCORE_PREFIX = 'project_rescue_best_score_';
export const STORAGE_KEY_XP_SCORE_PREFIX = 'project_rescue_xp_score_';
export const STORAGE_KEY_LAST_SCORE_PREFIX = 'project_rescue_last_score_';
export const STORAGE_KEY_ASSISTED_UNLOCK_PREFIX = 'project_rescue_assisted_unlock_';
export const STORAGE_KEY_REVEAL_REQUEST_PREFIX = 'project_rescue_reveal_request_';
export const STORAGE_KEY_ATTEMPT_COUNT_PREFIX = 'project_rescue_attempt_count_';
export const STORAGE_KEY_LAST_PLAYED_PREFIX = 'project_rescue_last_played_';
export const STORAGE_KEY_SHOW_TIMER = 'project_rescue_show_timer';
export const STORAGE_KEY_THEME = 'project_rescue_theme';
export const STORAGE_KEY_BEST_SCORE = `${STORAGE_KEY_BEST_SCORE_PREFIX}level-001`;

export const LEVELS: Level[] = [
  {
    id: 'level-001',
    number: 1,
    title: 'Level 1 - Hospital Patient Portal',
    projectName: 'MediConnect Patient Portal',
    scenarioDescription:
      'You have been assigned as a junior requirements engineer on the MediConnect project. A regional hospital network wants to build a web-based patient portal that allows patients to book appointments, view medical records, and communicate with their doctors. You are sitting in on a stakeholder discovery session. Your job is to identify which stakeholder statements can be turned into valid software requirements.',
    taskDescription:
      'Review each stakeholder statement below. Check the statements that represent valid software requirements. For each selected requirement, choose its type and assign a priority level.',
    clientName: 'Northfield Regional Hospital',
    industry: 'Healthcare',
    mode: 'mixed',
    statements: [
      {
        id: 'stmt-001',
        text: 'Patients should be able to log in using their hospital ID and a secure password to access their personal health records.',
        speaker: 'Dr. Anita Sharma',
        speakerRole: 'Chief Medical Officer',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation:
          'This is a functional requirement because it describes a specific system action. It is high priority because secure access is foundational.',
      },
      {
        id: 'stmt-002',
        text: 'The portal should look modern and feel welcoming. Patients are already stressed enough.',
        speaker: 'Marcus Webb',
        speakerRole: 'Patient Experience Manager',
        isRequirement: false,
        explanation:
          'This is a vague design preference, not a measurable or testable requirement as written.',
      },
      {
        id: 'stmt-003',
        text: 'The system must load any page within 2 seconds on a standard broadband connection.',
        speaker: 'Priya Nair',
        speakerRole: 'IT Infrastructure Lead',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation:
          'This is a non-functional performance requirement. It is high priority because slow pages would harm usability.',
      },
      {
        id: 'stmt-004',
        text: 'Patients should receive an automated email confirmation within 5 minutes of booking an appointment.',
        speaker: 'Dr. Anita Sharma',
        speakerRole: 'Chief Medical Officer',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'medium',
        explanation:
          'This is a functional requirement because it describes system behavior after booking. It is useful but not core access, so medium priority fits.',
      },
      {
        id: 'stmt-005',
        text: 'All patient data must be encrypted at rest and in transit, complying with HIPAA regulations.',
        speaker: 'Lena Kovacs',
        speakerRole: 'Compliance Officer',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation:
          'This is a non-functional security and compliance requirement. It is high priority because patient data protection is mandatory.',
      },
      {
        id: 'stmt-006',
        text: 'I think we should just use whatever technology the developers are most comfortable with. They know best.',
        speaker: 'James Okafor',
        speakerRole: 'Hospital Administrator',
        isRequirement: false,
        explanation:
          'This is a technology preference, not a statement of required system behavior, quality, or constraint.',
      },
    ],
  },
  {
    id: 'level-002',
    number: 2,
    title: 'Level 2 - Online Banking App',
    projectName: 'SecureBank Mobile',
    scenarioDescription:
      'A regional bank is preparing a mobile banking release. The product team has already approved this requirement list, but it needs to be organised before handoff to engineering.',
    taskDescription:
      'Review the approved requirement notes and organise each one by type so the engineering team can plan the work clearly.',
    clientName: 'Horizon Credit Union',
    industry: 'Fintech',
    mode: 'classify-all',
    statements: [
      {
        id: 'stmt-201',
        text: 'Customers must be able to transfer money between their own checking and savings accounts.',
        speaker: 'Amara Lewis',
        speakerRole: 'Product Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This describes a system capability, so it is functional.',
      },
      {
        id: 'stmt-202',
        text: 'The app must lock the session after 3 minutes of inactivity.',
        speaker: 'Nikolai Petrov',
        speakerRole: 'Security Lead',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is a security constraint on the app behavior, so it is non-functional.',
      },
      {
        id: 'stmt-203',
        text: 'Customers must be able to download a PDF statement for the previous 12 months.',
        speaker: 'Rina Patel',
        speakerRole: 'Customer Operations Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'medium',
        explanation: 'This describes a user action the system must support, so it is functional.',
      },
      {
        id: 'stmt-204',
        text: 'Balance information must refresh in under 5 seconds after a completed transfer.',
        speaker: 'Owen Brooks',
        speakerRole: 'Mobile Engineering Manager',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'medium',
        explanation: 'This is a performance target, so it is non-functional.',
      },
    ],
  },
  {
    id: 'level-003',
    number: 3,
    title: 'Level 3 - Food Delivery App',
    projectName: 'QuickBite Delivery',
    scenarioDescription:
      'A food delivery startup is planning its next release. The release manager needs help deciding which approved requirements should be handled first.',
    taskDescription:
      'Review the release planning notes and assign the priority that best matches customer impact, business risk, and delivery urgency.',
    clientName: 'QuickBite',
    industry: 'Food Delivery',
    mode: 'prioritise-only',
    statements: [
      {
        id: 'stmt-301',
        text: 'Customers must be able to see real-time order status after checkout.',
        speaker: 'Maya Chen',
        speakerRole: 'Customer Experience Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'Order tracking is central to customer trust after payment, so it is high priority.',
      },
      {
        id: 'stmt-302',
        text: 'Restaurant partners should be able to pause incoming orders when their kitchen is overloaded.',
        speaker: 'Diego Santos',
        speakerRole: 'Restaurant Success Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This prevents operational failures and bad customer experiences, so it is high priority.',
      },
      {
        id: 'stmt-303',
        text: 'Customers should be able to save favourite restaurants to a personal list.',
        speaker: 'Elena Novak',
        speakerRole: 'Growth Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'low',
        explanation: 'This is useful convenience, but not essential to ordering or delivery.',
      },
      {
        id: 'stmt-304',
        text: 'The checkout page must process payment confirmation within 4 seconds under normal load.',
        speaker: 'Samir Gupta',
        speakerRole: 'Payments Engineer',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'medium',
        explanation: 'This is important performance work, but the core payment capability matters first.',
      },
      {
        id: 'stmt-305',
        text: 'Drivers must receive the restaurant address and customer drop-off address after accepting an order.',
        speaker: 'Nora Hill',
        speakerRole: 'Driver Operations Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'Drivers cannot complete delivery without these addresses, so it is high priority.',
      },
      {
        id: 'stmt-306',
        text: 'Marketing banners should be configurable by city.',
        speaker: 'Joanne Kim',
        speakerRole: 'Marketing Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'low',
        explanation: 'This supports campaigns, but it is not critical to ordering or delivery operations.',
      },
    ],
  },
  {
    id: 'level-004',
    number: 4,
    title: 'Level 4 - University Course Registration',
    projectName: 'CampusEnroll',
    scenarioDescription:
      'A university is replacing an old course registration system. You are reviewing raw discovery notes from students, advisors, and administrators.',
    taskDescription:
      'Review the discovery notes and decide which statements are ready to become valid, actionable software requirements.',
    clientName: 'Westbridge University',
    industry: 'Education',
    mode: 'identify-only',
    statements: [
      {
        id: 'stmt-401',
        text: 'Students must be able to search available courses by department, course code, and instructor name.',
        speaker: 'Liam Wright',
        speakerRole: 'Student Representative',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a clear system capability and can be tested.',
      },
      {
        id: 'stmt-402',
        text: 'The new system should feel less annoying than the old one.',
        speaker: 'Priya Shah',
        speakerRole: 'Student',
        isRequirement: false,
        explanation: 'This is useful sentiment, but it is too vague to implement or test as a requirement.',
      },
      {
        id: 'stmt-403',
        text: 'Academic advisors must be able to approve or reject overload requests before students finalise registration.',
        speaker: 'Helen Ford',
        speakerRole: 'Academic Advisor',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This describes a specific workflow the system must support.',
      },
      {
        id: 'stmt-404',
        text: 'The database should probably use whatever system IT already likes.',
        speaker: 'Mark Evans',
        speakerRole: 'Department Administrator',
        isRequirement: false,
        explanation: 'This is an implementation preference, not a user-facing requirement or quality constraint.',
      },
      {
        id: 'stmt-405',
        text: 'The system must prevent students from registering for two classes with overlapping meeting times.',
        speaker: 'Alina Moore',
        speakerRole: 'Registrar',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a clear validation rule that the system can enforce.',
      },
      {
        id: 'stmt-406',
        text: 'Registration pages must meet WCAG 2.1 AA accessibility requirements.',
        speaker: 'Jordan Lee',
        speakerRole: 'Accessibility Officer',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is a clear accessibility constraint and therefore a valid non-functional requirement.',
      },
      {
        id: 'stmt-407',
        text: 'It would be nice if the system looked more like popular social media apps.',
        speaker: 'Nina Clarke',
        speakerRole: 'Student Ambassador',
        isRequirement: false,
        explanation: 'This is a broad design preference and is not testable as written.',
      },
      {
        id: 'stmt-408',
        text: 'Students must receive an email receipt after successfully adding or dropping a course.',
        speaker: 'Omar Hassan',
        speakerRole: 'Registrar Assistant',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'medium',
        explanation: 'This is specific, actionable, and testable.',
      },
    ],
  },
  {
    id: 'level-005',
    number: 5,
    title: 'Level 5 - E-Commerce Checkout',
    projectName: 'ShopSwift Checkout',
    scenarioDescription:
      'An online retailer is losing customers during checkout. You are reviewing stakeholder notes from product, payments, support, and operations before the release plan is finalised.',
    taskDescription:
      'Review each stakeholder statement below. Check the statements that represent valid software requirements. For each selected requirement, choose its type and assign a priority level.',
    clientName: 'ShopSwift Retail',
    industry: 'E-Commerce',
    mode: 'mixed',
    statements: [
      {
        id: 'stmt-501',
        text: 'Customers must be able to complete checkout using a saved delivery address.',
        speaker: 'Ava Miller',
        speakerRole: 'Product Owner',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a core checkout capability, so it is a functional requirement and high priority.',
      },
      {
        id: 'stmt-502',
        text: 'The checkout should feel premium and make customers trust us more.',
        speaker: 'Leo Grant',
        speakerRole: 'Brand Manager',
        isRequirement: false,
        explanation: 'This is a broad brand goal, not a measurable or testable software requirement.',
      },
      {
        id: 'stmt-503',
        text: 'Payment authorization must complete within 6 seconds under normal traffic.',
        speaker: 'Nadia Flores',
        speakerRole: 'Payments Lead',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is a performance constraint for a critical checkout step.',
      },
      {
        id: 'stmt-504',
        text: 'Customers must receive an order confirmation number immediately after successful payment.',
        speaker: 'Ibrahim Khan',
        speakerRole: 'Customer Support Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a concrete system behavior after payment and helps support order tracking.',
      },
      {
        id: 'stmt-505',
        text: 'The checkout page should be built with the trendiest frontend framework.',
        speaker: 'Marta Diaz',
        speakerRole: 'Marketing Coordinator',
        isRequirement: false,
        explanation: 'This is an implementation preference, not a stakeholder requirement.',
      },
      {
        id: 'stmt-506',
        text: 'The checkout flow must comply with PCI DSS requirements for card data handling.',
        speaker: 'Victor Chen',
        speakerRole: 'Security Officer',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is a security and compliance constraint, so it is non-functional and high priority.',
      },
    ],
  },
  {
    id: 'level-006',
    number: 6,
    title: 'Level 6 - Ride-Sharing Driver Portal',
    projectName: 'RideLink Driver Portal',
    scenarioDescription:
      'A ride-sharing company is improving its driver portal. The operations team needs release priorities for approved requirements before the next sprint planning session.',
    taskDescription:
      'Review the approved driver portal requirements and assign the priority that best matches safety, operational impact, and user value.',
    clientName: 'RideLink',
    industry: 'Transport',
    mode: 'prioritise-only',
    statements: [
      {
        id: 'stmt-601',
        text: 'Drivers must be able to upload required vehicle inspection documents.',
        speaker: 'Grace Lin',
        speakerRole: 'Driver Compliance Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'Inspection documents affect driver eligibility and compliance, so this is high priority.',
      },
      {
        id: 'stmt-602',
        text: 'Drivers should be able to view weekly earnings broken down by completed trips and bonuses.',
        speaker: 'Noah Reed',
        speakerRole: 'Driver Success Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'medium',
        explanation: 'This is important transparency, but it is less urgent than safety or compliance workflows.',
      },
      {
        id: 'stmt-603',
        text: 'Emergency support must be reachable from the portal in one tap during an active trip.',
        speaker: 'Fatima Ali',
        speakerRole: 'Safety Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This directly affects safety during live trips, so it is high priority.',
      },
      {
        id: 'stmt-604',
        text: 'The portal must load the trip history page within 3 seconds on a 4G connection.',
        speaker: 'Ben Carter',
        speakerRole: 'Platform Engineer',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'medium',
        explanation: 'This is a performance requirement, important but not as critical as emergency or compliance features.',
      },
      {
        id: 'stmt-605',
        text: 'Drivers should be able to update bank account details for payouts.',
        speaker: 'Sofia Martins',
        speakerRole: 'Payments Operations Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'Payout access is business-critical for drivers and support operations.',
      },
      {
        id: 'stmt-606',
        text: 'Drivers should be able to choose a dashboard accent colour.',
        speaker: 'Ethan Brooks',
        speakerRole: 'UX Researcher',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'low',
        explanation: 'This is a small personalisation feature and does not affect core driver workflows.',
      },
    ],
  },
  {
    id: 'level-007',
    number: 7,
    title: 'Level 7 - Hotel Booking Platform',
    projectName: 'StaySure Booking',
    scenarioDescription:
      'A hotel group is improving its booking platform after guests reported confusion during reservations. You are reviewing discovery notes from customer service, revenue, operations, and compliance.',
    taskDescription:
      'Review each stakeholder statement below. Check the statements that represent valid software requirements. For each selected requirement, choose its type and assign a priority level.',
    clientName: 'Northstar Hotels',
    industry: 'Hospitality',
    mode: 'mixed',
    statements: [
      {
        id: 'stmt-701',
        text: 'Guests must be able to filter available rooms by date, occupancy, room type, and accessibility needs.',
        speaker: 'Mia Torres',
        speakerRole: 'Guest Experience Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a core search capability for booking rooms, so it is functional and high priority.',
      },
      {
        id: 'stmt-702',
        text: 'The booking page should feel more luxurious and premium than competitor websites.',
        speaker: 'Felix Grant',
        speakerRole: 'Brand Director',
        isRequirement: false,
        explanation: 'This is a brand preference and is not measurable or testable as written.',
      },
      {
        id: 'stmt-703',
        text: 'The system must show the full price, including taxes and resort fees, before payment is submitted.',
        speaker: 'Hannah Okoye',
        speakerRole: 'Compliance Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a specific system behavior with compliance and trust impact, so it is high priority.',
      },
      {
        id: 'stmt-704',
        text: 'Room search results must load within 3 seconds for users on a 4G mobile connection.',
        speaker: 'Ivan Chen',
        speakerRole: 'Platform Engineer',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'medium',
        explanation: 'This is a measurable performance requirement. It matters, but payment and price accuracy are more critical.',
      },
      {
        id: 'stmt-705',
        text: 'The team should use the same booking engine that our previous agency liked.',
        speaker: 'Claire Bennett',
        speakerRole: 'Operations Coordinator',
        isRequirement: false,
        explanation: 'This is an implementation preference rather than a user, business, or quality requirement.',
      },
      {
        id: 'stmt-706',
        text: 'Guests must receive a booking confirmation email within 2 minutes after payment succeeds.',
        speaker: 'Mia Torres',
        speakerRole: 'Guest Experience Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'medium',
        explanation: 'This is a clear system action after booking. It is useful, but not as critical as completing payment correctly.',
      },
    ],
  },
  {
    id: 'level-008',
    number: 8,
    title: 'Level 8 - Charity Donation Portal',
    projectName: 'GiveBridge Donations',
    scenarioDescription:
      'A charity is rebuilding its donation portal before a major fundraising campaign. The approved requirements must be prioritised for the first release.',
    taskDescription:
      'Review the approved donation portal requirements and assign the priority that best matches donor trust, campaign impact, compliance, and operational value.',
    clientName: 'GiveBridge Foundation',
    industry: 'Nonprofit',
    mode: 'prioritise-only',
    statements: [
      {
        id: 'stmt-801',
        text: 'Donors must be able to complete a one-time card donation without creating an account.',
        speaker: 'Aisha Khan',
        speakerRole: 'Fundraising Director',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This directly affects donation conversion and campaign success, so it is high priority.',
      },
      {
        id: 'stmt-802',
        text: 'The portal must send tax receipt emails within 10 minutes of a successful donation.',
        speaker: 'Luca Romano',
        speakerRole: 'Finance Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'Receipts affect donor trust and financial records, so this is high priority.',
      },
      {
        id: 'stmt-803',
        text: 'Campaign staff should be able to update the homepage campaign message without a developer release.',
        speaker: 'Naomi Fields',
        speakerRole: 'Campaign Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'medium',
        explanation: 'This helps campaign operations, but donation completion and receipts are more urgent.',
      },
      {
        id: 'stmt-804',
        text: 'Donation payment pages must meet PCI DSS card data handling requirements.',
        speaker: 'Jon Bell',
        speakerRole: 'Security Consultant',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'Payment compliance is mandatory and high risk, so this is high priority.',
      },
      {
        id: 'stmt-805',
        text: 'Donors should be able to share a completed donation on social media.',
        speaker: 'Emma Patel',
        speakerRole: 'Marketing Coordinator',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'low',
        explanation: 'This supports awareness, but it is not essential to taking donations.',
      },
      {
        id: 'stmt-806',
        text: 'The donation confirmation page must load within 4 seconds under normal campaign traffic.',
        speaker: 'Rafael Costa',
        speakerRole: 'Web Operations Lead',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'medium',
        explanation: 'This is important for donor confidence, but core payment and compliance requirements are more critical.',
      },
    ],
  },
  {
    id: 'level-009',
    number: 9,
    title: 'Level 9 - Smart Home Energy App',
    projectName: 'EcoHome Energy',
    scenarioDescription:
      'A smart home company is designing an energy management app. The product team has collected raw stakeholder comments from homeowners, support, sustainability, and engineering.',
    taskDescription:
      'Review the discovery notes and decide which statements are ready to become valid, actionable software requirements.',
    clientName: 'EcoHome Systems',
    industry: 'Energy',
    mode: 'identify-only',
    statements: [
      {
        id: 'stmt-901',
        text: 'Homeowners must be able to view hourly energy usage for each connected smart meter.',
        speaker: 'Tara Singh',
        speakerRole: 'Product Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a specific, testable system capability.',
      },
      {
        id: 'stmt-902',
        text: 'The app should make people feel inspired to live greener lives.',
        speaker: 'Oliver Scott',
        speakerRole: 'Sustainability Advocate',
        isRequirement: false,
        explanation: 'This is a useful goal, but it is too vague to implement or test as a software requirement.',
      },
      {
        id: 'stmt-903',
        text: 'Users must be able to set a monthly energy budget and receive an alert when usage reaches 80 percent of it.',
        speaker: 'Tara Singh',
        speakerRole: 'Product Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This describes clear user behavior and a measurable alert condition.',
      },
      {
        id: 'stmt-904',
        text: 'The app should use whatever chart library the engineering team thinks is easiest.',
        speaker: 'Nina Walsh',
        speakerRole: 'Support Analyst',
        isRequirement: false,
        explanation: 'This is an implementation preference, not a requirement about user value or system quality.',
      },
      {
        id: 'stmt-905',
        text: 'Energy usage data must be encrypted while stored and while transmitted between the app and cloud service.',
        speaker: 'Kenji Mori',
        speakerRole: 'Security Engineer',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is a clear security requirement and is actionable.',
      },
      {
        id: 'stmt-906',
        text: 'The dashboard should look less boring than a spreadsheet.',
        speaker: 'Grace Young',
        speakerRole: 'Homeowner Panel Member',
        isRequirement: false,
        explanation: 'This is subjective feedback and needs measurable detail before it becomes a requirement.',
      },
    ],
  },
  {
    id: 'level-010',
    number: 10,
    title: 'Level 10 - Airport Baggage System',
    projectName: 'SkyTrack Baggage',
    scenarioDescription:
      'An airport authority is planning a baggage tracking system. The approved requirements need final organisation before a vendor handoff.',
    taskDescription:
      'Review the approved baggage system requirements and classify each one as Functional or Non-Functional.',
    clientName: 'MetroAir Authority',
    industry: 'Aviation',
    mode: 'classify-all',
    statements: [
      {
        id: 'stmt-1001',
        text: 'Passengers must be able to scan their baggage receipt number to view the latest bag location status.',
        speaker: 'Rachel Moore',
        speakerRole: 'Passenger Services Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This is a user-facing capability, so it is functional.',
      },
      {
        id: 'stmt-1002',
        text: 'Baggage status updates must appear in the passenger view within 30 seconds of a scanner event.',
        speaker: 'Dev Patel',
        speakerRole: 'Systems Integration Lead',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is a performance/timeliness constraint, so it is non-functional.',
      },
      {
        id: 'stmt-1003',
        text: 'Airline agents must be able to mark a bag as delayed and add a handling note.',
        speaker: 'Maria Jensen',
        speakerRole: 'Airline Operations Manager',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'high',
        explanation: 'This describes a specific workflow the system must support.',
      },
      {
        id: 'stmt-1004',
        text: 'The system must remain available 99.9 percent of the time during airport operating hours.',
        speaker: 'Sam Brooks',
        speakerRole: 'Airport IT Director',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is an availability requirement, so it is non-functional.',
      },
      {
        id: 'stmt-1005',
        text: 'Passengers must be able to submit a missing baggage report from a mobile device.',
        speaker: 'Rachel Moore',
        speakerRole: 'Passenger Services Lead',
        isRequirement: true,
        correctType: 'functional',
        correctClassification: 'functional',
        correctPriority: 'medium',
        explanation: 'This is a system capability for passengers, so it is functional.',
      },
      {
        id: 'stmt-1006',
        text: 'The baggage tracking interface must meet WCAG 2.1 AA accessibility requirements.',
        speaker: 'Lena Park',
        speakerRole: 'Accessibility Auditor',
        isRequirement: true,
        correctType: 'non-functional',
        correctClassification: 'non-functional',
        correctPriority: 'high',
        explanation: 'This is an accessibility constraint, so it is non-functional.',
      },
    ],
  },
];

export function getSelectedLevelId(): string {
  if (typeof window === 'undefined') return LEVELS[0].id;
  return localStorage.getItem(STORAGE_KEY_SELECTED_LEVEL) || LEVELS[0].id;
}

export function getLevelById(levelId: string | null | undefined): Level {
  return LEVELS.find((level) => level.id === levelId) || LEVELS[0];
}

export function getBestScoreKey(levelId: string): string {
  return `${STORAGE_KEY_BEST_SCORE_PREFIX}${levelId}`;
}

export function getXpScoreKey(levelId: string): string {
  return `${STORAGE_KEY_XP_SCORE_PREFIX}${levelId}`;
}

export function getLastScoreKey(levelId: string): string {
  return `${STORAGE_KEY_LAST_SCORE_PREFIX}${levelId}`;
}

export function getAssistedUnlockKey(levelId: string): string {
  return `${STORAGE_KEY_ASSISTED_UNLOCK_PREFIX}${levelId}`;
}

export function getRevealRequestKey(levelId: string): string {
  return `${STORAGE_KEY_REVEAL_REQUEST_PREFIX}${levelId}`;
}

export function getAttemptCountKey(levelId: string): string {
  return `${STORAGE_KEY_ATTEMPT_COUNT_PREFIX}${levelId}`;
}

export function getLastPlayedKey(levelId: string): string {
  return `${STORAGE_KEY_LAST_PLAYED_PREFIX}${levelId}`;
}

export function getEstimatedSeconds(statementCount: number): number {
  return Math.ceil((30 + statementCount * 25) / 60) * 60;
}

export function getEstimatedMinutes(statementCount: number): number {
  return Math.ceil(getEstimatedSeconds(statementCount) / 60);
}

const statementVariations: Record<string, { variants: string[]; updates: string[] }> = {
  'stmt-001': {
    variants: [
      'Patients must be able to sign in with their hospital ID and a secure password before viewing personal health records.',
      'The portal must let patients securely access their health records using hospital-issued login credentials.',
    ],
    updates: ['The hospital security team confirms that patient record access must require verified credentials.'],
  },
  'stmt-002': {
    variants: [
      'The portal should feel calm, modern, and welcoming because patients may already be anxious.',
      'Patients would prefer the portal to look friendly and less clinical.',
    ],
    updates: ['The patient experience team repeats that the old portal felt cold, but gives no measurable design target.'],
  },
  'stmt-003': {
    variants: [
      'Patient portal pages must display within 2 seconds for users on a standard broadband connection.',
      'Users should not wait more than 2 seconds for any portal page to load on normal broadband.',
    ],
    updates: ['IT support reports that slow page loads caused complaints in the previous portal.'],
  },
  'stmt-004': {
    variants: [
      'Patients must receive an automated appointment confirmation email within 5 minutes of booking.',
      'After booking an appointment, the system should send a confirmation email within 5 minutes.',
    ],
    updates: ['Clinic staff say confirmation emails reduce calls to reception after appointments are booked.'],
  },
  'stmt-005': {
    variants: [
      'Patient data must be encrypted while stored and while transmitted, in line with HIPAA obligations.',
      'The system must protect patient records with encryption at rest and in transit to satisfy HIPAA requirements.',
    ],
    updates: ['Compliance flags patient data encryption as a mandatory launch condition.'],
  },
  'stmt-006': {
    variants: [
      'The developers should choose whichever technology stack they are most comfortable maintaining.',
      'I think the engineering team should decide the tools since they know what works best.',
    ],
    updates: ['The administrator clarifies this was only a delivery preference, not a stakeholder requirement.'],
  },
  'stmt-201': {
    variants: [
      'Customers must be able to move funds between their own checking and savings accounts.',
      'The app must support transfers between accounts owned by the same customer.',
    ],
    updates: ['Customer support says internal transfers are one of the most requested mobile features.'],
  },
  'stmt-202': {
    variants: [
      'The mobile banking session must automatically lock after 3 minutes without activity.',
      'If a customer is inactive for 3 minutes, the app must lock the current session.',
    ],
    updates: ['Security review identifies inactive sessions as a risk for shared or lost devices.'],
  },
  'stmt-203': {
    variants: [
      'Customers must be able to export PDF statements covering the previous 12 months.',
      'The app should let customers download account statements as PDFs for the last year.',
    ],
    updates: ['Operations notes that PDF statements reduce branch and call-centre requests.'],
  },
  'stmt-204': {
    variants: [
      'After a transfer is completed, displayed balances must update within 5 seconds.',
      'Balance information must refresh in less than 5 seconds following a successful transfer.',
    ],
    updates: ['Mobile analytics show users often refresh repeatedly after moving money.'],
  },
  'stmt-301': {
    variants: [
      'Customers must be able to track live order status after checkout.',
      'After placing an order, customers should see real-time progress updates.',
    ],
    updates: ['Support reports that most order-related contacts are about delivery status.'],
  },
  'stmt-302': {
    variants: [
      'Restaurants must be able to pause new orders when kitchen capacity is overloaded.',
      'Partner restaurants should have a way to temporarily stop accepting orders during rush periods.',
    ],
    updates: ['Restaurant partners warn that overload causes cancellations and late deliveries.'],
  },
  'stmt-303': {
    variants: [
      'Customers should be able to add restaurants to a favourites list.',
      'The app should let users save preferred restaurants for quicker future ordering.',
    ],
    updates: ['Growth says favourites could improve repeat ordering, but it is not blocking checkout.'],
  },
  'stmt-304': {
    variants: [
      'Payment confirmation on checkout must complete within 4 seconds under normal load.',
      'The checkout page should confirm payment in no more than 4 seconds in typical traffic conditions.',
    ],
    updates: ['Payment logs show users abandon carts when confirmation feels slow.'],
  },
  'stmt-305': {
    variants: [
      'Drivers must receive pickup and drop-off addresses after accepting an order.',
      'Once a driver accepts delivery, the app must show the restaurant address and customer destination.',
    ],
    updates: ['Driver operations says missing address details directly blocks delivery completion.'],
  },
  'stmt-306': {
    variants: [
      'Marketing teams should be able to configure promotional banners for each city.',
      'City-specific marketing banners should be editable without a developer release.',
    ],
    updates: ['Marketing wants regional campaigns, but this does not affect core ordering.'],
  },
  'stmt-401': {
    variants: [
      'Students must be able to search courses by department, course code, and instructor.',
      'The registration system must support course search using department, code, or instructor name.',
    ],
    updates: ['Student representatives say search is the first step in nearly every registration session.'],
  },
  'stmt-402': {
    variants: [
      'The replacement system should be much less frustrating than the current one.',
      'Students want the new registration system to feel easier and less annoying.',
    ],
    updates: ['Student feedback is negative, but no measurable usability target has been supplied.'],
  },
  'stmt-403': {
    variants: [
      'Advisors must be able to approve or reject overload requests before registration is final.',
      'The system must route overload requests to academic advisors for approval decisions.',
    ],
    updates: ['Academic advisors confirm overload approval is required before students can exceed limits.'],
  },
  'stmt-404': {
    variants: [
      'IT should use whichever database platform they already prefer.',
      'The project should probably rely on the database system the IT team likes best.',
    ],
    updates: ['The department administrator clarifies this was a technical suggestion, not a course-registration rule.'],
  },
  'stmt-405': {
    variants: [
      'The system must block registration when two selected classes have overlapping meeting times.',
      'Students must not be allowed to enrol in courses that meet at the same time.',
    ],
    updates: ['The registrar says time conflicts are a common source of manual correction.'],
  },
  'stmt-406': {
    variants: [
      'Registration pages must satisfy WCAG 2.1 AA accessibility standards.',
      'The course registration interface must comply with WCAG 2.1 AA accessibility requirements.',
    ],
    updates: ['Accessibility review says compliance must be confirmed before launch.'],
  },
  'stmt-407': {
    variants: [
      'It would be nice if registration looked more like the social apps students use.',
      'Students might like the system more if it borrowed visual ideas from popular social platforms.',
    ],
    updates: ['The student ambassador gives visual inspiration but no testable requirement.'],
  },
  'stmt-408': {
    variants: [
      'Students must receive an email receipt after adding or dropping a course.',
      'The system must email students confirmation when course registration changes are completed.',
    ],
    updates: ['Registrar staff say email receipts reduce disputes about registration changes.'],
  },
  'stmt-501': {
    variants: [
      'Customers must be able to check out with an address they previously saved.',
      'The checkout must let shoppers select a saved delivery address.',
    ],
    updates: ['Analytics shows returning customers abandon checkout when they have to re-enter addresses.'],
  },
  'stmt-502': {
    variants: [
      'Checkout should look more premium so shoppers feel better about the brand.',
      'The purchase flow should make the company feel trustworthy and high-end.',
    ],
    updates: ['Brand feedback highlights trust concerns, but no measurable acceptance criteria are provided.'],
  },
  'stmt-503': {
    variants: [
      'Card authorization must finish within 6 seconds in normal traffic conditions.',
      'The payment step must authorize transactions in no more than 6 seconds under typical load.',
    ],
    updates: ['Payments reports that slow authorization increases duplicate payment attempts.'],
  },
  'stmt-504': {
    variants: [
      'After successful payment, customers must immediately see an order confirmation number.',
      'The system must display a confirmation number as soon as checkout payment succeeds.',
    ],
    updates: ['Support says missing confirmation numbers create avoidable customer contacts.'],
  },
  'stmt-505': {
    variants: [
      'The checkout should use whichever frontend framework is most fashionable this year.',
      'The team should rebuild checkout with a newer framework because it would look modern.',
    ],
    updates: ['Engineering clarifies that framework choice is an implementation decision, not a stakeholder requirement.'],
  },
  'stmt-506': {
    variants: [
      'Checkout must satisfy PCI DSS rules for handling payment card data.',
      'Card data handling in checkout must comply with PCI DSS requirements.',
    ],
    updates: ['Security says PCI compliance is mandatory before checkout changes can launch.'],
  },
  'stmt-601': {
    variants: [
      'Drivers must be able to submit vehicle inspection documents through the portal.',
      'The portal must let drivers upload required inspection paperwork.',
    ],
    updates: ['Compliance warns that missing inspection documents can suspend drivers.'],
  },
  'stmt-602': {
    variants: [
      'Drivers should be able to review weekly earnings split by trips and bonuses.',
      'The portal should show weekly pay with separate trip earnings and bonus amounts.',
    ],
    updates: ['Driver support says earnings questions are common after bonus campaigns.'],
  },
  'stmt-603': {
    variants: [
      'Drivers must be able to reach emergency support with one tap while on an active trip.',
      'During a live trip, emergency help must be accessible from the portal in one tap.',
    ],
    updates: ['Safety review marks emergency access as a launch-critical workflow.'],
  },
  'stmt-604': {
    variants: [
      'Trip history must load within 3 seconds for drivers using a 4G connection.',
      'The driver portal must display trip history in under 3 seconds on 4G.',
    ],
    updates: ['Platform metrics show trip history is one of the most visited driver pages.'],
  },
  'stmt-605': {
    variants: [
      'Drivers must be able to update bank details used for payouts.',
      'The portal should let drivers change payout bank account information.',
    ],
    updates: ['Payments operations says payout account changes currently create manual support work.'],
  },
  'stmt-606': {
    variants: [
      'Drivers should be able to pick an accent colour for their dashboard.',
      'The portal should allow drivers to personalise the dashboard colour theme.',
    ],
    updates: ['UX research says colour personalisation is nice to have, but not workflow-critical.'],
  },
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createAttemptLevel(level: Level, previousScore: number | null): Level {
  const variationStrength =
    previousScore === null || previousScore <= 40 ? 'low' : previousScore < 70 ? 'medium' : 'high';

  const statements = level.statements.map((statement) => {
    const variation = statementVariations[statement.id];
    if (!variation) return statement;

    const shouldVaryText =
      variationStrength === 'high' || (variationStrength === 'medium' && Math.random() > 0.45);

    return {
      ...statement,
      text: shouldVaryText ? pickRandom(variation.variants) : statement.text,
    };
  });

  const updates = level.statements
    .map((statement) => statementVariations[statement.id]?.updates[0])
    .filter(Boolean);

  const shouldAddUpdate = variationStrength !== 'low' && updates.length > 0;
  const scenarioDescription = shouldAddUpdate
    ? `${level.scenarioDescription} Stakeholder update: ${pickRandom(updates)}`
    : level.scenarioDescription;

  return {
    ...level,
    scenarioDescription,
    statements,
  };
}

export function shouldShowSelection(level: Level): boolean {
  return level.mode === 'mixed' || level.mode === 'identify-only';
}

export function shouldShowClassification(level: Level, answer?: UserAnswer): boolean {
  if (level.mode === 'classify-all') return true;
  if (level.mode === 'mixed') return Boolean(answer?.selected);
  return false;
}

export function shouldShowPriority(level: Level, answer?: UserAnswer): boolean {
  if (level.mode === 'prioritise-only') return true;
  if (level.mode === 'mixed') return Boolean(answer?.selected);
  return false;
}

export function createInitialAnswers(level: Level): UserAnswer[] {
  const selectedByDefault = !shouldShowSelection(level);
  return level.statements.map((statement) => ({
    statementId: statement.id,
    selected: selectedByDefault,
  }));
}

export function calculateScore(
  level: Level,
  answers: UserAnswer[]
): { total: number; correct: number; percentage: number; breakdown: Record<string, BreakdownEntry> } {
  const breakdown: Record<string, BreakdownEntry> = {};
  let points = 0;
  let maxPoints = 0;

  for (const stmt of level.statements) {
    const answer = answers.find((a) => a.statementId === stmt.id);
    const selected = answer?.selected ?? false;
    const selectionCorrect = selected === stmt.isRequirement;
    const classificationCorrect = answer?.classification === stmt.correctType;
    const priorityCorrect = answer?.priority === stmt.correctPriority;

    if (level.mode === 'mixed') {
      if (stmt.isRequirement) {
        maxPoints += 3;
        points += selected ? 1 : -1;
        if (selected && classificationCorrect) points += 1;
        if (selected && priorityCorrect) points += 1;
      } else if (selected) {
        points -= 1;
      }
    }

    if (level.mode === 'classify-all') {
      maxPoints += 1;
      if (classificationCorrect) points += 1;
    }

    if (level.mode === 'prioritise-only') {
      maxPoints += 1;
      if (priorityCorrect) points += 1;
    }

    if (level.mode === 'identify-only') {
      if (stmt.isRequirement) {
        maxPoints += 1;
        points += selected ? 1 : -1;
      } else if (selected) {
        points -= 1;
      }
    }

    breakdown[stmt.id] = {
      selectionCorrect,
      classificationCorrect: shouldShowClassification(level, answer) ? classificationCorrect : false,
      priorityCorrect: shouldShowPriority(level, answer) ? priorityCorrect : false,
    };
  }

  const clampedPoints = Math.min(maxPoints, Math.max(0, points));

  return {
    total: maxPoints,
    correct: clampedPoints,
    percentage: maxPoints > 0 ? Math.round((clampedPoints / maxPoints) * 100) : 0,
    breakdown,
  };
}

export function calculateProgress(level: Level, answers: UserAnswer[]): number {
  let totalSteps = 0;
  let completedSteps = 0;

  for (const stmt of level.statements) {
    const answer = answers.find((a) => a.statementId === stmt.id);

    if (level.mode === 'mixed') {
      if (answer?.selected) {
        totalSteps += 3;
        completedSteps += 1;
        if (answer.classification) completedSteps += 1;
        if (answer.priority) completedSteps += 1;
      }
      continue;
    }

    if (level.mode === 'classify-all') {
      totalSteps += 1;
      if (answer?.classification) completedSteps += 1;
      continue;
    }

    if (level.mode === 'prioritise-only') {
      totalSteps += 1;
      if (answer?.priority) completedSteps += 1;
      continue;
    }

    if (level.mode === 'identify-only') {
      totalSteps += 1;
      completedSteps += 1;
    }
  }

  return totalSteps > 0 ? Math.min(100, Math.round((completedSteps / totalSteps) * 100)) : 0;
}
