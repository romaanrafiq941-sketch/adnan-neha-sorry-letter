'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const defaultLetter = `Neha,

I am so sorry. I know I have hurt you, and I know my mistakes have left a pain in your heart that I never wanted to cause. Even when I failed to show it in the right way, my love for you has always been real, deep, and honest.

You mean everything to me. Your smile, your peace, your trust, your presence in my life — all of it matters more than I can ever explain. I may not always know how to express my feelings perfectly, but I want you to know this with all my heart: I love you more than words can say.

I am sorry for every moment that made you feel less loved, less seen, or less important. I am sorry for hurting you, and I am sorry for every time I made you doubt how much you mean to me. Please know that my heart has always belonged to you, and no one else will ever have the place you hold in me.

My love, my life, my peace — all of it is you. You are my woman, my comfort, my home, and the one I never want to lose. If I could turn back time and protect your heart, I would. Since I cannot, I will spend every day proving to you through my actions, my words, and my effort that I am worthy of your forgiveness and your love.

Please give me another chance to love you the way you deserve. I am ready to listen, to grow, and to become a better man for you. You deserve all my patience, my honesty, and my sincere love.

With all my heart,
Adnan

im very sorry my wifey neha, mujhe pata hai tumhe hamesha hurt hota hai mujse, lekin main sach mein hadd se zyada pyaar karta hoon tumse. Shayad main apni feelings ko sahi tarike se express nahi kar pata, par dil se main tumse bahut pyar karta hoon. Tumhari jagah mere dil mein kisi aur ki nahi hai, aur kabhi nahi hogi. Mere dil ki malika tum ho, aur tum hamesha raho gi.`;

  const envelope = document.getElementById('envelope');
  const letterBody = document.getElementById('letterBody');
  const letterTo = document.getElementById('letterTo');
  const letterFrom = document.getElementById('letterFrom');

  const fromInput = document.getElementById('fromName');
  const toInput = document.getElementById('toName');

  const revealBtn = document.getElementById('revealBtn');
  const editBtn = document.getElementById('editBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const editorPanel = document.getElementById('editorPanel');
  const letterEditor = document.getElementById('letterEditor');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');

  let currentText = defaultLetter;
  let typing = false;

  function updateNames() {
    letterTo.textContent = `My dearest ${toInput.value || 'Neha'},`;
    letterFrom.textContent = fromInput.value || 'Adnan';
  }

  function setLetterText(text) {
    currentText = text;
    letterBody.textContent = '';
  }

  async function typeReveal(text, speed = 14) {
    typing = true;
    letterBody.textContent = '';
    for (let i = 0; i < text.length; i++) {
      letterBody.textContent += text[i];
      if (text[i] === '\n') {
        await new Promise(r => setTimeout(r, speed * 6));
      } else {
        await new Promise(r => setTimeout(r, speed));
      }
    }
    typing = false;
  }

  function revealLetter() {
    envelope.classList.add('open');
    updateNames();
    if (!typing) {
      typeReveal(currentText);
    }
  }

  function showEditor() {
    letterEditor.value = currentText;
    editorPanel.style.display = 'block';
  }

  function hideEditor() {
    editorPanel.style.display = 'none';
  }

  function sanitizeName(name) {
    return String(name || '').replace(/[^a-z0-9_\-\.]/gi, '_');
  }

  function downloadLetter() {
    const from = fromInput.value || 'Adnan';
    const to = toInput.value || 'Neha';
    const filename = `sorry-letter-${sanitizeName(from)}-to-${sanitizeName(to)}.txt`;
    const blob = new Blob([`To: ${to}\nFrom: ${from}\n\n${currentText}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (revealBtn) revealBtn.addEventListener('click', revealLetter);

  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.toggle('open');
      if (envelope.classList.contains('open')) revealLetter();
    });

    envelope.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        envelope.click();
      }
    });
  }

  if (editBtn) editBtn.addEventListener('click', showEditor);
  if (saveBtn) saveBtn.addEventListener('click', () => {
    const text = letterEditor.value.trim() || defaultLetter;
    setLetterText(text);
    hideEditor();
    letterBody.textContent = text;
  });

  if (cancelBtn) cancelBtn.addEventListener('click', hideEditor);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadLetter);

  if (fromInput) fromInput.addEventListener('input', updateNames);
  if (toInput) toInput.addEventListener('input', updateNames);

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicToggle.textContent = 'Pause music';
      } else {
        bgMusic.pause();
        musicToggle.textContent = 'Play soft music';
      }
    });
  }

  updateNames();
  letterBody.textContent = currentText;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  }
});
