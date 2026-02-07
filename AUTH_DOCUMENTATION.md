# Authentication System Documentation

## Overview

The CivicReport platform features a comprehensive authentication system with separate interfaces for **Citizens** and **Authority (LSG)** users. The system is designed to provide secure access while maintaining ease of use for all user types.

## Access Points

### From Landing Page
Users can access the authentication interface through multiple entry points:
- **Navbar**: Login and Register buttons (desktop and mobile)
- **Hero Section**: "Report an Issue" button
- All buttons seamlessly navigate to the authentication page

### Navigation
- **Back to Home**: Users can return to the landing page at any time using the "Back to Home" button
- **Tab Switching**: Easy switching between Citizen and Authority interfaces

---

## User Types & Workflows

### 1. Citizen Authentication

#### A. Citizen Login
**Purpose**: Existing citizens access their dashboard to report issues and track submissions.

**Form Fields**:
- Email Address *
- Password *
- Remember Me (checkbox)
- Forgot Password (link)

**Additional Options**:
- Continue with Google (social login)
- Switch to Register

**Access**: After login, citizens can:
- Report new civic issues
- Track existing reports
- View resolution status
- Receive notifications

---

#### B. Citizen Registration
**Purpose**: New users create an account to start reporting civic issues.

**Form Structure** (Exact as specified):

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| **Name** | Text | Required | Full name of the citizen |
| **Adhar Number** | Text | Required, 12 digits | 12-digit Adhar number |
| **Mobile Number** | Tel | Required, 10 digits | Mobile number with +91 prefix |
| **Email** | Email | Required, valid email | Email address |
| **Ward** | Text | Required | Ward number |
| **Panchayat/Municipality/Corporation** | Dropdown | Required | Select from LSG list |
| **Password** | Password | Required, min 8 chars | Create password |
| **Confirm Password** | Password | Required, must match | Re-enter password |

**LSG Options Available**:
- Kozhikode Corporation
- Vadakara Municipality
- Koyilandy Municipality
- Balussery Municipality
- Gram Panchayat - Atholi
- Gram Panchayat - Chelannur
- Gram Panchayat - Koduvally
- Gram Panchayat - Kunnamangalam
- Gram Panchayat - Omassery
- Gram Panchayat - Thamarassery

**Submit Button**: "Create Account"

**Validation**:
- Adhar: Exactly 12 digits
- Mobile: Exactly 10 digits
- Password: Minimum 8 characters
- Confirm Password: Must match Password field

---

### 2. Authority (LSG) Authentication

The Authority interface has **two distinct pathways**:

#### A. Ward Member Registration
**Purpose**: Ward members register to manage civic issues in their assigned ward.

**Access**: Click "Ward Member" card from Authority selection screen

**Form Structure** (Exact as specified):

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| **Name** | Text | Required | Full name of ward member |
| **Email** | Email | Required | Official email address |
| **Unique Member ID** | Text | Required | Provided by LSG administration |
| **Ward Number** | Text | Required | Assigned ward number |
| **Mobile Number** | Tel | Required, 10 digits | Mobile number with +91 prefix |
| **Panchayat/Municipality/Corporation** | Dropdown | Required | Select from LSG list |
| **Password** | Password | Required, min 8 chars | Create password |
| **Confirm Password** | Password | Required, must match | Re-enter password |

**Submit Button**: "Register as Ward Member"

**Additional Features**:
- Back button to return to Authority selection
- Same LSG options as Citizen registration
- Unique Member ID hint: "Provided by your LSG administration"

---

#### B. Department Login
**Purpose**: Department officials access the administrative dashboard using their UDN credentials.

**Access**: Click "Department" card from Authority selection screen

**Form Structure** (Exact as specified):

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| **UDN Number** | Text | Required | Unique Department Number |
| **Password** | Password | Required | Department password |

**Additional Options**:
- Remember Me (checkbox)
- Forgot Password (link)

**Submit Button**: "Access Department Dashboard"

**Help Section**:
- Contact System Administrator for credentials
- Support for login issues

---

## UI/UX Features

### Design Elements

#### Two-Panel Layout
**Left Panel (Green Gradient)**:
- CivicReport branding
- "Shape your community together" tagline
- Feature highlights:
  - ✓ AI-Powered Issue Detection
  - ✓ Real-Time Status Tracking
  - ✓ Direct Government Connection
- Footer links (Privacy Policy, Terms of Service, Contact Support)

**Right Panel (White/Light)**:
- Tab switcher (Citizen / Authority)
- Form content area
- Clean, professional design

#### Form Components
- **Icons**: Each field has a relevant icon (User, Mail, Lock, etc.)
- **Password Toggle**: Eye icon to show/hide passwords
- **Input Validation**: Real-time validation with error messages
- **Responsive Design**: Mobile-optimized layouts
- **Accessibility**: Proper labels and ARIA attributes

### Visual Hierarchy
1. **Authority Selection Cards**: Large, clickable cards with icons
   - Ward Member (Green accent)
   - Department (Blue accent)
   - Hover effects with arrow indicators

2. **Form Styling**:
   - Clear labels with asterisks for required fields
   - Input hints for complex fields
   - Consistent spacing and alignment
   - Focus states with green accent

3. **Buttons**:
   - Primary: Green background (main actions)
   - Outline: Border only (secondary actions)
   - Social: Google login option
   - Full width on mobile

---

## Technical Implementation

