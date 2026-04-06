import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', review: '', rating: 5 }); // Changed message to review
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await axiosInstance.get('/content/testimonials');
      setTestimonials(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/content/testimonials/${editingId}`, formData);
      } else {
        await axiosInstance.post('/content/testimonials', formData);
      }
      setFormData({ name: '', review: '', rating: 5 });
      setEditingId(null);
      setShowForm(false);
      fetchTestimonials();
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleEdit = (item) => {
    // Correctly map the fields for editing
    setFormData({ name: item.name, review: item.review, rating: item.rating });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await axiosInstance.delete(`/content/testimonials/${id}`);
        fetchTestimonials();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const columns = [
    { header: 'Client Name', accessor: (row) => row.name },
    { header: 'Review', accessor: (row) => row.review.substring(0, 50) + '...' }, // Changed message to review
    { header: 'Rating', accessor: (row) => `${row.rating} / 5` }
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Manage Testimonials</h2>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', review: '', rating: 5 }); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          {showForm ? 'Cancel' : '+ Add New Testimonial'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                  placeholder="e.g. Rahul S." 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating (1 to 5)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  required 
                  value={formData.rating} 
                  onChange={e => setFormData({...formData, rating: e.target.value})} 
                  className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review / Message</label>
              <textarea 
                required 
                rows={3} 
                value={formData.review} 
                onChange={e => setFormData({...formData, review: e.target.value})} 
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Enter client testimonial..."
              ></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5"
              >
                {editingId ? 'Update Testimonial' : 'Save Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable columns={columns} data={testimonials} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Testimonials;