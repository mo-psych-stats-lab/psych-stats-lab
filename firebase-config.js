/* Firebase web configuration (optional).
   Leave as null to run the site without accounts; everything else keeps working and progress stays in the browser.
   To enable email/password accounts, paste the config object from:
   Firebase console > Project settings > General > Your apps > Web app > SDK setup and configuration > Config
   This object is NOT a secret (it identifies the project in every browser), but protect it as described in
   SETUP-FIREBASE.md: restrict the API key to your GitHub Pages domain and deploy firestore.rules.

   window.FIREBASE_CONFIG = {
     apiKey: "...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     appId: "..."
   };
*/
/* Public web config for project mopsych-stats (accounts separate from the scales lab). The key is restricted to the GitHub Pages domain and Firebase APIs; data is protected by firestore.rules. */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCA3PB5iQwieljcvBNU-_JqDR70LtKY8Do",
  authDomain: "mopsych-stats.firebaseapp.com",
  projectId: "mopsych-stats",
  appId: "1:107885720191:web:9e27c20dfdc3dd4033454a",
  messagingSenderId: "107885720191"
};
/* Optional: App Check with reCAPTCHA v3 to block abusive scripts (see SETUP-FIREBASE.md, step 6). */
window.FIREBASE_APPCHECK_SITE_KEY = null;
