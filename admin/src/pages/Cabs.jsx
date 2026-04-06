import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';

const Cabs = () => {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Expanded initial state for dynamic fields
  const initialFormState = { 
    name: '', 
    vehicleNumber: '',
    seats: '', 
    pricePerKm: '', 
    image: '', 
    isActive: true,
    acStatus: 'AC',
    fuelType: 'Petrol',
    category: 'Sedan',
    rating: 4.8,
    trips: 0,
    features: '' 
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchCabs = async () => {
    try {
      const res = await axiosInstance.get('/cabs');
      setCabs(res.data);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchCabs(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await axiosInstance.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image: res.data.imageUrl });
    } catch (error) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: typeof formData.features === 'string' ? formData.features.split(',').map(f => f.trim()).filter(f => f) : formData.features
      };
      if (editingId) {
        await axiosInstance.put(`/cabs/${editingId}`, payload);
      } else {
        await axiosInstance.post('/cabs', payload);
      }
      setFormData(initialFormState);
      setShowForm(false);
      setEditingId(null);
      fetchCabs();
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleEdit = (cab) => {
    setFormData({
      name: cab.name,
      vehicleNumber: cab.vehicleNumber || '',
      seats: cab.seats,
      pricePerKm: cab.pricePerKm,
      image: cab.image || '',
      isActive: cab.isActive,
      acStatus: cab.acStatus || 'AC',
      fuelType: cab.fuelType || 'Petrol',
      category: cab.category || 'Sedan',
      rating: cab.rating || 4.8,
      trips: cab.trips || 0,
      features: Array.isArray(cab.features) ? cab.features.join(', ') : ''
    });
    setEditingId(cab._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this cab?')) {
      try {
        await axiosInstance.delete(`/cabs/${id}`);
        fetchCabs();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const columns = [
    { header: 'Image', accessor: (row) => row.image ? <img src={row.image} alt="cab" className="h-10 w-16 object-contain bg-gray-50 rounded" /> : 'No Image' },
    { header: 'Vehicle No.', accessor: (row) => <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded text-sm uppercase tracking-wider">{row.vehicleNumber || 'N/A'}</span> },
    { header: 'Name', accessor: (row) => <span className="font-bold">{row.name}</span> },
    { header: 'Category', accessor: (row) => row.category },
    { header: 'Seats', accessor: (row) => row.seats },
    { header: 'Price/km', accessor: (row) => `₹${row.pricePerKm}` },
    { header: 'Status', accessor: (row) => <span className={`px-2 py-1 rounded text-xs font-bold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.isActive ? 'Active' : 'Inactive'}</span> }
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Cabs</h2>
        <button onClick={() => { setShowForm(!showForm); setFormData(initialFormState); setEditingId(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
          {showForm ? 'Cancel' : 'Add New Cab'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cab Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Toyota Innova" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle Number</label>
                <input type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono uppercase tracking-wide" placeholder="e.g. MH15BH2042" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Seats</label>
                <input type="number" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price Per Km (₹)</label>
                <input type="number" required value={formData.pricePerKm} onChange={e => setFormData({...formData, pricePerKm: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">AC Status</label>
                <select value={formData.acStatus} onChange={e => setFormData({...formData, acStatus: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fuel Type</label>
                <select value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="EV">EV</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Features (Comma separated)</label>
                <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="GPS Tracking, First Aid Kit, Clean Interiors" />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cab Image</label>
                <div className="flex items-center gap-4">
                  {formData.image && <img src={formData.image} alt="preview" className="h-16 w-24 object-contain bg-gray-50 border border-gray-200 rounded" />}
                  <div className="flex flex-col gap-1">
                    {uploading ? (
                      <div className="text-sm font-medium text-blue-600">Uploading...</div>
                    ) : (
                      <>
                        <div className="relative">
                          <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" id="cab-image-upload" />
                          <label htmlFor="cab-image-upload" className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-block">
                            Choose Image
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 w-max">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
              <label htmlFor="isActive" className="ml-3 block text-sm font-semibold text-gray-800 cursor-pointer">Available for Booking</label>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button type="submit" disabled={uploading} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5 mt-4">
                {editingId ? 'Update Cab' : 'Save Cab'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={cabs} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Cabs;