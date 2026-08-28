import { useMemo, useState } from 'react'
import './App.css'

const tutors = [
  { name: 'Emma R.', country: 'United Kingdom', flag: 'GB', rating: '4.9', lessons: '1,248', price: '$14', specialty: 'Mathematics & confidence', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=85', color: 'yellow' },
  { name: 'Sergio M.', country: 'Spain', flag: 'ES', rating: '5.0', lessons: '982', price: '$11', specialty: 'Coding fundamentals', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85', color: 'blue' },
  { name: 'Maya K.', country: 'United States', flag: 'US', rating: '4.9', lessons: '756', price: '$16', specialty: 'Science & exam prep', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85', color: 'pink' },
  { name: 'Leo A.', country: 'Australia', flag: 'AU', rating: '4.8', lessons: '634', price: '$12', specialty: 'Languages & literature', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85', color: 'green' },
]

function App() {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('All subjects')
  const [favorite, setFavorite] = useState([])
  const [authMode, setAuthMode] = useState(null)
  const [authRole, setAuthRole] = useState('student')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  const [authMessage, setAuthMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const filteredTutors = useMemo(() => tutors.filter((tutor) =>
    `${tutor.name} ${tutor.country} ${tutor.specialty}`.toLowerCase().includes(query.toLowerCase())
  ), [query])

  const toggleFavorite = (name) => setFavorite((current) => current.includes(name)
    ? current.filter((item) => item !== name)
    : [...current, name])

  const openAuth = (mode) => {
    setAuthMode(mode)
    setAuthMessage('')
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    const endpoint = authMode === 'signup' ? 'signup' : 'login'
    const payload = authMode === 'signup' ? { ...authForm, role: authRole } : { email: authForm.email, password: authForm.password }

    try {
      const response = await fetch(`/api/users/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Something went wrong.')
      localStorage.setItem('astegniAccessToken', data.access)
      setCurrentUser(data.user)
      setAuthMode(null)
      setAuthForm({ username: '', email: '', password: '' })
    } catch (error) {
      setAuthMessage(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <main>
      <nav className="nav"><a className="brand" href="/">Astegni<span>.</span></a><div className="nav-links"><a href="#tutors">Find a tutor</a><a href="#how">How it works</a><a href="#for-schools">For schools</a></div><div className="nav-actions"><select value={subject} onChange={(event) => setSubject(event.target.value)} aria-label="Subject"><option>All subjects</option><option>Mathematics</option><option>Science</option><option>Coding</option><option>Languages</option></select>{currentUser ? <span className="user-pill">{currentUser.username}</span> : <><button className="login" onClick={() => openAuth('login')}>Log in</button><button className="signup" onClick={() => openAuth('signup')}>Sign up</button></>}</div><button className="menu" aria-label="Open menu">☰</button></nav>
      <section className="hero"><div className="hero-copy"><p className="eyebrow">The world is your classroom</p><h1>Learn anything.<br /><em>Become more.</em></h1><p className="hero-text">Learn with a tutor who gets you. Private lessons, real conversations, and the confidence to master whatever matters to you.</p><div className="hero-actions"><button className="primary" onClick={() => document.querySelector('#tutors').scrollIntoView({ behavior: 'smooth' })}>Find your tutor <span>→</span></button><button className="play" aria-label="Watch how Astegni works">▶ <span>See how it works</span></button></div><div className="proof"><div className="avatars"><span>ER</span><span>SM</span><span>MK</span><span>+</span></div><p><strong>Millions of learners</strong><br />are growing with confidence</p></div></div><div className="hero-art"><div className="sun"></div><div className="scribble">learn<br />out loud</div><img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=85" alt="Smiling Astegni tutor" /><div className="stamp">100%<br /><small>REAL<br />PEOPLE</small></div><div className="note">“My kind of<br />practice.”</div></div></section>
      <section className="tutor-section" id="tutors"><div className="section-head"><div><p className="eyebrow">Meet your match</p><h2>Great lessons<br /><em>start here.</em></h2></div><div className="search-wrap"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, subject, or goal" aria-label="Search tutors" /></div></div><div className="filters"><button className="filter active">All tutors</button><button className="filter">Available now</button><button className="filter">Mathematics</button><button className="filter">Science</button><button className="filter">Coding</button><span className="result-count">{filteredTutors.length} tutors found</span></div><div className="tutor-grid">{filteredTutors.map((tutor) => <article className="tutor-card" key={tutor.name}><div className={`card-photo ${tutor.color}`}><img src={tutor.image} alt={tutor.name} /><button className={`heart ${favorite.includes(tutor.name) ? 'saved' : ''}`} onClick={() => toggleFavorite(tutor.name)} aria-label={`Save ${tutor.name}`}>♡</button><span className="online"><i></i> Online</span></div><div className="card-body"><div className="tutor-name"><h3>{tutor.name}</h3><span>{tutor.flag}</span></div><p className="country">{tutor.country}</p><p className="specialty">{tutor.specialty}</p><div className="card-meta"><span>★ {tutor.rating} <small>({tutor.lessons})</small></span><strong>from {tutor.price}<small>/lesson</small></strong></div></div></article>)}</div></section>
      <section className="how" id="how"><p className="eyebrow">A better way to learn</p><h2>One small step.<br /><em>A lot more you.</em></h2><div className="steps"><div><b>01</b><h3>Pick your person</h3><p>Browse thousands of tutors and find someone who makes you want to keep learning.</p></div><div><b>02</b><h3>Explore any subject</h3><p>Book a lesson that fits your life. Math, science, coding, music, languages, and more.</p></div><div><b>03</b><h3>Watch yourself grow</h3><p>Build a habit, find your strengths, and make learning feel like yours.</p></div></div></section>
      {authMode && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setAuthMode(null)}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="modal-close" onClick={() => setAuthMode(null)} aria-label="Close authentication dialog">×</button><p className="eyebrow">Welcome to Astegni</p><h2 id="auth-title">{authMode === 'signup' ? 'Start learning.' : 'Welcome back.'}</h2><p className="auth-subtitle">{authMode === 'signup' ? 'Find your people. Learn your way.' : 'Pick up where you left off.'}</p>{authMode === 'signup' && <div className="role-tabs"><button className={authRole === 'student' ? 'selected' : ''} onClick={() => setAuthRole('student')} type="button">I am a student</button><button className={authRole === 'tutor' ? 'selected' : ''} onClick={() => setAuthRole('tutor')} type="button">I am a tutor</button></div>}<form onSubmit={submitAuth}>{authMode === 'signup' && <label>Username<input required value={authForm.username} onChange={(event) => setAuthForm({ ...authForm, username: event.target.value })} placeholder="Your name" /></label>}<label>Email<input required type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input required minLength="8" type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} placeholder="At least 8 characters" /></label>{authMessage && <p className="auth-error">{authMessage}</p>}<button className="auth-submit" disabled={authLoading}>{authLoading ? 'Please wait...' : authMode === 'signup' ? `Create ${authRole} account` : 'Log in'}</button></form><button className="switch-auth" onClick={() => openAuth(authMode === 'signup' ? 'login' : 'signup')}>{authMode === 'signup' ? 'Already have an account? Log in' : 'New to Astegni? Create an account'}</button></section></div>}
      <footer><a className="brand" href="/">Astegni<span>.</span></a><p>Learning for real life.</p><span>© 2025 Astegni</span></footer>
    </main>
  )
}

export default App
