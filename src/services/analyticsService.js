import { isFirebaseConfigured, db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, query, orderBy, limit, increment } from 'firebase/firestore';
import { getLocal, setLocal } from './dbHelpers';
import { dbService } from './dbService'; // For getPosts, getComments, getCategories

export const analyticsService = {
  async getAnalytics() {
    const posts = await dbService.getPosts({ status: 'all' });
    const comms = await dbService.getComments();
    const cats = await dbService.getCategories();

    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;
    const now = new Date();
    const scheduledCount = posts.filter(p => p.status === 'scheduled' || (p.publishedAt && new Date(p.publishedAt) > now)).length;

    const topPosts = [...posts].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

    return {
      totalPosts: posts.length,
      topPosts,
      publishedPosts: publishedCount,
      draftPosts: draftCount,
      scheduledPosts: scheduledCount,
      totalViews,
      totalComments: comms.length,
      totalCategories: cats.length,
      isFirebaseActive: isFirebaseConfigured()
    };
  },

  async trackPageview(url, referrer) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const hour = today.getHours().toString().padStart(2, '0');

    let source = 'direct';
    if (referrer) {
      const ref = referrer.toLowerCase();
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo')) {
        source = 'search';
      } else if (ref.includes('facebook') || ref.includes('twitter') || ref.includes('t.co') || ref.includes('instagram') || ref.includes('linkedin')) {
        source = 'social';
      } else if (hostname && ref.includes(hostname)) {
        source = 'internal';
      } else {
        source = 'referral';
      }
    }

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'analytics_daily', dateStr);
        await setDoc(docRef, {
          date: dateStr,
          views: increment(1),
          [`sources.${source}`]: source !== 'internal' ? increment(1) : increment(0),
          [`hourly.${hour}`]: increment(1)
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore trackPageview error:', e);
      }
      return;
    }

    const key = `analytics_daily_${dateStr}`;
    const defaultData = {
      date: dateStr,
      views: 0,
      sources: { search: 0, social: 0, direct: 0, referral: 0 },
      hourly: {}
    };

    let data = getLocal(key, defaultData);
    data.views += 1;
    if (source !== 'internal') {
      if (data.sources[source] !== undefined) {
        data.sources[source] += 1;
      }
    }
    data.hourly[hour] = (data.hourly[hour] || 0) + 1;
    setLocal(key, data);
  },

  async getAnalyticsSeries(days = 30) {
    let series = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      series.push({
        date: dateStr,
        views: 0,
        sources: { search: 0, social: 0, direct: 0, referral: 0 },
        hourly: {}
      });
    }

    if (isFirebaseConfigured()) {
       try {
         const q = query(collection(db, 'analytics_daily'), orderBy('date', 'desc'), limit(days));
         const snap = await getDocs(q);
         if (!snap.empty) {
           const firestoreData = snap.docs.map(d => d.data());
           series = series.map(emptyDay => {
             const fsDay = firestoreData.find(f => f.date === emptyDay.date);
             return fsDay ? { ...emptyDay, ...fsDay } : emptyDay;
           });
         }
       } catch (e) {
         console.warn('Firestore getAnalyticsSeries error:', e);
       }
       return series;
    }

    series = series.map(emptyDay => {
      const dayData = getLocal(`analytics_daily_${emptyDay.date}`, null);
      return dayData ? { ...emptyDay, ...dayData } : emptyDay;
    });
    return series;
  },

  async resetDemoData() {
    // Disabled
  }
};
