import { useState } from 'react';
import { useStore } from '../store';
import { UserCircle, Camera, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateUser, games } = useStore();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ fullName: currentUser?.fullName || '', phone: currentUser?.phone || '', bio: currentUser?.bio || '', games: currentUser?.games || [], position: currentUser?.position || '', course: currentUser?.course || '', branch: currentUser?.branch || '', year: currentUser?.year || '' });

  const handleSave = () => { if (!currentUser) return; updateUser(currentUser.id, form); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file || !currentUser) return; const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']; if (!validTypes.includes(file.type)) { alert('Invalid file type'); return; } if (file.size > 5 * 1024 * 1024) { alert('File too large'); return; } const reader = new FileReader(); reader.onload = () => updateUser(currentUser.id, { avatar: reader.result as string }); reader.readAsDataURL(file); };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3"><UserCircle className="w-6 h-6 text-indigo-500" /><h1 className="text-2xl font-bold">My Profile</h1></div>
      {saved && <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"><CheckCircle className="w-5 h-5" /><span>Profile updated!</span></div>}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center gap-6">
          <div className="relative"><div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">{currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl font-bold text-white">{currentUser.fullName.charAt(0)}</span>}</div><label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700"><Camera className="w-4 h-4 text-white" /><input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" /></label></div>
          <div><h2 className="text-xl font-bold">{currentUser.fullName}</h2><p className="text-sm text-gray-500 capitalize">{currentUser.role.replace('_', ' ')}</p><p className="text-xs text-gray-400 mt-1">{currentUser.email}</p></div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-lg">Profile Details</h3>{!editing ? <button onClick={() => setEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Edit</button> : <div className="flex gap-2"><button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"><Save className="w-4 h-4" />Save</button><button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button></div>}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} disabled={!editing} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={!editing} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Games</label><div className="flex flex-wrap gap-2">{games.filter(g => g.isActive).map(g => (<button key={g.id} type="button" onClick={() => editing && setForm(f => ({ ...f, games: f.games.includes(g.id) ? f.games.filter(x => x !== g.id) : [...f.games, g.id] }))} disabled={!editing} className={`px-3 py-1 rounded-full text-sm border-2 ${form.games.includes(g.id) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'} ${!editing ? 'opacity-50' : ''}`}>{form.games.includes(g.id) ? '✓ ' : ''}{g.icon} {g.name}</button>))}</div></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} disabled={!editing} rows={3} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" /></div>
        </div>
      </div>
    </div>
  );
}
