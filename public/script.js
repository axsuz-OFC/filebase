// ================= LOADING SCREEN =================
document.addEventListener('DOMContentLoaded', () => {
  const loader  = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const pct     = document.getElementById('loaderPct');
  let progress  = 0;

  if (!loader) return; // Loader එක නැත්නම් error එකක් එන්නේ නැති වෙන්න

  const tick = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('hide');
        document.body.classList.add('loaded');
      }, 400);
    }
    loaderBar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 180);
});

// ================= FILE UPLOAD (TEMPFILES) =================
const dropzone  = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const result    = document.getElementById('result');
const resultUrl = document.getElementById('resultUrl');
const copyBtn   = document.getElementById('copyBtn');
const progress  = document.getElementById('progress');
const bar       = document.getElementById('bar');

if (dropzone) {
  dropzone.addEventListener('click', () => fileInput.click());

  ['dragover','dragenter'].forEach(ev =>
    dropzone.addEventListener(ev, e => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    })
  );
  ['dragleave','drop'].forEach(ev =>
    dropzone.addEventListener(ev, e => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    })
  );
  dropzone.addEventListener('drop', e => {
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleUpload(fileInput.files[0]);
  });
}

function handleUpload(file) {
  progress.hidden = false;
  result.hidden = true;
  bar.style.width = '0%';

  const form = new FormData();
  form.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://tmpfiles.org/api/v1/upload');

  xhr.upload.onprogress = e => {
    if (e.lengthComputable)
      bar.style.width = (e.loaded / e.total * 100) + '%';
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const direct = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      resultUrl.value = direct;
      result.hidden = false;
      progress.hidden = true;
    } else {
      alert('Upload failed.');
      progress.hidden = true;
    }
  };

  xhr.onerror = () => {
    alert('Network error.');
    progress.hidden = true;
  };

  xhr.send(form);
}

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(resultUrl.value);
    copyBtn.textContent = 'COPIED!';
    setTimeout(() => (copyBtn.textContent = 'COPY'), 1500);
  });
}

// ================= BACKGROUND IMAGES SLIDER =================
document.addEventListener('DOMContentLoaded', () => {
  const layers = document.querySelectorAll('.bg-layer');
  if (layers.length === 0) return;
  
  let currentIndex = 0;

  setInterval(() => {
    layers[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % layers.length;
    layers[currentIndex].classList.add('active');
  }, 4000);
});

// ================= SCROLL ANIMATION (Categories) =================
window.addEventListener('scroll', () => {
  const cards = document.querySelectorAll('.category-card');
  const triggerBottom = window.innerHeight / 5 * 4;

  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    
    if (cardTop < triggerBottom) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
    }
  });
});
