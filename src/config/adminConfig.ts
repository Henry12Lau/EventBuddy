/**
 * Admin Configuration
 * 
 * Add user IDs or emails here to grant admin access
 * No login required - just add your user info to the lists below
 */

// List of admin user IDs
// Add your user ID here (e.g., '1', '2', etc.)
export const ADMIN_USER_IDS = [
  '1',  // Demo User - CHANGE THIS to your actual user ID
];

// List of admin emails
// Add admin email addresses here
export const ADMIN_EMAILS = [
  'demo@eventbuddy.com',
  'admin@eventbuddy.com',
  // Add more admin emails here
];

/**
 * Check if a user ID is an admin
 */
export const isAdminUserId = (userId: string): boolean => {
  return ADMIN_USER_IDS.includes(userId);
};

/**
 * Check if an email is an admin
 */
export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
