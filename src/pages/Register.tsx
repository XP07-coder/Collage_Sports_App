import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Trophy, AlertCircle, UserPlus } from 'lucide-react';
import type { Role } from '../types';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', collegeId: '', course: '', branch: '', year: '', gender: '', dob: '', games: [] as string[], position: '', bio: '', role: 'player' as Role });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const register = useStore(s => s.register);
  const games = useStore(s => s.games);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.password || !form.phone || !form.collegeId) { setError('Fill required fields'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be 6+ chars'); return; }
    const result = register({ fullName: form.fullName, email: form.email, password: form.password, phone: form.phone, collegeId: form.collegeId, course: form.course, branch: form.branch, year: form.year, gender: form.gender, dob: form.dob, games: form.games, position: form.position, bio: form.bio, role: form.role });
    if (result) { setSuccess(true); setTimeout(() => navigate('/login'), 2000); }
    else { setError('Email already exists'); }
  };

  if (success) return (<div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><UserPlus className="w-8 h-8 text-green-600" /></div><h2 className="text-2xl font-bold">Registration Successful!</h2><p className="text-gray-600">Redirecting...</p></div></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-3"><Trophy className="w-7 h-7 text-yellow-300" /></div><h1 className="text-2xl font-bold text-white">Create Account</h1></div>
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">{(['player', 'team_owner', 'referee'] as Role[]).map(role => (<button key={role} type="button" onClick={() => setForm({ ...form, role })} className={`py-2 px-3 rounded-lg text-sm font-medium border-2 ${form.role === role ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>{role === 'team_owner' ? 'Team Owner' : role.charAt(0).toUpperCase() + role.slice(1)}</button>))}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="px-3 py-2 border rounded-lg" />
              <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-3 py-2 border rounded-lg" />
              <input type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="px-3 py-2 border rounded-lg" />
              <input type="password" placeholder="Confirm Password *" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="px-3 py-2 border rounded-lg" />
              <input type="tel" placeholder="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="College ID *" value={form.collegeId} onChange={e => setForm({ ...form, collegeId: e.target.value })} className="px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="Course" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} className="px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="Branch" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} className="px-3 py-2 border rounded-lg" />
            </div>
            <div><label className="block text-sm font-medium mb-2">Select Games</label><div className="flex flex-wrap gap-2">{games.filter(g => g.isActive).map(g => (<button key={g.id} type="button" onClick={() => setForm(f => ({ ...f, games: f.games.includes(g.id) ? f.games.filter(x => x !== g.id) : [...f.games, g.id] }))} className={`px-3 py-1 rounded-full text-sm border-2 ${form.games.includes(g.id) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>{form.games.includes(g.id) ? '✓ ' : ''}{g.icon} {g.name}</button>))}</div></div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg">Create Account</button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
