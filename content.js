// Vérifie si le script est déjà chargé
if (!window.correctorScriptLoaded) {
    window.correctorScriptLoaded = true;
    
    console.log('Content script chargé dans', window.location.href);

    // Variable pour stocker la dernière sélection
    let lastSelection = null;

    // Fonction pour vérifier si nous sommes dans Google Docs
    function isGoogleDocs() {
        return window.location.hostname === 'docs.google.com';
    }

    // Fonction pour obtenir le texte sélectionné dans Google Docs
    function getGoogleDocsSelection() {
        const selection = document.getSelection();
        if (!selection.rangeCount) return null;

        // Dans Google Docs, le texte est dans des spans imbriqués
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        
        // Si nous sommes dans l'éditeur de Google Docs
        if (container.closest('.kix-page')) {
            return {
                text: selection.toString().trim(),
                range: range.cloneRange(),
                isGoogleDocs: true
            };
        }
        return null;
    }

    // Fonction pour remplacer le texte dans Google Docs
    function replaceTextInGoogleDocs(range, newText) {
        try {
            // Simuler la frappe clavier pour Google Docs
            const pasteEvent = new ClipboardEvent('paste', {
                clipboardData: new DataTransfer(),
                bubbles: true,
                cancelable: true
            });
            
            // Ajouter le texte corrigé aux données du presse-papier
            pasteEvent.clipboardData.setData('text/plain', newText);
            
            // Sélectionner le texte à remplacer
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Déclencher l'événement de coller
            document.activeElement.dispatchEvent(pasteEvent);
            
            return true;
        } catch (error) {
            console.error('Erreur lors du remplacement dans Google Docs:', error);
            return false;
        }
    }

    // Écoute la sélection de texte
    document.addEventListener('mouseup', function() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            lastSelection = {
                text: selection.toString().trim(),
                range: selection.getRangeAt(0).cloneRange()
            };
        }
    });

    // Écoute les messages du background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'replaceText' && lastSelection) {
            try {
                // Vérifie que le texte sélectionné correspond au texte à corriger
                if (lastSelection.text === request.originalText) {
                    // Crée un nouveau nœud de texte avec le texte corrigé
                    const newText = document.createTextNode(request.correctedText);
                    
                    // Remplace le texte sélectionné par le texte corrigé
                    const range = lastSelection.range;
                    range.deleteContents();
                    range.insertNode(newText);
                    
                    // Réinitialise la sélection
                    window.getSelection().removeAllRanges();
                    lastSelection = null;
                    
                    sendResponse({ success: true });
                }
            } catch (error) {
                console.error('Erreur lors du remplacement du texte:', error);
                sendResponse({ success: false, error: error.message });
            }
        }
        return true;
    });
} 