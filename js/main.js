document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            
            // Toggle hamburger icon (simple text change for now, can be an SVG animation)
            if (navLinks.classList.contains('nav-active')) {
                hamburger.innerHTML = '✕';
            } else {
                hamburger.innerHTML = '☰';
            }
        });
    }
    // Set active nav link based on current URL
    const currentLocation = location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        if (itemHref === currentLocation || (currentLocation === '' && itemHref === 'index.html')) {
            item.classList.add('active');
        }
    });
    // Smooth reveal animation observer for elements not initially visible
    const revealElements = document.querySelectorAll('.glass-card, .reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    revealElements.forEach(el => {
        el.style.opacity = '0'; // hide initially if handled by observer
        revealOnScroll.observe(el);
    });
});
