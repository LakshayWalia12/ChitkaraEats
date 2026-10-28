
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [cart, setCart] = useState({})
  const [deliveryLocation, setDeliveryLocation] = useState('Selected Hostel')

  const [studentName, setStudentName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [instructions, setInstructions] = useState('')
  const [paymentMethod, setPaymentMethod] =
    useState('Cash on Delivery')

  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  // Load student, cart and delivery location
  useEffect(() => {
    const savedStudent = JSON.parse(
      sessionStorage.getItem('chitkaraEatsStudent') || 'null'
    )

    const savedCart = JSON.parse(
      sessionStorage.getItem('chitkaraEatsCart') || '{}'
    )

    const savedLocation =
      sessionStorage.getItem('chitkaraEatsDeliveryLocation') ||
      'Selected Hostel'

    setStudent(savedStudent)
    setStudentName(savedStudent?.name || '')
    setCart(savedCart)
    setDeliveryLocation(savedLocation)
  }, [])

  // Logout
  function handleLogout() {
    sessionStorage.removeItem('chitkaraEatsLoggedIn')
    sessionStorage.removeItem('chitkaraEatsStudent')

    navigate('/login')
  }

  // Cart calculation
  const cartItems = Object.keys(cart)

  let subtotal = 0
  let count = 0

  cartItems.forEach((name) => {
    const item = cart[name]

    count += item.qty
    subtotal += item.price * item.qty
  })

  const discount = subtotal >= 150 ? 20 : 0
  const total = subtotal - discount

  // Place order
  function handlePlaceOrder() {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }

    const name = studentName.trim()
    const mobile = mobileNumber.trim()
    const room = roomNumber.trim()

    if (!name || !mobile || !room) {
      alert(
        'Please fill Student Name, Mobile Number and Room Number.'
      )
      return
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number.')
      return
    }

    const orderId =
      '#CE' + Math.floor(1000 + Math.random() * 9000)

    setOrderDetails({
      orderId: orderId,
      name: name,
      room: room,
      payment: paymentMethod,
      instructions: instructions.trim() || 'None',
      location: `${deliveryLocation} • Room ${room}`
    })

    setOrderConfirmed(true)

    // Clear cart after order
    sessionStorage.removeItem('chitkaraEatsCart')

    alert('Order placed successfully! 🎉')
  }

  return (
    <div className="checkout-page">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="container nav">

          <button
            className="logo"
            type="button"
            onClick={() => navigate('/home')}
          >
            Chitkara<span>Eats</span>
          </button>

          <div className="checkout-user">
            👤 {student?.name || 'Student'}

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* CHECKOUT CONTENT */}
      {!orderConfirmed ? (
        <main className="checkout-main">

          <div className="container">

            <button
  className="back-btn"
  type="button"
  onClick={() => navigate('/home')}
>
  ← Back to Menu
</button>

            <h1>Checkout</h1>

            <p className="checkout-subtitle">
              Complete your details and place your order.
            </p>

            <div className="checkout-grid">

              {/* LEFT SIDE */}
              <section className="checkout-form">

                <div className="checkout-card">

                  <h2>Delivery Details</h2>

                  <div className="checkout-location">
                    📍 <strong>Deliver to:</strong>{' '}
                    {deliveryLocation}
                  </div>

                  <div className="checkout-field">
                    <label>Student Name</label>

                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={studentName}
                      onChange={(e) =>
                        setStudentName(e.target.value)
                      }
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Mobile Number</label>

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength="10"
                      placeholder="10-digit mobile number"
                      value={mobileNumber}
                      onChange={(e) =>
                        setMobileNumber(e.target.value)
                      }
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Room Number</label>

                    <input
                      type="text"
                      placeholder="Example: A-204"
                      value={roomNumber}
                      onChange={(e) =>
                        setRoomNumber(e.target.value)
                      }
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Delivery Instructions</label>

                    <textarea
                      placeholder="Example: Call me when you reach the gate"
                      value={instructions}
                      onChange={(e) =>
                        setInstructions(e.target.value)
                      }
                    ></textarea>
                  </div>

                </div>

                {/* PAYMENT */}
                <div className="checkout-card">

                  <h2>Payment Method</h2>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      checked={
                        paymentMethod === 'Cash on Delivery'
                      }
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                    />

                    <span>
                      💵 Cash on Delivery
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                    />

                    <span>
                      📱 UPI
                    </span>
                  </label>

                </div>

              </section>

              {/* RIGHT SIDE */}
              <section className="order-summary">

                <div className="checkout-card">

                  <h2>Order Summary</h2>

                  {cartItems.length === 0 ? (
                    <div className="empty-checkout">
                      Your cart is empty.
                    </div>
                  ) : (
                    <>
                      {cartItems.map((name) => {
                        const item = cart[name]

                        return (
                          <div
                            className="summary-item"
                            key={name}
                          >
                            <div>
                              <strong>{name}</strong>

                              <span>
                                {item.qty} × ₹{item.price}
                              </span>
                            </div>

                            <strong>
                              ₹{item.price * item.qty}
                            </strong>
                          </div>
                        )
                      })}

                      <hr />

                      <div className="summary-row">
                        <span>Items</span>
                        <strong>{count}</strong>
                      </div>

                      <div className="summary-row">
                        <span>Subtotal</span>
                        <strong>₹{subtotal}</strong>
                      </div>

                      <div className="summary-row">
                        <span>Delivery Fee</span>

                        <strong className="green-text">
                          ₹0
                        </strong>
                      </div>

                      <div className="summary-row">
                        <span>Student Discount</span>

                        <strong className="red-text">
                          -₹{discount}
                        </strong>
                      </div>

                      <hr />

                      <div className="summary-total">
                        <span>Total</span>
                        <strong>₹{total}</strong>
                      </div>

                      <button
                        className="place-order-btn"
                        type="button"
                        onClick={handlePlaceOrder}
                      >
                        Place Order →
                      </button>
                    </>
                  )}

                </div>

              </section>

            </div>

          </div>

        </main>
      ) : (

        /* ORDER CONFIRMATION */
        <main className="confirmation-page">

          <div className="confirmation-card">

            <div className="success-icon">
              ✓
            </div>

            <h1>Order Confirmed! 🎉</h1>

            <p>
              Your ChitkaraEats order has been placed
              successfully.
            </p>

            <div className="order-id">
              Order ID:
              <strong>
                {orderDetails?.orderId}
              </strong>
            </div>

            <div className="confirmation-details">

              <p>
                <strong>Name:</strong>{' '}
                {orderDetails?.name}
              </p>

              <p>
                <strong>Delivery:</strong>{' '}
                {orderDetails?.location}
              </p>

              <p>
                <strong>Payment:</strong>{' '}
                {orderDetails?.payment}
              </p>

              <p>
                <strong>Instructions:</strong>{' '}
                {orderDetails?.instructions}
              </p>

            </div>

            <button
              className="home-btn"
              type="button"
              onClick={() => navigate('/home')}
            >
              Back to Home
            </button>

          </div>

        </main>
      )}

      {/* FOOTER */}
      <footer>
        <div className="container">

          <div className="copyright">
            © 2026 ChitkaraEats • Chitkara University, Punjab
          </div>

        </div>
      </footer>

    </div>
  )
}

export default Checkout
