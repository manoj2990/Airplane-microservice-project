
   export function extractCode(str) {
      try {
        // Validate input
        if (!str || typeof str !== 'string') {
          console.warn('extractCode: Invalid input, expected non-empty string');
          return null;
        }
        
        const m = str.match(/\(([A-Z]{2,4})\)/);
        return m ? m[1] : null;
      } catch (error) {
        console.error('extractCode error:', error);
        return null;
      }
    }