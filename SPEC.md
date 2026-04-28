# Waste Management System - Mobile Application Specification

## 1. Project Overview

### Project Name
**Waste Management System** (نظام إدارة النفايات)

### Project Type
Mobile-first Progressive Web Application (PWA) with React + TypeScript

### Core Functionality Summary
A community-driven mobile application that transforms environmental cleanliness from passive responsibility into active, incentivized community behavior through an interactive grid-based map system.

### Target Users
- **Citizens**: Report waste issues, earn points, participate in cleaning activities
- **Cleaning Authorities**: Respond to reports, upload proof of cleaning
- **Community Validators**: Confirm cleanliness, validate reports
- **Business Partners**: Provide offers in exchange for visibility

---

## 2. Technical Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3.4
- **Icons**: Lucide React
- **Maps**: OpenStreetMap (Leaflet.js)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Storage**: LocalStorage (simulated Firebase)
- **Build Tool**: Vite 6.0

### Project Structure
```
waste-management-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/        # Buttons, inputs, cards
│   │   ├── map/           # Grid map components
│   │   ├── auth/          # Authentication components
│   │   └── profile/       # Profile components
│   ├── screens/          # Page components
│   │   ├── auth/          # Login, Signup
│   │   ├── home/          # Main dashboard
│   │   ├── report/        # Report issue
│   │   ├── profile/       # User profile
│   │   └── notifications/ # Notifications
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom hooks
│   ├── data/              # Mock data & types
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   └── App.tsx           # Main app component
├── public/               # Static assets
├── SPEC.md               # This specification
└── README.md             # Project documentation
```

---

## 3. UI/UX Specification

### Color Palette
| Status | Color | Hex Code | Usage |
|--------|-------|----------|-------|
| Clean | Green | `#22C55E` | Clean grid zones |
| Dirty | Red | `#EF4444` | Reported dirty areas |
| Review | Yellow | `#EAB308` | Under review zones |
| Primary | Teal | `#14B8A6` | Primary actions, highlights |
| Secondary | Slate | `#64748B` | Secondary text, borders |
| Background | White | `#FFFFFF` | Main background |
| Surface | Gray 50 | `#F8FAFC` | Cards, panels |
| Text Primary | Slate 900 | `#0F172A` | Main text |
| Text Secondary | Slate 500 | `#64748B` | Secondary text |

### Typography
- **Font Family**: System UI (Inter fallback)
- **Headings**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 12px

### Spacing System
- Base unit: 4px
- Common spacings: 8px, 12px, 16px, 24px, 32px

### Mobile-First Design
- Minimum touch target: 44x44px
- Bottom navigation height: 64px
- Safe area padding: 16px horizontal
- Card border radius: 12px
- Button border radius: 8px

---

## 4. Screen Specifications

### 4.1 Splash Screen
- App logo centered
- Loading indicator
- Auto-redirect to Login after 2 seconds

### 4.2 Authentication Screens

#### Login Screen
- Logo at top (40% from top)
- Email input field
- Password input field
- "Remember me" checkbox
- "Forgot Password?" link
- Login button (Primary)
- "Don't have an account? Sign up" link
- Social login buttons (Google, Facebook) - decorative

#### Signup Screen
- Back button to Login
- Full name input
- Email input
- Password input
- Confirm password input
- Phone number input (optional)
- Terms acceptance checkbox
- Sign up button
- "Already have an account? Login" link

### 4.3 Home Screen (Main Dashboard)
- **Header**: App title, notifications icon, user avatar
- **Map Area**:
  - Interactive grid map (OpenStreetMap base)
  - Grid overlay with status colors
  - Current location button
  - Zoom controls
- **Stats Bar**: Quick stats (clean zones, reports, points)
- **Quick Actions**: FAB for report, "I cleaned it" button

#### Grid System Behavior
- Grid size: ~100m x 100m in urban areas
- Tap to view zone details
- Long press to report issue
- Visual feedback on interaction

#### Zone Details Modal
- Zone status indicator (color badge)
- Last report info (date, user)
- Issue description
- Before/After images (if available)
- "I Cleaned It" button
- "Report Issue" button
- Community validation count

### 4.4 Report Issue Screen
- **Step 1**: Select/Confirm Location
  - Map preview with pin
  - Current GPS location (auto-detect)
  - Manual location selection
- **Step 2**: Upload Photo
  - Camera capture option
  - Gallery upload option
  - Photo preview with retake option
- **Step 3**: Issue Details
  - Category dropdown (Household, Industrial, Medical, Electronic, Other)
  - Severity slider (Low, Medium, High, Critical)
  - Description textarea (max 200 chars)
