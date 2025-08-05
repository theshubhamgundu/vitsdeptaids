import { User } from './authService';

interface UserSession {
  sessionId: string;
  userId: string;
  userRole: string;
  deviceInfo: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
}

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get device information for identification
const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform || 'Unknown';
  const language = navigator.language || 'Unknown';
  return `${platform}_${language}_${userAgent.slice(0, 50)}`;
};

// Store active sessions in localStorage (in a real app, this would be server-side)
const SESSIONS_KEY = 'activeSessions';

export const sessionService = {
  // Create a new session for a user
  createSession: (user: User): string => {
    const sessionId = generateSessionId();
    const deviceInfo = getDeviceInfo();
    
    const newSession: UserSession = {
      sessionId,
      userId: user.id,
      userRole: user.role,
      deviceInfo,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true,
    };

    // Get existing sessions
    const activeSessions = sessionService.getAllSessions();
    
    // Add new session
    activeSessions.push(newSession);
    
    // Store updated sessions
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(activeSessions));
    
    // Store current session ID for this device
    localStorage.setItem('currentSessionId', sessionId);
    
    return sessionId;
  },

  // Validate if a session is still active
  validateSession: (sessionId: string): boolean => {
    const activeSessions = sessionService.getAllSessions();
    const session = activeSessions.find(s => s.sessionId === sessionId);
    
    if (!session || !session.isActive) {
      return false;
    }

    // Update last activity
    session.lastActivity = new Date().toISOString();
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(activeSessions));
    
    return true;
  },

  // Get all active sessions
  getAllSessions: (): UserSession[] => {
    try {
      const sessions = localStorage.getItem(SESSIONS_KEY);
      if (!sessions) {
        return [];
      }
      return JSON.parse(sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  // Get sessions for a specific user
  getUserSessions: (userId: string): UserSession[] => {
    const activeSessions = sessionService.getAllSessions();
    return activeSessions.filter(s => s.userId === userId && s.isActive);
  },

  // Remove a specific session
  removeSession: (sessionId: string): void => {
    const activeSessions = sessionService.getAllSessions();
    const updatedSessions = activeSessions.map(session => 
      session.sessionId === sessionId ? { ...session, isActive: false } : session
    );
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    
    // If this is the current session, remove the session ID
    const currentSessionId = localStorage.getItem('currentSessionId');
    if (currentSessionId === sessionId) {
      localStorage.removeItem('currentSessionId');
    }
  },

  // Remove all sessions for a user (logout from all devices)
  removeAllUserSessions: (userId: string): void => {
    const activeSessions = sessionService.getAllSessions();
    const updatedSessions = activeSessions.map(session => 
      session.userId === userId ? { ...session, isActive: false } : session
    );
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
  },

  // Get current session ID for this device
  getCurrentSessionId: (): string | null => {
    return localStorage.getItem('currentSessionId');
  },

  // Clean up old inactive sessions (older than 30 days)
  cleanupOldSessions: (): void => {
    const activeSessions = sessionService.getAllSessions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const cleanedSessions = activeSessions.filter(session => {
      const lastActivity = new Date(session.lastActivity);
      return lastActivity > thirtyDaysAgo;
    });
    
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(cleanedSessions));
  },

  // Get session info for display
  getSessionInfo: (sessionId: string): UserSession | null => {
    const activeSessions = sessionService.getAllSessions();
    return activeSessions.find(s => s.sessionId === sessionId) || null;
  },

  // Check if user has multiple active sessions
  hasMultipleSessions: (userId: string): boolean => {
    const userSessions = sessionService.getUserSessions(userId);
    return userSessions.length > 1;
  }
};

export default sessionService;
