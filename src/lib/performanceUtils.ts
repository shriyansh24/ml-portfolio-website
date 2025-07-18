/**
 * Performance monitoring utilities
 */

/**
 * Report Web Vitals to analytics
 *
 * @param metric - Web Vitals metric
 */
export function reportWebVitals(metric: any) {
  // Check if analytics is available
  if (typeof window !== "undefined" && "gtag" in window) {
    // Send to Google Analytics
    const { name, delta, id } = metric;

    (window as any).gtag("event", name, {
      event_category: "Web Vitals",
      event_label: id,
      value: Math.round(name === "CLS" ? delta * 1000 : delta),
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vitals:", metric);
  }
}

/**
 * Initialize performance monitoring
 * This function should be called in the app layout
 */
export function initPerformanceMonitoring() {
  if (typeof window !== "undefined") {
    // Report First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const eventEntry = entry as PerformanceEventTiming;
        const metric = {
          name: "FID",
          delta: eventEntry.processingStart - eventEntry.startTime,
          id: entry.entryType,
        };
        reportWebVitals(metric);
      }
    });

    // Report Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const metric = {
          name: "LCP",
          delta: entry.startTime,
          id: entry.entryType,
        };
        reportWebVitals(metric);
      }
    });

    // Report Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }

      const metric = {
        name: "CLS",
        delta: clsValue,
        id: "layout-shift",
      };
      reportWebVitals(metric);
    });

    try {
      // Start observing
      fidObserver.observe({ type: "first-input", buffered: true });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch (error) {
      console.error("Error initializing performance monitoring:", error);
    }
  }
}

/**
 * Preload critical resources
 * This function preloads critical resources like fonts, images, and scripts
 */
export function preloadCriticalResources() {
  if (typeof window !== "undefined") {
    // Preload fonts
    const fontUrls = ["/fonts/Inter-Regular.ttf", "/fonts/Inter-Bold.ttf"];

    fontUrls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = "font";
      link.type = "font/ttf";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });

    // Preload critical images
    const imageUrls = ["/images/logo.svg", "/images/hero-bg.jpg"];

    imageUrls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = "image";
      document.head.appendChild(link);
    });
  }
}
