import { EMBEDDED_PUSHEEN } from './pusheen-embedded';

const API_KEY = 'q1Cxqwu40v4xFHGjOIA2z2t0hARgH5Qm';
const CACHE_KEY = 'maths-pusheen-gifs';
const LOCAL_COUNT = 9;
const FETCH_TIMEOUT = 3000;
const TERMS = ['pusheen celebrate', 'pusheen happy', 'pusheen party', 'pusheen star', 'pusheen dance'];

function getCached(): string[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'); }
  catch { return []; }
}

function addToCache(urls: string[]) {
  const all = [...new Set([...getCached(), ...urls])].slice(0, 50);
  localStorage.setItem(CACHE_KEY, JSON.stringify(all));
}

function getLocalPusheen(): string {
  const base = import.meta.env.BASE_URL;
  const idx = Math.floor(Math.random() * LOCAL_COUNT) + 1;
  return `${base}pusheen/${idx}.gif`;
}

async function fetchFromApi(): Promise<string | null> {
  if (!navigator.onLine) return null;
  const term = TERMS[Math.floor(Math.random() * TERMS.length)];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(term)}&limit=25&rating=g`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const urls: string[] = data.data.map((g: any) => g.images.fixed_height.url);
    if (urls.length) {
      addToCache(urls);
      return urls[Math.floor(Math.random() * urls.length)];
    }
  } catch {
    clearTimeout(timer);
  }
  return null;
}

function getEmbeddedPusheen(): string {
  return EMBEDDED_PUSHEEN[Math.floor(Math.random() * EMBEDDED_PUSHEEN.length)];
}

export async function fetchRandomPusheen(): Promise<string> {
  if (!navigator.onLine) return getEmbeddedPusheen();
  const url = await fetchFromApi();
  if (url) return url;
  const cached = getCached();
  if (cached.length) return cached[Math.floor(Math.random() * cached.length)];
  return getLocalPusheen();
}

export function showPusheen(container: HTMLElement) {
  fetchRandomPusheen().then(url => {
    container.innerHTML = `<img src="${url}" alt="Pusheen" />`;
    container.classList.remove('show');
    void container.offsetWidth;
    container.classList.add('show');
    setTimeout(() => container.classList.remove('show'), 5000);
  });
}
