// DOM Elements
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Navigation Functions
function handleNavScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Scroll Animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            element.classList.add('animated');
        }
    });
}

// Section Visibility Observer
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const container = entry.target.querySelector('.section-container');
            if (container) {
                container.classList.add('visible');
            }
        }
    });
}, { threshold: 0.1 });

// Team Section Scroll
function initTeamScroll() {
    const teamGrid = document.querySelector('.team-grid');
    const leftBtn = document.querySelector('.team-container .scroll-btn.left');
    const rightBtn = document.querySelector('.team-container .scroll-btn.right');

    if (teamGrid && leftBtn && rightBtn) {
        const updateScrollButtons = () => {
            leftBtn.classList.toggle('visible', teamGrid.scrollLeft > 0);
            rightBtn.classList.toggle('visible', 
                teamGrid.scrollLeft < teamGrid.scrollWidth - teamGrid.clientWidth);
        };

        teamGrid.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        leftBtn.addEventListener('click', () => {
            teamGrid.scrollBy({ left: -250, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            teamGrid.scrollBy({ left: 250, behavior: 'smooth' });
        });

        // Initial check
        updateScrollButtons();
    }
}

// Contact Form Handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            const formData = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        }
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Portfolio Filter and Scroll
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (!filterButtons.length || !portfolioItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter items with animation
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Reset scroll position
            portfolioGrid.scrollLeft = 0;
        });
    });

    // Initialize scroll buttons
    const leftBtn = document.querySelector('.portfolio-container .scroll-btn.left');
    const rightBtn = document.querySelector('.portfolio-container .scroll-btn.right');

    if (leftBtn && rightBtn) {
        const updateScrollButtons = () => {
            leftBtn.classList.toggle('visible', portfolioGrid.scrollLeft > 0);
            rightBtn.classList.toggle('visible', 
                portfolioGrid.scrollLeft < portfolioGrid.scrollWidth - portfolioGrid.clientWidth);
        };

        portfolioGrid.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        leftBtn.addEventListener('click', () => {
            portfolioGrid.scrollBy({ left: -300, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            portfolioGrid.scrollBy({ left: 300, behavior: 'smooth' });
        });

        // Initial check
        updateScrollButtons();
    }
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
}

// Pricing Tabs
function initPricingTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pricingCategories = document.querySelectorAll('.pricing-category');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show selected category
            pricingCategories.forEach(cat => {
                if (cat.getAttribute('data-category') === category) {
                    cat.classList.add('active');
                } else {
                    cat.classList.remove('active');
                }
            });
        });
    });
}

// Add after other function declarations
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add to your existing JavaScript
function initHeroImages() {
    const images = document.querySelectorAll('.hero-image img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Optional: Add mouse movement effect
    const heroRight = document.querySelector('.hero-right');
    if (heroRight) {
        heroRight.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroRight.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            const images = heroRight.querySelectorAll('.hero-image');
            const cards = heroRight.querySelectorAll('.floating-card');

            images.forEach(image => {
                image.style.transform = `
                    translateX(${x * 20}px) 
                    translateY(${y * 20}px)
                    translateZ(${image.classList.contains('main') ? '50px' : '25px'})
                `;
            });

            cards.forEach(card => {
                card.style.transform = `
                    translateX(${x * 30}px) 
                    translateY(${y * 30}px)
                    translateZ(75px)
                `;
            });
        });

        heroRight.addEventListener('mouseleave', () => {
            const elements = heroRight.querySelectorAll('.hero-image, .floating-card');
            elements.forEach(el => {
                el.style.transform = '';
            });
        });
    }
}

