import { useState } from 'react';
import { useStore } from '../store';
import { UserCircle, Camera, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateUser } = useStore();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
    sport: currentUser?.sport || '',
    position: currentUser?.position || '',
    course: currentUser?.course || '',
    branch: currentUser?.branch || '',
    year: currentUser?.year || '',
  });

  const handleSave = () => {
    if (!currentUser) return;
    updateUser(currentUser.id, form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPG, PNG, or WEBP.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    // Convert to data URL for localStorage storage
    const reader = new FileReader();
    reader.onload = () => {
      updateUser(currentUser.id, { avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <UserCircle className="w-6 h-6 text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{currentUser.fullName.charAt(0)}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser.fullName}</h2>
            <p className="text-sm text-gray-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
            <p className="text-xs text-gray-400 mt-1">{currentUser.email}</p>
            <p className="text-xs text-gray-400">College ID: {currentUser.collegeId}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Profile Details</h3>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                <Save className="w-4 h-4" /> Save
              </button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
            <input type="text" value={form.sport} onChange={e => setForm({...form, sport: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input type="text" value={form.position} onChange={e => setForm({...form, position: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <input type="text" value={form.course} onChange={e => setForm({...form, course: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <input type="text" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
              disabled={!editing} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Account Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-medium">{currentUser.email}</p>
          </div>
          <div>
            <p className="text-gray-400">College ID</p>
            <p className="font-medium">{currentUser.collegeId}</p>
          </div>
          <div>
            <p className="text-gray-400">Gender</p>
            <p className="font-medium">{currentUser.gender || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-400">Year</p>
            <p className="font-medium">{currentUser.year || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-400">Date of Birth</p>
            <p className="font-medium">{currentUser.dob || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-400">Account Status</p>
            <p className="font-medium text-green-600">{currentUser.active ? 'Active' : 'Suspended'}</p>
          </div>
          <div>
            <p className="text-gray-400">Verified</p>
            <p className="font-medium text-green-600">{currentUser.verified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-gray-400">Joined</p>
            <p className="font-medium">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
