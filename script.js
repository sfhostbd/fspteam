// DOM Elements
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');

// Navigation Functions
function handleNavScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function toggleMobileMenu() {
    // Toggle menu icon
    const menuIcon = menuToggle.querySelector('i');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-times');
    
    // Toggle menu and auth buttons
    navLinks.classList.toggle('active');
    authButtons.classList.toggle('active');
    
    // Toggle body scroll
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.mobile-menu-btn')) {
        toggleMobileMenu();
    }
});

// Close mobile menu when clicking a nav link
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth <= 768) {
        toggleMobileMenu();
    }
});

// Update active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
}

// Event Listeners
window.addEventListener('scroll', () => {
    handleNavScroll();
    updateActiveNavLink();
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    handleNavScroll();
    updateActiveNavLink();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

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

// Pricing Tabs
function initPricingTabs() {
    const tabBtns = document.querySelectorAll('.pricing-tabs .tab-btn');
    const pricingCategories = document.querySelectorAll('.pricing-category');
    
    if (!tabBtns.length || !pricingCategories.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and categories
            tabBtns.forEach(b => b.classList.remove('active'));
            pricingCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding pricing category
            const category = btn.dataset.category;
            const targetCategory = document.querySelector(`.pricing-category[data-category="${category}"]`);
            if (targetCategory) {
                targetCategory.classList.add('active');
            }
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

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initServicesSection();
    initStats();
    initNavigation();
    initPricingTabs();
    initFAQ();
    initCustomPlanBuilder();
});

// Services Section Initialization
function initServicesSection() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    let isScrolling = false;
    let startX;
    let scrollLeft;

    // Touch events
    servicesGrid.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - servicesGrid.offsetLeft;
        scrollLeft = servicesGrid.scrollLeft;
    }, { passive: true });

    servicesGrid.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.touches[0].pageX - servicesGrid.offsetLeft;
        const walk = (x - startX) * 2;
        servicesGrid.scrollLeft = scrollLeft - walk;
    });

    servicesGrid.addEventListener('touchend', () => {
        isScrolling = false;
    });

    // Mouse events for desktop
    servicesGrid.addEventListener('mousedown', (e) => {
        isScrolling = true;
        startX = e.pageX - servicesGrid.offsetLeft;
        scrollLeft = servicesGrid.scrollLeft;
        servicesGrid.style.cursor = 'grabbing';
    });

    servicesGrid.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - servicesGrid.offsetLeft;
        const walk = (x - startX) * 2;
        servicesGrid.scrollLeft = scrollLeft - walk;
    });

    servicesGrid.addEventListener('mouseup', () => {
        isScrolling = false;
        servicesGrid.style.cursor = 'grab';
    });

    servicesGrid.addEventListener('mouseleave', () => {
        isScrolling = false;
        servicesGrid.style.cursor = 'grab';
    });

    // Prevent context menu on long press for mobile
    servicesGrid.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.services-grid')) {
            e.preventDefault();
        }
    });

    // Set initial cursor style
    servicesGrid.style.cursor = 'grab';
}

// Stats Animation
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (!target) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStat(stat, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

function animateStat(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    function updateCount() {
        current += step;
        if (current < target) {
            element.textContent = Math.round(current);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    }
    
    updateCount();
}

// Navigation initialization
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    window.addEventListener('scroll', handleNavScroll);
}

// Add this function for FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}

// Custom Plan Builder functionality
function initCustomPlanBuilder() {
    const builderBtn = document.querySelector('.custom-plan-btn');
    const modal = document.querySelector('.builder-modal');
    const closeBtn = document.querySelector('.close-modal');
    const createPlanBtn = document.querySelector('.create-plan-btn');
    const totalPrice = document.getElementById('totalPrice');
    
    if (!builderBtn || !modal || !closeBtn || !createPlanBtn || !totalPrice) return;

    // Open modal
    builderBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle category selection
    const categoryOptions = modal.querySelectorAll('input[name="category"]');
    categoryOptions.forEach(option => {
        option.addEventListener('change', () => {
            updateFeatures(option.value);
            updateTotal();
        });
    });

    // Handle feature selection
    modal.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updateTotal();
        }
    });

    // Create plan button click handler
    createPlanBtn.addEventListener('click', () => {
        // Get selected category
        const selectedCategory = modal.querySelector('input[name="category"]:checked').value;
        
        // Get selected features
        const selectedFeatures = Array.from(modal.querySelectorAll('.feature-option input:checked'))
            .map(input => {
                const featureText = input.closest('.feature-option').textContent.trim();
                const price = input.closest('.feature-option').querySelector('.price').textContent;
                return `${featureText} (${price})`;
            });

        // Close modal
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Scroll to contact form
        const contactForm = document.getElementById('contact');
        contactForm.scrollIntoView({ behavior: 'smooth' });

        // Update contact form
        setTimeout(() => {
            const messageField = document.getElementById('message');
            if (messageField) {
                const customPlanDetails = 
                    "Custom Plan Details:\n" +
                    "-------------------\n" +
                    `Category: ${selectedCategory}\n` +
                    "Selected Features:\n" +
                    selectedFeatures.join('\n') + "\n\n" +
                    `Total Estimated Price: ${totalPrice.textContent}\n\n`;
                
                messageField.value = customPlanDetails + messageField.value;
            }
        }, 800);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCustomPlanBuilder);

document.addEventListener('DOMContentLoaded', function() {
    // Image loading optimization
    const heroImage = document.querySelector('.hero-image img');
    const imageContainer = document.querySelector('.image-container');
    
    if (heroImage) {
        // Preload the image
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = heroImage.src;
        document.head.appendChild(preloadLink);

        // Handle image loading
        if (heroImage.complete) {
            heroImage.style.opacity = '1';
        } else {
            heroImage.onload = function() {
                heroImage.style.opacity = '1';
            };
        }

        // 3D effect on mouse move
        if (imageContainer) {
            imageContainer.addEventListener('mousemove', function(e) {
                const rect = imageContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                imageContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            imageContainer.addEventListener('mouseleave', function() {
                imageContainer.style.transform = 'rotateX(0) rotateY(0)';
            });
        }
    }

    // Social icons hover effect
    const socialIcons = document.querySelectorAll('.social-icons-circle .icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateZ(50px) scale(1.1)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateZ(30px)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    });

    // Performance optimization for tech circle animation
    const techCircle = document.querySelector('.hero::before');
    if (techCircle) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled > window.innerHeight) {
                techCircle.style.animationPlayState = 'paused';
            } else {
                techCircle.style.animationPlayState = 'running';
            }
        }, { passive: true });
    }
});

