import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

export default function TrackShipment() {
  const [containerId, setContainerId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateContainerId = (id) => {
    return id.trim().length > 0;
  };

  const handleTracking = async () => {
    if (!validateContainerId(containerId)) {
      setError('Please enter a valid container ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/shipments/track/${containerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tracking information');
      }

      setTrackingResult(data);
      setError('');
    } catch (error) {
      console.error('Error tracking shipment:', error);
      setError(error.message || 'Failed to connect to tracking service');
      setTrackingResult(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <Ship className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">ShipTrack</span>
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Tracking Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            <h1 className="text-3xl font-bold text-center mb-8">Track Your Shipment</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Container ID (e.g., CONT-1234)"
                  value={containerId}
                  onChange={(e) => setContainerId(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-400 pl-12"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <button
                onClick={handleTracking}
                disabled={loading || !containerId}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Track Now</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Tracking Result */}
            {trackingResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white rounded-xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-semibold mb-6">Tracking Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-600">Container ID</p>
                    <p className="font-semibold text-lg">{trackingResult.containerId}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold text-lg text-blue-600">{trackingResult.status}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-600">Current Location</p>
                    <p className="font-semibold text-lg">{trackingResult.currentLocation}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-600">Departure From</p>
                    <p className="font-semibold text-lg">{trackingResult.departureLocation}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-600">Expected Arrival</p>
                    <p className="font-semibold text-lg">{formatDate(trackingResult.eta)}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-semibold text-lg">{formatDate(trackingResult.lastUpdated)}</p>
                  </div>
                </div>

                {/* Location History */}
                {trackingResult.locationHistory && trackingResult.locationHistory.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Location History</h3>
                    <div className="space-y-4">
                      {trackingResult.locationHistory.map((history, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div>
                            <p className="font-medium">{history.location}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(history.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 