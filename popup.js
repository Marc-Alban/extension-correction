document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const correctButton = document.getElementById('correctButton');
    const resultDiv = document.getElementById('result');

    correctButton.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `text=${encodeURIComponent(text)}&language=fr&enabledOnly=false`
            });

            const data = await response.json();
            let correctedText = text;
            
            if (data.matches) {
                const matches = data.matches.sort((a, b) => b.offset - a.offset);
                for (const match of matches) {
                    const replacement = match.replacements[0]?.value || match.word;
                    correctedText = correctedText.substring(0, match.offset) + 
                                  replacement + 
                                  correctedText.substring(match.offset + match.length);
                }
            }

            resultDiv.textContent = correctedText;
            resultDiv.style.display = 'block';
        } catch (error) {
            console.error('Erreur lors de la correction:', error);
            resultDiv.textContent = 'Erreur lors de la correction. Veuillez réessayer.';
            resultDiv.style.display = 'block';
        }
    });
}); 