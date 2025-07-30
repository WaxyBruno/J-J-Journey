// Smooth scrolling for scroll indicator
document.querySelector('.scroll-indicator').addEventListener('click', () => {
    document.querySelector('.timeline-section').scrollIntoView({
        behavior: 'smooth'
    });
});

// Intersection Observer for timeline animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// Observe founder cards
document.querySelectorAll('.founder-card').forEach(card => {
    observer.observe(card);
});

// Create animated performance chart
function createPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Performance data points
    const dataPoints = [
        { x: 0, y: 20, label: '2013' },
        { x: 80, y: 60, label: '2021' },
        { x: 160, y: 40, label: '2023' },
        { x: 240, y: 120, label: '2024' }
    ];
    
    let animationProgress = 0;
    const animationDuration = 2000; // 2 seconds
    let startTime = null;
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        animationProgress = Math.min(elapsed / animationDuration, 1);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw animated line
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < dataPoints.length - 1; i++) {
            const currentPoint = dataPoints[i];
            const nextPoint = dataPoints[i + 1];
            
            const segmentProgress = Math.max(0, Math.min(1, (animationProgress * dataPoints.length) - i));
            
            if (segmentProgress > 0) {
                const startX = currentPoint.x;
                const startY = height - currentPoint.y;
                const endX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
                const endY = height - (currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress);
                
                if (i === 0) {
                    ctx.moveTo(startX, startY);
                }
                ctx.lineTo(endX, endY);
            }
        }
        ctx.stroke();
        
        // Draw animated points
        ctx.fillStyle = '#ffd700';
        dataPoints.forEach((point, index) => {
            const pointProgress = Math.max(0, Math.min(1, (animationProgress * dataPoints.length) - index));
            if (pointProgress > 0) {
                ctx.beginPath();
                ctx.arc(point.x, height - point.y, 4 * pointProgress, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        if (animationProgress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    // Start animation when chart comes into view
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(animate);
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    chartObserver.observe(canvas);
}

// Real photos are now used instead of generated avatars

// Parallax scrolling effect
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-bg');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Smooth reveal animations
function revealOnScroll() {
    const reveals = document.querySelectorAll('.founder-card, .transformation-card');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add CSS for reveal animation
const revealStyles = `
    .founder-card, .transformation-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .founder-card.active, .transformation-card.active {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = revealStyles;
document.head.appendChild(styleSheet);

// Typing animation for hero subtitle
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 1500); // Delay before starting
}

// Metric counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.metric-value, .stat-number, .impact-stat .number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        
        if (numericValue) {
            let current = 0;
            const increment = numericValue / 50;
            const suffix = target.replace(/[0-9]/g, '');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createPerformanceChart();
    
    // Add event listeners
    window.addEventListener('scroll', () => {
        handleParallax();
        revealOnScroll();
    });
    
    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const metricsSection = document.querySelector('.dashboard-metrics');
    if (metricsSection) {
        counterObserver.observe(metricsSection);
    }
    
    // Button interactions
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect styles
const rippleStyles = `
    .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Replace direct scroll listener with throttled version
window.addEventListener('scroll', throttle(() => {
    handleParallax();
    revealOnScroll();
}, 16)); // ~60fps