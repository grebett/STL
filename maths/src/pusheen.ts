const API_KEY = 'q1Cxqwu40v4xFHGjOIA2z2t0hARgH5Qm';
const CACHE_KEY = 'maths-pusheen-gifs';
const TERMS = ['pusheen celebrate', 'pusheen happy', 'pusheen party', 'pusheen star', 'pusheen dance'];

function getCached(): string[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'); }
  catch { return []; }
}

function addToCache(urls: string[]) {
  const all = [...new Set([...getCached(), ...urls])].slice(0, 50);
  localStorage.setItem(CACHE_KEY, JSON.stringify(all));
}

export async function fetchRandomPusheen(): Promise<string | null> {
  const term = TERMS[Math.floor(Math.random() * TERMS.length)];
  try {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(term)}&limit=25&rating=g`
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    const urls: string[] = data.data.map((g: any) => g.images.fixed_height.url);
    if (urls.length) {
      addToCache(urls);
      return urls[Math.floor(Math.random() * urls.length)];
    }
  } catch {}
  const cached = getCached();
  if (cached.length) return cached[Math.floor(Math.random() * cached.length)];
  return null;
}

export function showPusheen(container: HTMLElement) {
  fetchRandomPusheen().then(url => {
    if (!url) return;
    container.innerHTML = `<img src="${url}" alt="Pusheen" />`;
    container.classList.remove('show');
    void container.offsetWidth;
    container.classList.add('show');
    setTimeout(() => container.classList.remove('show'), 5000);
  });
}
