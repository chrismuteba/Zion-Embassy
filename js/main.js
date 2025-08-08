// Main JavaScript file for The Ekklesia Zion Embassy website

class ChurchWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupFormHandlers();
        this.setupNotifications();
        this.setupSearch();
        this.setupMobileMenu();
        this.setupBackToTop();
        this.setupAnimations();
    }

    // Event Listeners Setup
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePageLoad();
        });

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Page Load Handler
    handlePageLoad() {
        this.animateOnLoad();
        this.loadStoredData();
        this.checkForUpdates();
    }

    // Scroll Effects
    setupScrollEffects() {
        const header = document.querySelector('.header');
        const backToTop = document.querySelector('.back-to-top');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset > 100;
            
            if (header) {
                header.classList.toggle('scrolled', scrolled);
            }

            if (backToTop) {
                backToTop.classList.toggle('visible', scrolled);
            }

            this.animateOnScroll();
        });
    }

    // Enhanced Mobile Menu Setup
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.mobile-menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            document.body.appendChild(overlay);
        }

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });

            // Close menu when clicking on links
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Check if it's a dropdown toggle in mobile
                    if (window.innerWidth <= 768 && link.closest('.nav-item').querySelector('.dropdown-menu')) {
                        const navItem = link.closest('.nav-item');
                        const hasDropdown = navItem.querySelector('.dropdown-menu');
                        
                        if (hasDropdown && !link.getAttribute('href').startsWith('#')) {
                            e.preventDefault();
                            navItem.classList.toggle('dropdown-active');
                            
                            // Close other dropdowns
                            document.querySelectorAll('.nav-item').forEach(item => {
                                if (item !== navItem) {
                                    item.classList.remove('dropdown-active');
                                }
                            });
                            return;
                        }
                    }
                    
                    // Close menu for regular links
                    if (!link.closest('.dropdown-menu')) {
                        this.closeMobileMenu();
                    }
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            navMenu.classList.add('active');
            mobileToggle.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Toggle hamburger icon
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    }

    closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset hamburger icon
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
        
        // Close any open dropdowns
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('dropdown-active');
        });
    }

    // Back to Top Button
    setupBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Form Handlers
    setupFormHandlers() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupDonationForm();
        this.setupEventRegistration();
    }

    // Contact Form
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Validate form
                if (this.validateContactForm(data)) {
                    await this.submitContactForm(data);
                }
            });
        }
    }

    // Newsletter Form
    setupNewsletterForm() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = form.querySelector('input[type="email"]').value;
                
                if (this.validateEmail(email)) {
                    await this.subscribeNewsletter(email);
                }
            });
        });
    }

    // Donation Form
    setupDonationForm() {
        const donationForm = document.getElementById('donation-form');
        
        if (donationForm) {
            donationForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(donationForm);
                const data = Object.fromEntries(formData);
                
                if (this.validateDonationForm(data)) {
                    await this.processDonation(data);
                }
            });

            // Amount buttons
            const amountButtons = donationForm.querySelectorAll('.amount-btn');
            const amountInput = donationForm.querySelector('#amount');
            
            amountButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    amountButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (amountInput) {
                        amountInput.value = btn.dataset.amount;
                    }
                });
            });
        }
    }

    // Event Registration
    setupEventRegistration() {
        const eventButtons = document.querySelectorAll('.event-register-btn');
        
        eventButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = btn.dataset.eventId;
                this.showEventRegistrationModal(eventId);
            });
        });
    }

    // Enhanced Search Functionality
    setupSearch() {
        this.setupGlobalSearch();
        this.setupPageSpecificSearch();
    }

    setupGlobalSearch() {
        // Add search functionality to header
        this.addHeaderSearch();
        
        // Handle search shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearchModal();
            }
            
            // Escape to close search
            if (e.key === 'Escape') {
                this.closeSearchModal();
            }
        });
    }

    addHeaderSearch() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        // Create search toggle button
        const searchToggle = document.createElement('button');
        searchToggle.className = 'search-toggle';
        searchToggle.innerHTML = '<i class="fas fa-search"></i>';
        searchToggle.setAttribute('aria-label', 'Search');
        
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-input" placeholder="Search..." id="header-search-input">
        `;

        // Insert before the last nav item (Give button)
        const lastNavItem = navMenu.lastElementChild;
        navMenu.insertBefore(searchToggle, lastNavItem);
        navMenu.insertBefore(searchContainer, lastNavItem);

        // Setup event listeners
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            const searchInput = searchContainer.querySelector('.search-input');
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
        });

        // Setup search input
        const headerSearchInput = document.getElementById('header-search-input');
        if (headerSearchInput) {
            headerSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                    }
                }
            });

            // Close search when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchContainer.contains(e.target) && !searchToggle.contains(e.target)) {
                    searchContainer.classList.remove('active');
                }
            });
        }
    }

    setupPageSpecificSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query);
                    }, 300);
                } else {
                    this.clearSearchResults();
                }
            });
        }
    }

    openSearchModal() {
        // Redirect to search page for now
        window.location.href = 'search.html';
    }

    closeSearchModal() {
        // Close any open search modals
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.remove('active');
        }
    }

    // Animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach(el => observer.observe(el));
    }

    // Notification System
    setupNotifications() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        document.body.appendChild(this.notificationContainer);
    }

    showNotification(message, type = 'success', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        this.notificationContainer.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto hide
        const hideTimeout = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(hideTimeout);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Form Validation
    validateContactForm(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!this.validateEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        if (errors.length > 0) {
            this.showNotification(errors.join('<br>'), 'error');
            return false;
        }

        return true;
    }

    validateDonationForm(data) {
        const errors = [];

        if (!data.amount || parseFloat(data.amount) < 1) {
            errors.push('Please enter a valid donation amount');
        }

        if (!data.frequency) {
            errors.push('Please select a donation frequency');
        }

        if (errors.length > 0) {
            this.showNotification(errors.join('<br>'), 'error');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Form Submissions
    async submitContactForm(data) {
        try {
            this.showLoadingState('contact-form');
            
            // Simulate API call
            await this.simulateApiCall();
            
            this.showNotification('Thank you for your message! We will get back to you soon.', 'success');
            document.getElementById('contact-form').reset();
            
        } catch (error) {
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.hideLoadingState('contact-form');
        }
    }

    async subscribeNewsletter(email) {
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            this.showNotification('Successfully subscribed to our newsletter!', 'success');
            
            // Store subscription locally
            this.storeNewsletterSubscription(email);
            
        } catch (error) {
            this.showNotification('Sorry, there was an error with your subscription. Please try again.', 'error');
        }
    }

    async processDonation(data) {
        try {
            this.showLoadingState('donation-form');
            
            // Simulate payment processing
            await this.simulateApiCall(2000);
            
            this.showNotification('Thank you for your generous donation!', 'success');
            
            // Store donation record
            this.storeDonationRecord(data);
            
        } catch (error) {
            this.showNotification('Sorry, there was an error processing your donation. Please try again.', 'error');
        } finally {
            this.hideLoadingState('donation-form');
        }
    }

    // Search Functionality
    async performSearch(query) {
        const searchData = this.getSearchData();
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(results);
    }

    getSearchData() {
        // This would typically come from an API or database
        return [
            { title: 'Sunday Service', content: 'Join us every Sunday at 9:00 AM for worship', url: '/events.html' },
            { title: 'Bible Study', content: 'Tuesday evening Bible study sessions', url: '/events.html' },
            { title: 'Youth Ministry', content: 'Engaging young people with biblical teaching', url: '/ministries.html' },
            { title: 'Prayer Meeting', content: 'Friday evening prayer and worship', url: '/events.html' },
            { title: 'About Us', content: 'Learn about our church history and mission', url: '/about.html' }
        ];
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found.</p>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result">
                    <h4><a href="${result.url}">${result.title}</a></h4>
                    <p>${result.content}</p>
                </div>
            `).join('');
        }

        searchResults.style.display = 'block';
    }

    clearSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // Utility Functions
    showLoadingState(formId) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        }
    }

    hideLoadingState(formId) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
        }
    }

    simulateApiCall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // Local Storage Functions
    storeNewsletterSubscription(email) {
        const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
        if (!subscriptions.includes(email)) {
            subscriptions.push(email);
            localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
        }
    }

    storeDonationRecord(data) {
        const donations = JSON.parse(localStorage.getItem('donation_records') || '[]');
        donations.push({
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('donation_records', JSON.stringify(donations));
    }

    loadStoredData() {
        // Load any stored user preferences or data
        const theme = localStorage.getItem('theme');
        if (theme) {
            document.body.classList.add(`theme-${theme}`);
        }
    }

    // Event Registration Modal
    showEventRegistrationModal(eventId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Event Registration</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="event-registration-form">
                        <input type="hidden" name="eventId" value="${eventId}">
                        <div class="form-group">
                            <label for="reg-name">Full Name</label>
                            <input type="text" id="reg-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="reg-email">Email</label>
                            <input type="email" id="reg-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="reg-phone">Phone</label>
                            <input type="tel" id="reg-phone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="reg-notes">Special Requirements</label>
                            <textarea id="reg-notes" name="notes"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Form submission
        const form = modal.querySelector('#event-registration-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitEventRegistration(new FormData(form));
            this.closeModal(modal);
        });
    }

    closeModal(modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    async submitEventRegistration(formData) {
        try {
            const data = Object.fromEntries(formData);
            await this.simulateApiCall();
            
            this.showNotification('Successfully registered for the event!', 'success');
            
            // Store registration
            const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
            registrations.push({
                ...data,
                timestamp: new Date().toISOString(),
                id: Date.now()
            });
            localStorage.setItem('event_registrations', JSON.stringify(registrations));
            
        } catch (error) {
            this.showNotification('Sorry, there was an error with your registration. Please try again.', 'error');
        }
    }

    // Scroll Animations
    animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll:not(.animate-in)');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    animateOnLoad() {
        const elements = document.querySelectorAll('.animate-on-load');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 200);
        });
    }

    handleScroll() {
        this.animateOnScroll();
    }

    handleResize() {
        // Handle responsive adjustments
        const navMenu = document.querySelector('.nav-menu');
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    }

    checkForUpdates() {
        // Check for any updates or announcements
        const lastCheck = localStorage.getItem('last_update_check');
        const now = new Date().toISOString().split('T')[0];
        
        if (lastCheck !== now) {
            // Simulate checking for updates
            localStorage.setItem('last_update_check', now);
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChurchWebsite();
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChurchWebsite;
}