### Component Structure
```
src/
├── pages/
│   └── Auth.jsx                    # Main auth page with tabs
│       └── Auth.css
└── components/
    └── auth/
        ├── CitizenLogin.jsx        # Citizen login form
        ├── CitizenRegister.jsx     # Citizen registration form
        ├── AuthorityLogin.jsx      # Authority selection screen
        ├── WardMemberRegister.jsx  # Ward member registration
        ├── DepartmentLogin.jsx     # Department login form
        └── *.css                   # Corresponding styles
```

### State Management
- **App.jsx**: Controls navigation between landing and auth pages
- **Auth.jsx**: Manages tab switching and view states
- **Form Components**: Handle individual form data and validation

### Navigation Flow
```
Landing Page
    ↓ (Login/Register/Report buttons)
Auth Page
    ├── Citizen Tab
    │   ├── Login
    │   └── Register
    └── Authority Tab
        ├── Ward Member → Registration Form
        └── Department → Login Form
```

---

## Form Validation Rules

### Citizen Registration
- **Name**: Non-empty string
- **Adhar**: Exactly 12 numeric digits
- **Mobile**: Exactly 10 numeric digits
- **Email**: Valid email format
- **Ward**: Non-empty string
- **LSG**: Must select from dropdown
- **Password**: Minimum 8 characters
- **Confirm Password**: Must match password

### Ward Member Registration
- **Name**: Non-empty string
- **Email**: Valid email format
- **Member ID**: Non-empty string (alphanumeric)
- **Ward Number**: Non-empty string
- **Mobile**: Exactly 10 numeric digits
- **LSG**: Must select from dropdown
- **Password**: Minimum 8 characters
- **Confirm Password**: Must match password

### Department Login
- **UDN Number**: Non-empty string
- **Password**: Non-empty string

---

## Security Features

### Password Security
- Minimum 8 characters required
- Password visibility toggle
- Confirm password validation
- Secure password storage (to be implemented in backend)

### Data Protection
- Form data validation before submission
- HTTPS encryption (production)
- Secure session management
- CSRF protection (to be implemented)

### Access Control
- Role-based authentication
- Unique identifiers (Adhar, Member ID, UDN)
- Ward-level access for members
- Department-level access for officials

---

## User Experience Enhancements

### Helpful Features
1. **Input Hints**: Guidance text below complex fields
2. **Error Messages**: Clear validation feedback
3. **Auto-formatting**: Phone numbers, Adhar numbers
4. **Remember Me**: Persistent login option
5. **Forgot Password**: Password recovery flow
6. **Social Login**: Google authentication option (Citizens only)

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast ratios
- Clear focus indicators
- Proper ARIA labels

---

## Integration Points

### Backend API Endpoints (To Be Implemented)

#### Citizen
- `POST /api/auth/citizen/register` - Register new citizen
- `POST /api/auth/citizen/login` - Citizen login
- `POST /api/auth/citizen/forgot-password` - Password recovery

#### Ward Member
- `POST /api/auth/ward-member/register` - Register ward member
- `POST /api/auth/ward-member/login` - Ward member login

#### Department
- `POST /api/auth/department/login` - Department login

### Data Validation
All form submissions should be validated on both client and server side.

---

## Testing Checklist

### Functional Testing
- [ ] Citizen login with valid credentials
- [ ] Citizen registration with all required fields
- [ ] Ward member registration with valid Member ID
- [ ] Department login with UDN number
- [ ] Password visibility toggle works
- [ ] Form validation displays errors
- [ ] Tab switching preserves no data
- [ ] Back navigation returns to landing page
- [ ] Mobile menu works correctly

### UI/UX Testing
- [ ] Responsive design on mobile (320px - 768px)
- [ ] Responsive design on tablet (768px - 1024px)
- [ ] Responsive design on desktop (>1024px)
- [ ] All buttons are clickable
- [ ] Form inputs are accessible
- [ ] Error states are visible
- [ ] Loading states (to be implemented)

### Security Testing
- [ ] Password masking works
- [ ] Form data is not exposed in URL
- [ ] HTTPS in production
- [ ] XSS protection
- [ ] SQL injection prevention (backend)

---

## Future Enhancements

### Planned Features
1. **Email Verification**: Verify email during registration
2. **OTP Authentication**: SMS-based verification
3. **Two-Factor Authentication**: Enhanced security for authorities
4. **Profile Management**: Edit user details after registration
5. **Session Management**: Automatic logout after inactivity
6. **Password Strength Meter**: Visual feedback on password strength
7. **Multi-language Support**: Malayalam, Hindi, English

### Integration
- **Adhar Verification API**: Validate Adhar numbers
- **Mobile OTP Service**: SMS verification
- **Email Service**: Verification and notifications
- **Government Database**: Verify Member IDs and UDN numbers

---

## Support & Documentation

### For Citizens
- **Help Center**: Comprehensive guides on registration and reporting
- **Video Tutorials**: Step-by-step registration process
- **FAQ**: Common questions and answers
- **Support Email**: support@civicreport.in

### For Authorities
- **Admin Portal**: Separate documentation
- **Training Materials**: Official training sessions
- **Technical Support**: Priority support channel
- **System Administrator Contact**: For credential issues

---

## Conclusion

The authentication system is designed to be:
- **Secure**: Multiple validation layers and role-based access
- **User-Friendly**: Clear forms with helpful guidance
- **Accessible**: Works for all users regardless of technical expertise
- **Scalable**: Ready for expansion to other districts and states

All forms follow the exact structure specified, ensuring consistency and compliance with requirements.
