import './style.css';

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Lazy load images with fade-in effect
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease-in-out';
      
      img.onload = () => {
        img.style.opacity = '1';
      };
      
      if (img.complete) {
        img.style.opacity = '1';
      }
      
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '50px'
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  imageObserver.observe(img);
});

// Add animation class on scroll
const fadeElements = document.querySelectorAll('section, article');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

fadeElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  fadeObserver.observe(el);
});

console.log('Nazeefa Ahmed Portfolio - Modern Design 🎨');
