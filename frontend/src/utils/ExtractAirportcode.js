
   export function extractCode(str) {
      const m = str.match(/\(([A-Z]{2,4})\)/);
      return m ? m[1] : null;
    }