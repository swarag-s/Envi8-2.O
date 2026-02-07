# CivicReport - AI-Powered Civic Issue Reporting Platform

A modern, responsive landing page for a civic issue reporting platform that empowers citizens to report issues directly to their Corporation, Panchayat, or Local Self Government (LSG) with AI-driven analysis and routing.

## 🚀 Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **AI-Powered Workflow**: Visual representation of the AI analysis and routing process
- **Interactive Components**: Animated statistics, progress bars, and hover effects
- **Icon-Based Design**: Uses Lucide React icons instead of emojis for a professional look
- **Smooth Animations**: Powered by Framer Motion for engaging user experience

## 🎨 Design Highlights

### Color Palette
- **Primary Green**: #10B981 (Main brand color)
- **Secondary Blue**: #3B82F6 (Accent color)
- **Secondary Orange**: #F59E0B (Highlight color)
- **Neutral Grays**: Professional grayscale palette

### Sections
1. **Hero Section**: Eye-catching introduction with statistics and call-to-action
2. **How It Works**: 4-step process visualization showing the reporting workflow
3. **Impact Section**: Real statistics and achievements with animated progress bars
4. **Footer**: Comprehensive footer with newsletter signup and contact information

## 📦 Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, consistent icon set
- **CSS3**: Custom CSS with CSS variables for theming

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173` in your web browser

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
civic-report/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with scroll effects
│   │   ├── Navbar.css
│   │   ├── Hero.jsx             # Hero section with animations
│   │   ├── Hero.css
│   │   ├── HowItWorks.jsx       # Process explanation section
│   │   ├── HowItWorks.css
│   │   ├── Impact.jsx           # Statistics and achievements
│   │   ├── Impact.css
│   │   ├── Footer.jsx           # Footer with newsletter
│   │   └── Footer.css
│   ├── App.jsx                  # Main app component
│   ├── App.css
│   ├── index.css                # Global styles and design system
│   └── main.jsx                 # App entry point
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Key Features Explained

### 1. Responsive Navigation
- Fixed navbar with glassmorphism effect
- Smooth scroll to sections
- Mobile-friendly hamburger menu
- Login/Register CTAs

### 2. Hero Section
- Animated statistics (Issues Resolved, Success Rate, Response Time)
- Trust badges (Verified by Govt, AI-Powered, 100% Secure)
- Floating icon animations showing the workflow
- Gradient background with animated pattern

### 3. How It Works
- 4-step process visualization:
  1. Capture the Issue (Photo/Video)
  2. AI Analysis (Auto-categorization)
  3. Auto-Route to Authority (Corporation/Panchayat/LSG)
  4. Track & Resolution (Real-time updates)
- Feature cards highlighting key capabilities
- Step connectors with arrows

### 4. Impact Section
- Animated statistics cards
- Achievement badges
- Location coverage with animated progress bars
- Hover effects and transitions

### 5. Footer
- Newsletter subscription form
- Contact information
- Organized link sections (Product, Company, Legal, Support)
- Social media links
- Responsive layout

## 🎨 Customization

### Colors
Edit the CSS variables in `src/index.css`:
```css
:root {
  --primary-green: #10B981;
  --secondary-blue: #3B82F6;
  --secondary-orange: #F59E0B;
  /* ... more variables */
}
```

### Content
- Update statistics in `src/components/Hero.jsx`
- Modify process steps in `src/components/HowItWorks.jsx`
- Change impact data in `src/components/Impact.jsx`
- Edit footer links in `src/components/Footer.jsx`

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy the 'dist' folder
```

## 🔧 Performance Optimizations

- Lazy loading for images
- Optimized animations with `will-change`
- Minimal bundle size with tree-shaking
- CSS variables for consistent theming
- Efficient re-renders with React hooks

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email support@civicreport.in or visit our help center.

---

**Built with ❤️ for better civic governance in Kozhikode, Kerala**
