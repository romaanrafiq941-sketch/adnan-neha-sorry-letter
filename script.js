'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Default letter content (original + user's paragraph appended)
  const defaultLetter = `Neha,

I want to start by saying I'm truly sorry. I know I hurt you, and there isn't a good excuse for the pain I caused. I’ve been thinking a lot about what happened and about how my words and actions affected you.

You mean everything to me — your happiness matters more than anything. If I could undo the moments that hurt you, I would. Since I can't, I promise to learn, to listen better, and to be the person you deserve. I will show you through my actions, not just my words.

Please forgive me. I'm ready to do the hard work to rebuild your trust and to hold our love with the care it deserves.

Always yours,
Adnan

im vwey sorry my wifey neha muje pata tumahe huesha hurt hota h mujse lekin mai sach mai hadd se zyda pyaar krta hu tumse shayad muje ye express krna nhi ataa bbut iloveyou my wifey.....aur tumare jagah mere dil mai koyi nhi le skta aur na he mai dunga ye jagah kissi ko kyu ki mere dil ki malika tum ho aur rahogi humesha`;

  // DOM elements
  const envelope = document.getElementById('envelope');
  const playBtn = document.getElementById('playBtn');
  const editBtn = document.getElementById('editBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const printBtn = document.getElementById('printBtn');

  const fromInput = document.getElementById('fromName');
  const toInput = document.getElementById('toName');

  const letterBody = document.getElementById('letterBody');
  const letterTo = document.getElementById('letterTo');
  const letterFrom = document.getElementById('letterFrom');

  const editor = document.getElementById('editor');
  const letterEditor = document.getElementById('letterEditor');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // Make sure required elements exist
  if (!letterBody || !letterTo || !letterFrom || !fromInput || !toInput) {
    console.warn('Some required elements are missing. script.js will not fully initialize.');
    return;
  }

  // State
  let currentText = defaultLetter;
  let typing = false;

  function updateNames() {
    letterTo.textContent = `My dearest ${toInput.value || 'Neha'},`;
    letterFrom.textContent = fromInput.value || 'Adnan';
  }

  function setLetterText(text) {
    currentText = text;
    letterBody.textContent = ''; // cleared for typed reveal
  }

  // Typewriter reveal
  async function typeReveal(text, speed = 18) {
    typing = true;
    letterBody.textContent = '';
    for (let i = 0; i < text.length; i++) {
      letterBody.textContent += text[i];
      await new Promise(r => setTimeout(r, speed));
    }
    typing = false;
  }

  // Play / reveal button
  if (playBtn && envelope) {
    playBtn.addEventListener('click', async () => {
      envelope.classList.add('open');
      updateNames();
      if (!typing) {
        await typeReveal(currentText);
      }
    });
  }

  // Clicking envelope toggles open/close (if envelope exists)
  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.toggle('open');
    });
  }

  // Edit letter
  if (editBtn && editor && letterEditor) {
    editBtn.addEventListener('click', () => {
      letterEditor.value = currentText;
      editor.style.display = 'block';
      editor.setAttribute('aria-hidden', 'false');
      letterEditor.focus();
    });
  }

  if (saveBtn && editor && letterEditor) {
    saveBtn.addEventListener('click', () => {
      const text = letterEditor.value.trim() || defaultLetter;
      setLetterText(text);
      editor.style.display = 'none';
      editor.setAttribute('aria-hidden', 'true');
      // refresh immediate preview (not typed)
      letterBody.textContent = text;
    });
  }

  if (cancelBtn && editor) {
    cancelBtn.addEventListener('click', () => {
      editor.style.display = 'none';
      editor.setAttribute('aria-hidden', 'true');
    });
  }

  // Keep names synced
  if (fromInput) fromInput.addEventListener('input', updateNames);
  if (toInput) toInput.addEventListener('input', updateNames);

  // Utility to sanitize filename safe for most OS
  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9_\-\.]/gi, '_');
  }

  // Download as .txt
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const from = (fromInput && fromInput.value) ? fromInput.value : 'Adnan';
      const to = (toInput && toInput.value) ? toInput.value : 'Neha';
      const header = `To: ${to}\nFrom: ${from}\n\n`;
      const blob = new Blob([header + currentText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeFrom = sanitizeFilename(from);
      const safeTo = sanitizeFilename(to);
      a.download = `sorry-letter-${safeFrom}-to-${safeTo}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  // Print
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Initialize view
  updateNames();
  letterBody.textContent = currentText;

  // Register service worker to cache site for offline / poor connections
  if ('serviceWorker' in navigator) {
    // Use relative path so it works on GitHub Pages or local folder
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker registered (scope: ' + reg.scope + ')');
      })
      .catch(err => {
        console.warn('Service Worker registration failed:', err);
      });
  }
});
