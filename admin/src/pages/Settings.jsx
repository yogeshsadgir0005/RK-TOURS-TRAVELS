import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Loader from '../components/Loader';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  
  const [formData, setFormData] = useState({
    siteName: '',
    admin_whatsapp_number: '',
    contactEmail: '',
    contactPhone: '',
    officeAddress: '', 
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',  
    logoUrl: '',
    heroImageUrl: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/content');
        const content = res.data;
        setFormData({
          siteName: content.siteName || '',
          admin_whatsapp_number: content.admin_whatsapp_number || '',
          contactEmail: content.contactEmail || '',
          contactPhone: content.contactPhone || '',
          officeAddress: content.officeAddress || '',
          facebookUrl: content.facebookUrl || '',
          twitterUrl: content.twitterUrl || '',
          instagramUrl: content.instagramUrl || '',
          logoUrl: content.logoUrl || '',
          heroImageUrl: content.heroImageUrl || ''
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageUpload = async (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    if (targetField === 'logoUrl') setUploadingLogo(true);
    else setUploadingHero(true);

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await axiosInstance.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, [targetField]: res.data.imageUrl }));
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      if (targetField === 'logoUrl') setUploadingLogo(false);
      else setUploadingHero(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const keys = Object.keys(formData);
      for (const key of keys) {
        await axiosInstance.post('/content', { key, value: formData[key] });
      }
      alert('Global Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <h2 className="text-2xl font-bold">Global Site Settings</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Logo Upload Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand Logo</label>
              <div className="flex flex-col gap-4">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo Preview" className="h-20 w-auto object-contain bg-gray-50 border border-gray-200 p-2 rounded-xl" />
                ) : (
                  <div className="h-20 w-32 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 rounded-xl font-medium">No Logo</div>
                )}
                <div className="relative">
                  <input type="file" onChange={(e) => handleImageUpload(e, 'logoUrl')} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="cursor-pointer bg-white border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all inline-block shadow-sm">
                    {uploadingLogo ? 'Uploading...' : 'Change Logo'}
                  </label>
                </div>
              </div>
            </div>

            {/* Hero BG Upload Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hero Section Background</label>
              <div className="flex flex-col gap-4">
                {formData.heroImageUrl ? (
                  <img src={formData.heroImageUrl} alt="Hero BG Preview" className="h-20 w-32 object-cover bg-gray-50 border border-gray-200 rounded-xl" />
                ) : (
                  <div className="h-20 w-32 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 rounded-xl font-medium">No Image</div>
                )}
                <div className="relative">
                  <input type="file" onChange={(e) => handleImageUpload(e, 'heroImageUrl')} className="hidden" id="hero-upload" />
                  <label htmlFor="hero-upload" className="cursor-pointer bg-white border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all inline-block shadow-sm">
                    {uploadingHero ? 'Uploading...' : 'Change Background'}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Website Name</label>
              <input type="text" required value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin WhatsApp Number</label>
              <input type="text" required placeholder="e.g. 919876543210" value={formData.admin_whatsapp_number} onChange={e => setFormData({...formData, admin_whatsapp_number: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input type="tel" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Office Address (Used for Footer Map)</label>
              <input type="text" value={formData.officeAddress} onChange={e => setFormData({...formData, officeAddress: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123 Main St, Mumbai, Maharashtra, India" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
              <input type="url" value={formData.facebookUrl} onChange={e => setFormData({...formData, facebookUrl: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
              <input type="url" value={formData.twitterUrl} onChange={e => setFormData({...formData, twitterUrl: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
              <input type="url" value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={saving || uploadingLogo || uploadingHero} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;