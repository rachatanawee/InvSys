import '@testing-library/jest-dom'

// Mock environment variables
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_SUPABASE_URL: 'test-url',
        VITE_SUPABASE_ANON_KEY: 'test-key'
      }
    }
  }
})