// Add this to your existing script.js
function initTeamSection() {
    const teamGrid = document.querySelector('.team-grid');
    const scrollLeftBtn = document.querySelector('.scroll-btn.left');
    const scrollRightBtn = document.querySelector('.scroll-btn.right');
    
    if (!teamGrid || !scrollLeftBtn || !scrollRightBtn) return;

    // Show/hide scroll buttons based on scroll position
    function updateScrollButtons() {
        const canScrollLeft = teamGrid.scrollLeft > 0;
        const canScrollRight = teamGrid.scrollLeft < (teamGrid.scrollWidth - teamGrid.clientWidth);

        scrollLeftBtn.style.opacity = canScrollLeft ? '1' : '0';
        scrollRightBtn.style.opacity = canScrollRight ? '1' : '0';
    }

    // Scroll the team grid
    function scroll(direction) {
        const scrollAmount = direction === 'left' ? -220 : 220; // Adjusted for card width + gap
        teamGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    // Event listeners
    scrollLeftBtn.addEventListener('click', () => scroll('left'));
    scrollRightBtn.addEventListener('click', () => scroll('right'));
    teamGrid.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    // Initial check
    updateScrollButtons();

    // Add touch scrolling
    let isDown = false;
    let startX;
    let scrollLeft;

    teamGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        teamGrid.style.cursor = 'grabbing';
        startX = e.pageX - teamGrid.offsetLeft;
        scrollLeft = teamGrid.scrollLeft;
    });

    teamGrid.addEventListener('mouseleave', () => {
        isDown = false;
        teamGrid.style.cursor = 'grab';
    });

    teamGrid.addEventListener('mouseup', () => {
        isDown = false;
        teamGrid.style.cursor = 'grab';
    });

    teamGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - teamGrid.offsetLeft;
        const walk = (x - startX) * 2;
        teamGrid.scrollLeft = scrollLeft - walk;
    });

    // Add hover effect to team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            teamMembers.forEach(m => {
                if (m !== member) {
                    m.style.opacity = '0.7';
                    m.style.transform = 'scale(0.95)';
                }
            });
        });

        member.addEventListener('mouseleave', () => {
            teamMembers.forEach(m => {
                m.style.opacity = '1';
                m.style.transform = 'scale(1)';
            });
        });
    });
}

function initScrolling(containerClass) {
    const container = document.querySelector(`.${containerClass}`);
    const scrollLeftBtn = container.querySelector('.scroll-btn.left');
    const scrollRightBtn = container.querySelector('.scroll-btn.right');
    const scrollGrid = container.querySelector(`.${containerClass}-grid`);
    
    if (!scrollGrid || !scrollLeftBtn || !scrollRightBtn) return;

    function updateScrollButtons() {
        const canScrollLeft = scrollGrid.scrollLeft > 0;
        const canScrollRight = scrollGrid.scrollLeft < (scrollGrid.scrollWidth - scrollGrid.clientWidth);

        scrollLeftBtn.style.opacity = canScrollLeft ? '1' : '0';
        scrollRightBtn.style.opacity = canScrollRight ? '1' : '0';
    }

    function scroll(direction) {
        const scrollAmount = direction === 'left' ? -240 : 240;
        scrollGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    scrollLeftBtn.addEventListener('click', () => scroll('left'));
    scrollRightBtn.addEventListener('click', () => scroll('right'));
    scrollGrid.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    // Initial check
    updateScrollButtons();

    // Add touch/mouse drag scrolling
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollGrid.style.cursor = 'grabbing';
        startX = e.pageX - scrollGrid.offsetLeft;
        scrollLeft = scrollGrid.scrollLeft;
    });

    scrollGrid.addEventListener('mouseleave', () => {
        isDown = false;
        scrollGrid.style.cursor = 'grab';
    });

    scrollGrid.addEventListener('mouseup', () => {
        isDown = false;
        scrollGrid.style.cursor = 'grab';
    });

    scrollGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollGrid.offsetLeft;
        const walk = (x - startX) * 2;
        scrollGrid.scrollLeft = scrollLeft - walk;
    });
}

// Services scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    const servicesGrid = document.querySelector('.services-grid');
    const leftBtn = document.querySelector('.services-container .scroll-btn.left');
    const rightBtn = document.querySelector('.services-container .scroll-btn.right');

    if (servicesGrid && leftBtn && rightBtn) {
        const updateScrollButtons = () => {
            leftBtn.classList.toggle('visible', servicesGrid.scrollLeft > 0);
            rightBtn.classList.toggle('visible', 
                servicesGrid.scrollLeft < servicesGrid.scrollWidth - servicesGrid.clientWidth);
        };

        servicesGrid.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        leftBtn.addEventListener('click', () => {
            servicesGrid.scrollBy({ left: -300, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            servicesGrid.scrollBy({ left: 300, behavior: 'smooth' });
        });

        // Initial check
        updateScrollButtons();
    }
});

// Stats Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        function updateCount() {
            current += step;
            if (current < target) {
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stat.classList.add('animate');
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

// Call animation when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateStats();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners
    window.addEventListener('scroll', handleNavScroll);
    menuToggle.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', animateOnScroll);

    // Initialize features
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
    
    initSmoothScroll();
    initPortfolioFilter();
    initTeamScroll();
    initContactForm();
    initPricingTabs();
    initScrollToTop();
    initHeroImages();
    initTeamSection();
    initScrolling('team-container');
    initScrolling('portfolio-container');

    // Initial checks
    animateOnScroll();
    handleNavScroll();

    // Add resize handler for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            animateOnScroll();
            handleNavScroll();
        }, 250);
    });
});

