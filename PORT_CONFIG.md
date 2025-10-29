# 🔧 Port Configuration - Fixed at 3005

The ChartIQ AI application is now configured to **always run on port 3005**.

---

## ✅ Configuration Complete

### What's Been Updated:

1. **package.json** - Scripts updated
   ```json
   "dev": "next dev -p 3005"
   "start": "next start -p 3005"
   ```

2. **.env.example** - Default URLs updated
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3005
   NEXT_PUBLIC_API_URL=http://localhost:3005/api
   ```

3. **Development Server** - Running on port 3005
   - Local: http://localhost:3005
   - Network: http://172.31.64.1:3005

---

## 🌐 Application URLs

All application URLs now use port **3005**:

### Public Pages
- **Homepage**: [http://localhost:3005](http://localhost:3005)
- **Signup**: [http://localhost:3005/signup](http://localhost:3005/signup)
- **Login**: [http://localhost:3005/login](http://localhost:3005/login)
- **Reset Password**: [http://localhost:3005/reset-password](http://localhost:3005/reset-password)

### Protected Pages
- **Dashboard**: [http://localhost:3005/dashboard](http://localhost:3005/dashboard)

### API Routes
- **Auth Callback**: [http://localhost:3005/auth/callback](http://localhost:3005/auth/callback)
- **API Base**: [http://localhost:3005/api](http://localhost:3005/api)

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# Starts on http://localhost:3005
```

### Production Mode
```bash
npm run build
npm start
# Starts on http://localhost:3005
```

---

## 🔧 Environment Variables

Make sure your `.env.local` file uses port 3005:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3005
NEXT_PUBLIC_API_URL=http://localhost:3005/api
```

---

## ⚙️ Supabase Configuration

When setting up Supabase OAuth providers (Google, etc.), use these redirect URLs:

### Development
```
http://localhost:3005/auth/callback
```

### Production
```
https://your-domain.com/auth/callback
```

---

## 📝 Notes

- Port **3005** is now **fixed** and won't change
- The app will **always start** on this port
- No need to worry about port conflicts
- Consistent URLs across all environments
- Easy to remember: **3005**

---

## ✅ Current Status

**Development Server**: ✅ Running on [http://localhost:3005](http://localhost:3005)

All URLs in documentation and configuration now reference port **3005**.

---

**Port 3005 is your permanent development port for ChartIQ AI!** 🚀
