export function useConfettis() {
    let jsConfetti: any = null;
    const confettisCounter = ref(0);

    async function launchConfettis(emoji?: string) {
        if (!jsConfetti) {
            if (import.meta.client) {
                const { default: JSConfetti } = await import('js-confetti');
                jsConfetti = new JSConfetti();
            } else {
                return;
            }
        }

        let confettis;
        if (typeof emoji === 'string') {
            confettis = {
                emojis: [emoji],
                emojiSize: 50,
                confettiNumber: 75
            };
        } else {
            confettis = {
                confettiRadius: 7,
                confettiNumber: 75
            };
        }
        if (confettisCounter.value < 3) {
            confettisCounter.value++;
            jsConfetti.addConfetti(confettis).then(() => {
                confettisCounter.value--;
            });
        } else if (confettisCounter.value === 0) {
            jsConfetti.clearCanvas();
        }
    }

    return { launchConfettis };
}
