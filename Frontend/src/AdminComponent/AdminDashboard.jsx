import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Check, Truck, Edit2, MapPin, AlertCircle, Package, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnquiryList from './EnquiryList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Update the generateContainerId function to be more reliable
const generateContainerId = () => {
  const prefix = 'SHIP';
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${random}-${timestamp}`;
};

// Update the generateContainerPath function
const generateContainerPath = (containerId) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}/${containerId}`;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('shipments');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    containerId: generateContainerId(), // Add containerId with generated value
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    departureLocation: '',
    destinationLocation: '',
    currentLocation: '',
    departureDate: '',
    eta: '',
    status: 'Pending',
    shipmentType: 'Standard',
    weight: '',
    dimensions: '',
    description: '',
    specialInstructions: ''
  });
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const statusOptions = ['Pending', 'In Transit', 'Delayed', 'Delivered', 'On Hold'];
  const shipmentTypes = ['Standard', 'Express', 'Priority', 'Economy'];

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchShipments();
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName) errors.customerName = 'Customer name is required';
    if (!formData.customerEmail) {
      errors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errors.customerEmail = 'Invalid email format';
    }
    if (!formData.customerPhone) errors.customerPhone = 'Phone number is required';
    if (!formData.departureLocation) errors.departureLocation = 'Departure location is required';
    if (!formData.destinationLocation) errors.destinationLocation = 'Destination location is required';
    if (!formData.currentLocation) errors.currentLocation = 'Current location is required';
    if (!formData.departureDate) errors.departureDate = 'Departure date is required';
    if (!formData.eta) errors.eta = 'ETA is required';
    if (!formData.weight) errors.weight = 'Weight is required';
    if (!formData.dimensions) errors.dimensions = 'Dimensions are required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/shipments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem('adminToken');
          navigate('/admin-login');
          return;
        }
        throw new Error('Failed to fetch shipments');
      }

      const data = await response.json();
      setShipments(data);
      setError('');
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to load shipments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    setError('');
    
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create shipment data
      const shipmentData = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        departureLocation: formData.departureLocation.trim(),
        destinationLocation: formData.destinationLocation.trim(),
        currentLocation: formData.currentLocation.trim(),
        departureDate: formData.departureDate,
        eta: formData.eta,
        status: formData.status,
        shipmentType: formData.shipmentType,
        weight: formData.weight.toString(),
        dimensions: formData.dimensions.trim(),
        description: (formData.description || '').trim(),
        specialInstructions: (formData.specialInstructions || '').trim()
      };

      console.log('Making API request to:', `${API_URL}/shipments`);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      });
      console.log('Request body:', JSON.stringify(shipmentData, null, 2));

      const response = await fetch(`${API_URL}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(shipmentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      setSuccessMessage(`Shipment added successfully! Container ID: ${data.containerId}`);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        departureLocation: '',
        destinationLocation: '',
        currentLocation: '',
        departureDate: '',
        eta: '',
        status: 'Pending',
        shipmentType: 'Standard',
        weight: '',
        dimensions: '',
        description: '',
        specialInstructions: ''
      });

      await fetchShipments();

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error details:', err);
      setError(`Error adding shipment: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/shipments/${shipmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setSuccessMessage('Status updated successfully');
      setShowSuccess(true);
      fetchShipments();

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update status. Please try again.');
    }
  };

  const handleUpdateLocation = async (shipmentId, newLocation) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/shipments/${shipmentId}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ location: newLocation })
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      setSuccessMessage('Location updated successfully');
      setShowSuccess(true);
      fetchShipments();

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update location. Please try again.');
    }
  };

  const filteredShipments = shipments.filter(shipment => 
    Object.values(shipment).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('shipments')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'shipments' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Shipments</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'enquiries' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Enquiries</span>
              </div>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('adminToken');
                navigate('/admin-login');
              }}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'shipments' ? (
          <>
            {/* Success Alert */}
            {showSuccess && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                <Check className="h-5 w-5" />
                {successMessage}
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Add Shipment Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Add New Shipment</h2>
              
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Type</label>
                    <select
                      name="shipmentType"
                      value={formData.shipmentType}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      {shipmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.customerName ? 'border-red-500' : ''}`}
                    />
                    {formErrors.customerName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                    <input
                      type="email"
                      placeholder="Enter customer email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.customerEmail ? 'border-red-500' : ''}`}
                    />
                    {formErrors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.customerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.customerPhone ? 'border-red-500' : ''}`}
                    />
                    {formErrors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.customerPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Location</label>
                    <input
                      type="text"
                      placeholder="Enter departure location"
                      name="departureLocation"
                      value={formData.departureLocation}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.departureLocation ? 'border-red-500' : ''}`}
                    />
                    {formErrors.departureLocation && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.departureLocation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination Location</label>
                    <input
                      type="text"
                      placeholder="Enter destination location"
                      name="destinationLocation"
                      value={formData.destinationLocation}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.destinationLocation ? 'border-red-500' : ''}`}
                    />
                    {formErrors.destinationLocation && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.destinationLocation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                    <input
                      type="text"
                      placeholder="Enter current location"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.currentLocation ? 'border-red-500' : ''}`}
                    />
                    {formErrors.currentLocation && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.currentLocation}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.departureDate ? 'border-red-500' : ''}`}
                    />
                    {formErrors.departureDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.departureDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Arrival Date</label>
                    <input
                      type="date"
                      name="eta"
                      value={formData.eta}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.eta ? 'border-red-500' : ''}`}
                    />
                    {formErrors.eta && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.eta}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Shipment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="Enter weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.weight ? 'border-red-500' : ''}`}
                    />
                    {formErrors.weight && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.weight}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (LxWxH)</label>
                    <input
                      type="text"
                      placeholder="e.g., 100x50x75 cm"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${formErrors.dimensions ? 'border-red-500' : ''}`}
                    />
                    {formErrors.dimensions && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.dimensions}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Enter any special handling instructions or notes"
                  rows="3"
                  className="w-full p-2 border rounded-lg resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding Shipment...</span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5" />
                    <span>Add New Shipment</span>
                  </>
                )}
              </button>
            </form>

            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg"
                />
              </div>
              <button
                onClick={fetchShipments}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Refresh shipments"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Shipments Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Container ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Container Path
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departure Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departure Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ETA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2">Loading shipments...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredShipments.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                          No shipments found
                        </td>
                      </tr>
                    ) : (
                      filteredShipments.map((shipment) => (
                        <tr key={shipment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {shipment.containerId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.containerPath}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.customerEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.departureLocation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.currentLocation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={shipment.status}
                              onChange={(e) => handleUpdateStatus(shipment._id, e.target.value)}
                              className="text-sm rounded-full px-3 py-1 font-medium"
                              style={{
                                backgroundColor: 
                                  shipment.status === 'Delivered' ? '#def7ec' :
                                  shipment.status === 'In Transit' ? '#e1effe' :
                                  shipment.status === 'Delayed' ? '#fde8e8' :
                                  '#f3f4f6',
                                color:
                                  shipment.status === 'Delivered' ? '#03543f' :
                                  shipment.status === 'In Transit' ? '#1e429f' :
                                  shipment.status === 'Delayed' ? '#9b1c1c' :
                                  '#374151'
                              }}
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(shipment.departureDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(shipment.eta).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const newLocation = prompt('Enter new location:', shipment.currentLocation);
                                  if (newLocation) handleUpdateLocation(shipment._id, newLocation);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <MapPin className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EnquiryList />
        )}
      </div>
    </div>
  );
}