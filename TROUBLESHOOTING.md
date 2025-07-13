# Troubleshooting Guide - BritishBaccy Registration System

## 🔧 Common npm Installation Issues

### Issue 1: Security Vulnerabilities During Installation
**Symptoms:**
```
7 vulnerabilities (3 high, 4 critical)
```

**Solution:**
```bash
npm audit fix --force
```

**What this does:**
- Automatically updates packages to secure versions
- May cause major version changes (this is normal)
- Resolves security vulnerabilities

### Issue 2: Deprecated Package Warnings
**Symptoms:**
```
npm warn deprecated inflight@1.0.6: This module is not supported
npm warn deprecated glob@8.1.0: Glob versions prior to v9 are no longer supported
```

**Solution:**
- These warnings are normal and don't affect functionality
- The packages still work correctly
- Future updates will replace these packages

### Issue 3: Funding Messages
**Symptoms:**
```
41 packages are looking for funding
run `npm fund` for details
```

**Solution:**
- This is completely normal
- These are optional sponsorship requests
- You can safely ignore them
- Running `npm fund` shows sponsorship links (optional)

### Issue 4: Node Version Compatibility
**Symptoms:**
```
Error: This package requires Node.js version >= 18.0.0
```

**Solution:**
1. Check your Node.js version:
   ```bash
   node --version
   ```
2. If below 18.0.0, update Node.js:
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a version manager like nvm

### Issue 5: Permission Errors (Windows)
**Symptoms:**
```
Error: EACCES: permission denied
```

**Solution:**
1. Run PowerShell as Administrator
2. Or use:
   ```bash
   npm install --no-optional
   ```

### Issue 6: Network/Proxy Issues
**Symptoms:**
```
Error: connect ETIMEDOUT
```

**Solution:**
1. Check internet connection
2. If behind corporate firewall:
   ```bash
   npm config set registry https://registry.npmjs.org/
   npm config set proxy http://your-proxy:port
   ```

## 🚀 Server Issues

### Issue 1: Port Already in Use
**Symptoms:**
```
Error: listen EADDRINUSE :::3000
```

**Solution:**
1. Change port in server.js:
   ```javascript
   const PORT = process.env.PORT || 3001; // Change to 3001 or any available port
   ```
2. Or kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```

### Issue 2: Module Not Found
**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
npm install
```

### Issue 3: JWT Secret Missing
**Symptoms:**
```
Error: JWT secret is required
```

**Solution:**
1. Create `.env` file in project root
2. Add:
   ```env
   JWT_SECRET=your_super_secure_random_string_here_make_it_long_and_complex
   ```

## 🌐 Frontend Issues

### Issue 1: CORS Errors
**Symptoms:**
```
Access to fetch at 'http://localhost:3000' from origin 'null' has been blocked by CORS policy
```

**Solution:**
1. Serve HTML file through a local server instead of opening directly
2. Use Live Server extension in VS Code
3. Or use Python: `python -m http.server 8000`

### Issue 2: API Connection Failed
**Symptoms:**
- Registration/login forms show "Network error"
- Console shows connection refused

**Solution:**
1. Make sure backend server is running:
   ```bash
   npm start
   ```
2. Check API_BASE_URL in HTML file matches server port
3. Use demo mode for testing without backend

### Issue 3: Forms Not Working
**Symptoms:**
- Buttons don't respond
- No error messages shown

**Solution:**
1. Check browser console for JavaScript errors
2. Ensure all script tags are properly closed
3. Try refreshing the page

## 🔍 Debugging Tips

### Check Server Status
```bash
# Start server with detailed logs
npm run dev

# Check if server is responding
curl http://localhost:3000/api/health
```

### Check Frontend Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Test API Endpoints
```bash
# Test registration endpoint
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","nickname":"testuser"}'
```

## 📞 Getting Help

If you're still having issues:

1. **Check the logs:** Look at console output for specific error messages
2. **Try demo mode:** Test frontend without backend connection
3. **Clean install:** Delete `node_modules` and `package-lock.json`, then run `npm install`
4. **Contact support:** Email BritishBaccy@gmail.com with:
   - Error message
   - Steps you tried
   - Your operating system
   - Node.js version (`node --version`)

## 🔄 Clean Reset

If everything is broken, try this complete reset:

```bash
# Delete all installed packages
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall everything
npm install

# Fix any security issues
npm audit fix --force

# Start fresh
npm start
```

---

**Remember:** The system is designed to work in demo mode even without a backend, so you can always test the frontend functionality while troubleshooting server issues!
