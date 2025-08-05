// DOM Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const profileBtn = document.getElementById('profileBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const newsletterForm = document.getElementById('newsletterForm');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');

// State
let currentTestimonial = 0;
let isDarkMode = localStorage.getItem('darkMode') === 'true' || false;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeScrollEffects();
    initializeAnimations();
});

// Mobile Menu Toggle
mobileMenuToggle?.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const icon = this.textContent;
    this.textContent = icon === '☰' ? '✕' : '☰';
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
    }
});

// Search Functionality
searchBtn?.addEventListener('click', function() {
    searchInput.classList.toggle('expanded');
    
    if (searchInput.classList.contains('expanded')) {
        searchInput.focus();
    }
});

// Close search when clicking outside
document.addEventListener('click', function(e) {
    if (!searchBtn.contains(e.target) && !searchInput.contains(e.target)) {
        searchInput.classList.remove('expanded');
    }
});

// Search input functionality
searchInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            // Simulate search functionality
            showNotification(`Searching for: "${query}"`, 'info');
            this.value = '';
            this.classList.remove('expanded');
        }
    }
});

// Theme Toggle
themeToggle?.addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    toggleTheme();
    localStorage.setItem('darkMode', isDarkMode);
});

function initializeTheme() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-color-scheme', 'light');
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-color-scheme', 'light');
        themeToggle.textContent = '🌙';
    }
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Modal Functionality
profileBtn?.addEventListener('click', function() {
    loginModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

closeModal?.addEventListener('click', function() {
    loginModal.classList.add('hidden');
    document.body.style.overflow = '';
});

// Close modal when clicking overlay
loginModal?.addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('modal-overlay')) {
        this.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) {
        loginModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Testimonials Carousel
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    // Hide all testimonials
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current testimonial
    if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
        dots[index]?.classList.add('active');
    }
}

prevTestimonial?.addEventListener('click', function() {
    currentTestimonial = currentTestimonial > 0 ? currentTestimonial - 1 : testimonialCards.length - 1;
    showTestimonial(currentTestimonial);
});

nextTestimonial?.addEventListener('click', function() {
    currentTestimonial = currentTestimonial < testimonialCards.length - 1 ? currentTestimonial + 1 : 0;
    showTestimonial(currentTestimonial);
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-rotate testimonials
setInterval(() => {
    if (testimonialCards.length > 1) {
        currentTestimonial = currentTestimonial < testimonialCards.length - 1 ? currentTestimonial + 1 : 0;
        showTestimonial(currentTestimonial);
    }
}, 5000);

// Newsletter Form
newsletterForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (email) {
        // Simulate newsletter signup
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        emailInput.value = '';
        
        // Add loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active navigation link
            updateActiveNavLink(this);
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });
});

// Update Active Navigation Link
function updateActiveNavLink(clickedLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    clickedLink.classList.add('active');
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Header background opacity based on scroll
        if (currentScrollY > 50) {
            header.style.background = 'linear-gradient(135deg, rgba(45, 27, 105, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2D1B69 0%, #1E3A8A 100%)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(title);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 3000;
        background: var(--color-surface);
        border: 1px solid var(--color-card-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        padding: var(--space-16);
        max-width: 350px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add type-specific styles
    if (type === 'success') {
        notification.style.borderLeftColor = 'var(--color-success)';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        notification.style.borderLeftColor = 'var(--color-error)';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'info') {
        notification.style.borderLeftColor = 'var(--color-info)';
        notification.style.borderLeftWidth = '4px';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Button Click Effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-12);
    }
    
    .notification-message {
        color: var(--color-text);
        font-size: var(--font-size-sm);
        line-height: var(--line-height-normal);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
        cursor: pointer;
        padding: var(--space-4);
        border-radius: var(--radius-sm);
        transition: all var(--duration-fast) var(--ease-standard);
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        background: var(--color-secondary);
        color: var(--color-text);
    }
`;
document.head.appendChild(style);

// Handle notification and cart button clicks
document.getElementById('notificationBtn')?.addEventListener('click', function() {
    showNotification('You have 2 new notifications', 'info');
});

document.getElementById('cartBtn')?.addEventListener('click', function() {
    showNotification('Cart functionality coming soon!', 'info');
});

// Lazy loading for better performance
function initializeLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.src = element.dataset.lazy;
                element.removeAttribute('data-lazy');
                lazyObserver.unobserve(element);
            }
        });
    });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// Initialize lazy loading
initializeLazyLoading();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Any additional scroll handling can go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Escape key handling for dropdowns
    if (e.key === 'Escape') {
        // Close any open dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        });
        
        // Close search if expanded
        searchInput?.classList.remove('expanded');
        
        // Close mobile menu
        navMenu?.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.textContent = '☰';
        }
    }
});

// Focus management for accessibility
document.querySelectorAll('.nav-link, .btn, button, input, select').forEach(element => {
    element.addEventListener('focus', function() {
        this.setAttribute('data-focused', 'true');
    });
    
    element.addEventListener('blur', function() {
        this.removeAttribute('data-focused');
    });
});

console.log('ModernTech website initialized successfully! 🚀');
