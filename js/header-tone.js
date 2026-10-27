// 상단 툴바 색 자동 전환 — 툴바 뒤에 깔린 이미지 부분이 밝으면 어두운 반투명 툴바(.is-on-light)로 바꿉니다.
function watchHeaderTone(img) {
  const header = document.querySelector('.site-header');
  let rows = null; // 이미지 각 가로줄의 평균 밝기 (0~1)

  function measure() {
    const w = 64, h = 160;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    let d;
    try { d = ctx.getImageData(0, 0, w, h).data; } catch { return; } // 픽셀을 읽을 수 없으면 기본 툴바 유지
    rows = Array.from({ length: h }, (_, y) => {
      let sum = 0;
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      }
      return sum / w / 255;
    });
    update();
  }

  function update() {
    if (!rows) return;
    const hr = header.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    const top = Math.max(hr.top, ir.top);
    const bottom = Math.min(hr.bottom, ir.bottom);
    let light = false;
    if (bottom > top) {
      const a = Math.floor(((top - ir.top) / ir.height) * rows.length);
      const b = Math.max(a + 1, Math.ceil(((bottom - ir.top) / ir.height) * rows.length));
      const seg = rows.slice(a, b);
      light = seg.reduce((s, v) => s + v, 0) / seg.length > 0.55;
    }
    header.classList.toggle('is-on-light', light);
  }

  if (img.complete && img.naturalWidth) measure();
  else img.addEventListener('load', measure, { once: true });
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
}
