// Función para probar el localStorage directamente
export const testLocalStorage = () => {
  if (typeof window !== 'undefined') {
    console.log('=== TESTING LOCALSTORAGE ===');
    
    // Verificar qué hay en localStorage
    const storedUser = localStorage.getItem('user');
    console.log('Current localStorage user:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        console.log('User roles:', parsedUser.roles);
        console.log('Has ADMIN role:', parsedUser.roles?.includes('ADMIN'));
        console.log('Has ROLE_ADMIN role:', parsedUser.roles?.includes('ROLE_ADMIN'));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    // Verificar todos los keys en localStorage
    console.log('All localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`${key}: ${localStorage.getItem(key)}`);
      }
    }
    
    console.log('=== END TESTING ===');
  }
};

// Función para limpiar localStorage
export const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('localStorage cleared');
  }
};

// Función para simular login
export const simulateLogin = () => {
  if (typeof window !== 'undefined') {
    const mockUser = {
      id: 1,
      username: 'admin',
      roles: ['ROLE_ADMIN'],
      token: 'mock-token'
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    console.log('Mock user stored:', mockUser);
  }
};
