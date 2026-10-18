'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const defaultLetter = `Neha,

I want to start by saying I'm truly sorry. I know I hurt you, and there isn't a good excuse for the pain I caused. I’ve been thinking a lot about what happened and about how my words and actions affected you.

You mean everything to me — your happiness matters more than anything. If I could undo the moments that hurt you, I would. Since I can't, I promise to learn, to listen better, and to be the person you deserve. I will show you through my actions, not just my words.

Please forgive me. I'm ready to do the hard work to rebuild your trust and to hold our love with the care it deserves.

Always yours,
Adnan

im vwey sorry my wifey neha muje pata tumahe huesha hurt hota h mujse lekin mai sach mai hadd se zyda pyaar krta hu tumse shayad muje ye express krna nhi ataa bbut iloveyou my wifey.....aur tumare jagah mere dil mai koyi nhi le skta aur na he mai dunga ye jagah kissi ko kyu ki mere dil ki malika tum ho aur rahogi humesha`;

  const envelope = document.getElementById('envelope');
  const letterBody = document.getElementById('letterBody');
  const letterTo = document.getElementById('letterTo');
  const letterFrom = document.getElementById('letterFrom');

  const fromInput = document.getElementById('fromName');
  const toInput = document.getElementById('toName');

  const revealBtn = document.getElementById('revealBtn');
  const editBtn = document.getElementById('editBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const printBtn = document.getElementById('printBtn');

  const editor = document.getElementById('editor');
  const letterEditor = document.getElementById('letterEditor');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const status = document.getElementById('status');

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

  function openEnvelopeAndReveal() {
    envelope.classList.add('open');
    updateNames();
    if (!typing) {
      typeReveal(currentText);
    }
  }

  function showEditor() {
    letterEditor.value = currentText;
    editor.style.display = 'block';
    editor.setAttribute('aria-hidden', 'false');
    letterEditor.focus();
  }
  function hideEditor() {
    editor.style.display = 'none';
    editor.setAttribute('aria-hidden', 'true');
  }

  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9_\-\.]/gi, '_');
  }
  function downloadText(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (revealBtn) revealBtn.addEventListener('click', openEnvelopeAndReveal);
  if (envelope) envelope.addEventListener('click', () => {
    const isOpen = envelope.classList.toggle('open');
    envelope.setAttribute('aria-pressed', String(isOpen));
    if (isOpen) openEnvelopeAndReveal();
  });

  if (editBtn) editBtn.addEventListener('click', showEditor);
  if (saveBtn) saveBtn.addEventListener('click', () => {
    const text = letterEditor.value.trim() || defaultLetter;
    setLetterText(text);
    hideEditor();
    letterBody.textContent = text;
  });
  if (cancelBtn) cancelBtn.addEventListener('click', hideEditor);

  if (downloadBtn) downloadBtn.addEventListener('click', () => {
    const from = fromInput.value || 'Adnan';
    const to = toInput.value || 'Neha';
    const header = `To: ${to}\nFrom: ${from}\n\n`;
    const filename = `letter-${sanitizeFilename(from)}-to-${sanitizeFilename(to)}.txt`;
    downloadText(filename, header + currentText);
  });

  if (printBtn) printBtn.addEventListener('click', () => window.print());

  if (fromInput) fromInput.addEventListener('input', updateNames);
  if (toInput) toInput.addEventListener('input', updateNames);

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().catch(()=>{});
        musicToggle.textContent = 'Pause music';
      } else {
        bgMusic.pause();
        musicToggle.textContent = 'Play music';
      }
    });
  }

  updateNames();
  letterBody.textContent = currentText;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        if (status) status.textContent = 'Site cached for offline use.';
        console.log('Service Worker registered:', reg.scope);
      })
      .catch(err => {
        console.warn('Service Worker registration failed:', err);
      });
  }

  if (envelope) {
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        envelope.click();
      }
    });
  }
});
