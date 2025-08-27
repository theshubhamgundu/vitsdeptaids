import { User } from "./authService";

export interface SessionData {
  user: User;
  lastActivity: number;
  sessionId: string;
  expiresAt: number;
}

export interface SessionManager {
  createSession: (user: User) => void;
  getSession: () => SessionData | null;
  updateSession: (updates: Partial<User>) => void;
  clearSession: () => void;
  isSessionValid: () => boolean;
  refreshSession: () => void;
  getLastRoute: () => string | null;
  setLastRoute: (route: string) => void;
  hasMultipleSessions: (userId: string) => boolean;
  logoutAllDevices: (userId: string) => void;
  setupAutoRefresh: () => (() => void) | undefined;
  isAutoRefreshSetup: () => boolean;
}

class SessionService implements SessionManager {
  private readonly SESSION_KEY = "vitsdeptaids_session";
  private readonly LAST_ROUTE_KEY = "vitsdeptaids_last_route";
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private autoRefreshSetup = false;

  createSession(user: User): void {
    try {
      const sessionData: SessionData = {
        user,
        lastActivity: Date.now(),
        sessionId: this.generateSessionId(),
        expiresAt: Date.now() + this.SESSION_DURATION,
      };

      // Save to localStorage
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      
      // Also save to sessionStorage for tab-specific persistence
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      
      // Save user separately for backward compatibility
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      console.log("✅ Session created successfully for:", user.name);
    } catch (error) {
      console.error("❌ Error creating session:", error);
    }
  }

  getSession(): SessionData | null {
    try {
      // Try sessionStorage first (tab-specific)
      let sessionData = sessionStorage.getItem(this.SESSION_KEY);
      
      if (!sessionData) {
        // Fallback to localStorage
        sessionData = localStorage.getItem(this.SESSION_KEY);
      }

      if (!sessionData) {
        return null;
      }

      const session: SessionData = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        console.log("⚠️ Session expired, clearing...");
        this.clearSession();
        return null;
      }

      // Update last activity
      session.lastActivity = Date.now();
      this.updateSessionData(session);

      return session;
    } catch (error) {
      console.error("❌ Error getting session:", error);
      this.clearSession();
      return null;
    }
  }

  updateSession(updates: Partial<User>): void {
    try {
      const session = this.getSession();
      if (session) {
        session.user = { ...session.user, ...updates };
        session.lastActivity = Date.now();
        this.updateSessionData(session);
        
        // Also update currentUser for backward compatibility
        localStorage.setItem("currentUser", JSON.stringify(session.user));
        
        console.log("✅ Session updated successfully");
      }
    } catch (error) {
      console.error("❌ Error updating session:", error);
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.LAST_ROUTE_KEY);
      this.autoRefreshSetup = false; // Reset auto-refresh flag
      console.log("✅ Session cleared successfully");
    } catch (error) {
      console.error("❌ Error clearing session:", error);
    }
  }

  isSessionValid(): boolean {
    try {
      const session = this.getSession();
      if (!session) return false;

      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
      return false;
    }

      // Check if user data is valid
      if (!session.user || !session.user.id || !session.user.role) {
        return false;
      }
    
    return true;
    } catch (error) {
      console.error("❌ Error checking session validity:", error);
      return false;
    }
  }

  refreshSession(): void {
    try {
      const session = this.getSession();
      if (session) {
        session.expiresAt = Date.now() + this.SESSION_DURATION;
        session.lastActivity = Date.now();
        this.updateSessionData(session);
        console.log("✅ Session refreshed successfully");
      }
    } catch (error) {
      console.error("❌ Error refreshing session:", error);
    }
  }

  getLastRoute(): string | null {
    try {
      return localStorage.getItem(this.LAST_ROUTE_KEY);
    } catch (error) {
      console.error("❌ Error getting last route:", error);
      return null;
    }
  }

  setLastRoute(route: string): void {
    try {
      localStorage.setItem(this.LAST_ROUTE_KEY, route);
    } catch (error) {
      console.error("❌ Error setting last route:", error);
    }
  }

  hasMultipleSessions(userId: string): boolean {
    // This is a placeholder implementation.
    // In a real application, you would query your backend or local storage
    // to check if there are multiple sessions for the given user.
    // For now, we'll just return false as a default.
    return false;
  }

  logoutAllDevices(userId: string): void {
    // This is a placeholder implementation.
    // In a real application, you would send a request to your backend
    // to invalidate all sessions for the given user.
    // Currently does nothing - implement when backend supports it
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateSessionData(session: SessionData): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("❌ Error updating session data:", error);
    }
  }

  // Auto-refresh session on user activity
  setupAutoRefresh(): (() => void) | undefined {
    if (this.autoRefreshSetup) {
      return undefined; // Already setup
    }
    
    this.autoRefreshSetup = true;
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const refreshSession = () => {
      if (this.isSessionValid()) {
        this.refreshSession();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, refreshSession, { passive: true });
    });

    // Cleanup function
    return () => {
      this.autoRefreshSetup = false;
      events.forEach(event => {
        document.removeEventListener(event, refreshSession);
      });
    };
  }

  // Check if auto-refresh is already setup
  isAutoRefreshSetup(): boolean {
    return this.autoRefreshSetup;
  }
}

export const sessionService = new SessionService();
export default sessionService;
