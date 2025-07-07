// Test file to verify authentication flow
// This is for debugging purposes only

export const testAuthFlow = () => {
  console.log('=== Testing Authentication Flow ===');
  
  // Check if user data exists in localStorage
  const user = localStorage.getItem('user');
  console.log('User in localStorage:', user);
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('Parsed user data:', userData);
      console.log('User roles:', userData.roles);
      console.log('User token:', userData.token ? 'Present' : 'Missing');
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Check cookies
  const cookies = document.cookie.split(';');
  const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
  console.log('User cookie:', userCookie || 'Not found');
  
  console.log('Current page:', window.location.pathname);
  console.log('=== End Test ===');
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).testAuthFlow = testAuthFlow;
}