- **Step 4**: Confirmation
  - Summary of report
  - Submit button
  - Success animation on submit

### 4.5 Profile Screen
- **Header**: Avatar, Name, Level badge
- **Stats Cards**:
  - Total Points (large number)
  - Reports Submitted (count)
  - Validations Made (count)
  - Cleaning Actions (count)
- **Progress Section**:
  - Weekly/Monthly progress chart
  - Achievement badges
  - Rank indicator
- **Menu Items**:
  - My Reports
  - My Validations
  - Rewards & Offers
  - Settings
  - Help & Support
  - Logout

### 4.6 Notifications Screen
- List of notifications
- Types: Report resolved, Points earned, Achievement unlocked, Community alert
- Swipe to mark as read
- Tap to navigate to relevant screen

### 4.7 Authority Dashboard (Hidden menu for demo)
- Pending reports list
- Mark as cleaned with photo upload
- View statistics

---

## 5. Functionality Specifications

### 5.1 Authentication
- Email/password registration and login
- Session persistence with localStorage
- Form validation with error messages
- Loading states during authentication

### 5.2 Map & Grid System
- OpenStreetMap integration with Leaflet.js
- Custom grid overlay layer
- Dynamic grid coloring based on status
- Tap interaction to view zone details
- GPS location detection (simulated)
- Pan and zoom controls

### 5.3 Report System
- Multi-step form with progress indicator
- Image upload with preview (simulated with placeholder)
- Location selection with map
- Category and severity selection
- Report submission with confirmation
- Local storage update for mock data

### 5.4 Status Update System
- Report resolution workflow
- Photo upload for "after cleaning" proof
- Grid status update (Red → Yellow → Green)
- Push notification simulation

### 5.5 Points & Rewards System
- Points calculation per action:
  - Report submitted: 10 points
  - Report validated: 5 points
  - "I Cleaned It": 25 points
  - Weekly streak: 50 bonus points
- Level system:
  - Level 1: 0-100 points (Beginner)
  - Level 2: 101-500 points (Contributor)
  - Level 3: 501-1000 points (Guardian)
  - Level 4: 1001+ points (Eco Champion)
- Reward badges display

### 5.6 Gamification
- Points animation on earn
- Achievement notifications
- Progress bars for levels
- Weekly challenges (simulated)

### 5.7 Notifications
- In-app notification center
- Notification types with icons
- Mark as read functionality
- Push notification simulation

---

## 6. Data Models (Mock Data)

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  level: number;
  totalReports: number;
  totalValidations: number;
  totalCleanings: number;
  createdAt: Date;
}
```

### Zone
```typescript
interface Zone {
  id: string;
  lat: number;
  lng: number;
  status: 'clean' | 'dirty' | 'review';
  lastReport?: Report;
  cleaningCount: number;
}
```

### Report
```typescript
interface Report {
  id: string;
  zoneId: string;
  userId: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  status: 'pending' | 'in_review' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  type: 'report_resolved' | 'points_earned' | 'achievement' | 'alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}
```

---

## 7. Development Phases

### Phase 1: Core Foundation (Current)
- Project setup with React + TypeScript
- Authentication screens (Login/Signup)
- Main navigation (Bottom nav)
- Home screen with grid map
- Basic profile screen

### Phase 2: Reporting & Status
- Report issue feature (multi-step form)
- Zone details modal
- Status update system
- Notification system
- Authority dashboard

### Phase 3: Gamification & Polish
- Points system implementation
- Rewards display
- Achievement badges
- Quick actions ("I Cleaned It")
- Full gamification flow
- Polish and animations

---

## 8. Success Criteria

1. ✅ User can register and login
2. ✅ Grid map displays with color-coded zones
3. ✅ User can tap zone to view details
4. ✅ User can report issue with all steps
5. ✅ Report updates zone status to RED
6. ✅ Profile shows user stats and points
7. ✅ Notifications display correctly
8. ✅ Bottom navigation works smoothly
9. ✅ Mobile-first responsive design
10. ✅ Clean, modern UI with green/red/yellow indicators

---

## 9. Future Considerations (Not in current scope)

- Firebase integration for real backend
- Real-time updates with WebSockets
- Image upload to cloud storage
- Push notifications with service workers
- Native app compilation (Capacitor/Cordova)
- Government dashboard integration
- Business partner portal
- Advanced anti-fraud system with ML
- A/B testing framework

---

**Author**: MiniMax Agent
**Created**: 2026-04-25
**Version**: 1.0.0