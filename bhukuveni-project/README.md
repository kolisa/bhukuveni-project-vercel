# Bhukuveni Facility Manager

<div align="center">
  <h3>🏥 Comprehensive Healthcare Facility Management System</h3>
  <p>A beautiful, mobile-friendly application for managing maintenance, cleaning, cooking, and staff in healthcare facilities</p>
</div>

---

## ✨ Features

### 👥 **Staff Management**
- Add and manage facility staff members
- Assign staff to specific tasks
- Track roles and responsibilities

### 🔧 **Maintenance Tracking**
- 8 categories (Facility, Equipment, Safety, Plumbing, Electrical, HVAC, Exterior, Interior)
- 4 priority levels (Low, Medium, High, Critical)
- 5 frequency options (Daily, Weekly, Monthly, Quarterly, Annually)
- Staff assignment
- Photo documentation
- Notes and comments
- PDF fault report export

### ✨ **Cleaning Schedules**
- 8 area types (Patient Rooms, Operating Rooms, Bathrooms, Kitchen, etc.)
- Staff assignment
- Time scheduling
- Frequency tracking
- Completion status

### 🍳 **Cooking & Meal Planning**
- Daily cooking schedule
- Meal types (Breakfast, Lunch, Dinner, Snack)
- Chef assignment
- Servings tracking
- Weekly menu planning
- Dietary information

### 📱 **Mobile-First Design**
- Fully responsive (phones, tablets, desktops)
- Touch-optimized interface
- Hamburger menu on mobile
- Camera integration for photos
- Swipe-friendly navigation

### 🔔 **Notifications**
- Toast notifications for all actions
- 30-minute cooking reminders
- Auto-dismiss after 5 seconds
- 4 notification types (Success, Error, Warning, Info)

### 💾 **Persistent Storage**
- All data saved automatically
- Photos stored as base64
- Never lose your data
- Works offline

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bhukuveni-project

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Structure

```
bhukuveni-project/
├── public/                    # Static assets
├── src/
│   ├── App.jsx               # Main app wrapper
│   ├── main.jsx              # React entry point
│   ├── index.css             # Global styles + Tailwind
│   └── BhukuveniFacilityManager.jsx  # Main component
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
└── .eslintrc.cjs            # ESLint config
```

---

## 🛠️ Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon set
- **window.storage API** - Persistent storage

---

## 📖 Usage Guide

### Adding Staff Members

1. Navigate to **Staff** tab
2. Click **"Add Staff"**
3. Enter name and role
4. Staff member appears in assignment dropdowns

### Creating Maintenance Tasks

1. Go to **Maintenance** tab
2. Click **"Add Item"**
3. Fill in details:
   - Title and description
   - Category and priority
   - Frequency
   - Assign to staff member
4. Click **"Add Item"**

### Taking Photos

1. Click on any task card
2. In the detail modal, click **"Add Photo"**
3. Take photo or select from gallery
4. Photo saves automatically

### Adding Notes

1. Open task detail modal
2. Type note in text box
3. Press Enter or click **"Add"**
4. Note appears with timestamp

### Exporting Fault Reports

1. Open task detail modal
2. Click **"Export Fault Report"**
3. File downloads with all details

---

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change color scheme:

```javascript
colors: {
  primary: {
    500: '#6366f1', // Change primary color
    600: '#4f46e5',
  },
}
```

### Categories

Edit arrays in `BhukuveniFacilityManager.jsx`:

```javascript
const categories = ['Your', 'Custom', 'Categories'];
```

### Areas

```javascript
const areas = ['Your', 'Facility', 'Areas'];
```

---

## 🔒 Security & Privacy

- ✅ **POPIA Compliant** - Data stored locally only
- ✅ **No external servers** - All data stays on device
- ✅ **No tracking** - No analytics or third-party scripts
- ✅ **User control** - Users can delete all data anytime

---

## 📱 Mobile Features

- **Camera Access** - Take photos directly
- **Touch Optimized** - Large tap targets (44px minimum)
- **Responsive Text** - Scales for all screen sizes
- **Offline Support** - Works without internet
- **PWA Ready** - Can be installed on home screen

---

## 🐛 Troubleshooting

### Storage Issues

If data isn't persisting:
1. Check browser console for errors
2. Ensure `window.storage` API is available
3. Clear browser cache and reload

### Camera Not Working

1. Grant camera permissions
2. Use HTTPS (required for camera API)
3. Check browser compatibility

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use in your projects!

---

## 🙏 Acknowledgments

Built for **Bhukuveni Healthcare Facility** with ❤️

Special thanks to:
- React team for amazing UI library
- Tailwind CSS for beautiful styling
- Lucide for perfect icons

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check documentation above
- Review code comments

---

## 🗺️ Roadmap

Future enhancements:
- [ ] Actual PDF generation (not just text files)
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Barcode scanning for inventory
- [ ] Advanced reporting
- [ ] Export to Excel
- [ ] Calendar integration
- [ ] Multi-facility support

---

<div align="center">
  <p><strong>Bhukuveni Facility Manager v2.0</strong></p>
  <p>Professional facility management at your fingertips 📱✨</p>
</div>
