# CORS Error - Supabase Authentication

## Understanding the Error

You're experiencing a CORS (Cross-Origin Resource Sharing) error when Supabase tries to refresh authentication tokens:

```
Access to fetch at 'https://jifjjzaofphtebzdwicy.supabase.co/auth/v1/token?grant_type=refresh_token' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

### What is CORS?

CORS is a security mechanism that prevents websites from making requests to a different domain than the one that served the web page. When your app (running on `http://localhost:5173`) tries to communicate with Supabase (`https://jifjjzaofphtebzdwicy.supabase.co`), the browser checks if Supabase allows this cross-origin request.

### Why This Is Happening

The Supabase authentication system is trying to automatically refresh your authentication token (this happens in the background), but Supabase hasn't been configured to allow requests from your local development server (`http://localhost:5173`).

## The Solution

You need to whitelist your local development URL in your Supabase project settings.

### Step-by-Step Fix

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Log in to your account

2. **Select Your Project**
   - Click on your project: `jifjjzaofphtebzdwicy`

3. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "URL Configuration"

4. **Configure Site URL**
   - Set **Site URL** to: `http://localhost:5173`
   - This is the main URL of your application

5. **Add Redirect URLs**
   - In **Redirect URLs**, add the following URLs (one per line):
     ```
     http://localhost:5173
     http://localhost:5173/auth/callback
     http://localhost:5173/**
     ```
   - The `**` wildcard allows all paths under localhost:5173

6. **Save Changes**
   - Click "Save" at the bottom of the page

7. **Wait a Few Moments**
   - CORS configuration changes may take 1-2 minutes to propagate

8. **Clear Browser Storage and Refresh**
   - Open browser DevTools (F12)
   - Go to "Application" tab → "Storage" → "Clear site data"
   - Refresh your page (Ctrl+R or Cmd+R)

### For Production Deployment

When you deploy your application to production, you'll need to add your production URLs:

1. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
2. Add to **Redirect URLs**:
   ```
   https://yourdomain.com
   https://yourdomain.com/auth/callback
   https://yourdomain.com/**
   ```

## Additional Troubleshooting

### If the Error Persists

1. **Check Browser Console**
   - Look for any other error messages
   - Check if there are network errors

2. **Verify Environment Variables**
   - Ensure your `.env` file has the correct values:
     ```
     VITE_SUPABASE_URL=https://jifjjzaofphtebzdwicy.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

3. **Clear Old Sessions**
   - Clear browser cache and cookies
   - Clear localStorage:
     ```javascript
     localStorage.clear()
     sessionStorage.clear()
     ```

4. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart it
   npm run dev
   ```

### Common Mistakes to Avoid

❌ **Don't use** `localhost:5173` without the protocol (`http://`)
✅ **Use** `http://localhost:5173`

❌ **Don't forget** to include all redirect paths
✅ **Include** wildcard patterns like `http://localhost:5173/**`

❌ **Don't mix** http and https for localhost
✅ **Use** `http://` for localhost (not `https://`)

## Why Products Are Still Loading

You mentioned seeing "Products fetched: (147)" in the console. This is actually good news! It means:

- ✅ Your Supabase connection is working for data fetching
- ✅ The database queries are successful
- ❌ Only the authentication token refresh is failing due to CORS

The authentication CORS error doesn't prevent data fetching with the anonymous key, but it will cause issues with:
- User session management
- Automatic token refresh
- Protected routes
- User-specific features

## Summary

**Problem**: Supabase doesn't allow requests from `http://localhost:5173` for authentication

**Solution**: Add `http://localhost:5173` to the allowed URLs in Supabase Dashboard → Authentication → URL Configuration

**Expected Result**: After configuration, the CORS errors will disappear and authentication will work smoothly

---

## Need More Help?

If you continue to experience issues after following these steps:
1. Check the Supabase project status
2. Verify your project tier (free tier has some limitations)
3. Contact Supabase support if the issue persists
