import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import AdminDashboard from './AdminComponent/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import LandingPage from './components/LandingPage'
import TrackShipment from './components/TrackShipment'
import Contact from './components/Contact'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ship } from 'lucide-react'

// Secret passkey - you should store this securely in an environment variable
const ADMIN_PASSKEY = "ShipTrack2024@Admin"; // Change this to your desired secret passkey

function ProtectedRoute({ children }) {
  const [passkey, setPasskey] = useState('');
  const [showPrompt, setShowPrompt] = useState(true);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handlePasskeySubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (passkey === ADMIN_PASSKEY) {
      setShowPrompt(false);
      setError('');
      // Store in session storage to persist during the session
      sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setError('Too many attempts. Please try again in 30 seconds.');
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, 30000);
      } else {
        setError(`Invalid passkey. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (isAuthenticated === 'true') {
      setShowPrompt(false);
    }
  }, []);

  if (showPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="flex items-center justify-center mb-8">
            <Ship className="h-12 w-12 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800 ml-3">Admin Access</h2>
          </div>
          
          <form onSubmit={handlePasskeySubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-lg font-semibold mb-3">
                Enter Admin Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  disabled={isLocked}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Enter your secret passkey"
                />
              </div>
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLocked || !passkey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLocked ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </motion.button>

            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl text-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Back to Home
              </motion.button>
            </Link>
          </form>
        </motion.div>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <Router>
      {/* nj */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/track" element={<TrackShipment />} />
        <Route path="/contact" element={<Contact />} />
        {/* Catch all unknown routes and redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
