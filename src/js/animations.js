export function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}
