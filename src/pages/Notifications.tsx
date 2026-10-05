import { useStore } from '../store';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';

export default function Notifications() {
  const { notifications, currentUser, markNotificationRead } = useStore();
  const myNotifications = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = myNotifications.filter(n => !n.read).length;

  const markAllRead = () => {
    myNotifications.filter(n => !n.read).forEach(n => markNotificationRead(n.id));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No Notifications</h3>
          <p className="text-gray-400 mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifications.map(notif => (
            <div key={notif.id}
              onClick={() => !notif.read && markNotificationRead(notif.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                notif.read
                  ? 'bg-white border-gray-100'
                  : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
              }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {!notif.read && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm">{notif.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {notif.read && (
                  <Check className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
