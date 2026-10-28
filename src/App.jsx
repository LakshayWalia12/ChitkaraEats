import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import './App.css'

const locations = {
  'Boys Hostels': [
    'Alfred Nobel Hostel',
    'Archimedies Hostel',
    'Aristotle Hostel',
    'Armstrong Hostel',
    'Franklin Hostel'
  ],
  'Girls Hostels': [
    'PI Hostel',
    'NGH Hostel',
    'Colombus Hostel',
    'IBN Hostel'
  ],
  'Academic Blocks': [
    'Turing Block (CSE)',
    'Galileo Block',
    'Exploretorium',
    'Newton Block',
    'Sportorium'
  ]
}

const products = [
  ['Classic Maggi', 50, '🍜', 'Classic masala noodles'],
  ['Veg Burger', 70, '🍔', 'Crispy patty with fresh veggies'],
  ['Chicken Burger', 99, '🍗', 'Juicy grilled chicken patty'],
  ['Chocolate Shake', 90, '🍫', 'Thick and creamy chocolate shake'],
  ['Oreo Shake', 95, '🍪', 'Loaded with crushed Oreo cookies'],
  ['Egg Roll', 60, '🥚', 'Spicy egg wrap with onions'],
  ['Notebook (200 pg)', 40, '📓', 'Ruled notebook, spiral bound'],
  ['Xerox / Printout (per page)', 2, '🖨️', 'Black & white printout per page'],
  ['Cheese Maggi', 70, '🧀', 'Creamy cheesy Maggi'],
  ['Masala Maggi', 60, '🍜', 'Spicy campus favourite'],
  ['Kulhad Chai', 30, '☕', 'Hot chai in a kulhad'],
  ['Cold Coffee', 80, '🥤', 'Chilled creamy coffee'],
  ['Paneer Roll', 90, '🌯', 'Spicy paneer wrap']
]

const outlets = [
  ['Punjab 13', '🍕', '15–20 min', '★ 4.6', 'North Indian, Chinese, Pastas', '₹50 minimum', 'red-bg'],
  ['Chai Nagri', '☕', '10–15 min', '★ 4.8', 'Kulhad Chai, Bun Maska, Samosa', '₹30 minimum', 'brown-bg'],
  ['Healthy Wave', '🌯', '20–25 min', '★ 4.5', 'Paneer, Egg & Chicken Rolls', '₹60 minimum', 'green-bg'],
  ['Tuck Shop', '🌙', '15 min', '★ 4.7', 'Biscuits, Chips, Midnight Maggi', 'Open till 2 AM', 'blue-bg']
]

