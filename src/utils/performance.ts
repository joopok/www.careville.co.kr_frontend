// Performance monitoring utilities

export const measurePerformance = () => {
  if (typeof window === 'undefined') return;
  
  // Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP is not available
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            const delay = entry.processingStart - entry.startTime;
            console.log('FID:', delay);
          }
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // FID is not available
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Report CLS when page is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          console.log('CLS:', clsValue);
        }
      });
    } catch (e) {
      // CLS is not available
    }
  }

  // Navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;
      
      console.log('Performance Metrics:');
      console.log('DNS lookup:', timing.domainLookupEnd - timing.domainLookupStart, 'ms');
      console.log('TCP connection:', timing.connectEnd - timing.connectStart, 'ms');
      console.log('Request time:', timing.responseStart - timing.requestStart, 'ms');
      console.log('Response time:', timing.responseEnd - timing.responseStart, 'ms');
      console.log('DOM processing:', timing.domComplete - timing.domLoading, 'ms');
      console.log('Page load time:', timing.loadEventEnd - navigationStart, 'ms');
    }, 0);
  });
};

// Image optimization helper
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  // If using a CDN or image service, add optimization parameters
  if (width) {
    // Example: Add width parameter for responsive images
    return `${url}?w=${width}`;
  }
  return url;
};

// Lazy load helper
export const lazyLoadImage = (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(imageSrc);
    img.onerror = reject;
    img.src = imageSrc;
  });
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};