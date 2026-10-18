'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const defaultLetter = `Neha,\n\nI am so sorry. I know I have hurt you, and I know my mistakes have left a pain in your heart that I never wanted to cause. Even when I failed to show it in the right way, my love for you has always been real, deep, and honest.\n\nYou mean everything to me. Your smile, your peace, your trust, and your presence in my life matter more than I can ever explain. I may not always know how to express my feelings perfectly, but I want you to know this with all my heart: I love you more than words can say.\n\nI am sorry for every moment that made you feel less loved, less seen, or less important. I am sorry for hurting you, and I am sorry for every time I made you doubt how much you mean to me. Please know that my heart has always belonged to you, and no one else will ever have the place you hold in me.\n\nMy love, my life, my peace — all of it is you. You are my woman, my comfort, my home, and the one I never want to lose. If I could turn back time and protect your heart, I would. Since I cannot, I will spend every day proving to you through my actions, my words, and my effort that I am worthy of your forgiveness and your love.\n\nPlease give me another chance to love you the way you deserve. I am ready to listen, to grow, and to become a better man for you. You deserve all my patience, my honesty, and my sincere love.\n\nWith all my heart,\nAdnan\n\nim very sorry my wifey neha, mujhe pata hai tumhe hamesha hurt hota hai mujse, lekin main sach mein hadd se zyada pyaar karta hoon tumse. Shayad main apni feelings ko sahi tarike se express nahi kar pata, par dil se main tumse bahut pyar karta hoon. Tumhari jagah mere dil mein kisi aur ki nahi hai, aur kabhi nahi hogi. Mere dil ki malika tum ho, aur tum hamesha raho gi.`;

  const envelope = document.getElementById('envelope');
  const letterBody = document.getElementById('letterBody');
  const letterTo = document.getElementById('letterTo');
  const letterFrom = document.getElementById('letterFrom');

  // static names (permanent on the page)
  const fromName = 'Adnan';
  const toName = 'Neha';

  const revealBtn = document.getElementById('revealBtn');
  const editBtn = document.getElementById('editBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const editorPanel = document.getElementById('editorPanel');
  const letterEditor = document.getElementById('letterEditor');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');

  // Gallery elements
  const galleryImage = document.getElementById('galleryImage');
  const prevPhoto = document.getElementById('prevPhoto');
  const nextPhoto = document.getElementById('nextPhoto');
  const galleryThumbs = document.getElementById('galleryThumbs');

  let currentText = defaultLetter;
  let typing = false;

  // Swan images (royalty-free Pixabay)
  const swanImages = [
    'https://cdn.pixabay.com/photo/2016/11/23/00/45/swan-1850154_1280.jpg',
    'https://cdn.pixabay.com/photo/2018/06/11/10/14/swan-3475679_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/11/29/06/16/swan-1869246_1280.jpg'
  ];
  let photoIndex = 0;
  let galleryTimer = null;

  function updateGallery(index) {
    photoIndex = (index + swanImages.length) % swanImages.length;
    galleryImage.src = swanImages[photoIndex];

    const buttons = galleryThumbs.querySelectorAll('button');
    buttons.forEach((btn, i) => btn.classList.toggle('active', i === photoIndex));
  }

  function createThumbs() {
    swanImages.forEach((src, i) => {
      const btn = document.createElement('button');
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Swan ${i+1}`;
      btn.appendChild(img);
      btn.addEventListener('click', () => {
        updateGallery(i);
        resetGalleryTimer();
      });
      galleryThumbs.appendChild(btn);
    });
  }

  function nextGallery() { updateGallery(photoIndex + 1); }
  function prevGallery() { updateGallery(photoIndex - 1); }

  function startGalleryTimer() { stopGalleryTimer(); galleryTimer = setInterval(() => nextGallery(), 5000); }
  function stopGalleryTimer() { if (galleryTimer) { clearInterval(galleryTimer); galleryTimer = null; } }
  function resetGalleryTimer() { stopGalleryTimer(); startGalleryTimer(); }

  function updateNames() {
    // use static values so the names remain permanent
    letterTo.textContent = `My dearest ${toName},`;
    letterFrom.textContent = fromName;
    // also update static labels in header
    const sFrom = document.getElementById('staticFrom');
    const sTo = document.getElementById('staticTo');
    if (sFrom) sFrom.textContent = fromName;
    if (sTo) sTo.textContent = toName;
  }

  function setLetterText(text) { currentText = text; letterBody.textContent = ''; }

  async function typeReveal(text, speed = 12) {
    typing = true;
    letterBody.textContent = '';
    for (let i = 0; i < text.length; i++) {
      letterBody.textContent += text[i];
      if (text[i] === '\n') {
        await new Promise(r => setTimeout(r, speed * 7));
      } else {
        await new Promise(r => setTimeout(r, speed));
      }
    }
    typing = false;
  }

  function revealLetter() {
    envelope.classList.add('open');
    updateNames();
    if (!typing) typeReveal(currentText);
  }

  function showEditor() { letterEditor.value = currentText; editorPanel.style.display = 'block'; }
  function hideEditor() { editorPanel.style.display = 'none'; }

  function sanitizeName(name) { return String(name || '').replace(/[^a-z0-9_\-\.]/gi, '_'); }

  function downloadLetter() {
    const from = fromName;
    const to = toName;
    const filename = `sorry-letter-${sanitizeName(from)}-to-${sanitizeName(to)}.txt`;
    const content = `To: ${to}\nFrom: ${from}\n\n${currentText}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  if (revealBtn) revealBtn.addEventListener('click', revealLetter);
  if (envelope) {
    envelope.addEventListener('click', () => { envelope.classList.toggle('open'); if (envelope.classList.contains('open')) revealLetter(); });
    envelope.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); envelope.click(); } });
  }

  if (editBtn) editBtn.addEventListener('click', showEditor);
  if (saveBtn) saveBtn.addEventListener('click', () => { const text = letterEditor.value.trim() || defaultLetter; setLetterText(text); hideEditor(); letterBody.textContent = text; });
  if (cancelBtn) cancelBtn.addEventListener('click', hideEditor);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadLetter);

  if (musicToggle && bgMusic) { musicToggle.addEventListener('click', () => { if (bgMusic.paused) { bgMusic.play().catch(() => {}); musicToggle.textContent = 'Pause music'; } else { bgMusic.pause(); musicToggle.textContent = 'Play soft music'; } }); }

  if (nextPhoto) nextPhoto.addEventListener('click', () => { nextGallery(); resetGalleryTimer(); });
  if (prevPhoto) prevPhoto.addEventListener('click', () => { prevGallery(); resetGalleryTimer(); });

  createThumbs(); updateGallery(0); startGalleryTimer();

  updateNames(); letterBody.textContent = currentText;

  if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch((err) => { console.warn('Service worker registration failed:', err); }); }
});