// Reviews Scroll Functionality
const reviewGrid = document.querySelector('.review-grid');
let isScrolling = false;
let startX;
let scrollLeft;
let rafId;

// Touch events for mobile
reviewGrid.addEventListener('touchstart', (e) => {
    isScrolling = true;
    startX = e.touches[0].pageX - reviewGrid.offsetLeft;
    scrollLeft = reviewGrid.scrollLeft;
    cancelAnimationFrame(rafId);
}, { passive: true });

reviewGrid.addEventListener('touchmove', (e) => {
    if (!isScrolling) return;
    const x = e.touches[0].pageX - reviewGrid.offsetLeft;
    const walk = (x - startX) * 2;
    
    rafId = requestAnimationFrame(() => {
        reviewGrid.scrollLeft = scrollLeft - walk;
    });
}, { passive: true });

reviewGrid.addEventListener('touchend', () => {
    isScrolling = false;
    cancelAnimationFrame(rafId);
    snapToCard();
});

// Mouse events for desktop
reviewGrid.addEventListener('mousedown', (e) => {
    isScrolling = true;
    startX = e.pageX - reviewGrid.offsetLeft;
    scrollLeft = reviewGrid.scrollLeft;
    reviewGrid.style.cursor = 'grabbing';
    cancelAnimationFrame(rafId);
});

reviewGrid.addEventListener('mousemove', (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - reviewGrid.offsetLeft;
    const walk = (x - startX) * 2;
    
    rafId = requestAnimationFrame(() => {
        reviewGrid.scrollLeft = scrollLeft - walk;
    });
});

reviewGrid.addEventListener('mouseup', () => {
    isScrolling = false;
    reviewGrid.style.cursor = 'grab';
    cancelAnimationFrame(rafId);
    snapToCard();
});

reviewGrid.addEventListener('mouseleave', () => {
    if (isScrolling) {
        isScrolling = false;
        reviewGrid.style.cursor = 'grab';
        cancelAnimationFrame(rafId);
        snapToCard();
    }
});

// Snap to nearest card
function snapToCard() {
    const cardWidth = reviewGrid.querySelector('.review-card').offsetWidth;
    const scrollPosition = reviewGrid.scrollLeft;
    const targetPosition = Math.round(scrollPosition / cardWidth) * cardWidth;
    
    reviewGrid.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
    });
}

// Prevent image dragging
document.querySelectorAll('.reviewer-image').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});

// Initialize grab cursor
reviewGrid.style.cursor = 'grab';

// Initialize scroll behavior for both grids
function initScrollBehavior(element) {
    let isScrolling = false;
    let startX;
    let scrollLeft;
    let rafId;

    element.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        cancelAnimationFrame(rafId);
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        const x = e.touches[0].pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        
        rafId = requestAnimationFrame(() => {
            element.scrollLeft = scrollLeft - walk;
        });
    }, { passive: true });

    element.addEventListener('touchend', () => {
        isScrolling = false;
        cancelAnimationFrame(rafId);
        snapToItem(element);
    });

    element.addEventListener('mousedown', (e) => {
        isScrolling = true;
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        element.style.cursor = 'grabbing';
        cancelAnimationFrame(rafId);
    });

    element.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        
        rafId = requestAnimationFrame(() => {
            element.scrollLeft = scrollLeft - walk;
        });
    });

    element.addEventListener('mouseup', () => {
        isScrolling = false;
        element.style.cursor = 'grab';
        cancelAnimationFrame(rafId);
        snapToItem(element);
    });

    element.addEventListener('mouseleave', () => {
        if (isScrolling) {
            isScrolling = false;
            element.style.cursor = 'grab';
            cancelAnimationFrame(rafId);
            snapToItem(element);
        }
    });

    element.style.cursor = 'grab';
}

function snapToItem(element) {
    const itemWidth = element.children[0].offsetWidth;
    const scrollPosition = element.scrollLeft;
    const targetPosition = Math.round(scrollPosition / itemWidth) * itemWidth;
    
    element.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
    });
}

// Initialize scrolling for both grids
document.addEventListener('DOMContentLoaded', () => {
    const reviewGrid = document.querySelector('.review-grid');
    const recognitionGrid = document.querySelector('.recognition-grid');
    
    if (reviewGrid) initScrollBehavior(reviewGrid);
    if (recognitionGrid) initScrollBehavior(recognitionGrid);
});

// Initialize scroll behavior for certifications
document.addEventListener('DOMContentLoaded', () => {
    const certGrid = document.querySelector('.cert-grid');
    if (certGrid) initScrollBehavior(certGrid);
});

// Initialize scroll behavior for services
document.addEventListener('DOMContentLoaded', () => {
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) initScrollBehavior(servicesGrid);
}); 
