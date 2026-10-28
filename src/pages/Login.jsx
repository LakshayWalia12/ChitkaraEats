import { useState } from 'react'
import '../App.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rollNo, setRollNo] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(e) {
    e.preventDefault()

    setError('')

    if (!rollNo || !name || !phone || !password) {
      setError('Please fill all fields.')
      return
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    sessionStorage.setItem(
      'chitkaraEatsLoggedIn',
      'true'
    )

    sessionStorage.setItem(
      'chitkaraEatsStudent',
      JSON.stringify({
        rollNo: rollNo,
        name: name,
        phone: phone
      })
    )

    window.location.href = '/home'
  }

  return (
    <div className="login-page">

      <div className="login-wrap">

        <div className="brand">

          <div className="logo">
            Chitkara<span>Eats</span>
          </div>

          <h1>
            Campus food, just a login away. 🍔
          </h1>

          <p>
            Login with your student details and order food,
            drinks and study essentials directly to your hostel gate.
          </p>

          <div className="points">

            <div className="point">
              ⚡ Fast 15–20 min campus delivery
            </div>

            <div className="point">
              🎓 Student-friendly prices
            </div>

            <div className="point">
              🌙 Late-night food available
            </div>

          </div>

        </div>

        <div className="form-area">

          <h2>Student Login</h2>

          <p className="sub">
            Enter your ChitkaraEats account details
          </p>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="field">
              <label>Roll Number</label>

              <input
                type="text"
                placeholder="e.g. 2410999999"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Student Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Phone Number</label>

              <input
                type="tel"
                inputMode="numeric"
                maxLength="10"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>

              <div className="password-box">

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  className="show-btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>

              </div>

            </div>

            <button
              className="login-btn"
              type="submit"
            >
              Login to ChitkaraEats →
            </button>

          </form>

          <div className="demo">
            You can enter any valid-looking roll number,
            name, 10-digit phone number and a password.
          </div>

        </div>

      </div>

    </div>
  )
}

export default Login