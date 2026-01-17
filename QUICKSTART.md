# Quick Start Guide - Next.js Career Visualizer

## Installation & Running

### 1. Install Dependencies (Already Done)
```bash
cd client-next
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open browser: `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
npm start
```

## Project Structure

### Pages (Routes)
- **`/pages/index.js`** - Main app (route: `/`)
  - Career Visualizer Component
  - Voice input, camera, manual input
  - Download functionality
  - Admin panel
  
- **`/pages/login.js`** - Login page (route: `/login`)
  - User/Admin login
  - Email/password authentication
  - Role-based routing

### Public Assets
- **`/public/images/`** - All career images (120+ images)
- Used via `/images/filename` in src attributes

## Key Features

### Authentication Flow
1. User lands on `/` → redirected to `/login`
2. User logs in with email/password
3. Role stored in localStorage
4. Redirected to `/` for career visualization

### Career Visualization
1. **Camera Demo** (3 seconds)
2. **Voice Recognition** (10 second timeout)
3. **Manual Input** (fallback)
4. **Result Display** with image & animations
5. **Download** as PNG
6. **Play Again** or **Next Candidate**

### API Integration
- Backend: `https://izhanrahman1.pythonanywhere.com`
- Endpoints:
  - `POST /login` - Authentication
  - `POST /record` - Save career records

## File Contents

### /pages/index.js (Main App)
- `CareerVisualizer` component - All UI & logic
- `Home` component - Authentication wrapper
- 800+ lines of code (consolidated from React version)

### /pages/login.js (Login)
- Login form with role selection
- Email/password validation
- Error handling
- localStorage integration

## Styling Approach

### No External CSS - Using Inline Styles
```javascript
style={{
  background: 'linear-gradient(...)',
  backgroundColor: 'rgba(...)',
  color: 'white',
  opacity: 0.9,
  // etc.
}}
```

### Framer Motion Animations
- Page transitions
- Button animations
- Listening indicator pulse
- Sparkle animations
- Smooth scale/fade effects

## Environment Variables (Optional)

Create `.env.local` in project root:
```
NEXT_PUBLIC_SERVER_URL=https://izhanrahman1.pythonanywhere.com
```

Or keep default in code (already set).

## Testing Checklist

- [ ] Dev server starts successfully
- [ ] Login page loads at `/login`
- [ ] Can login with credentials
- [ ] Redirects to `/` after login
- [ ] Camera access works
- [ ] Voice recognition starts
- [ ] Manual input works
- [ ] Results display correctly
- [ ] Download button works
- [ ] Images load properly
- [ ] Animations are smooth
- [ ] Logout works
- [ ] Admin panel shows (if admin)

## Troubleshooting

### Images not loading
- Check `/public/images/` folder has all images
- Ensure filenames match exactly (case-sensitive)

### Voice recognition not working
- Chrome/Edge work best
- Allow microphone permissions
- Check browser console for errors
- Fallback to manual input available

### Login not working
- Verify backend server is running
- Check network tab in DevTools
- Ensure API URL is correct

### Camera not working
- HTTPS required on production
- Allow camera permissions
- Check browser console
- localhost works without HTTPS for dev

## Building for Deployment

```bash
# Build optimized version
npm run build

# Test production build locally
npm start

# Then deploy to hosting (Vercel, AWS, etc.)
```

## Backend Integration

The app expects these endpoints:

### Login Endpoint
```
POST https://izhanrahman1.pythonanywhere.com/login
Request: { email, password }
Response: { success, role }
```

### Record Endpoint
```
POST https://izhanrahman1.pythonanywhere.com/record
Request: { name, career }
Response: (any)
```

## Code Organization

All code is in simple `.js` files (no JSX complexity):
- Clean, readable code
- Easy to maintain
- Quick to modify
- All logic in page files
- No component fragmentation

## Next Steps

1. Test the app locally
2. Verify backend connectivity
3. Deploy to production server
4. Update domain/DNS if needed
5. Monitor error logs

---

Happy coding! 🚀
