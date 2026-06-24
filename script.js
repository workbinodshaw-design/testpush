const phrases = [
    "beautiful web apps.",
    "interactive UIs.",
    "fast APIs.",
    "creative digital solutions."
];

const typingElement = document.getElementById("typing-text");
let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // Remove a letter
        typingElement.textContent = currentPhrase.substring(0, letterIndex - 1);
        letterIndex--;
    } else {
        // Add a letter
        typingElement.textContent = currentPhrase.substring(0, letterIndex + 1);
        letterIndex++;
    }

    // Determine typing speed
    let typingSpeed = isDeleting ? 50 : 100;

    // If word is completely typed out
    if (!isDeleting && letterIndex === currentPhrase.length) {
        typingSpeed = 2000; // Pause at the end of word
        isDeleting = true;
    } 
    // If word is completely deleted
    else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next word
        typingSpeed = 500; // Pause before starting new word
    }

    setTimeout(type, typingSpeed);
}

// Start typing effect on load
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000); // Initial delay
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
