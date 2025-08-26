import { useToast } from "@/hooks/use-toast";
import { tables } from "@/lib/supabase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseApp, firebaseConfig } from "@/lib/firebase";

export interface DeviceRegistrationResult {
  success: boolean;
  token?: string;
  error?: string;
}

const saveTokenToDatabase = async (
  userId: string,
  role: string,
  token: string,
): Promise<boolean> => {
  try {
    // Try a conventional table name for device tokens
    const deviceTokens = (tables as any).device_tokens?.();
    if (deviceTokens) {
      const { error } = await deviceTokens
        .upsert({ user_id: userId, role, fcm_token: token, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      if (!error) return true;
      console.warn("FCM token upsert error:", error);
    }
  } catch (e) {
    console.warn("Device token table not available:", e);
  }

  // Fallback to user_profiles column if it exists
  try {
    const userProfiles = tables.userProfiles();
    if (userProfiles) {
      const { error } = await userProfiles
        .update({ fcm_token: token, fcm_updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (!error) return true;
      console.warn("user_profiles update failed:", error);
    }
  } catch (e) {
    console.warn("user_profiles update not available:", e);
  }

  // Final fallback to localStorage for this device
  try {
    localStorage.setItem("fcm_token", token);
  } catch (_) {}
  return false;
};

export const notificationsService = {
  registerDevice: async (
    user: { id: string; role: string; name?: string },
  ): Promise<DeviceRegistrationResult> => {
    try {
      const supported = await isSupported();
      if (!supported) {
        console.warn("FCM not supported in this environment");
        return { success: false, error: "Notifications not supported" };
      }

      if (!firebaseApp || !firebaseConfig?.messagingSenderId) {
        console.warn("Firebase not configured");
        return { success: false, error: "Firebase not configured" };
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return { success: false, error: "Permission denied" };
      }

      const messaging = getMessaging(firebaseApp);
      const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY as string | undefined;
      if (!vapidKey) {
        console.warn("Missing VITE_FCM_VAPID_KEY");
      }

      const token = await getToken(messaging, { vapidKey });
      if (token) {
        const saved = await saveTokenToDatabase(user.id, user.role, token);
        if (!saved) {
          console.warn("Token saved locally only");
        }
        return { success: true, token };
      }
      return { success: false, error: "Failed to get FCM token" };
    } catch (error: any) {
      console.warn("FCM registration failed:", error);
      return { success: false, error: error?.message || "Registration failed" };
    }
  },
};

export default notificationsService;


