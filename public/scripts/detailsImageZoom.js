document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const zoomedImage = document.getElementById('zoomed');
    const input = document.getElementById('qty-input');

    if (thumbnails.length > 0 && zoomedImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('mouseover', () => {
                zoomedImage.src = thumbnail.src;
                zoomedImage.alt = thumbnail.alt;
                
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
            });
        });

        // Set first thumbnail as active
        thumbnails[0].classList.add('active');
    }

    if (input) {
        input.addEventListener('focus', function() {
            this.style.caretColor = 'transparent';
        });

        input.addEventListener('keydown', function(e) {
            const currentValue = parseInt(this.value || '1', 10);

            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.value = Math.max(1, currentValue + 1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.value = Math.max(1, currentValue - 1);
                    break;
                case 'Tab':
                    break;
                default:
                    e.preventDefault();
            }
        });
    }
});