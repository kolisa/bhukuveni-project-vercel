import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ClipboardCheck, Utensils, Sparkles, Plus, Trash2, Edit2, Save, X, CheckCircle, Circle, Bell, AlertCircle, CheckCheck, Clock, TrendingUp, Users, ChefHat, Home, Camera, FileText, Download, User, Image as ImageIcon, Menu as MenuIcon, BarChart3, PieChart, Activity, RefreshCw, Smartphone, Search, Filter, SlidersHorizontal, FileSpreadsheet, BellRing, Settings } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Haptic Feedback utility
const hapticFeedback = (type = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [20, 100, 20]
    };
    navigator.vibrate(patterns[type] || 10);
  }
};

// Swipeable Item Wrapper
const SwipeableItem = ({ children, onSwipeLeft, onSwipeRight, threshold = 100 }) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const diff = currentTouch - touchStart;
    setOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const swipeDistance = touchEnd - touchStart;
    
    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0 && onSwipeRight) {
        hapticFeedback('success');
        onSwipeRight();
      } else if (swipeDistance < 0 && onSwipeLeft) {
        hapticFeedback('success');
        onSwipeLeft();
      }
    }
    
    setOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isDragging ? `translateX(${offset * 0.3}px)` : 'translateX(0)',
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        position: 'relative'
      }}
      className="touch-pan-y"
    >
      {isDragging && Math.abs(offset) > 50 && (
        <div className={`absolute inset-y-0 flex items-center px-4 text-white font-bold ${
          offset > 0 ? 'left-0 bg-green-500' : 'right-0 bg-red-500'
        }`}>
          {offset > 0 ? '✓ Complete' : '✗ Delete'}
        </div>
      )}
      {children}
    </div>
  );
};

// Pull to Refresh Component
const PullToRefresh = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && startY.current > 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 120));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80 && !isRefreshing) {
      setIsRefreshing(true);
      hapticFeedback('medium');
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    startY.current = 0;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center bg-gradient-to-b from-indigo-100 to-transparent"
          style={{ height: `${pullDistance}px`, transition: 'height 0.2s ease' }}
        >
          <RefreshCw 
            className={`w-8 h-8 text-indigo-600 ${pullDistance > 80 || isRefreshing ? 'animate-spin' : ''}`}
          />
        </div>
      )}
      {children}
    </div>
  );
};

// PWA Install Prompt
const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    hapticFeedback('medium');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      hapticFeedback('success');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4 sm:p-6 z-50 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Install Bhukuveni</h3>
          <p className="text-sm text-white/90 mb-4">Add to your home screen for quick access and offline use</p>
          <div className="flex space-x-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 border-2 border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Notification Center Component
