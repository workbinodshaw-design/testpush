import { useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, increment } from 'firebase/firestore';

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      const hasVisited = sessionStorage.getItem('hasVisited_AIVerse');
      
      if (!hasVisited) {
        try {
          // 1. Increment Global Counter
          const globalRef = doc(db, 'analytics', 'visitors');
          await setDoc(globalRef, {
            totalVisitors: increment(1),
            lastVisit: new Date().toISOString()
          }, { merge: true });

          // 2. Increment Daily Counter
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const dailyRef = doc(db, 'analytics_daily', today);
          await setDoc(dailyRef, {
            count: increment(1),
            date: today
          }, { merge: true });
          
          sessionStorage.setItem('hasVisited_AIVerse', 'true');
        } catch (error) {
          console.error("Failed to track visitor:", error);
        }
      }
    };

    trackVisitor();
  }, []);

  return null;
};

export default VisitorTracker;
