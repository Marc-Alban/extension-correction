// Création du menu contextuel
chrome.runtime.onInstalled.addListener(() => {
    try {
        chrome.contextMenus.create({
            id: 'correctText',
            title: 'Corriger le texte',
            contexts: ['selection']
        });
        console.log('Menu contextuel créé avec succès');
    } catch (error) {
        console.error('Erreur lors de la création du menu:', error);
    }
});

// API LanguageTool pour la correction
const LANGUAGETOOL_API = 'https://api.languagetool.org/v2/check';

// Fonction pour préserver la casse d'origine
function preserveCase(original, replacement) {
    if (original === original.toUpperCase()) return replacement.toUpperCase();
    if (original === original.toLowerCase()) return replacement.toLowerCase();
    if (original[0] === original[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
    }
    return replacement.toLowerCase();
}

// Fonction de correction de texte
async function correctText(text) {
    console.log('Tentative de correction du texte:', text);
    try {
        const response = await fetch(LANGUAGETOOL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(text)}&language=fr&enabledOnly=false&level=picky`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let correctedText = text;
        
        // Corrections courantes en français
        const commonFixes = {
            'est di': 'et dis',
            'est de': 'et dis',
            'fait': 'fais',
            'faits': 'fais',
            'de plutot': 'plutôt',
            'plutot': 'plutôt'
        };

        // Détection des questions
        const questionPatterns = [
            /\b(que|quoi|comment|pourquoi|où|quand|qui)\b/i,
            /\b(fais|fait|vas|vais|peux|peut|dois|doit|es|est|as|a)-tu\b/i,
            /\b(tu .+(quoi|que|où|comment|pourquoi|quand))\b/i
        ];

        // Appliquer les corrections courantes
        for (const [wrong, right] of Object.entries(commonFixes)) {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            correctedText = correctedText.replace(regex, right);
        }
        
        if (data.matches && data.matches.length > 0) {
            const matches = data.matches.sort((a, b) => b.offset - a.offset);
            
            for (const match of matches) {
                if (match.replacements && match.replacements.length > 0) {
                    const originalPart = correctedText.substring(match.offset, match.offset + match.length);
                    const replacement = match.replacements[0].value;
                    const preservedCaseReplacement = preserveCase(originalPart, replacement);
                    
                    correctedText = correctedText.substring(0, match.offset) + 
                                  preservedCaseReplacement + 
                                  correctedText.substring(match.offset + match.length);
                }
            }

            // Correction de la ponctuation française
            correctedText = correctedText
                .replace(/\s*([.,!?:;])\s*/g, '$1 ') // Espace après la ponctuation
                .replace(/\s+([.,!?:;])/g, '$1') // Pas d'espace avant la ponctuation simple
                .replace(/\s*([!?:;])\s*/g, ' $1 ') // Espace avant et après la ponctuation double
                .trim();

            // Première lettre en majuscule uniquement au début d'une phrase
            correctedText = correctedText.split(/([.!?]\s+)/).map((part, index) => {
                if (index === 0 || /[.!?]\s+$/.test(correctedText.split(/([.!?]\s+)/)[index-1])) {
                    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
                }
                return part;
            }).join('');

            // Vérification finale de la ponctuation
            const isQuestion = questionPatterns.some(pattern => pattern.test(correctedText));
            if (!correctedText.match(/[.!?]$/)) {
                if (isQuestion) {
                    correctedText = correctedText.trim() + ' ?';
                } else {
                    correctedText = correctedText.trim() + '.';
                }
            } else if (isQuestion && !correctedText.endsWith('?')) {
                correctedText = correctedText.replace(/[.!]$/, ' ?');
            }
        }

        return correctedText;
    } catch (error) {
        console.error('Erreur lors de la correction:', error);
        throw error;
    }
}

// Gestion du clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'correctText' && info.selectionText) {
        console.log('Texte sélectionné:', info.selectionText);
        
        correctText(info.selectionText)
            .then(correctedText => {
                console.log('Texte corrigé:', correctedText);
                return chrome.tabs.sendMessage(tab.id, {
                    action: 'replaceText',
                    correctedText: correctedText,
                    originalText: info.selectionText
                });
            })
            .catch(error => {
                console.error('Erreur dans le processus de correction:', error);
            });
    }
}); 