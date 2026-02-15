import React, { useState, useEffect } from 'react';
import { Calendar, ClipboardCheck, Utensils, Sparkles, Plus, Trash2, Edit2, Save, X, CheckCircle, Circle, Bell, AlertCircle, CheckCheck, Clock, TrendingUp, Users, ChefHat, Home, Camera, FileText, Download, User, Image as ImageIcon, Menu as MenuIcon } from 'lucide-react';

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

// Dashboard Component
const Dashboard = ({ stats, maintenanceItems, cleaningTasks, cookingSchedule }) => {
  const today = new Date().toDateString();
  const todaysCooking = cookingSchedule.filter(s => new Date(s.date).toDateString() === today);
  const urgentMaintenance = maintenanceItems.filter(i => !i.completed && i.priority === 'Critical');
  const todayCleaning = cleaningTasks.filter(t => !t.completed && t.frequency === 'Daily');

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in">
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
          title="Staff"
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

  return (
    <div className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 transition-all duration-300 transform hover:scale-102 hover:shadow-xl ${
      item.completed ? 'border-green-300 bg-green-50 shadow-md' : 'border-gray-200 hover:border-blue-300 shadow-md'
    }`}>
      <div className="flex items-start space-x-2 sm:space-x-4">
        <button
          onClick={onToggle}
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

// Maintenance Tab
const MaintenanceTab = ({ items, staffMembers, onToggle, onDelete, onAdd, onUpdate, onView }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = items.filter(item => item.category === cat);
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

// Staff Tab
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
              Staff Management
            </h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage facility staff members</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Staff
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
                  placeholder="Staff member name"
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
                Add Staff
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
              <p className="text-lg sm:text-xl font-medium">No staff members yet</p>
              <p className="text-xs sm:text-sm mt-2">Click "Add Staff" to get started</p>
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

  const groupedTasks = areas.reduce((acc, area) => {
    acc[area] = tasks.filter(task => task.area === area);
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

  // Load data from storage
  useEffect(() => {
    loadData();
    checkForReminders();
    const interval = setInterval(checkForReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [maintenance, cleaning, cooking, menu, notifs, staff] = await Promise.all([
        window.storage.get('bhukuveni-maintenance', false).catch(() => null),
        window.storage.get('bhukuveni-cleaning', false).catch(() => null),
        window.storage.get('bhukuveni-cooking', false).catch(() => null),
        window.storage.get('bhukuveni-menu', false).catch(() => null),
        window.storage.get('bhukuveni-notifications', false).catch(() => null),
        window.storage.get('bhukuveni-staff', false).catch(() => null)
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

  const addNotification = async (message, type = 'info') => {
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
    
    setTimeout(() => removeNotification(newNotif.id), 5000);
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
    addNotification(`Added maintenance task: ${item.title}`, 'success');
  };

  const toggleMaintenanceItem = async (id) => {
    const updated = maintenanceItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed, lastChecked: new Date().toISOString() } : item
    );
    setMaintenanceItems(updated);
    await saveData('bhukuveni-maintenance', updated);
    const item = updated.find(i => i.id === id);
    addNotification(
      item.completed ? `Completed: ${item.title}` : `Unchecked: ${item.title}`,
      item.completed ? 'success' : 'info'
    );
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

  // PDF Export function
  const exportFaultToPDF = async (item) => {
    const pdfContent = `
Bhukuveni Facility Manager - Fault Report
═══════════════════════════════════════════════════

Task: ${item.title}
Category: ${item.category}
Priority: ${item.priority}
Frequency: ${item.frequency}
Status: ${item.completed ? 'Completed' : 'Pending'}
Assigned To: ${item.assignedTo || 'Unassigned'}

Description:
${item.description || 'No description provided'}

${item.lastChecked ? `Last Checked: ${new Date(item.lastChecked).toLocaleString()}` : ''}

${item.notes && item.notes.length > 0 ? `
NOTES:
───────────────────────────────────────────────────
${item.notes.map(note => `
[${new Date(note.timestamp).toLocaleString()}] - ${note.author}
${note.text}
`).join('\n')}
` : ''}

${item.photos && item.photos.length > 0 ? `
Photos Attached: ${item.photos.length}
` : ''}

Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════════════
    `;

    // Create and download PDF-like text file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fault-report-${item.id}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification('Fault report exported', 'success');
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
              <div className="hidden sm:block bg-white/20 backdrop-blur-lg rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-white">
                <div className="text-xs opacity-90">Time</div>
                <div className="text-sm sm:text-xl font-bold">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="relative">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-white cursor-pointer hover:scale-110 transition-transform" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
                    {stats.unreadNotifications}
                  </span>
                )}
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
                { id: 'staff', label: 'Staff', icon: Users }
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
              { id: 'staff', label: 'Staff', icon: Users, gradient: 'from-pink-500 to-pink-600' }
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {activeTab === 'dashboard' && <Dashboard stats={stats} maintenanceItems={maintenanceItems} cleaningTasks={cleaningTasks} cookingSchedule={cookingSchedule} />}
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
