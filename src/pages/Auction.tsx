import { useState } from 'react';
import { useStore } from '../store';
import { Hammer, DollarSign, Users } from 'lucide-react';

export default function Auction() {
  const { auctions, users, teams, tournaments, currentUser, createAuction, placeBid } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ tournamentId: '', playerId: '', basePrice: 50 });
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});

  const players = users.filter(u => u.role === 'player');
  const myTeam = teams.find(t => t.ownerId === currentUser?.id || t.members.includes(currentUser?.id || ''));

  const handleCreate = () => {
    if (!form.tournamentId || !form.playerId) return;
    createAuction(form);
    setShowCreate(false);
    setForm({ tournamentId: '', playerId: '', basePrice: 50 });
  };

  const handleBid = (auctionId: string) => {
    if (!myTeam) return;
    const amount = bidAmounts[auctionId];
    if (!amount) return;
    const success = placeBid(auctionId, myTeam.id, amount);
    if (success) {
      setBidAmounts({ ...bidAmounts, [auctionId]: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hammer className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-800">Auction</h1>
        </div>
        {currentUser?.role === 'admin' && (
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            <DollarSign className="w-4 h-4" /> Add Player
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Add Player to Auction</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={form.tournamentId} onChange={e => setForm({...form, tournamentId: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select Tournament</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={form.playerId} onChange={e => setForm({...form, playerId: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select Player</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.sports?.join(', ')})</option>)}
            </select>
            <input type="number" placeholder="Base Price" value={form.basePrice} onChange={e => setForm({...form, basePrice: +e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Auction Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctions.map(auction => {
          const player = users.find(u => u.id === auction.playerId);
          const highestBid = auction.bids.reduce((max, b) => b.amount > max.amount ? b : max, { amount: 0, teamId: '' } as any);
          const highestTeam = teams.find(t => t.id === highestBid.teamId);
          const currentHighest = highestBid.amount || auction.basePrice;

          return (
            <div key={auction.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{player?.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{player?.fullName}</h3>
                    <p className="text-xs text-gray-500">{player?.sports?.join(', ')} • Base: ₹{auction.basePrice}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  auction.status === 'sold' ? 'bg-green-100 text-green-700' :
                  auction.status === 'unsold' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {auction.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Bid</span>
                  <span className="text-lg font-bold text-amber-600">₹{currentHighest}</span>
                </div>
                {highestTeam && (
                  <p className="text-xs text-gray-500 mt-1">Leading: {highestTeam.name} ({auction.bids.length} bids)</p>
                )}
              </div>

              {auction.status === 'available' && myTeam && (
                <div className="flex gap-2">
                  <input type="number" placeholder="Your bid (₹)" value={bidAmounts[auction.id] || ''}
                    onChange={e => setBidAmounts({...bidAmounts, [auction.id]: +e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" min={currentHighest + 10} />
                  <button onClick={() => handleBid(auction.id)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">
                    Bid
                  </button>
                </div>
              )}

              {auction.status === 'sold' && (
                <p className="text-sm text-green-600 font-medium">Sold to {teams.find(t => t.id === auction.soldTo)?.name} for ₹{auction.soldPrice}</p>
              )}
            </div>
          );
        })}
      </div>

      {auctions.length === 0 && (
        <div className="text-center py-16">
          <Hammer className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No Auction Items</h3>
          <p className="text-gray-400 mt-2">Auction items will appear here when created</p>
        </div>
      )}
    </div>
  );
}
