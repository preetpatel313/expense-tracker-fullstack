const API_URL = "http://localhost:5000/api"

// 🔐 Save token
function setToken(token) {
  localStorage.setItem("token", token)
}

// 🔐 Get token
function getToken() {
  return localStorage.getItem("token")
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("userProfile")
  window.location.href = "login.html"
}

// 🔑 Signup
async function signup(name, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || data.error || "Signup failed")
    }

    setToken(data.token)
    // Save user profile
    if (data.user) {
      localStorage.setItem("userProfile", JSON.stringify({
        name: data.user.name,
        email: data.user.email,
        joinDate: new Date().toISOString().split("T")[0],
        currency: "INR",
        notifications: true
      }))
    }
    window.location.href = "dashboard.html"

  } catch (err) {
    showError(err.message)
  }
}

// 🔐 Login
async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || data.error || "Login failed")
    }

    setToken(data.token)
    // Save user profile
    if (data.user) {
      localStorage.setItem("userProfile", JSON.stringify({
        name: data.user.name,
        email: data.user.email,
        joinDate: new Date().toISOString().split("T")[0],
        currency: "INR",
        notifications: true
      }))
    }
    window.location.href = "dashboard.html"

  } catch (err) {
    console.error("Login error:", err)
    showError(err.message || "Connection failed. Make sure the server is running on http://localhost:5000")
  }
}

// ❌ Show error
function showError(message) {
  const errorBox = document.getElementById("error")

  if (errorBox) {
    errorBox.innerText = message
    errorBox.style.display = "block"
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorBox.style.display = "none"
    }, 5000)
  } else {
    alert(message)
  }
}