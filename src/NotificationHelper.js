import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = "BP1QBf9_DWL_-j5hVYzQ3ha7OQL21AzDth_2_EfwC-A5ksvObbZ8SYUR8TfDPyaHWA9czoa3kVQ_peTks-iQltw"; // from Firebase

export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("✅ FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Error getting FCM token", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
