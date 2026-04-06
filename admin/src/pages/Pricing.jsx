import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Loader from '../components/Loader';

const Pricing = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nightCharges: '',
    driverAllowance: ''
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await axiosInstance.get('/content');
        const content = res.data;
        setFormData({
          nightCharges: content.nightCharges || '',
          driverAllowance: content.driverAllowance || ''
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const keys = Object.keys(formData);
      for (const key of keys) {
        await axiosInstance.post('/content', { key, value: formData[key] });
      }
      alert('Pricing settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold">Global Pricing Configurations</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Night Charges (₹)</label>
              <input type="number" required value={formData.nightCharges} onChange={e => setFormData({...formData, nightCharges: e.target.value})} className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver Allowance / Day (₹)</label>
              <input type="number" required value={formData.driverAllowance} onChange={e => setFormData({...formData, driverAllowance: e.target.value})} className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Pricing Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Pricing;