// Add event listeners to all plan buttons
document.querySelectorAll('.plan-button span').forEach(button => {
    button.addEventListener('click', function(e) {
        // Get the service value and price info from data attributes
        const serviceValue = this.getAttribute('data-service');
        const price = this.getAttribute('data-price');
        const period = this.getAttribute('data-period');
        
        // Scroll to contact form
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            const messageField = document.getElementById('message');
            
            if (serviceSelect) {
                // Set the value directly
                serviceSelect.value = serviceValue;
                
                // If the value was set successfully
                if (serviceSelect.value === serviceValue) {
                    // Trigger change event
                    serviceSelect.dispatchEvent(new Event('change'));
                    
                    // Add price information to message field
                    if (messageField) {
                        const planName = this.closest('.pricing-plan').querySelector('.plan-name').textContent;
                        const planCategory = this.closest('.pricing-plan').querySelector('.plan-category').textContent;
                        const currentMessage = messageField.value;
                        const priceInfo = `Selected Service: ${planCategory}\nPlan: ${planName}\nPrice: $${price}/${period}\n\n`;
                        messageField.value = priceInfo + currentMessage;
                    }
                }
            }
        }, 800); // Small delay to ensure smooth scroll completes
    });
});

// Add these functions to your existing script.js
function updateFeatures(category) {
    const featureOptions = document.querySelector('.feature-options');
    const features = getFeaturesByCategory(category);
    
    featureOptions.innerHTML = `
        <label class="feature-option">
            <input type="checkbox" value="basic" checked disabled>
            <span>Basic ${getCategoryName(category)} Package</span>
            <span class="price">$${getBasePrice(category)}</span>
        </label>
        ${features.map(feature => `
            <label class="feature-option">
                <input type="checkbox" value="${feature.id}">
                <span>${feature.name}</span>
                <span class="price">+$${feature.price}</span>
            </label>
        `).join('')}
    `;
}

function getFeaturesByCategory(category) {
    const features = {
        marketing: [
            { id: 'social', name: 'Social Media Management', price: 399 },
            { id: 'seo', name: 'Advanced SEO', price: 299 },
            { id: 'ads', name: 'Ad Campaign Management', price: 499 },
            { id: 'content', name: 'Content Marketing', price: 399 }
        ],
        graphics: [
            { id: 'branding', name: 'Complete Brand Identity', price: 399 },
            { id: 'social-kit', name: 'Social Media Kit', price: 199 },
            { id: 'print', name: 'Print Materials Design', price: 299 },
            { id: 'illustration', name: 'Custom Illustrations', price: 399 }
        ],
        uiux: [
            { id: 'wireframes', name: 'Wireframing & Prototyping', price: 599 },
            { id: 'user-research', name: 'User Research', price: 499 },
            { id: 'interaction', name: 'Interactive Prototypes', price: 699 },
            { id: 'testing', name: 'Usability Testing', price: 399 }
        ],
        mobile: [
            { id: 'native', name: 'Native Development', price: 2999 },
            { id: 'cross-platform', name: 'Cross-Platform Support', price: 1999 },
            { id: 'api', name: 'API Integration', price: 1499 },
            { id: 'analytics', name: 'Analytics Integration', price: 999 }
        ],
        web: [
            { id: 'responsive', name: 'Responsive Design', price: 999 },
            { id: 'ecommerce', name: 'E-commerce Integration', price: 1499 },
            { id: 'cms', name: 'CMS Implementation', price: 1299 },
            { id: 'optimization', name: 'Performance Optimization', price: 799 }
        ],
        security: [
            { id: 'audit', name: 'Security Audit', price: 799 },
            { id: 'monitoring', name: '24/7 Monitoring', price: 599 },
            { id: 'encryption', name: 'Data Encryption', price: 899 },
            { id: 'compliance', name: 'Compliance Management', price: 699 }
        ]
    };
    
    return features[category] || [];
}

function getCategoryName(category) {
    const names = {
        marketing: 'Digital Marketing',
        graphics: 'Graphics Design',
        uiux: 'UI/UX Design',
        mobile: 'Mobile Development',
        web: 'Web Development',
        security: 'Cybersecurity'
    };
    return names[category] || category;
}

function getBasePrice(category) {
    const prices = {
        marketing: 599,
        graphics: 299,
        uiux: 799,
        mobile: 4999,
        web: 2999,
        security: 999
    };
    return prices[category] || 0;
}

function updateTotal() {
    const totalPrice = document.getElementById('totalPrice');
    const checkedFeatures = document.querySelectorAll('.feature-option input:checked');
    
    let total = 0;
    checkedFeatures.forEach(feature => {
        const priceText = feature.closest('.feature-option').querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        total += price;
    });
    
    totalPrice.textContent = `$${total}`;
} 