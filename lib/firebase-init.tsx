'use client';

import { useEffect } from 'react';
import { getAnalyticsInstance } from './firebase';

export function FirebaseInit() {
  useEffect(() => {
    // Initialize Firebase Analytics on client side
    if (typeof window !== 'undefined') {
      getAnalyticsInstance();
    }
  }, []);

  return null;
}
