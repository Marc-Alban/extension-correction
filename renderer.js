const { ipcRenderer } = require('electron');

// Gestionnaire du navigateur web
document.getElementById('browser').addEventListener('click', () => {
    const webview = document.getElementById('webview');
    if (webview.style.display === 'none') {
        webview.style.display = 'block';
    } else {
        webview.style.display = 'none';
    }
});

// Gestionnaire de téléchargements
document.getElementById('downloads').addEventListener('click', () => {
    ipcRenderer.send('open-download-manager');
});

// Gestionnaire de mots de passe
document.getElementById('passwordManager').addEventListener('click', () => {
    ipcRenderer.send('open-password-manager');
});

// Correcteur de texte
document.getElementById('textCorrector').addEventListener('click', async () => {
    // À implémenter : intégration avec LanguageTool API
    console.log('Correcteur de texte - Fonctionnalité à venir');
});

// Client Email
document.getElementById('email').addEventListener('click', () => {
    // À implémenter : client email IMAP/SMTP
    console.log('Client Email - Fonctionnalité à venir');
});

// Chat IA
document.getElementById('chat').addEventListener('click', () => {
    // À implémenter : intégration avec API OpenAI
    console.log('Chat IA - Fonctionnalité à venir');
}); 