function App() {
  // React Router navigation
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState(locations['Boys Hostels'][0])

  const [cart, setCart] = useState(() =>
    JSON.parse(sessionStorage.getItem('chitkaraEatsCart') || '{}')
  )

  const [cartOpen, setCartOpen] = useState(false)
  const [student, setStudent] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const savedStudent = JSON.parse(
      sessionStorage.getItem('chitkaraEatsStudent') || 'null'
    )

    setStudent(savedStudent)
  }, [])

  useEffect(() => {
    sessionStorage.setItem('chitkaraEatsCart', JSON.stringify(cart))
  }, [cart])

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()

    return products.filter(([name, , , description]) =>
      `${name} ${description}`.toLowerCase().includes(q)
    )
  }, [search])

  const cartCount = Object.values(cart).reduce(
    (sum, item) => sum + item.qty,
    0
  )

  const subtotal = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  const discount = subtotal >= 150 ? 20 : 0
  const total = subtotal - discount

  function showToast(message) {
    setToast(message)

    setTimeout(() => {
      setToast('')
    }, 1600)
  }

  function addToCart(name, price) {
    setCart((oldCart) => ({
      ...oldCart,
      [name]: {
        price: price,
        qty: (oldCart[name]?.qty || 0) + 1
      }
    }))

    showToast(`${name} added to cart ✓`)
  }

  function changeQty(name, amount) {
    setCart((oldCart) => {
      const item = oldCart[name]

      if (!item) {
        return oldCart
      }

      const qty = item.qty + amount
      const next = { ...oldCart }

      if (qty <= 0) {
        delete next[name]
      } else {
        next[name] = {
          ...item,
          qty: qty
        }
      }

      return next
    })
  }

  function logout() {
    sessionStorage.removeItem('chitkaraEatsLoggedIn')
    sessionStorage.removeItem('chitkaraEatsStudent')

    setStudent(null)

    showToast('Logged out')
  }

  // Go to React Checkout page
  function goToCheckout() {
    if (!cartCount) {
      alert('Your cart is empty!')
      return
    }

    // Save selected delivery location
    sessionStorage.setItem(
      'chitkaraEatsDeliveryLocation',
      location
    )

    // React Router se checkout page open hoga
    navigate('/checkout')

    // Cart panel close
    setCartOpen(false)
  }

  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container nav">

          <a className="logo" href="#">
            Chitkara<span>Eats</span>
          </a>

          <div className="location">
            📍 <span>Deliver to:</span>

            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                showToast(`Delivery location: ${e.target.value}`)
              }}
            >
              {Object.entries(locations).map(([group, items]) => (
                <optgroup label={group} key={group}>
                  {items.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="account">
            <span>
              {student ? `👤 ${student.name}` : 'Student'}
            </span>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="search">
            <span className="search-icon">⌕</span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Maggi, Cold Coffee, Rolls, Stationery..."
            />
          </div>

          <button
            className="cart"
            type="button"
            onClick={() => setCartOpen(true)}
          >
            🛒 Cart ({cartCount})
          </button>

        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">

          <div>
            <span className="badge">
              EXCLUSIVE TO CHITKARA PUNJAB CAMPUS
            </span>

            <h1>
              Late night cravings? We deliver right to your hostel gate.
            </h1>

            <p>
              Order your favourite food, drinks and study essentials
              from campus outlets without leaving your hostel.
            </p>

            <div className="actions">
              <a className="btn primary" href="#menu">
                Order Now →
              </a>

              <a className="btn outline" href="#outlets">
                Explore Outlets
              </a>
            </div>

            <div className="stats">
              <div className="stat">
                <strong>15–20 min</strong>
                <small>Average Delivery</small>
              </div>

              <div className="stat">
                <strong>10+</strong>
                <small>Campus Outlets</small>
              </div>

              <div className="stat">
                <strong>24 Hr</strong>
                <small>Square One Open</small>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="food-circle">🍔</div>

            <div className="float f1">
              ⚡ Fast Campus Delivery
            </div>

            <div className="float f2">
              🎓 Student Friendly Prices
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories">
        <div className="container">

          <div className="section-head">
            <div>
              <h2>Quick Categories</h2>
              <p>Find exactly what you are craving</p>
            </div>

            <a className="red-link" href="#menu">
              See All
            </a>
          </div>

          <div className="categories">
            {[
              '☕ Chai & Coffee',
              '🌯 Kathi Rolls',
              '🍜 Late Night Maggi',
              '🍔 Burgers & Meals',
              '🥤 Shakes & Drinks',
              '📝 Stationery & Print'
            ].map((item) => (
              <a
                className="category"
                href="#menu"
                key={item}
              >
                <span className="emoji">
                  {item.split(' ')[0]}
                </span>

                {item.substring(item.indexOf(' ') + 1)}
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* OUTLETS */}
      <section id="outlets">
        <div className="container">

          <div className="section-head">
            <div>
              <h2>Popular Campus Spots</h2>
              <p>Student favourites around campus</p>
            </div>

            <a className="red-link" href="#menu">
              View Menu
            </a>
          </div>

          <div className="outlets">
            {outlets.map(
              ([name, emoji, time, rating, info, minimum, bg]) => (
                <article className="card" key={name}>

                  <div className={`outlet-img ${bg}`}>
                    {emoji}

                    <span className="time">
                      {time}
                    </span>
                  </div>

                  <div className="card-body">

                    <div className="title-row">
                      <h3>{name}</h3>
                      <span className="rating">
                        {rating}
                      </span>
                    </div>

                    <p className="muted info">
                      📍 Square One
                      <br />
                      {info}
                    </p>

                    <div className="card-foot">
                      <span>{minimum}</span>

                      <span className="status">
                        ● {name === 'Tuck Shop'
                          ? 'Active'
                          : 'Open Now'}
                      </span>
                    </div>

                    <a
                      className="menu-btn"
                      href="#menu"
                    >
                      View Menu
                    </a>

                  </div>
                </article>
              )
            )}
          </div>

        </div>
      </section>

      {/* MENU */}
      <section id="menu">
        <div className="container">

          <div className="section-head">
            <div>
              <h2>Popular Picks</h2>
              <p>Fresh food, snacks and essentials</p>
            </div>
          </div>

          <div className="products">
            {filteredProducts.map(
              ([name, price, emoji, description]) => (
                <article
                  className="card product"
                  key={name}
                >

                  <div className="product-img">
                    {emoji}
                  </div>

                  <div>
                    <h3>{name}</h3>

                    <p>{description}</p>

                    <div className="product-bottom">

                      <span className="price">
                        ₹{price}
                      </span>

                      <button
                        className="add add-btn"
                        type="button"
                        onClick={() =>
                          addToCart(name, price)
                        }
                      >
                        + Add
                      </button>

                    </div>
                  </div>

                </article>
              )
            )}
          </div>

        </div>
      </section>

      {/* WHY CHITKARAEATS */}
      <section className="why">
        <div className="container">

          <div className="section-head">
            <div>
              <h2>Why Students Love ChitkaraEats</h2>
              <p>Made for campus life</p>
            </div>
          </div>

          <div className="features">
            {[
              [
                '⚡',
                'Fast Campus Delivery',
                'Get your food delivered around campus in just 15–20 minutes.'
              ],
              [
                '💰',
                'Zero Delivery Fee',
                'Student-first pricing with no unnecessary delivery charges.'
              ],
              [
                '🌙',
                'Late Night Food',
                'Cravings after midnight? Tuck shop and night food have you covered.'
              ],
              [
                '📍',
                'Hostel Delivery',
                'Choose your hostel or academic block for convenient delivery.'
              ],
              [
                '🎓',
                'Student Friendly Prices',
                "Affordable options designed around a student's budget."
              ],
              [
                '🛍️',
                'Food + Stationery',
                'Order food and study essentials from one convenient platform.'
              ]
            ].map(([icon, title, text]) => (
              <div
                className="feature"
                key={title}
              >
                <span className="feature-icon">
                  {icon}
                </span>

                <h3>{title}</h3>

                <p>{text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="container">

          <div className="section-head">
            <div>
              <h2>How Hostel Delivery Works</h2>
              <p>Three simple steps</p>
            </div>
          </div>

          <div className="steps">
            {[
              [
                '1',
                'Pick Your Hostel',
                'Select your hostel or campus block from the top bar.'
              ],
              [
                '2',
                'Order Food & Needs',
                'Choose snacks, meals, drinks or stationery.'
              ],
              [
                '3',
                'Receive at Gate',
                'Get your order delivered to your selected location.'
              ]
            ].map(([no, title, text]) => (
              <div className="step" key={no}>

                <div className="step-no">
                  {no}
                </div>

                <h3>{title}</h3>

                <p>{text}</p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">

          <div className="footer-grid">

            <div>
              <h3>ChitkaraEats</h3>
              <p>
                Built by students, for students.
                Fast meals and study essentials across
                Chitkara University campus.
              </p>
            </div>

            <div>
              <h4>Hostel Zones</h4>

              <ul>
                <li>Alfred Nobel</li>
                <li>Archimedies</li>
                <li>Aristotle</li>
                <li>PI & NGH</li>
                <li>IBN</li>
              </ul>
            </div>

            <div>
              <h4>Popular Outlets</h4>

              <ul>
                <li>Square One</li>
                <li>Chai Nagri</li>
                <li>Healthy Wave</li>
                <li>Tuck Shop</li>
              </ul>
            </div>

            <div>
              <h4>Help & Support</h4>

              <ul>
                <li>
                  <a href="#">Student Support Chat</a>
                </li>

                <li>
                  <a href="#">Become a Delivery Runner</a>
                </li>

                <li>
                  <a href="#">Outlet Partner Login</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="copyright">
            © 2026 ChitkaraEats • Independent Student Delivery Network • Chitkara University, Punjab
          </div>

        </div>
      </footer>

      {/* CART */}
      {cartOpen && (
        <>
          <div className="cart-panel open">

            <div className="cart-head">
              <h2>Your Cart 🛒</h2>

              <button
                className="close"
                type="button"
                onClick={() => setCartOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="cart-demo">

              {!cartCount ? (
                <div className="empty-cart">
                  Your cart is empty. Add something delicious! 🍜
                </div>
              ) : (
                <>
                  {Object.entries(cart).map(
                    ([name, item]) => (
                      <div
                        className="cart-item"
                        key={name}
                      >

                        <span>
                          {name} × {item.qty}
                        </span>

                        <strong>
                          ₹{item.price * item.qty}
                        </strong>

                        <div
                          style={{
                            display: 'flex',
                            gap: '5px'
                          }}
                        >
                          <button
                            className="qty-btn"
                            onClick={() =>
                              changeQty(name, -1)
                            }
                          >
                            −
                          </button>

                          <button
                            className="qty-btn"
                            onClick={() =>
                              changeQty(name, 1)
                            }
                          >
                            +
                          </button>
                        </div>

                      </div>
                    )
                  )}

                  <br />

                  <p>
                    Subtotal
                    <strong style={{ float: 'right' }}>
                      ₹{subtotal}
                    </strong>
                  </p>

                  <p>
                    Delivery Fee
                    <strong
                      style={{
                        float: 'right',
                        color: '#198754'
                      }}
                    >
                      ₹0
                    </strong>
                  </p>

                  <p>
                    Student Discount
                    <strong
                      style={{
                        float: 'right',
                        color: '#d32f2f'
                      }}
                    >
                      -₹{discount}
                    </strong>
                  </p>

                  <hr style={{ margin: '15px 0' }} />

                  <p style={{ fontSize: '18px' }}>
                    <strong>Total</strong>

                    <strong style={{ float: 'right' }}>
                      ₹{total}
                    </strong>
                  </p>

                  {/* CHECKOUT BUTTON */}
                  <button
                    className="checkout"
                    type="button"
                    onClick={goToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}

            </div>
          </div>

          <div
            className="cart-overlay open"
            onClick={() => setCartOpen(false)}
          ></div>
        </>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </>
  )
}

export default App
