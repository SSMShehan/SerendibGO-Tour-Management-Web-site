# Testing MongoDB Connection on Vercel

## Step 1: Find Your Vercel Deployment URL

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Find your deployment URL (e.g., `https://your-project.vercel.app`)

## Step 2: Test the Debug Connection Endpoint

This endpoint shows the MongoDB connection status without requiring authentication.

### Method 1: Using Browser
Simply open this URL in your browser:
```
https://your-project.vercel.app/api/debug-connection
```

**Expected Response (if connected):**
```json
{
  "status": "connected",
  "readyState": 1,
  "readyStateName": "connected",
  "database": "serandibgo",
  "host": "cluster0.xxxxx.mongodb.net",
  "mongoUri": "✅ Set",
  "env": "production"
}
```

**Expected Response (if NOT connected):**
```json
{
  "status": "disconnected",
  "readyState": 0,
  "readyStateName": "disconnected",
  "database": "Not connected",
  "host": "Not connected",
  "mongoUri": "✅ Set",
  "env": "production"
}
```

### Method 2: Using curl (Command Line)
```bash
curl https://your-project.vercel.app/api/debug-connection
```

### Method 3: Using PowerShell (Windows)
```powershell
Invoke-RestMethod -Uri "https://your-project.vercel.app/api/debug-connection" -Method Get
```

## Step 3: Test Health Check Endpoint

Test if the API is running:
```
https://your-project.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "SerendibGo API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production"
}
```

## Step 4: Test Endpoints That Require Database

### Test Tours Endpoint (GET request, no auth needed)
```
https://your-project.vercel.app/api/tours
```

### Test Hotels Endpoint
```
https://your-project.vercel.app/api/hotels
```

### Test Vehicles Endpoint
```
https://your-project.vercel.app/api/vehicles
```

**If MongoDB is connected:** You'll get data or an empty array `[]`
**If MongoDB is NOT connected:** You might get an error or timeout

## Step 5: Check Vercel Function Logs

1. Go to your Vercel project dashboard
2. Click on the latest deployment
3. Click on the **"Functions"** tab or **"Logs"** tab
4. Look for logs with these indicators:
   - `🔄 Attempting to connect to MongoDB...`
   - `✅ MongoDB Connected: cluster0.xxxxx.mongodb.net`
   - `✅ Database initialized for serverless`
   - `❌ Database connection failed!` (if there's an error)

## Step 6: Verify Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify that `MONGODB_URI` is set with your MongoDB connection string
3. Make sure it's set for **Production** environment
4. If you just added it, you may need to **redeploy** your project

## Troubleshooting

### If `mongoUri` shows "❌ Not set":
- Go to Vercel Dashboard → Settings → Environment Variables
- Add `MONGODB_URI` with your MongoDB connection string
- Redeploy your project

### If status is "disconnected":
- Check Vercel function logs for error messages
- Verify MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)
- Check if the connection string is correct
- Look for timeout errors in logs

### If you see timeout errors:
- MongoDB Atlas might be blocking Vercel's IP addresses
- Go to MongoDB Atlas → Network Access → Add IP Address → Allow 0.0.0.0/0 (all IPs)

## Quick Test Script

Save this as `test-vercel-connection.ps1` and run it:

```powershell
# Replace with your Vercel URL
$vercelUrl = "https://your-project.vercel.app"

Write-Host "Testing Vercel MongoDB Connection..." -ForegroundColor Cyan
Write-Host ""

# Test debug connection
Write-Host "1. Testing /api/debug-connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$vercelUrl/api/debug-connection" -Method Get
    Write-Host "   Status: $($response.status)" -ForegroundColor $(if ($response.status -eq "connected") { "Green" } else { "Red" })
    Write-Host "   Database: $($response.database)" -ForegroundColor White
    Write-Host "   Host: $($response.host)" -ForegroundColor White
    Write-Host "   Mongo URI: $($response.mongoUri)" -ForegroundColor White
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test health check
Write-Host "2. Testing /api/health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$vercelUrl/api/health" -Method Get
    Write-Host "   Status: $($response.status)" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Cyan
```

