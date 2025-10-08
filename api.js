// API Client for Crypto Trading Tracker
class CryptoTrackerAPI {
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }

  // Helper method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Get all transactions
  async getTransactions() {
    return this.makeRequest("/transactions");
  }

  // Create a new transaction
  async createTransaction(transactionData) {
    return this.makeRequest("/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    });
  }

  // Update a transaction
  async updateTransaction(id, transactionData) {
    return this.makeRequest(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    });
  }

  // Delete a transaction
  async deleteTransaction(id) {
    return this.makeRequest(`/transactions/${id}`, {
      method: "DELETE",
    });
  }

  // Get portfolio statistics
  async getStatistics() {
    return this.makeRequest("/statistics");
  }

  // Health check
  async healthCheck() {
    return this.makeRequest("/health");
  }
}

// Create global API instance
const api = new CryptoTrackerAPI();

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CryptoTrackerAPI, api };
}
