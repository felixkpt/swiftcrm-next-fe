export const pauseAllAudioElements = (messagesRef: any, currentAudio?: HTMLAudioElement) => {
    const audioElements = messagesRef.current?.querySelectorAll('.singleConversationSection audio');
    audioElements?.forEach((audio: HTMLAudioElement) => {
        if (audio !== currentAudio) {
            audio.pause();
        }
    });
};

// Function to handle autoplay when Play All button is clicked
export const playAllAudioElements = async (conversationsContainer: any) => {
    if (conversationsContainer.current) {
        const audioElements = conversationsContainer.current.querySelectorAll('.singleConversationSection audio');

        // Pause all and reset currentTime
        audioElements.forEach((itm) => {
            const audio = itm as HTMLAudioElement;
            audio.pause();
            audio.currentTime = 0;
        });

        console.log('Paused all audio.');

        // Define a recursive function for sequential playback
        const playAudioSequentially = async (index: number) => {
            if (index >= audioElements.length) {
                console.log('Finished playing all audio.');
                return;
            }

            const audio = audioElements[index] as HTMLAudioElement;

            try {
                // Scroll to the current audio element
                const scrollOffset = audio.closest('.singleConversationSection')?.getBoundingClientRect().height;
                const currentScrollTop = conversationsContainer.current?.scrollTop || 0;
                console.log('Current scroll top:', currentScrollTop);

                conversationsContainer.current.scrollTo({
                    top: currentScrollTop + scrollOffset + 10,
                    behavior: 'smooth'
                });

                await audio.play();
                await new Promise((resolve) => {
                    audio.onended = resolve;
                });
            } catch (error) {
                console.error('Audio playback error:', error);
            }

            // Play the next audio element after the current one finishes
            playAudioSequentially(index + 1);
        };
        setTimeout(() => {

            // Start sequential playback from the first audio element
            playAudioSequentially(0);
        }, 1000);
    }
};
