// "BIG TIME EVENT BUS"

const MONITORING_SCROLL = Symbol('MONITORING_SCROLL');
const HANDLE_DEBOUNCE_SCROLL = Symbol('HANDLE_DEBOUNCE_SCROLL');
const HANDLE_THROTTLE_SCROLL = Symbol('HANDLE_THROTTLE_SCROLL');
const HANDLE_SCROLL = Symbol('HANDLE_SCROLL');

const MONITORING_RESIZE = Symbol('MONITORING_RESIZE');
const HANDLE_DEBOUNCE_RESIZE = Symbol('HANDLE_DEBOUNCE_RESIZE');

const MONITORING_IMAGES_LOAD = Symbol('MONITORING_IMAGES_LOAD');
const HANDLE_IMAGES_LOAD = Symbol('HANDLE_IMAGES_LOAD');
const IMAGES_TRACKED = Symbol('IMAGES_TRACKED');
const IMAGES_LOADED = Symbol('IMAGES_LOADED');

const AD_REFRESH_INTERVAL = Symbol('AD_REFRESH_INTERVAL');
const AD_REFRESH_TIMER = Symbol('AD_REFRESH_TIMER');
const AD_REFRESH_COUNT = Symbol('AD_REFRESH_COUNT');

const debounce = (callback, wait, context = this) => {
  let timeout = null;
  const later = () => callback.apply(context, null);

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = {
  ticking: false,

  request(callback) {
    return () => {
      if (!this.ticking) {
        requestAnimationFrame(() => this.update(callback));
      }

      this.ticking = true;
    };
  },

  update(callback) {
    callback();
    this.ticking = false;
  },
};

const listeners = {};

const BigTimeEventBus = {
  // Monitoring flags
  [MONITORING_SCROLL]: false,
  [MONITORING_RESIZE]: false,
  [MONITORING_IMAGES_LOAD]: false,

  /* Scroll
   ============================= */
  [HANDLE_DEBOUNCE_SCROLL]: debounce(() => {
    BigTimeEventBus.trigger('scroll', window.pageYOffset, 'debounce');
  }, 100),

  [HANDLE_THROTTLE_SCROLL]: throttle.request(() => {
    BigTimeEventBus.trigger('scroll', window.pageYOffset, 'throttle');
  }),

  [HANDLE_SCROLL]: () => BigTimeEventBus.trigger('scroll', window.pageYOffset, 'none'),

  monitorScroll() {
    if (this[MONITORING_SCROLL]) return;

    window.addEventListener('scroll', this[HANDLE_DEBOUNCE_SCROLL], false);
    window.addEventListener('scroll', this[HANDLE_THROTTLE_SCROLL], false);
    window.addEventListener('scroll', this[HANDLE_SCROLL], false);

    this[MONITORING_SCROLL] = true;
  },

  deregisterScroll() {
    if (!this[MONITORING_SCROLL]) {
      return;
    }

    window.removeEventListener('scroll', this[HANDLE_DEBOUNCE_SCROLL]);
    window.removeEventListener('scroll', this[HANDLE_THROTTLE_SCROLL]);
    window.removeEventListener('scroll', this[HANDLE_SCROLL]);

    this[MONITORING_SCROLL] = false;
  },

  /* Resize
   ============================= */
  [HANDLE_DEBOUNCE_RESIZE]: debounce(() => {
    const breakpoints = BigTimeEventBus.getBreakpoints();

    BigTimeEventBus.trigger('resize', {
      breakpoints,
      width: window.innerWidth,
      height: window.innerHeight,
    }, 'debounce');
  }),

  monitorResize() {
    if (this[MONITORING_RESIZE]) return; // resize is not being tracked

    window.addEventListener('resize', this[HANDLE_DEBOUNCE_RESIZE], false);

    this[MONITORING_RESIZE] = true;
  },

  deregisterResize() {
    if (!this[MONITORING_RESIZE]) return;

    window.removeEventListener('resize', this[HANDLE_DEBOUNCE_RESIZE]);

    this[MONITORING_RESIZE] = false;
  },

  getBreakpoints() {
    // if (__CLIENT__) { // eslint-disable-line no-undef
    if (window) { // eslint-disable-line no-undef
      const s = window.matchMedia('(max-width: 759px)').matches;
      const m = window.matchMedia('(min-width: 760px) and (max-width: 999px)').matches;
      const l = window.matchMedia('(min-width: 1000px) and (max-width: 1239px)').matches;
      const xl = window.matchMedia('(min-width: 1240px)').matches;

      return { s, m, l, xl };
    }

    return { s: false, m: false, l: false, xl: false };
  },

  /* Images
   ============================= */
  [IMAGES_LOADED]: 0,
  [IMAGES_TRACKED]: [],

  [HANDLE_IMAGES_LOAD]: () => {
    BigTimeEventBus.trigger('imagesLoaded', undefined, 'throttle');
    BigTimeEventBus[MONITORING_IMAGES_LOAD] = false;
  },

  monitorImagesLoad() {
    const images = Array.from(document.getElementsByTagName('picture')).map(picture => picture.querySelector('img'));
    const loadedImages = images.filter(image => image.complete);
    this[IMAGES_TRACKED] = images;
    this[IMAGES_LOADED] = loadedImages.length;
    this[MONITORING_IMAGES_LOAD] = true;
    this.triggerImagesLoaded();
  },

  oneImageLoaded() {
    if (!this[MONITORING_IMAGES_LOAD]) return; // images are not being tracked

    const images = this[IMAGES_TRACKED];
    const loadedImages = images.filter(image => image.complete);
    this[IMAGES_LOADED] = loadedImages.length;
    this.triggerImagesLoaded();
  },

  triggerImagesLoaded() {
    if (this[IMAGES_LOADED] === this[IMAGES_TRACKED].length) {
      this[HANDLE_IMAGES_LOAD]();
    }
  },

  /* Ad Refresh
   ============================= */
  [AD_REFRESH_INTERVAL]: null,
  [AD_REFRESH_TIMER]: null,
  [AD_REFRESH_COUNT]: null,

  monitorAdRefresh(interval, count) {
    if (this[AD_REFRESH_INTERVAL]) {
      this.clearAdRefreshInterval();
      document.removeEventListener('visibilitychange', this.toggleAdRefreshInterval);
    }

    this[AD_REFRESH_TIMER] = interval;
    this[AD_REFRESH_COUNT] = count;

    this.setAdRefreshInterval();

    document.addEventListener('visibilitychange', this.toggleAdRefreshInterval);
  },

  toggleAdRefreshInterval() {
    if (document.hidden) {
      BigTimeEventBus.clearAdRefreshInterval();
    } else {
      BigTimeEventBus.setAdRefreshInterval();
    }
  },

  setAdRefreshInterval() {
    this[AD_REFRESH_INTERVAL] = setInterval(() => {
      if (this[AD_REFRESH_COUNT]) {
        BigTimeEventBus.trigger('adRefresh');
        this[AD_REFRESH_COUNT] -= 1;
      } else {
        this.clearAdRefreshInterval();
      }
    }, this[AD_REFRESH_TIMER]);
  },

  clearAdRefreshInterval() {
    clearInterval(this[AD_REFRESH_INTERVAL]);
  },

  deregisterAdRefresh() {
    if (!this[AD_REFRESH_INTERVAL]) return;

    this.clearAdRefreshInterval();
    document.removeEventListener('visibilitychange', this.toggleAdRefreshInterval);
  },

  /* Event Control
   ============================= */
  on(key, fn, attenuation = 'throttle') {
    const attenuatedKey = key !== 'resize' ? `${key}_${attenuation}` : `${key}_debounce`;

    if (!listeners[attenuatedKey]) {
      listeners[attenuatedKey] = [];
    }

    listeners[attenuatedKey] = [...listeners[attenuatedKey], fn];
  },

  remove(key, fnToRemove, attenuation = 'throttle') {
    const attenuatedKey = key !== 'resize' ? `${key}_${attenuation}` : `${key}_debounce`;

    if (listeners[attenuatedKey]) {
      listeners[attenuatedKey] = listeners[attenuatedKey].filter(fn => fn !== fnToRemove);
    }
  },

  trigger(key, data, attenuation = 'throttle') {
    const attenuatedKey = key !== 'resize' ? `${key}_${attenuation}` : `${key}_debounce`;
    if (!listeners[attenuatedKey]) {
      return;
    }

    listeners[attenuatedKey].forEach(fn => fn(data));
  },

  once(key, fn, attenuation) {
    const onceFn = (...args) => {
      fn(...args);
      BigTimeEventBus.remove(key, onceFn, attenuation);
    };
    BigTimeEventBus.on(key, onceFn, attenuation);
  },
};

export default BigTimeEventBus;
