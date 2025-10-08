# 🚀 Deploying Crypto Trading Tracker to Vercel

This guide will walk you through deploying your crypto trading tracker to Vercel with MongoDB Atlas.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Vercel Account** - [Sign up at vercel.com](https://vercel.com)
2. **MongoDB Atlas Account** - [Sign up at mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **Git Repository** (optional but recommended)

## 🗂️ Project Structure for Vercel

The project has been restructured for Vercel's serverless architecture:

```
crypto-trading-tracker/
├── api/                          # Serverless functions
│   ├── _db.js                   # Database connection utility
│   ├── health.js                # Health check endpoint
│   ├── transactions.js          # GET/POST transactions
│   ├── transactions/[id].js     # PUT/DELETE individual transaction
│   └── statistics.js            # Portfolio statistics
├── index.html                   # Main frontend file
├── api.js                       # Frontend API client
├── vercel.json                  # Vercel configuration
├── package.json                 # Dependencies
└── server.js                    # Local development server
```

## 🌐 Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up/Login and create a new project
3. Create a **FREE** cluster (M0 Sandbox)
4. Wait for cluster creation (2-3 minutes)

### 1.2 Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Create a user with **Read and Write** privileges
3. Remember the username and password!

### 1.3 Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
3. This is safe for serverless functions

### 1.4 Get Connection String

1. Go to your cluster → **Connect**
2. Choose **Connect your application**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy from Git (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Import Project"**
   - Connect your Git provider
   - Select your repository
   - Click **"Import"**

### Option B: Deploy with Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

## ⚙️ Step 3: Configure Environment Variables

After deployment, you need to add your MongoDB connection string:

1. **In Vercel Dashboard**:

   - Go to your project
   - Click **Settings** → **Environment Variables**
   - Add new variable:
     - **Name**: `MONGODB_URI`
     - **Value**: Your MongoDB Atlas connection string
     - **Environments**: Production, Preview, Development

2. **Example**:

   ```
   Name: MONGODB_URI
   Value: mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/crypto-tracker?retryWrites=true&w=majority
   ```

3. **Redeploy** to apply environment variables:
   ```bash
   vercel --prod
   ```

## 🔧 Step 4: Update Frontend API Base URL (Optional)

If you want to use a custom domain or need to update the API base URL:

1. Edit `api.js`:

   ```javascript
   // For production, you might want to use your custom domain
   const api = new CryptoTrackerAPI("https://your-custom-domain.vercel.app");
   ```

2. Or keep it relative (recommended):
   ```javascript
   const api = new CryptoTrackerAPI(""); // Uses same domain
   ```

## 🧪 Step 5: Test Your Deployment

1. **Visit Your Site**:

   - Vercel will provide a URL like: `https://your-project-name.vercel.app`
   - Open the URL in your browser

2. **Test API Endpoints**:

   - Health check: `https://your-project-name.vercel.app/api/health`
   - Should return: `{"success":true,"message":"Crypto Trading Tracker API is running on Vercel",...}`

3. **Test Full Functionality**:
   - Add a test transaction
   - Verify it saves to database
   - Check monthly summary
   - Test filters and export

## 🎯 Step 6: Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Add your custom domain
   - Follow DNS configuration instructions

## 📊 Performance & Monitoring

### Vercel Analytics

- Enable analytics in your Vercel dashboard
- Monitor function execution times
- Track user interactions

### MongoDB Monitoring

- Use MongoDB Atlas monitoring
- Set up alerts for connection issues
- Monitor database performance

## 🔒 Security Best Practices

### Environment Variables

- ✅ Use environment variables for sensitive data
- ✅ Never commit `.env` files to Git
- ✅ Use MongoDB Atlas for production (not local MongoDB)

### Database Security

- ✅ Use strong passwords for MongoDB users
- ✅ Regularly rotate database passwords
- ✅ Monitor database access logs

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Timeout**:

   ```
   Error: Server selection timed out
   ```

   - **Solution**: Check MongoDB Atlas network access (allow 0.0.0.0/0)
   - Verify connection string format

2. **Environment Variable Not Found**:

   ```
   Error: MONGODB_URI environment variable is not set
   ```

   - **Solution**: Add `MONGODB_URI` in Vercel environment variables
   - Redeploy after adding variables

3. **Function Timeout**:

   ```
   Error: Function execution timed out
   ```

   - **Solution**: Check `maxDuration` in `vercel.json` (currently set to 10s)
   - Optimize database queries

4. **CORS Errors**:
   ```
   Error: Access to fetch at '...' from origin '...' has been blocked by CORS
   ```
   - **Solution**: All API functions include CORS headers
   - Check that API calls use relative URLs

### Debug Steps

1. **Check Vercel Function Logs**:

   - Go to Vercel dashboard → Your project → Functions
   - Click on individual functions to see logs

2. **Test API Endpoints Directly**:

   ```bash
   curl https://your-project.vercel.app/api/health
   ```

3. **Check MongoDB Atlas Logs**:
   - Go to Atlas dashboard → Network Access
   - Verify recent connections

## 📈 Scaling & Optimization

### Vercel Limits (Free Plan)

- **Bandwidth**: 100GB/month
- **Function Execution**: 100 hours/month
- **Function Duration**: 10 seconds max
- **Database Connections**: Use connection pooling

### Optimization Tips

- ✅ Database connection caching implemented
- ✅ Efficient MongoDB indexes created
- ✅ Minimal function cold starts
- ✅ Optimized bundle sizes

## 🎉 Success!

Your crypto trading tracker is now live on Vercel!

**Your URLs**:

- **Frontend**: `https://your-project.vercel.app`
- **API Health**: `https://your-project.vercel.app/api/health`
- **Transactions**: `https://your-project.vercel.app/api/transactions`

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Vercel function logs
3. Verify MongoDB Atlas connection
4. Test API endpoints individually

---

**Happy Trading on the Cloud! 🚀📊**
