const API_URL = "http://localhost:5000/api"

// 🔐 Get token
function getToken() {
  return localStorage.getItem("token")
}

// Common headers
function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getToken()
  }
}

// ========== TRANSACTIONS API ==========

// 📝 Get all transactions
async function getTransactions() {
  try {
    const res = await fetch(`${API_URL}/expenses`, {
      method: "GET",
      headers: getHeaders()
    })
    
    if (!res.ok) {
      console.error("Failed to fetch transactions")
      return []
    }
    
    return await res.json()
  } catch (err) {
    console.error("Get transactions error:", err)
    return []
  }
}

// ➕ Add transaction
async function addTransactionAPI(title, amount, type, category = null) {
  try {
    const res = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ title, amount, type, category })
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to add transaction")
    }
    
    return await res.json()
  } catch (err) {
    console.error("Add transaction error:", err)
    throw err
  }
}

// ✏️ Update transaction
async function updateTransactionAPI(id, title, amount, type, category = null) {
  try {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ title, amount, type, category })
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to update transaction")
    }
    
    return await res.json()
  } catch (err) {
    console.error("Update transaction error:", err)
    throw err
  }
}

// 🗑️ Delete transaction
async function deleteTransactionAPI(id) {
  try {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to delete transaction")
    }
    
    return await res.json()
  } catch (err) {
    console.error("Delete transaction error:", err)
    throw err
  }
}