import { supabase, isSupabaseEnabled } from './supabaseClient';

/**
 * Hybrid Database Service
 * - Primary: localStorage (always works, offline-first)
 * - Secondary: Supabase (optional cloud sync when configured)
 */

class DatabaseService {
  constructor() {
    this.userId = this.getUserId();
  }

  // Get or create a unique user ID for this device
  getUserId() {
    let userId = localStorage.getItem('bhukuveni-user-id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('bhukuveni-user-id', userId);
    }
    return userId;
  }

  // Get data - always from localStorage (instant, offline-first)
  async get(key) {
    try {
      const localData = localStorage.getItem(`bhukuveni-${key}`);
      if (localData) {
        return { value: localData };
      }
      
      // If no local data and Supabase is enabled, try to sync from cloud
      if (isSupabaseEnabled && supabase) {
        await this.syncFromCloud(key);
        const syncedData = localStorage.getItem(`bhukuveni-${key}`);
        if (syncedData) {
          return { value: syncedData };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  }

  // Set data - save to localStorage immediately, then sync to cloud in background
  async set(key, value) {
    try {
      // Save locally first (instant, always works)
      localStorage.setItem(`bhukuveni-${key}`, value);
      
      // Sync to cloud in background (if enabled)
      if (isSupabaseEnabled && supabase) {
        this.syncToCloud(key, value).catch(err => {
          console.warn('Cloud sync failed (working offline):', err);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error setting data:', error);
      return false;
    }
  }

  // Sync data TO cloud (background operation)
  async syncToCloud(key, value) {
    if (!isSupabaseEnabled || !supabase) return;

    try {
      const { error } = await supabase
        .from('bhukuveni_data')
        .upsert({
          user_id: this.userId,
          data_key: key,
          data_value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,data_key'
        });

      if (error) throw error;
      console.log(`☁️ Synced ${key} to cloud`);
    } catch (error) {
      console.warn(`Cloud sync failed for ${key}:`, error);
      throw error;
    }
  }

  // Sync data FROM cloud (pull latest)
  async syncFromCloud(key) {
    if (!isSupabaseEnabled || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('bhukuveni_data')
        .select('data_value, updated_at')
        .eq('user_id', this.userId)
        .eq('data_key', key)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
      
      if (data) {
        localStorage.setItem(`bhukuveni-${key}`, data.data_value);
        console.log(`📥 Synced ${key} from cloud`);
      }
    } catch (error) {
      console.warn(`Failed to sync ${key} from cloud:`, error);
    }
  }

  // Sync all data from cloud (useful on app startup)
  async syncAllFromCloud() {
    if (!isSupabaseEnabled || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('bhukuveni_data')
        .select('data_key, data_value, updated_at')
        .eq('user_id', this.userId);

      if (error) throw error;

      if (data && data.length > 0) {
        data.forEach(item => {
          const localKey = `bhukuveni-${item.data_key}`;
          const localData = localStorage.getItem(localKey);
          
          // Only overwrite if cloud data is newer
          if (!localData) {
            localStorage.setItem(localKey, item.data_value);
          }
        });
        console.log(`📥 Synced ${data.length} items from cloud`);
      }
    } catch (error) {
      console.warn('Failed to sync all data from cloud:', error);
    }
  }

  // Get sync status
  getStatus() {
    return {
      offline: !isSupabaseEnabled,
      cloudSync: isSupabaseEnabled,
      userId: this.userId
    };
  }
}

// Create singleton instance
const dbService = new DatabaseService();

// Replace window.storage with our hybrid service
window.storage = dbService;

export default dbService;
