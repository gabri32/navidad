class ChristmasBook {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 4;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.book = document.getElementById('book');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageIndicator = document.getElementById('pageIndicator');
        this.musicBtn = document.getElementById('musicBtn');
        this.backgroundMusic = document.getElementById('backgroundMusic');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateNavigation();
        this.startAnimations();
        this.setupMusic();
    }
    
    setupEventListeners() {
        // Botones de navegación
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Eventos táctiles para móviles
        this.book.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.book.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Eventos de mouse para escritorio
        this.book.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.book.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Control de música
        this.musicBtn.addEventListener('click', () => this.toggleMusic());
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleMouseDown(e) {
        this.touchStartX = e.screenX;
    }
    
    handleMouseUp(e) {
        this.touchEndX = e.screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe derecha - página anterior
                this.previousPage();
            } else {
                // Swipe izquierda - página siguiente
                this.nextPage();
            }
        }
    }
    
    handleKeyPress(e) {
        if (e.key === 'ArrowLeft') {
            this.previousPage();
        } else if (e.key === 'ArrowRight') {
            this.nextPage();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages && !this.isAnimating) {
            this.isAnimating = true;
            this.currentPage++;
            this.updateBook();
            this.playPageFlipSound();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }
    }
    
    previousPage() {
        if (this.currentPage > 1 && !this.isAnimating) {
            this.isAnimating = true;
            this.currentPage--;
            this.updateBook();
            this.playPageFlipSound();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }
    }
    
    updateBook() {
        // Remover clases anteriores
        this.book.className = 'book';
        
        // Agregar clase de página actual
        if (this.currentPage > 1) {
            this.book.classList.add(`page-${this.currentPage}`);
        }
        
        this.updateNavigation();
        this.triggerPageAnimations();
    }
    
    updateNavigation() {
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === this.totalPages;
        this.pageIndicator.textContent = `${this.currentPage} / ${this.totalPages}`;
    }
    
    triggerPageAnimations() {
        // Resetear todas las animaciones primero
        const allTextElements = document.querySelectorAll('.page-text p');
        allTextElements.forEach(element => {
            element.style.animation = 'none';
            element.style.opacity = '0';
        });
        
        // Activar animaciones para la página actual
        setTimeout(() => {
            const currentPageElement = document.querySelector(`.page-${this.currentPage}`);
            if (currentPageElement) {
                const textElements = currentPageElement.querySelectorAll('.page-text p');
                textElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.animation = `fadeInUp 1s ease-out forwards`;
                        element.style.animationDelay = `${0.3 + (index * 0.3)}s`;
                    }, 100);
                });
            }
        }, 200);
    }
    
    startAnimations() {
        // Iniciar animaciones de la primera página
        setTimeout(() => {
            this.triggerPageAnimations();
        }, 500);
        
        // Crear efectos de luces navideñas
        this.createChristmasLights();
    }
    
    createChristmasLights() {
        const lightsContainer = document.createElement('div');
        lightsContainer.className = 'christmas-lights';
        lightsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        
        for (let i = 0; i < 20; i++) {
            const light = document.createElement('div');
            light.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${this.getRandomChristmasColor()};
                border-radius: 50%;
                box-shadow: 0 0 10px currentColor;
                animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            lightsContainer.appendChild(light);
        }
        
        document.body.appendChild(lightsContainer);
        
        // Agregar animación de parpadeo
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    getRandomChristmasColor() {
        const colors = ['#d4af37', '#dc143c', '#228b22', '#ffffff', '#ffd700'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupMusic() {
        // Configurar música de fondo
        this.backgroundMusic.volume = 0.3;
        
        // Crear música navideña sintética si no hay archivo
        if (!this.backgroundMusic.src || this.backgroundMusic.src.includes('christmas-music.mp3')) {
            this.createSyntheticMusic();
        }
    }
    
    createSyntheticMusic() {
        // Crear contexto de audio para música sintética
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let isPlaying = false;
            
            const playChristmasChord = (frequency, duration) => {
                if (!isPlaying) return;
                
                const oscillator1 = audioContext.createOscillator();
                const oscillator2 = audioContext.createOscillator();
                const oscillator3 = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator1.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator2.frequency.setValueAtTime(frequency * 1.25, audioContext.currentTime);
                oscillator3.frequency.setValueAtTime(frequency * 1.5, audioContext.currentTime);
                
                oscillator1.type = 'sine';
                oscillator2.type = 'sine';
                oscillator3.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator1.connect(gainNode);
                oscillator2.connect(gainNode);
                oscillator3.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator1.start(audioContext.currentTime);
                oscillator2.start(audioContext.currentTime);
                oscillator3.start(audioContext.currentTime);
                
                oscillator1.stop(audioContext.currentTime + duration);
                oscillator2.stop(audioContext.currentTime + duration);
                oscillator3.stop(audioContext.currentTime + duration);
            };
            
            const christmasSequence = [
                { freq: 261.63, duration: 1 }, // C
                { freq: 293.66, duration: 1 }, // D
                { freq: 329.63, duration: 1 }, // E
                { freq: 349.23, duration: 1 }, // F
                { freq: 392.00, duration: 2 }, // G
                { freq: 349.23, duration: 1 }, // F
                { freq: 329.63, duration: 1 }, // E
                { freq: 293.66, duration: 2 }, // D
            ];
            
            this.musicBtn.addEventListener('click', () => {
                if (!isPlaying) {
                    isPlaying = true;
                    this.musicBtn.classList.add('playing');
                    
                    const playSequence = () => {
                        if (!isPlaying) return;
                        
                        let currentTime = 0;
                        christmasSequence.forEach((note, index) => {
                            setTimeout(() => {
                                if (isPlaying) {
                                    playChristmasChord(note.freq, note.duration);
                                }
                            }, currentTime * 1000);
                            currentTime += note.duration;
                        });
                        
                        setTimeout(() => {
                            if (isPlaying) playSequence();
                        }, currentTime * 1000 + 2000);
                    };
                    
                    playSequence();
                } else {
                    isPlaying = false;
                    this.musicBtn.classList.remove('playing');
                }
            });
        } catch (error) {
            console.log('Audio context not supported');
        }
    }
    
    toggleMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(() => {
                // Si no se puede reproducir el archivo, usar música sintética
                console.log('Using synthetic music');
            });
            this.musicBtn.classList.add('playing');
        } else {
            this.backgroundMusic.pause();
            this.musicBtn.classList.remove('playing');
        }
    }
    
    playPageFlipSound() {
        // Crear sonido sintético de pasar página
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio context not supported');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ChristmasBook();
    
    // Agregar efecto de carga suave
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);