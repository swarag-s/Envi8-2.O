# 🚀 CivicReport - Quick Reference Card

## Access the Application
```
http://localhost:5173
```

## 📱 User Flows

### Citizen Path
```
Landing Page → Click "Login/Register" → Citizen Tab (default)
├── Login: Email + Password
└── Register: 8 fields (Name, Adhar, Mobile, Email, Ward, LSG, Password, Confirm)
```

### Authority Path
```
Landing Page → Click "Login/Register" → Authority Tab
├── Ward Member: 8 fields (Name, Email, Member ID, Ward, Mobile, LSG, Password, Confirm)
└── Department: 2 fields (UDN Number, Password)
```

## 📋 Form Fields Quick Reference

### Citizen Registration
1. Name (text)
2. Adhar Number (12 digits)
3. Mobile Number (+91 + 10 digits)
4. Email (email format)
5. Ward (text)
6. Panchayat/Municipality/Corporation (dropdown)
7. Password (min 8 chars)
8. Confirm Password (must match)

### Ward Member Registration
1. Name (text)
2. Email (email format)
3. Unique Member ID (text)
4. Ward Number (text)
5. Mobile Number (+91 + 10 digits)
6. Panchayat/Municipality/Corporation (dropdown)
7. Password (min 8 chars)
8. Confirm Password (must match)

### Department Login
1. UDN Number (text)
2. Password (password)

## 🎨 Color Palette
- Primary Green: `#10B981`
- Secondary Blue: `#3B82F6`
- Secondary Orange: `#F59E0B`
- Neutral Dark: `#111827`
- Neutral Light: `#F9FAFB`

## 📁 Key Files

### Components
- `src/components/Navbar.jsx` - Navigation with auth buttons
- `src/components/Hero.jsx` - Hero with report button
- `src/components/auth/CitizenLogin.jsx` - Citizen login form
- `src/components/auth/CitizenRegister.jsx` - Citizen registration
- `src/components/auth/AuthorityLogin.jsx` - Authority selection
- `src/components/auth/WardMemberRegister.jsx` - Ward member form
- `src/components/auth/DepartmentLogin.jsx` - Department login

### Pages
- `src/pages/Auth.jsx` - Main authentication page
- `src/App.jsx` - App with routing logic

### Styles
- `src/index.css` - Global design system
- `src/pages/Auth.css` - Auth page layout
- `src/components/auth/*.css` - Form styles

## 🔧 Commands

### Development
```bash
npm run dev          # Start dev server
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📚 Documentation Files
- `README.md` - Complete project guide
- `QUICK_START.md` - Quick customization
- `PLATFORM_WORKFLOW.md` - Civic reporting workflow
- `AUTH_DOCUMENTATION.md` - Auth system details
- `IMPLEMENTATION_SUMMARY.md` - What's been built

## ✅ Testing Checklist
- [ ] Open http://localhost:5173
- [ ] Click Login/Register buttons
- [ ] Switch between Citizen/Authority tabs
- [ ] Fill Citizen registration form
- [ ] Fill Ward Member registration form
- [ ] Test Department login
- [ ] Test back navigation
- [ ] Test on mobile (resize browser)
- [ ] Verify all form validations

## 🎯 LSG Options (Dropdown)
1. Kozhikode Corporation
2. Vadakara Municipality
3. Koyilandy Municipality
4. Balussery Municipality
5. Gram Panchayat - Atholi
6. Gram Panchayat - Chelannur
7. Gram Panchayat - Koduvally
8. Gram Panchayat - Kunnamangalam
9. Gram Panchayat - Omassery
10. Gram Panchayat - Thamarassery

## 🔐 Validation Rules
- **Adhar**: Exactly 12 digits
- **Mobile**: Exactly 10 digits (after +91)
- **Email**: Valid email format
- **Password**: Minimum 8 characters
- **Confirm Password**: Must match Password

## 🎨 UI Features
- ✅ Password show/hide toggle
- ✅ Input field icons
- ✅ Form validation messages
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Back navigation
- ✅ Tab switching
- ✅ Social login (Google) for citizens

## 📞 Support
- Email: support@civicreport.in
- Documentation: See markdown files in project root

---

**Everything is ready! Open http://localhost:5173 and start testing!** 🎉
