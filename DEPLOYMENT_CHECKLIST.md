# 🚀 Deployment Checklist & Troubleshooting Guide

## ✅ Issues Fixed

### 1. **CORS Configuration** ✅
- **Problem**: CORS errors when accessing from Vercel
- **Solution**: Updated `backend/main.py` to allow all origins (`allow_origins=["*"]`)
- **Status**: Fixed ✅

### 2. **API Endpoint Paths** ✅
- **Problem**: Double `/api/api/` in URLs
- **Solution**: Removed duplicate `/api` prefix from frontend API calls
- **Status**: Fixed ✅

### 3. **Environment Variables** ⚠️
- **Problem**: Frontend `.env` pointing to localhost
- **Solution**: Need to configure Vercel environment variables
- **Status**: **ACTION REQUIRED** ⚠️

---

## 📋 Deployment Steps

### **Backend (Render)**

#### 1. **Push Latest Code to GitHub**
```bash
git add .
git commit -m "fix: CORS configuration and API endpoints for production"
git push origin main
```

#### 2. **Render Configuration**
Your Render service should already be deployed. Verify these settings:

- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variable**: `GROQ_API_KEY` = `your_actual_api_key`

#### 3. **Get Your Render URL**
After deployment, your backend URL will be something like:
```
https://lecture-voice-to-notes-generator-XXXX.onrender.com
```

**Copy this URL** - you'll need it for the frontend!

---

### **Frontend (Vercel)**

#### 1. **Configure Environment Variables in Vercel**

Go to your Vercel project → **Settings** → **Environment Variables**

Add this variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_BASE_URL` | `https://your-render-url.onrender.com/api` | Production, Preview, Development |

**⚠️ IMPORTANT**: Replace `your-render-url.onrender.com` with your **actual Render backend URL**

Example:
```
VITE_API_BASE_URL=https://lecture-voice-to-notes-generator-f892.onrender.com/api
```

#### 2. **Redeploy Frontend**

After adding the environment variable:
1. Go to **Deployments** tab in Vercel
2. Click the **three dots** (•••) on the latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache" (optional)
5. Click **Redeploy**

---

## 🧪 Testing Your Deployment

### 1. **Test Backend Health**
Open in browser:
```
https://your-render-url.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

### 2. **Test Backend API Docs**
Open in browser:
```
https://your-render-url.onrender.com/docs
```

You should see the FastAPI interactive documentation.

### 3. **Test Frontend**
1. Open your Vercel URL: `https://lecture-voice-to-notes-generator-nine.vercel.app`
2. Open browser DevTools (F12) → Console tab
3. Upload a small audio file
4. Check for errors in the console

---

## 🐛 Troubleshooting

### **Issue: CORS Errors**

**Symptoms**: 
- `Access-Control-Allow-Origin` errors in console
- Network requests fail with CORS errors

**Solutions**:
1. ✅ Verify `backend/main.py` has `allow_origins=["*"]`
2. ✅ Redeploy backend to Render
3. ✅ Clear browser cache (Ctrl+Shift+Delete)
4. ✅ Try in incognito/private window

---

### **Issue: 404 Not Found**

**Symptoms**:
- API calls return 404 errors
- Routes not found

**Solutions**:
1. ✅ Check API endpoint paths don't have double `/api/api/`
2. ✅ Verify `VITE_API_BASE_URL` ends with `/api`
3. ✅ Check Render logs for routing errors

---

### **Issue: 500 Internal Server Error**

**Symptoms**:
- Server errors when transcribing
- "GROQ_API_KEY not configured" error

**Solutions**:
1. ✅ Verify `GROQ_API_KEY` is set in Render environment variables
2. ✅ Check Render logs: Dashboard → Logs tab
3. ✅ Ensure API key is valid at https://console.groq.com/

---

### **Issue: Timeout Errors**

**Symptoms**:
- Requests timeout after 30-60 seconds
- "Request failed" errors for large files

**Solutions**:
1. ✅ Render free tier spins down after inactivity (first request takes 30-60s)
2. ✅ Large files are automatically chunked (this is normal)
3. ✅ Consider upgrading Render to paid tier for better performance

---

### **Issue: Frontend Shows Localhost URL**

**Symptoms**:
- API calls go to `http://localhost:8000`
- Network errors in production

**Solutions**:
1. ✅ Set `VITE_API_BASE_URL` in Vercel environment variables
2. ✅ Redeploy frontend after adding env var
3. ✅ Clear browser cache

---

## 📊 Monitoring

### **Check Render Logs**
1. Go to Render Dashboard
2. Click your service
3. Click **Logs** tab
4. Watch for errors in real-time

### **Check Vercel Logs**
1. Go to Vercel Dashboard
2. Click your project
3. Click **Deployments**
4. Click on a deployment → **View Function Logs**

---

## 🔐 Security Notes

### **Environment Variables**
- ✅ Never commit `.env` files to GitHub
- ✅ Use Render/Vercel dashboards to set environment variables
- ✅ Rotate API keys if accidentally exposed

### **CORS**
- ⚠️ Currently allowing all origins (`allow_origins=["*"]`)
- ✅ This is OK for public APIs without sensitive data
- ⚠️ If you add authentication later, restrict CORS origins

---

## 📝 Quick Reference

### **Your URLs**

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend (Vercel)** | `https://lecture-voice-to-notes-generator-nine.vercel.app` | User interface |
| **Backend (Render)** | `https://your-service.onrender.com` | API server |
| **API Docs** | `https://your-service.onrender.com/docs` | Interactive API documentation |
| **Health Check** | `https://your-service.onrender.com/health` | Server status |

### **Environment Variables**

#### Render (Backend)
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

#### Vercel (Frontend)
```
VITE_API_BASE_URL=https://your-render-url.onrender.com/api
```

---

## 🎯 Next Steps

1. ✅ Push code to GitHub
2. ⚠️ **Get your Render backend URL**
3. ⚠️ **Set `VITE_API_BASE_URL` in Vercel**
4. ⚠️ **Redeploy frontend on Vercel**
5. ✅ Test the application
6. ✅ Monitor logs for errors

---

## 💡 Tips

- **Cold Starts**: Render free tier spins down after 15 min. First request takes 30-60s.
- **Large Files**: Files >25MB are automatically chunked. This is normal and may take time.
- **Rate Limits**: Groq has rate limits. Add retry logic if needed (already implemented).
- **Debugging**: Always check browser console (F12) and Render logs for errors.

---

## 🆘 Still Having Issues?

1. Check browser console for errors (F12)
2. Check Render logs for backend errors
3. Verify environment variables are set correctly
4. Try in incognito mode to rule out cache issues
5. Test backend API directly using `/docs` endpoint

Good luck! 🚀