const NotificationCenter = ({ notifications, onClose, onMarkAsRead, onClearAll }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const typeColors = {
    success: 'text-green-600 bg-green-100',
    error: 'text-red-600 bg-red-100',
    warning: 'text-yellow-600 bg-yellow-100',
    info: 'text-blue-600 bg-blue-100'
  };

  const typeIcons = {
    success: CheckCheck,
    error: AlertCircle,
    warning: Clock,
    info: Bell
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <BellRing className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-2 p-4 border-b">
          {['all', 'unread', 'read'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="ml-auto px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications</p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const Icon = typeIcons[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border-2 ${
                    notif.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-indigo-200'
                  } hover:shadow-md transition-all`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${typeColors[notif.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                      }`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notif.read && (
                      <button
                        onClick={() => onMarkAsRead(notif.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Notification Toast Component
const NotificationToast = ({ notifications, onClose }) => {
  const typeStyles = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-yellow-500 to-orange-600',
    info: 'from-blue-500 to-indigo-600'
  };

  const typeIcons = {
    success: CheckCheck,
    error: AlertCircle,
    warning: Clock,
    info: Bell
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 space-y-3 max-w-sm">
      {notifications.map(notif => {
        const Icon = typeIcons[notif.type];
        return (
          <div
            key={notif.id}
            className={`bg-gradient-to-r ${typeStyles[notif.type]} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-slide-in`}
          >
            <div className="flex items-start space-x-3">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base break-words">{notif.message}</p>
                <p className="text-xs opacity-90 mt-1">
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => onClose(notif.id)}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Item Detail Modal Component
const ItemDetailModal = ({ item, onClose, onAddNote, onAddPhoto, onExportPDF }) => {
  const [noteText, setNoteText] = useState('');

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        onAddPhoto(item.id, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(item.id, noteText);
      setNoteText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{item.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm">
                  {item.category}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm">
                  {item.priority} Priority
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Description
            </h3>
            <p className="text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg">
              {item.description || 'No description provided'}
            </p>
          </div>

          {/* Assignment */}
          {item.assignedTo && (
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Assigned To
              </h3>
              <p className="text-gray-600 bg-indigo-50 p-3 sm:p-4 rounded-lg font-medium">
                {item.assignedTo}
              </p>
            </div>
          )}

          {/* Photos */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-indigo-600" />
              Photos ({item.photos?.length || 0})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              {item.photos?.map(photo => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                  <img src={photo.data} alt="Task photo" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                    {new Date(photo.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <label className="flex items-center justify-center px-4 py-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors cursor-pointer">
              <Camera className="w-5 h-5 mr-2" />
              <span className="font-medium">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>
          </div>

          {/* Notes */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Notes ({item.notes?.length || 0})
            </h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {item.notes?.map(note => (
                <div key={note.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{note.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">{note.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                className="px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
              >
                Add
              </button>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={() => {
              onExportPDF(item);
              onClose();
            }}
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-bold text-sm sm:text-base"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Fault Report
          </button>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, completed, total, icon: Icon, gradient, showPercentage = true }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h3 className="text-xs sm:text-lg font-bold text-gray-700 truncate">{title}</h3>
        <div className={`p-2 sm:p-4 rounded-lg sm:rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          <Icon className="w-4 h-4 sm:w-7 sm:h-7" />
        </div>
      </div>
      <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
        {completed} / {total}
      </div>
      {showPercentage && (
        <div className="mt-2 sm:mt-4">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
            <span className="font-medium">Progress</span>
            <span className="font-bold">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
            <div
              className={`h-2 sm:h-3 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 shadow-inner`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Bar Chart Component
const BarChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{item.label}</span>
              <span className="font-bold text-gray-900">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600 transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const slice = {
      ...item,
      percentage: percentage.toFixed(1),
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return slice;
  });

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500'
  ];

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
        {title}
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="40"
            />
            {slices.map((slice, index) => {
              const circumference = 2 * Math.PI * 80;
              const offset = ((100 - slice.percentage) / 100) * circumference;
              const rotateAngle = slice.startAngle + 90;
              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={slice.color || '#6366f1'}
                  strokeWidth="40"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{
                    transform: `rotate(${rotateAngle}deg)`,
                    transformOrigin: '100px 100px',
                    transition: 'all 0.5s ease'
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="w-full space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${colors[index % colors.length]}`} style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Trend Card Component
const TrendCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <Icon className={`w-5 h-5 text-${color}-500`} />
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className={`flex items-center text-sm font-semibold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ stats, maintenanceItems, cleaningTasks, cookingSchedule, onExport }) => {
  const today = new Date().toDateString();
  const todaysCooking = cookingSchedule.filter(s => new Date(s.date).toDateString() === today);
  const urgentMaintenance = maintenanceItems.filter(i => !i.completed && i.priority === 'Critical');
  const todayCleaning = cleaningTasks.filter(t => !t.completed && t.frequency === 'Daily');

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in">
      {/* Export Button Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6" />
              Export Data
            </h3>
            <p className="text-sm text-indigo-100 mt-1">Download reports in Excel format</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onExport('maintenance')}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Maintenance
            </button>
            <button
              onClick={() => onExport('cleaning')}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Cleaning
            </button>
            <button
              onClick={() => onExport('cooking')}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Cooking
            </button>
            <button
              onClick={() => onExport('all')}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Maintenance"
          completed={stats.maintenanceCompleted}
          total={stats.maintenanceTotal}
          icon={ClipboardCheck}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Cleaning"
          completed={stats.cleaningCompleted}
          total={stats.cleaningTotal}
          icon={Sparkles}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Today's Meals"
          completed={todaysCooking.filter(c => c.completed).length}
          total={todaysCooking.length}
          icon={ChefHat}
          gradient="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Bhukeni People"
          completed={stats.totalStaff}
          total={stats.totalStaff}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
          showPercentage={false}
        />
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Urgent Maintenance */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
              Urgent
            </h3>
            <span className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
              {urgentMaintenance.length}
            </span>
          </div>
          <div className="space-y-2">
            {urgentMaintenance.slice(0, 3).map(item => (
              <div key={item.id} className="bg-red-50 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                <p className="text-xs text-gray-600">{item.category}</p>
              </div>
            ))}
            {urgentMaintenance.length === 0 && (
              <p className="text-gray-500 text-xs sm:text-sm italic">No urgent items</p>
            )}
          </div>
        </div>

        {/* Today's Cleaning */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
              Cleaning
            </h3>
            <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
              {todayCleaning.length}
            </span>
          </div>
          <div className="space-y-2">
            {todayCleaning.slice(0, 3).map(task => (
              <div key={task.id} className="bg-green-50 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">{task.task}</p>
                <p className="text-xs text-gray-600">{task.area}</p>
              </div>
            ))}
            {todayCleaning.length === 0 && (
              <p className="text-gray-500 text-xs sm:text-sm italic">All done!</p>
            )}
          </div>
        </div>

        {/* Today's Cooking */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" />
              Menu
            </h3>
            <span className="bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
              {todaysCooking.length}
            </span>
          </div>
          <div className="space-y-2">
            {todaysCooking.slice(0, 3).map(slot => (
              <div key={slot.id} className="bg-orange-50 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">{slot.dish}</p>
                <p className="text-xs text-gray-600">{slot.mealType} - {slot.time}</p>
              </div>
            ))}
            {todaysCooking.length === 0 && (
              <p className="text-gray-500 text-xs sm:text-sm italic">No meals scheduled</p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Activity className="w-7 h-7 mr-3 text-indigo-600" />
          Analytics & Insights
        </h2>

        {/* Trend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <TrendCard
            title="Completion Rate"
            value={`${stats.maintenanceTotal > 0 ? Math.round((stats.maintenanceCompleted / stats.maintenanceTotal) * 100) : 0}%`}
            change={12}
            icon={TrendingUp}
            color="blue"
          />
          <TrendCard
            title="Active Tasks"
            value={stats.maintenanceTotal - stats.maintenanceCompleted + cleaningTasks.filter(t => !t.completed).length}
            change={-5}
            icon={ClipboardCheck}
            color="orange"
          />
          <TrendCard
            title="Bhukeni People"
            value={`${stats.totalStaff}`}
            change={8}
            icon={Users}
            color="purple"
          />
          <TrendCard
            title="Weekly Meals"
            value={cookingSchedule.length}
            change={15}
            icon={ChefHat}
            color="green"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance by Priority */}
          <BarChart
            title="Maintenance by Priority"
            data={[
              { label: 'Critical', value: maintenanceItems.filter(i => i.priority === 'Critical').length },
              { label: 'High', value: maintenanceItems.filter(i => i.priority === 'High').length },
              { label: 'Medium', value: maintenanceItems.filter(i => i.priority === 'Medium').length },
              { label: 'Low', value: maintenanceItems.filter(i => i.priority === 'Low').length }
            ]}
            color="red"
          />

          {/* Task Distribution */}
          <DonutChart
            title="Task Distribution"
            data={[
              { label: 'Maintenance', value: stats.maintenanceTotal, color: '#3b82f6' },
              { label: 'Cleaning', value: stats.cleaningTotal, color: '#10b981' },
              { label: 'Cooking', value: cookingSchedule.length, color: '#f97316' },
              { label: 'Completed', value: stats.maintenanceCompleted + stats.cleaningCompleted, color: '#8b5cf6' }
            ]}
          />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Category Breakdown */}
          <BarChart
            title="Maintenance Categories"
            data={[
              { label: 'Facility', value: maintenanceItems.filter(i => i.category === 'Facility').length },
              { label: 'Equipment', value: maintenanceItems.filter(i => i.category === 'Equipment').length },
              { label: 'Safety', value: maintenanceItems.filter(i => i.category === 'Safety').length },
              { label: 'Plumbing', value: maintenanceItems.filter(i => i.category === 'Plumbing').length },
              { label: 'Electrical', value: maintenanceItems.filter(i => i.category === 'Electrical').length },
              { label: 'HVAC', value: maintenanceItems.filter(i => i.category === 'HVAC').length }
            ]}
            color="indigo"
          />

          {/* Cleaning Areas */}
          <BarChart
            title="Cleaning by Area"
            data={[
              { label: 'Patient Rooms', value: cleaningTasks.filter(t => t.area === 'Patient Rooms').length },
              { label: 'Operating Rooms', value: cleaningTasks.filter(t => t.area === 'Operating Rooms').length },
              { label: 'Bathrooms', value: cleaningTasks.filter(t => t.area === 'Bathrooms').length },
              { label: 'Kitchen', value: cleaningTasks.filter(t => t.area === 'Kitchen').length },
              { label: 'Hallways', value: cleaningTasks.filter(t => t.area === 'Hallways').length }
            ]}
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

// MaintenanceItem Component
const MaintenanceItem = ({ item, onToggle, onDelete, onView }) => {
  const priorityColors = {
    Low: 'bg-green-100 text-green-800 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    High: 'bg-orange-100 text-orange-800 border-orange-300',
    Critical: 'bg-red-100 text-red-800 border-red-300'
  };

  const handleSwipeComplete = () => {
    hapticFeedback('success');
    onToggle();
  };

  const handleSwipeDelete = () => {
    hapticFeedback('error');
    onDelete();
  };

  return (
    <SwipeableItem onSwipeRight={handleSwipeComplete} onSwipeLeft={handleSwipeDelete}>
      <div className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 transition-all duration-300 transform hover:scale-102 hover:shadow-xl ${
        item.completed ? 'border-green-300 bg-green-50 shadow-md' : 'border-gray-200 hover:border-blue-300 shadow-md'
      }`}>
        <div className="flex items-start space-x-2 sm:space-x-4">
          <button
            onClick={() => { hapticFeedback('light'); onToggle(); }}
            className="flex-shrink-0 mt-1 transform transition-transform hover:scale-110"
          >
            {item.completed ? (
              <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400 hover:text-blue-600" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm sm:text-lg ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'} break-words`}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold border-2 ${priorityColors[item.priority]}`}>
                    {item.priority}
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border-2 border-blue-300">
                    {item.frequency}
                  </span>
                  {item.assignedTo && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border-2 border-purple-300 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {item.assignedTo}
                    </span>
                  )}
                  {(item.notes?.length > 0 || item.photos?.length > 0) && (
                    <button
                      onClick={onView}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border-2 border-indigo-300 hover:bg-indigo-200 transition-colors"
                    >
                      {item.photos?.length || 0} 📷 {item.notes?.length || 0} 📝
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => { hapticFeedback('light'); onDelete(); }}
                className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SwipeableItem>
  );
};

// Maintenance Tab
const MaintenanceTab = ({ items, staffMembers, onToggle, onDelete, onAdd, onUpdate, onView }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Facility',
    priority: 'Medium',
    frequency: 'Weekly',
    assignedTo: ''
  });

  const categories = ['Facility', 'Equipment', 'Safety', 'Plumbing', 'Electrical', 'HVAC', 'Exterior', 'Interior'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData);
    }
    setFormData({ title: '', description: '', category: 'Facility', priority: 'Medium', frequency: 'Weekly', assignedTo: '' });
    setShowForm(false);
  };

  // Filter and search logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Completed' && item.completed) ||
                         (filterStatus === 'Pending' && !item.completed);
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = filteredItems.filter(item => item.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 border border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Maintenance
            </h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Track and manage facility tasks</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Item
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            {(searchTerm || filterCategory !== 'All' || filterPriority !== 'All' || filterStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('All');
                  setFilterPriority('All');
                  setFilterStatus('All');
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600 font-medium">
              Showing {filteredItems.length} of {items.length} tasks
            </div>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-inner border border-blue-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  placeholder="e.g., Check fire extinguishers"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  rows="3"
                  placeholder="Detailed description"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                >
                  {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                >
                  <option value="">Unassigned</option>
                  {staffMembers.map(staff => <option key={staff.id} value={staff.name}>{staff.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: '', description: '', category: 'Facility', priority: 'Medium', frequency: 'Weekly', assignedTo: '' });
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-medium text-sm sm:text-base"
              >
                {editingId ? 'Update' : 'Add'} Item
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4 sm:space-y-8">
          {categories.map(category => {
            const categoryItems = groupedItems[category];
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category} className="border-l-4 border-blue-500 pl-3 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                  {category}
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-normal text-gray-500">({categoryItems.length})</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {categoryItems.map(item => (
                    <MaintenanceItem
                      key={item.id}
                      item={item}
                      onToggle={() => onToggle(item.id)}
                      onDelete={() => onDelete(item.id)}
                      onView={() => onView(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {filteredItems.length === 0 && items.length > 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-medium">No tasks match your filters</p>
              <p className="text-xs sm:text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
          {items.length === 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <ClipboardCheck className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-medium">No maintenance items yet</p>
              <p className="text-xs sm:text-sm mt-2">Click "Add Item" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Bhukeni People Tab
const StaffTab = ({ staff, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData.name, formData.role);
    setFormData({ name: '', role: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 border border-pink-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Bhukeni People
            </h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your Bhukeni team members</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Person
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-inner border border-pink-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm sm:text-base"
                  placeholder="Team member name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm sm:text-base"
                  placeholder="e.g., Cleaner, Chef, Technician"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', role: '' });
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg font-medium text-sm sm:text-base"
              >
                Add Person
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {staff.map(member => (
            <div key={member.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-pink-100 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl mb-3">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base break-words">{member.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{member.role}</p>
                </div>
                <button
                  onClick={() => onDelete(member.id)}
                  className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))}
          {staff.length === 0 && (
            <div className="col-span-full text-center py-12 sm:py-16 text-gray-500">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-medium">No team members yet</p>
              <p className="text-xs sm:text-sm mt-2">Click "Add Person" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CleaningTask Component  
const CleaningTask = ({ task, onToggle, onDelete }) => (
  <div className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 transition-all duration-300 transform hover:scale-102 hover:shadow-xl ${
    task.completed ? 'border-green-300 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300 shadow-md'
  }`}>
    <div className="flex items-start space-x-2 sm:space-x-4">
      <button onClick={onToggle} className="flex-shrink-0 mt-1 transform transition-transform hover:scale-110">
        {task.completed ? (
          <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400 hover:text-green-600" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-sm sm:text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'} break-words`}>
              {task.task}
            </h4>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border-2 border-green-300">
                {task.frequency}
              </span>
              {task.time && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border-2 border-blue-300">
                  {task.time}
                </span>
              )}
              {task.assignedTo && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border-2 border-purple-300 flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {task.assignedTo}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Cleaning Tab
const CleaningTab = ({ tasks, staffMembers, onToggle, onDelete, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('All');
  const [filterFrequency, setFilterFrequency] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    area: '',
    task: '',
    frequency: 'Daily',
    assignedTo: '',
    time: ''
  });

  const frequencies = ['Daily', 'Twice Daily', 'Weekly', 'Bi-weekly', 'Monthly'];
  const areas = ['Patient Rooms', 'Operating Rooms', 'Waiting Area', 'Bathrooms', 'Kitchen', 'Hallways', 'Offices', 'Entrance'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ area: '', task: '', frequency: 'Daily', assignedTo: '', time: '' });
    setShowForm(false);
  };

  // Filter and search logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === 'All' || task.area === filterArea;
    const matchesFrequency = filterFrequency === 'All' || task.frequency === filterFrequency;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Completed' && task.completed) ||
                         (filterStatus === 'Pending' && !task.completed);
    return matchesSearch && matchesArea && matchesFrequency && matchesStatus;
  });

  const groupedTasks = areas.reduce((acc, area) => {
    acc[area] = filteredTasks.filter(task => task.area === area);
    return acc;
  }, {});

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 border border-green-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Cleaning Schedule
            </h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Maintain cleanliness across all areas</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Task
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cleaning tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Areas</option>
              {areas.map(area => <option key={area} value={area}>{area}</option>)}
            </select>

            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Frequencies</option>
              {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            {(searchTerm || filterArea !== 'All' || filterFrequency !== 'All' || filterStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterArea('All');
                  setFilterFrequency('All');
                  setFilterStatus('All');
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600 font-medium">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Area *</label>
                <select
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-green-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  <option value="">Select area</option>
                  {areas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-green-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Task *</label>
                <input
                  type="text"
                  required
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-green-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="e.g., Mop floors and sanitize surfaces"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-green-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  <option value="">Unassigned</option>
                  {staffMembers.map(staff => <option key={staff.id} value={staff.name}>{staff.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-green-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ area: '', task: '', frequency: 'Daily', assignedTo: '', time: '' });
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-medium text-sm sm:text-base"
              >
                Add Task
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4 sm:space-y-8">
          {areas.map(area => {
            const areaTasks = groupedTasks[area];
            if (areaTasks.length === 0) return null;
            
            return (
              <div key={area} className="border-l-4 border-green-500 pl-3 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                  {area}
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-normal text-gray-500">({areaTasks.length})</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {areaTasks.map(task => (
                    <CleaningTask
                      key={task.id}
                      task={task}
                      onToggle={() => onToggle(task.id)}
                      onDelete={() => onDelete(task.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {filteredTasks.length === 0 && tasks.length > 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-medium">No tasks match your filters</p>
              <p className="text-xs sm:text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
          {tasks.length === 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-medium">No cleaning tasks scheduled</p>
              <p className="text-xs sm:text-sm mt-2">Click "Add Task" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CookingSlot Component
const CookingSlot = ({ slot, onToggle, onDelete }) => {
  const mealColors = {
    Breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Lunch: 'bg-orange-100 text-orange-800 border-orange-300',
    Dinner: 'bg-red-100 text-red-800 border-red-300',
    Snack: 'bg-green-100 text-green-800 border-green-300'
  };

  return (
    <div className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 transition-all duration-300 transform hover:scale-102 hover:shadow-xl ${
      slot.completed ? 'border-orange-300 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-300 shadow-md'
    }`}>
      <div className="flex items-start space-x-2 sm:space-x-4">
        <button onClick={onToggle} className="flex-shrink-0 mt-1 transform transition-transform hover:scale-110">
          {slot.completed ? (
            <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-orange-600" />
          ) : (
            <Circle className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400 hover:text-orange-600" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <span className={`px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold border-2 ${mealColors[slot.mealType]}`}>
                  {slot.mealType}
                </span>
                <span className="px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-blue-100 text-blue-800 border-2 border-blue-300">
                  {slot.time}
                </span>
              </div>
              <h4 className={`font-bold text-sm sm:text-lg ${slot.completed ? 'text-gray-500 line-through' : 'text-gray-800'} break-words`}>
                {slot.dish}
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                {slot.chef && (
                  <span className="flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="font-bold">{slot.chef}</span>
                  </span>
                )}
                {slot.servings && (
                  <span className="flex items-center">
                    <Utensils className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="font-bold">{slot.servings} servings</span>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onDelete}
              className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cooking Tab
const CookingTab = ({ schedule, staffMembers, onToggle, onDelete, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mealType: 'Breakfast',
    date: new Date().toISOString().split('T')[0],
    time: '',
    dish: '',
    chef: '',
    servings: ''
  });

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      mealType: 'Breakfast',
      date: new Date().toISOString().split('T')[0],
      time: '',
      dish: '',
      chef: '',
      servings: ''
    });
    setShowForm(false);
  };

  const groupedSchedule = schedule.reduce((acc, slot) => {
    const date = new Date(slot.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSchedule).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 border border-orange-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Cooking Schedule
            </h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Plan and track meal preparation</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Slot
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Meal Type</label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                >
                  {mealTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Servings</label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Dish *</label>
                <input
                  type="text"
                  required
                  value={formData.dish}
                  onChange={(e) => setFormData({ ...formData, dish: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="e.g., Grilled chicken with vegetables"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Chef</label>
                <select
                  value={formData.chef}
                  onChange={(e) => setFormData({ ...formData, chef: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                >
                  <option value="">Unassigned</option>
                  {staffMembers.map(staff => <option key={staff.id} value={staff.name}>{staff.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    mealType: 'Breakfast',
                    date: new Date().toISOString().split('T')[0],
                    time: '',
                    dish: '',
                    chef: '',
                    servings: ''
                  });
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg font-medium text-sm sm:text-base"
              >
                Add to Schedule
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4 sm:space-y-8">
          {sortedDates.map(date => (
            <div key={date} className="border-l-4 border-orange-500 pl-3 sm:pl-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {groupedSchedule[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(slot => (
                    <CookingSlot
                      key={slot.id}
                      slot={slot}
                      onToggle={() => onToggle(slot.id)}
                      onDelete={() => onDelete(slot.id)}
                    />
                  ))}
              </div>
            </div>
          ))}
          {schedule.length === 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-medium">No cooking schedule set</p>
              <p className="text-xs sm:text-sm mt-2">Click "Add Slot" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// MenuItem Component
const MenuItem = ({ item, onDelete }) => (
  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 shadow-md border-2 border-purple-100 hover:shadow-lg transition-all">
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 min-w-0">
        <h5 className="font-bold text-gray-800 mb-2 text-sm sm:text-base break-words">{item.mainDish}</h5>
        {item.sides && (
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            <span className="font-semibold">Sides:</span> {item.sides}
          </p>
        )}
        {item.beverages && (
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            <span className="font-semibold">Drinks:</span> {item.beverages}
          </p>
        )}
        {item.dietary && (
          <p className="text-xs text-purple-600 mt-2 italic bg-purple-50 px-2 py-1 rounded">{item.dietary}</p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110 flex-shrink-0"
      >
        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  </div>
);

// Menu Tab
const MenuTab = ({ items, onDelete, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    mealType: 'Breakfast',
    mainDish: '',
    sides: '',
    beverages: '',
    dietary: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      day: 'Monday',
      mealType: 'Breakfast',
      mainDish: '',
      sides: '',
      beverages: '',
      dietary: ''
    });
    setShowForm(false);
  };

  const groupedMenu = days.reduce((acc, day) => {
    acc[day] = mealTypes.reduce((meals, mealType) => {
      meals[mealType] = items.filter(item => item.day === day && item.mealType === mealType);
      return meals;
    }, {});
    return acc;
  }, {});

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 border border-purple-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Menu Planning
            </h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Plan weekly nutritious meals</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Menu
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                >
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Meal</label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                >
                  {mealTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Main Dish *</label>
                <input
                  type="text"
                  required
                  value={formData.mainDish}
                  onChange={(e) => setFormData({ ...formData, mainDish: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="e.g., Grilled chicken breast"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sides</label>
                <input
                  type="text"
                  value={formData.sides}
                  onChange={(e) => setFormData({ ...formData, sides: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="e.g., Rice, vegetables"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Beverages</label>
                <input
                  type="text"
                  value={formData.beverages}
                  onChange={(e) => setFormData({ ...formData, beverages: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="e.g., Water, juice"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Dietary Notes</label>
                <input
                  type="text"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="e.g., Gluten-free, Vegan"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    day: 'Monday',
                    mealType: 'Breakfast',
                    mainDish: '',
                    sides: '',
                    beverages: '',
                    dietary: ''
                  });
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium text-sm sm:text-base"
              >
                Add to Menu
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6 sm:space-y-10">
          {days.map(day => (
            <div key={day} className="border-l-4 border-purple-500 pl-3 sm:pl-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full mr-2 sm:mr-3"></div>
                {day}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {mealTypes.map(mealType => (
                  <div key={mealType} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-200 shadow-md hover:shadow-xl transition-all">
                    <h4 className="font-bold text-purple-800 mb-3 sm:mb-4 text-base sm:text-lg flex items-center">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {mealType}
                    </h4>
                    {groupedMenu[day][mealType].length > 0 ? (
                      groupedMenu[day][mealType].map(item => (
                        <MenuItem key={item.id} item={item} onDelete={() => onDelete(item.id)} />
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs sm:text-sm italic">No menu planned</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
const BhukuveniFacilityManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [cleaningTasks, setCleaningTasks] = useState([]);
  const [cookingSchedule, setCookingSchedule] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [notificationPreferences, setNotificationPreferences] = useState({
    browserNotifications: true,
    highPriorityAlerts: true,
    taskReminders: true,
    overdueAlerts: true,
    taskCompletions: false
  });

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Load notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await window.storage.get('bhukuveni-notification-prefs', false).catch(() => null);
      if (prefs?.value) {
        setNotificationPreferences(JSON.parse(prefs.value));
      }
    };
    loadPreferences();
  }, []);

  // Load data from storage
  useEffect(() => {
    loadData();
    checkForReminders();
    autoResetRecurringTasks(); // Auto-reset daily tasks
    checkForOverdueTasks(); // Check for overdue tasks
    
    const interval = setInterval(checkForReminders, 60000);
    const resetInterval = setInterval(autoResetRecurringTasks, 3600000); // Check every hour
    const overdueInterval = setInterval(checkForOverdueTasks, 300000); // Check every 5 minutes
    
    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
      clearInterval(overdueInterval);
    };
  }, []);

  const loadData = async () => {
    try {
      const [maintenance, cleaning, cooking, menu, notifs, staff, prefs] = await Promise.all([
        window.storage.get('bhukuveni-maintenance', false).catch(() => null),
        window.storage.get('bhukuveni-cleaning', false).catch(() => null),
        window.storage.get('bhukuveni-cooking', false).catch(() => null),
        window.storage.get('bhukuveni-menu', false).catch(() => null),
        window.storage.get('bhukuveni-notifications', false).catch(() => null),
        window.storage.get('bhukuveni-staff', false).catch(() => null),
        window.storage.get('bhukuveni-notification-prefs', false).catch(() => null)
      ]);

      if (maintenance?.value) setMaintenanceItems(JSON.parse(maintenance.value));
      if (cleaning?.value) setCleaningTasks(JSON.parse(cleaning.value));
      if (cooking?.value) setCookingSchedule(JSON.parse(cooking.value));
      if (menu?.value) setMenuItems(JSON.parse(menu.value));
      if (notifs?.value) setNotifications(JSON.parse(notifs.value));
      if (staff?.value) setStaffMembers(JSON.parse(staff.value));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const saveData = async (key, data) => {
    try {
      await window.storage.set(key, JSON.stringify(data), false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addNotification = async (message, type = 'info', options = {}) => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    const updated = [newNotif, ...notifications].slice(0, 50);
    setNotifications(updated);
    await saveData('bhukuveni-notifications', updated);
    
    // Send browser notification if enabled and permitted
    if (notificationPreferences.browserNotifications && notificationPermission === 'granted' && !options.skipBrowser) {
      const title = options.title || 'Bhukuveni Facility Manager';
      const icon = '/icon-192x192.png';
      const body = message;
      
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          // Use service worker for better notification management
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
              body,
              icon,
              badge: icon,
              tag: `bhukuveni-${type}`,
              renotify: true,
              requireInteraction: type === 'error' || options.priority === 'high',
              vibrate: [200, 100, 200]
            });
          });
        } else {
          // Fallback to regular notification
          new Notification(title, { body, icon });
        }
      } catch (error) {
        console.error('Notification error:', error);
      }
    }
    
    setTimeout(() => removeNotification(newNotif.id), 5000);
  };

  const markNotificationAsRead = async (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    await saveData('bhukuveni-notifications', updated);
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
    await saveData('bhukuveni-notifications', []);
  };

  const saveNotificationPreferences = async (prefs) => {
    setNotificationPreferences(prefs);
    await saveData('bhukuveni-notification-prefs', prefs);
  };

  const removeNotification = async (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    await saveData('bhukuveni-notifications', updated);
  };

  const checkForReminders = () => {
    const now = new Date();
    cookingSchedule.forEach(slot => {
      if (!slot.completed) {
        const slotTime = new Date(`${slot.date}T${slot.time}`);
        const diff = slotTime - now;
        if (diff > 0 && diff < 1800000 && !slot.reminded) {
          addNotification(`Upcoming: ${slot.mealType} - ${slot.dish} in 30 minutes`, 'warning');
          slot.reminded = true;
        }
      }
    });
  };

  // Check for overdue tasks
  const checkForOverdueTasks = () => {
    if (!notificationPreferences.overdueAlerts) return;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Check for overdue high-priority maintenance items
    maintenanceItems.forEach(item => {
      if (!item.completed && item.priority === 'High' && !item.overdueNotified) {
        const createdDate = new Date(item.createdAt);
        const hoursSinceCreated = (now - createdDate) / (1000 * 60 * 60);
        
        // Notify if high priority item is pending for more than 24 hours
        if (hoursSinceCreated > 24) {
          addNotification(
            `⚠️ Overdue: ${item.title} (${Math.floor(hoursSinceCreated)} hours overdue)`,
            'error',
            { title: 'Overdue Task Alert', priority: 'high' }
          );
          item.overdueNotified = true;
        }
      }
    });
    
    // Check for overdue cooking tasks
    cookingSchedule.forEach(slot => {
      if (!slot.completed && !slot.overdueNotified) {
        const slotDateTime = new Date(`${slot.date}T${slot.time}`);
        if (now > slotDateTime) {
          const hoursOverdue = (now - slotDateTime) / (1000 * 60 * 60);
          if (hoursOverdue > 1) { // Notify if more than 1 hour overdue
            addNotification(
              `🍽️ Overdue: ${slot.mealType} - ${slot.dish}`,
              'warning',
              { title: 'Meal Preparation Overdue' }
            );
            slot.overdueNotified = true;
          }
        }
      }
    });
  };

  // Auto-reset recurring tasks
  const autoResetRecurringTasks = async () => {
    const now = new Date();
    const today = now.toDateString();
    const lastResetDate = localStorage.getItem('lastResetDate');
    
    // Only reset once per day
    if (lastResetDate === today) return;
    
    // Reset daily maintenance tasks
    const updatedMaintenance = maintenanceItems.map(item => {
      if (item.frequency === 'Daily' && item.completed && item.lastChecked) {
        const lastCheckedDate = new Date(item.lastChecked).toDateString();
        if (lastCheckedDate !== today) {
          return { ...item, completed: false, reminded: false };
        }
      }
      return item;
    });
    
    // Reset daily cleaning tasks
    const updatedCleaning = cleaningTasks.map(task => {
      if ((task.frequency === 'Daily' || task.frequency === 'Twice Daily') && task.completed && task.lastCompleted) {
        const lastCompletedDate = new Date(task.lastCompleted).toDateString();
        if (lastCompletedDate !== today) {
          return { ...task, completed: false };
        }
      }
      return task;
    });
    
    const maintenanceChanged = JSON.stringify(updatedMaintenance) !== JSON.stringify(maintenanceItems);
    const cleaningChanged = JSON.stringify(updatedCleaning) !== JSON.stringify(cleaningTasks);
    
    if (maintenanceChanged || cleaningChanged) {
      if (maintenanceChanged) {
        setMaintenanceItems(updatedMaintenance);
        await saveData('bhukuveni-maintenance', updatedMaintenance);
      }
      if (cleaningChanged) {
        setCleaningTasks(updatedCleaning);
        await saveData('bhukuveni-cleaning', updatedCleaning);
      }
      
      localStorage.setItem('lastResetDate', today);
      addNotification('Daily tasks have been reset', 'info');
    }
  };

  // Staff functions
  const addStaffMember = async (name, role) => {
    const newStaff = { id: Date.now(), name, role };
    const updated = [...staffMembers, newStaff];
    setStaffMembers(updated);
    await saveData('bhukuveni-staff', updated);
    addNotification(`Added staff member: ${name}`, 'success');
  };

  const deleteStaffMember = async (id) => {
    const updated = staffMembers.filter(s => s.id !== id);
    setStaffMembers(updated);
    await saveData('bhukuveni-staff', updated);
  };

  // Maintenance functions
  const addMaintenanceItem = async (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
      completed: false,
      lastChecked: null,
      notes: [],
      photos: []
    };
    const updated = [...maintenanceItems, newItem];
    setMaintenanceItems(updated);
    await saveData('bhukuveni-maintenance', updated);
    
    // Send notification based on priority
    if (item.priority === 'High' && notificationPreferences.highPriorityAlerts) {
      addNotification(
        `🚨 High Priority: ${item.title} requires attention!`,
        'warning',
        { title: 'High Priority Alert', priority: 'high' }
      );
    } else {
      addNotification(`Added maintenance task: ${item.title}`, 'success');
    }
  };

  const toggleMaintenanceItem = async (id) => {
    const updated = maintenanceItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed, lastChecked: new Date().toISOString() } : item
    );
    setMaintenanceItems(updated);
    await saveData('bhukuveni-maintenance', updated);
    const item = updated.find(i => i.id === id);
    
    if (item.completed && notificationPreferences.taskCompletions) {
      addNotification(
        `✓ Completed: ${item.title}`,
        'success',
        { title: 'Task Completed', priority: item.priority === 'High' ? 'high' : 'normal' }
      );
    } else if (!item.completed) {
      addNotification(
        `Unchecked: ${item.title}`,
        'info',
        { skipBrowser: true }
      );
    }
  };

  const deleteMaintenanceItem = async (id) => {
    const item = maintenanceItems.find(i => i.id === id);
    const updated = maintenanceItems.filter(item => item.id !== id);
    setMaintenanceItems(updated);
    await saveData('bhukuveni-maintenance', updated);
    addNotification(`Deleted: ${item.title}`, 'info');
  };

  const updateMaintenanceItem = async (id, updates) => {
    const updated = maintenanceItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setMaintenanceItems(updated);
    await saveData('bhukuveni-maintenance', updated);
    addNotification(`Updated maintenance task`, 'success');
  };

  const addNoteToItem = async (id, note) => {
    const updated = maintenanceItems.map(item => {
      if (item.id === id) {
        const newNote = {
          id: Date.now(),
          text: note,
          timestamp: new Date().toISOString(),
          author: item.assignedTo || 'System'
        };
        return { ...item, notes: [...(item.notes || []), newNote] };
      }
      return item;
    });
    setMaintenanceItems(updated);
    await saveData('bhukuveni-maintenance', updated);
    addNotification('Note added', 'success');
  };

  const addPhotoToItem = async (id, photoData) => {
    const updated = maintenanceItems.map(item => {
      if (item.id === id) {
        const newPhoto = {
          id: Date.now(),
          data: photoData,
          timestamp: new Date().toISOString()
        };
        return { ...item, photos: [...(item.photos || []), newPhoto] };
      }
      return item;
    });
    setMaintenanceItems(updated);
    await saveData('bhukuveni-maintenance', updated);
    addNotification('Photo added', 'success');
  };

  // Cleaning functions
  const addCleaningTask = async (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      completed: false,
      lastCompleted: null,
      notes: [],
      photos: []
    };
    const updated = [...cleaningTasks, newTask];
    setCleaningTasks(updated);
    await saveData('bhukuveni-cleaning', updated);
    addNotification(`Added cleaning task: ${task.task}`, 'success');
  };

  const toggleCleaningTask = async (id) => {
    const updated = cleaningTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed, lastCompleted: new Date().toISOString() } : task
    );
    setCleaningTasks(updated);
    await saveData('bhukuveni-cleaning', updated);
    const task = updated.find(t => t.id === id);
    addNotification(
      task.completed ? `Completed: ${task.task}` : `Unchecked: ${task.task}`,
      task.completed ? 'success' : 'info'
    );
  };

  const deleteCleaningTask = async (id) => {
    const task = cleaningTasks.find(t => t.id === id);
    const updated = cleaningTasks.filter(task => task.id !== id);
    setCleaningTasks(updated);
    await saveData('bhukuveni-cleaning', updated);
    addNotification(`Deleted: ${task.task}`, 'info');
  };

  // Cooking functions
  const addCookingSlot = async (slot) => {
    const newSlot = {
      id: Date.now(),
      ...slot,
      completed: false,
      notes: [],
      photos: []
    };
    const updated = [...cookingSchedule, newSlot];
    setCookingSchedule(updated);
    await saveData('bhukuveni-cooking', updated);
    addNotification(`Added to cooking schedule: ${slot.dish}`, 'success');
  };

  const toggleCookingSlot = async (id) => {
    const updated = cookingSchedule.map(slot =>
      slot.id === id ? { ...slot, completed: !slot.completed } : slot
    );
    setCookingSchedule(updated);
    await saveData('bhukuveni-cooking', updated);
    const slot = updated.find(s => s.id === id);
    addNotification(
      slot.completed ? `Completed: ${slot.dish}` : `Unchecked: ${slot.dish}`,
      slot.completed ? 'success' : 'info'
    );
  };

  const deleteCookingSlot = async (id) => {
    const slot = cookingSchedule.find(s => s.id === id);
    const updated = cookingSchedule.filter(slot => slot.id !== id);
    setCookingSchedule(updated);
    await saveData('bhukuveni-cooking', updated);
    addNotification(`Deleted from schedule: ${slot.dish}`, 'info');
  };

  // Menu functions
  const addMenuItem = async (item) => {
    const newItem = { id: Date.now(), ...item };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    await saveData('bhukuveni-menu', updated);
    addNotification(`Added to menu: ${item.mainDish}`, 'success');
  };

  const deleteMenuItem = async (id) => {
    const item = menuItems.find(i => i.id === id);
    const updated = menuItems.filter(item => item.id !== id);
    setMenuItems(updated);
    await saveData('bhukuveni-menu', updated);
    addNotification(`Removed from menu: ${item.mainDish}`, 'info');
  };

  // PDF Export function with jsPDF
  const exportFaultToPDF = async (item) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    pdf.setFillColor(79, 70, 229); // Indigo
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bhukuveni Facility Manager', pageWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(14);
    pdf.text('Maintenance Fault Report', pageWidth / 2, 32, { align: 'center' });

    // Reset text color
    pdf.setTextColor(0, 0, 0);
    yPosition = 55;

    // Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Task:', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.title, 45, yPosition);
    yPosition += 10;

    // Details section
    pdf.setFontSize(12);
    const details = [
      { label: 'Category:', value: item.category },
      { label: 'Priority:', value: item.priority },
      { label: 'Frequency:', value: item.frequency },
      { label: 'Status:', value: item.completed ? 'Completed ✓' : 'Pending' },
      { label: 'Assigned To:', value: item.assignedTo || 'Unassigned' },
      { label: 'Last Checked:', value: item.lastChecked ? new Date(item.lastChecked).toLocaleString() : 'N/A' }
    ];

    details.forEach(detail => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(detail.label, 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(detail.value, 70, yPosition);
      yPosition += 8;
    });

    yPosition += 5;

    // Description
    if (item.description) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description:', 20, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(item.description, pageWidth - 40);
      descLines.forEach(line => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Notes section
    if (item.notes && item.notes.length > 0) {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFillColor(255, 243, 205); // Light yellow
      pdf.rect(15, yPosition - 5, pageWidth - 30, 10, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('NOTES', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      item.notes.forEach(note => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text(`[${new Date(note.timestamp).toLocaleString()}] - ${note.author}`, 20, yPosition);
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        const noteLines = pdf.splitTextToSize(note.text, pageWidth - 40);
        noteLines.forEach(line => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 20, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      });
    }

    // Photos section
    if (item.photos && item.photos.length > 0) {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`Photos Attached: ${item.photos.length}`, 20, yPosition);
      yPosition += 10;

      // Add photos to PDF
      for (let i = 0; i < Math.min(item.photos.length, 4); i++) {
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 20;
        }
        try {
          pdf.addImage(item.photos[i].data, 'JPEG', 20, yPosition, 80, 60);
          pdf.setFontSize(9);
          pdf.text(new Date(item.photos[i].timestamp).toLocaleString(), 20, yPosition + 65);
          yPosition += 75;
        } catch (e) {
          console.error('Error adding image to PDF:', e);
        }
      }
    }

    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, pdf.internal.pageSize.getHeight() - 10);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pdf.internal.pageSize.getHeight() - 10);
    }

    // Save PDF
    pdf.save(`fault-report-${item.title.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.pdf`);
    addNotification('PDF report exported successfully', 'success');
  };

  // Excel/CSV Export functions
  const exportToExcel = async (dataType) => {
    let data, filename, sheetName;
    
    switch(dataType) {
      case 'maintenance':
        data = maintenanceItems.map(item => ({
          'Title': item.title,
          'Category': item.category,
          'Priority': item.priority,
          'Frequency': item.frequency,
          'Status': item.completed ? 'Completed' : 'Pending',
          'Assigned To': item.assignedTo || 'Unassigned',
          'Description': item.description || '',
          'Last Checked': item.lastChecked ? new Date(item.lastChecked).toLocaleString() : 'Never',
          'Notes Count': item.notes?.length || 0,
          'Photos Count': item.photos?.length || 0
        }));
        filename = `maintenance-tasks-${Date.now()}.xlsx`;
        sheetName = 'Maintenance Tasks';
        break;
        
      case 'cleaning':
        data = cleaningTasks.map(task => ({
          'Task': task.task,
          'Area': task.area,
          'Frequency': task.frequency,
          'Status': task.completed ? 'Completed' : 'Pending',
          'Assigned To': task.assignedTo || 'Unassigned',
          'Time': task.time || '',
          'Last Completed': task.lastCompleted ? new Date(task.lastCompleted).toLocaleString() : 'Never'
        }));
        filename = `cleaning-schedule-${Date.now()}.xlsx`;
        sheetName = 'Cleaning Schedule';
        break;
        
      case 'cooking':
        data = cookingSchedule.map(slot => ({
          'Date': new Date(slot.date).toLocaleDateString(),
          'Time': slot.time,
          'Meal Type': slot.mealType,
          'Dish': slot.dish,
          'Chef': slot.chef || 'Unassigned',
          'Servings': slot.servings || '',
          'Status': slot.completed ? 'Completed' : 'Pending'
        }));
        filename = `cooking-schedule-${Date.now()}.xlsx`;
        sheetName = 'Cooking Schedule';
        break;
        
      case 'menu':
        data = menuItems.map(item => ({
          'Day': item.day,
          'Meal Type': item.mealType,
          'Main Dish': item.mainDish,
          'Sides': item.sides || '',
          'Beverages': item.beverages || '',
          'Dietary Notes': item.dietary || ''
        }));
        filename = `weekly-menu-${Date.now()}.xlsx`;
        sheetName = 'Weekly Menu';
        break;
        
      case 'staff':
        data = staffMembers.map(member => ({
          'Name': member.name,
          'Role': member.role
        }));
        filename = `bhukeni-people-${Date.now()}.xlsx`;
        sheetName = 'Bhukeni People';
        break;
        
      case 'all':
        // Create workbook with multiple sheets
        const wb = XLSX.utils.book_new();
        
        // Maintenance sheet
        const maintenanceData = maintenanceItems.map(item => ({
          'Title': item.title,
          'Category': item.category,
          'Priority': item.priority,
          'Status': item.completed ? 'Completed' : 'Pending',
          'Assigned To': item.assignedTo || 'Unassigned'
        }));
        const maintenanceSheet = XLSX.utils.json_to_sheet(maintenanceData);
        XLSX.utils.book_append_sheet(wb, maintenanceSheet, 'Maintenance');
        
        // Cleaning sheet
        const cleaningData = cleaningTasks.map(task => ({
          'Task': task.task,
          'Area': task.area,
          'Status': task.completed ? 'Completed' : 'Pending',
          'Assigned To': task.assignedTo || 'Unassigned'
        }));
        const cleaningSheet = XLSX.utils.json_to_sheet(cleaningData);
        XLSX.utils.book_append_sheet(wb, cleaningSheet, 'Cleaning');
        
        // Cooking sheet
        const cookingData = cookingSchedule.map(slot => ({
          'Date': new Date(slot.date).toLocaleDateString(),
          'Meal Type': slot.mealType,
          'Dish': slot.dish,
          'Chef': slot.chef || 'Unassigned'
        }));
        const cookingSheet = XLSX.utils.json_to_sheet(cookingData);
        XLSX.utils.book_append_sheet(wb, cookingSheet, 'Cooking');
        
        // Staff sheet
        const staffData = staffMembers.map(member => ({
          'Name': member.name,
          'Role': member.role
        }));
        const staffSheet = XLSX.utils.json_to_sheet(staffData);
        XLSX.utils.book_append_sheet(wb, staffSheet, 'Bhukeni People');
        
        XLSX.writeFile(wb, `bhukuveni-complete-report-${Date.now()}.xlsx`);
        addNotification('Complete report exported successfully', 'success');
        return;
    }
    
    // Create workbook and sheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Save file
    XLSX.writeFile(wb, filename);
    addNotification(`${sheetName} exported successfully`, 'success');
  };

  const exportToCSV = async (dataType) => {
    // Similar to Excel but save as CSV
    const filename = exportToExcel(dataType);
    // XLSX library handles CSV export automatically when filename ends with .csv
  };

  // Dashboard statistics
  const stats = {
    maintenanceTotal: maintenanceItems.length,
    maintenanceCompleted: maintenanceItems.filter(i => i.completed).length,
    cleaningTotal: cleaningTasks.length,
    cleaningCompleted: cleaningTasks.filter(t => t.completed).length,
    cookingToday: cookingSchedule.filter(s => {
      const today = new Date().toDateString();
      return new Date(s.date).toDateString() === today;
    }).length,
    menuItemsWeek: menuItems.length,
    unreadNotifications: notifications.filter(n => !n.read).length,
    totalStaff: staffMembers.length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <div className="text-2xl text-white font-semibold">Loading Bhukuveni...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Notifications Toast */}
      <NotificationToast 
        notifications={notifications.filter(n => !n.read).slice(0, 3)} 
        onClose={removeNotification}
      />

      {/* Mobile Header */}
      {/* Notification Center Modal */}
      {showNotificationCenter && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotificationCenter(false)}
          onMarkAsRead={markNotificationAsRead}
          onClearAll={clearAllNotifications}
        />
      )}

      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                <Home className="w-6 h-6 sm:w-10 sm:h-10 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-4xl font-bold text-white drop-shadow-lg">Bhukuveni</h1>
                <p className="text-indigo-100 mt-1 text-xs sm:text-lg hidden sm:block">Healthcare Facility Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Sync Status Indicator */}
              {window.storage && window.storage.getStatus && (
                <div className="hidden lg:block bg-white/20 backdrop-blur-lg rounded-xl px-3 py-2 text-white">
                  {window.storage.getStatus().cloudSync ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">Cloud Sync On</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs font-medium">Offline Mode</span>
                    </div>
                  )}
                </div>
              )}
              <div className="hidden sm:block bg-white/20 backdrop-blur-lg rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-white">
                <div className="text-xs opacity-90">Time</div>
                <div className="text-sm sm:text-xl font-bold">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationCenter(true)}
                  className="hover:scale-110 transition-transform"
                >
                  <BellRing className="w-6 h-6 sm:w-8 sm:h-8 text-white cursor-pointer" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden text-white"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Menu</h3>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Calendar },
                { id: 'maintenance', label: 'Maintenance', icon: ClipboardCheck },
                { id: 'cleaning', label: 'Cleaning', icon: Sparkles },
                { id: 'cooking', label: 'Cooking', icon: ChefHat },
                { id: 'menu', label: 'Menu', icon: Utensils },
                { id: 'staff', label: 'People', icon: Users }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="bg-white shadow-xl sticky top-0 z-40 hidden sm:block">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Calendar, gradient: 'from-blue-500 to-blue-600' },
              { id: 'maintenance', label: 'Maintenance', icon: ClipboardCheck, gradient: 'from-indigo-500 to-indigo-600' },
              { id: 'cleaning', label: 'Cleaning', icon: Sparkles, gradient: 'from-green-500 to-green-600' },
              { id: 'cooking', label: 'Cooking', icon: ChefHat, gradient: 'from-orange-500 to-orange-600' },
              { id: 'menu', label: 'Menu', icon: Utensils, gradient: 'from-purple-500 to-purple-600' },
              { id: 'staff', label: 'People', icon: Users, gradient: 'from-pink-500 to-pink-600' }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-semibold transition-all duration-300 relative group whitespace-nowrap ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <PullToRefresh onRefresh={loadData}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-24 sm:pb-8">
          {activeTab === 'dashboard' && <Dashboard stats={stats} maintenanceItems={maintenanceItems} cleaningTasks={cleaningTasks} cookingSchedule={cookingSchedule} onExport={exportToExcel} />}
          {activeTab === 'maintenance' && (
            <MaintenanceTab
              items={maintenanceItems}
              staffMembers={staffMembers}
              onToggle={toggleMaintenanceItem}
              onDelete={deleteMaintenanceItem}
              onAdd={addMaintenanceItem}
              onUpdate={updateMaintenanceItem}
              onView={setViewingItem}
            />
          )}
          {activeTab === 'cleaning' && (
            <CleaningTab
              tasks={cleaningTasks}
              staffMembers={staffMembers}
              onToggle={toggleCleaningTask}
              onDelete={deleteCleaningTask}
              onAdd={addCleaningTask}
            />
          )}
          {activeTab === 'cooking' && (
            <CookingTab
              schedule={cookingSchedule}
              staffMembers={staffMembers}
              onToggle={toggleCookingSlot}
              onDelete={deleteCookingSlot}
              onAdd={addCookingSlot}
            />
          )}
          {activeTab === 'menu' && (
            <MenuTab
              items={menuItems}
              onDelete={deleteMenuItem}
              onAdd={addMenuItem}
            />
          )}
          {activeTab === 'staff' && (
            <StaffTab
              staff={staffMembers}
              onAdd={addStaffMember}
              onDelete={deleteStaffMember}
            />
          )}
        </main>
      </PullToRefresh>

      {/* Bottom Navigation Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl sm:hidden z-40">
        <div className="flex justify-around items-center py-2">
          {[
            { id: 'dashboard', label: 'Home', icon: Home, gradient: 'from-blue-500 to-blue-600' },
            { id: 'maintenance', label: 'Tasks', icon: ClipboardCheck, gradient: 'from-indigo-500 to-indigo-600' },
            { id: 'cleaning', label: 'Clean', icon: Sparkles, gradient: 'from-green-500 to-green-600' },
            { id: 'cooking', label: 'Cook', icon: ChefHat, gradient: 'from-orange-500 to-orange-600' },
            { id: 'staff', label: 'People', icon: Users, gradient: 'from-pink-500 to-pink-600' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  hapticFeedback('light');
                  setActiveTab(tab.id);
                }}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-2 transition-all duration-300 ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                    : 'text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Item Detail Modal */}
      {viewingItem && (
        <ItemDetailModal 
          item={viewingItem} 
          onClose={() => setViewingItem(null)}
          onAddNote={addNoteToItem}
          onAddPhoto={addPhotoToItem}
          onExportPDF={exportFaultToPDF}
        />
      )}
    </div>
  );
};

export default BhukuveniFacilityManager;
