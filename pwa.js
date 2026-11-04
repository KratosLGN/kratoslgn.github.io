(() => {
  const button = document.getElementById('installApp');
  const dialog = document.getElementById('installHelp');
  const help = document.getElementById('installInstructions');
  const standalone = window.matchMedia('(display-mode: standalone)');
  let installPrompt = null;

  function updateVisibility() {
    button.hidden = standalone.matches || navigator.standalone === true;
  }
  updateVisibility();
  standalone.addEventListener('change', updateVisibility);

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    updateVisibility();
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    button.hidden = true;
    if (dialog.open) dialog.close();
  });

  function showHelp() {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    help.textContent = ios
      ? 'En Safari, abre Compartir y elige «Añadir a pantalla de inicio». Activa «Abrir como app web» si aparece y toca «Añadir». Si no ves la opción en tu navegador, abre esta página en Safari.'
      : 'Abre el menú de tu navegador y busca «Instalar aplicación» o «Añadir a pantalla de inicio». Si no aparece, prueba con Chrome o Edge actualizados. La opción depende del navegador y del dispositivo.';
    dialog.showModal();
  }
  button.addEventListener('click', async () => {
    if (!installPrompt) {
      showHelp();
      return;
    }
    const prompt = installPrompt;
    installPrompt = null;
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      showHelp();
    }
  });
  document.getElementById('closeInstallHelp').addEventListener('click', () => dialog.close());

  if ('serviceWorker' in navigator && window.isSecureContext) {
    // No page reload on activation: an update must not interrupt a playing channel.
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
      // Manual home-screen instructions remain available if registration fails.
    });
  }
})();
