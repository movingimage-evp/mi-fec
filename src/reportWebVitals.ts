import type { Metric } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });

    // Attribution build gives us the culprit element for layout shifts. It is
    // loaded lazily so the extra payload only lands when reporting is enabled.
    import('web-vitals/attribution').then(({ onCLS }) => {
      onCLS((metric) => {
        const { largestShiftTarget } = metric.attribution;

        if (largestShiftTarget) {
          console.debug('[web-vitals] largest shift caused by', largestShiftTarget);
        }
      });
    });
  }
};

export default reportWebVitals;
