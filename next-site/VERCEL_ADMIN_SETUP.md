# Vercel Deployment Configuration for Admin System

## 🚀 Deploy to Vercel with Admin Access

### 1. **Set Environment Variables in Vercel**

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

```bash
# Required for Admin System
ADMIN_USERNAME=nazeefa
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_very_long_random_jwt_secret_key_here
NODE_ENV=production
```

### 2. **Generate Secure Values**

**For JWT_SECRET**, use a long random string (32+ characters):
```bash
# Example (generate your own):
JWT_SECRET=nz2025_super_secure_jwt_secret_key_for_admin_system_9876543210
```

**For ADMIN_PASSWORD**, use a strong password:
```bash
# Example:
ADMIN_PASSWORD=YourSecurePassword2025!
```

### 3. **Access Admin on Vercel**

Once deployed with environment variables:

```
https://your-vercel-domain.vercel.app/admin
```

**Login credentials:**
- Username: `nazeefa` (or whatever you set in ADMIN_USERNAME)
- Password: Your secure password from ADMIN_PASSWORD

### 4. **Quick Vercel Setup Steps**

1. **Push to GitHub** (already done ✅)
2. **Connect to Vercel** (if not already connected)
3. **Add Environment Variables:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add the 4 variables above
4. **Redeploy** (Vercel will auto-deploy on next push or manually trigger)

### 5. **Vercel Environment Variables Setup**

| Variable | Value | Description |
|----------|--------|-------------|
| `ADMIN_USERNAME` | `nazeefa` | Admin login username |
| `ADMIN_PASSWORD` | `YourSecurePassword2025!` | Admin login password |
| `JWT_SECRET` | `your_random_32_char_secret` | JWT signing secret |
| `NODE_ENV` | `production` | Environment mode |

### 6. **Security for Production**

✅ **Already Implemented:**
- HTTP-only cookies
- JWT token authentication  
- Password hashing with bcrypt
- CSRF protection
- Input validation

### 7. **Testing the Deployment**

After setting up environment variables and redeploying:

1. Visit: `https://your-site.vercel.app/admin`
2. Login with your credentials
3. Test adding/editing content
4. Verify changes appear on main site

### 8. **Troubleshooting**

If admin doesn't work on Vercel:
- Check environment variables are set
- Check Vercel function logs
- Ensure all dependencies are in package.json
- Verify JWT_SECRET is long enough (32+ chars)

### 9. **Data Persistence Note**

Currently using JSON files for data storage. For production, consider:
- **Vercel KV** (Redis-based storage)
- **External database** (MongoDB, PostgreSQL)
- **GitHub as storage** (commit data changes back to repo)

The current JSON file approach works but data won't persist between deployments.