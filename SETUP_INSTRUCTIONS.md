# Setup Instructions for Payroll Frontend

## Quick Start Guide

Follow these steps to get your payroll application up and running:

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- React
- Ant Design
- Tailwind CSS
- React Router
- Axios

### Step 2: Add the Illustration Image

**IMPORTANT:** You need to add the QA/bug testing illustration image for the login and register pages.

1. Save the image file as: `src/assets/images/auth-illustration.png`
2. The image should be the one showing two people working on code with bug testing

If you don't have the image, you can:
- Use any placeholder image (recommended size: 600x600px)
- Or temporarily comment out the image import in Login.jsx and Register.jsx

### Step 3: Configure Environment Variables

The `.env` file is already created with default values:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_BASE_URL=http://localhost:8000
```

Update these if your backend API is running on a different URL.

### Step 4: Start the Development Server

```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

### Step 5: Test the Application

1. You'll be redirected to the login page
2. Use the demo credentials:
   - **Username:** hruser123
   - **Password:** SecurePass123!

3. Or register a new account by clicking "Sign up now"

## File Structure Overview

### Authentication Components
- `src/components/Auth/Login.jsx` - Login page with split-screen design
- `src/components/Auth/Register.jsx` - Registration page with form validation

### Key Features

#### Login Page
- Username and password fields
- Remember me checkbox
- Forgot password link
- Demo credentials display
- Responsive split-screen layout

#### Register Page
- Username (min 4 characters)
- Email (with validation)
- First name and last name
- Password with strength requirements
- Password confirmation
- Responsive split-screen layout

### Styling
- **Tailwind CSS** for utility classes
- **Ant Design** for components
- **Custom CSS** in App.css and index.css
- **Color Theme:** Blue (#2563eb) and White

## Troubleshooting

### Issue: Image not showing
**Solution:** Make sure the image is saved at `src/assets/images/auth-illustration.png`

### Issue: Ant Design styles not working
**Solution:** Check if antd is installed: `npm install antd`

### Issue: Tailwind styles not applying
**Solution:**
1. Ensure `tailwind.config.js` and `postcss.config.js` are in the root directory
2. Check if Tailwind directives are in `src/index.css`
3. Restart the development server

### Issue: Routing not working
**Solution:**
1. Ensure `react-router-dom` is installed
2. Check the Router setup in `App.js`

## Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Next Steps

After successfully running the application:

1. **Connect to Backend API:**
   - Update API endpoints in `src/services/api.js`
   - Configure authentication in `src/services/auth.service.js`

2. **Implement Dashboard:**
   - Create dashboard components in `src/components/Dashboard/`
   - Add protected routes

3. **Add Payroll Features:**
   - File upload functionality
   - Payroll list and details
   - Charts and analytics

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments in Login.jsx and Register.jsx
- Ensure all dependencies are properly installed

## Color Customization

To change the blue theme color, update these files:

1. `tailwind.config.js` - Tailwind color scheme
2. `src/index.css` - Ant Design color overrides
3. `src/App.js` - ConfigProvider theme token

Current primary color: `#2563eb` (Blue-600)

---

Happy Coding! 🚀
