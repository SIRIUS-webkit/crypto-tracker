# 📊 Crypto Trading Tracker with MongoDB

A comprehensive cryptocurrency trading tracker that records buy/sell transactions and calculates profit/loss using FIFO (First-In, First-Out) accounting method. Now with MongoDB database integration for persistent data storage.

## 🚀 Features

- **Transaction Management**: Add, edit, and delete buy/sell transactions
- **FIFO Accounting**: Accurate profit/loss calculation using industry-standard FIFO method
- **Real-time Portfolio**: Track current holdings and unrealized P/L
- **Monthly Summary**: View performance analytics by month
- **Advanced Filtering**: Filter transactions by type, cryptocurrency, and date range
- **Data Export**: Export transactions to CSV format
- **MongoDB Integration**: Persistent data storage with full CRUD operations
- **Responsive Design**: Modern UI that works on desktop and mobile

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API**: RESTful API with JSON responses

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd crypto-trading-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MongoDB

#### Option A: Local MongoDB

1. Install and start MongoDB locally
2. Create a database called `crypto-tracker`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get your connection string

### 4. Environment Configuration

Create a `.env` file in the project root:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/crypto-tracker
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crypto-tracker

# Server Configuration
PORT=3000

# Environment
NODE_ENV=development
```

### 5. Start the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

### 6. Access the Application

Open your browser and go to:

```
http://localhost:3000
```

## 📚 API Documentation

The application provides a RESTful API for all operations:

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Statistics

- `GET /api/statistics` - Get portfolio statistics

### Health Check

- `GET /api/health` - Check API health

## 💰 How It Works

### FIFO Accounting Method

The tracker uses First-In, First-Out (FIFO) accounting to calculate profit/loss:

1. **Buy Transactions**: Added to your holdings at cost basis
2. **Sell Transactions**: Sold from earliest purchases first
3. **Average Cost**: Calculated as weighted average of all purchases
4. **Realized P/L**: Only calculated when you sell (not on paper gains)

### Example:

```
Buy 1 BTC @ $30,000 (Jan 1)
Buy 1 BTC @ $35,000 (Jan 15)
Sell 1 BTC @ $40,000 (Feb 1)

P/L Calculation:
- Sold BTC cost basis: $30,000 (first purchase)
- Proceeds after fees: $39,500 (assuming $500 fees)
- Realized P/L: $39,500 - $30,000 = $9,500 profit

Remaining Holdings:
- 1 BTC @ $35,000 average cost
```

## 📊 Features in Detail

### Monthly Summary

- Track investment and proceeds by month
- Monitor realized profit/loss trends
- View trading activity statistics

### Transaction Filtering

- Filter by transaction type (BUY/SELL)
- Filter by cryptocurrency
- Filter by date range
- Clear filters easily

### Portfolio Holdings

- View current balances for each cryptocurrency
- See average buy price (cost basis)
- Calculate unrealized P/L with current market prices

## 🔧 Development

### Project Structure

```
crypto-trading-tracker/
├── index.html          # Main frontend file
├── api.js              # API client for frontend
├── server.js           # Backend server
├── package.json        # Dependencies and scripts
├── .env               # Environment variables
└── README.md          # This file
```

### Database Schema

**Transactions Collection:**

```javascript
{
  _id: ObjectId,
  date: String,           // YYYY-MM-DD format
  type: String,           // "BUY" or "SELL"
  crypto: String,         // Cryptocurrency symbol (e.g., "BTC")
  amount: Number,         // Amount of crypto
  price: Number,          // Price per unit in USD
  totalValue: Number,     // amount * price
  fees: Number,           // Transaction fees
  netAmount: Number,      // Total including/excluding fees
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure database permissions are correct

2. **Port Already in Use**

   - Change PORT in `.env` file
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **API Not Loading**
   - Check browser console for errors
   - Verify server is running
   - Check network connectivity

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please create an issue in the project repository.

---

**Happy Trading! 🚀📈**
