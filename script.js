/* ==========================================================================
   CHAITANYA CONSTRUCTIONS - PREMIUM INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Preloader Screen ---
    const preloader = document.getElementById('preloader');
    
    const dismissPreloader = () => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
        }
    };

    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, 1800); // safety fallback


    // --- 2. Scroll Progress & Header Styles ---
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    const handleScrollTransitions = () => {
        const scrollY = window.scrollY;
        
        // Sticky Header color transitions
        if (scrollY > 60) {
            header.classList.add('scroll-scrolled');
            header.classList.remove('hero-transparent');
        } else {
            header.classList.remove('scroll-scrolled');
            // Make transparent on top to blend with dark hero image
            header.classList.add('hero-transparent');
        }

        // Scroll Progress calculation
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (documentHeight > 0) {
            const percentage = (scrollY / documentHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = `${percentage}%`;
            }
        }

        // Back to top floating button visibility
        if (scrollY > 500) {
            if (backToTopBtn) backToTopBtn.style.opacity = '1';
        } else {
            if (backToTopBtn) backToTopBtn.style.opacity = '0.5';
        }
    };

    window.addEventListener('scroll', handleScrollTransitions);
    // Execute immediately to set initial states
    handleScrollTransitions();


    // --- 3. Statistics Count-Up Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const countUpStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            let startTime = null;

            const step = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentVal = Math.floor(progress * target);
                
                stat.textContent = currentVal;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    stat.textContent = target; // force absolute target at end
                }
            };

            window.requestAnimationFrame(step);
        });
    };

    // Observer to trigger countUpStats when statistics become visible
    const statsSection = document.getElementById('hero');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    setTimeout(countUpStats, 400); // short delay after preloader
                    animatedStats = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        statsObserver.observe(statsSection);
    }


    // --- 4. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- 5. Scroll Spy Navigation Highlight ---
    const spySections = document.querySelectorAll('.scroll-spy-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -50% 0px' });

    spySections.forEach(sec => spyObserver.observe(sec));


    // --- 6. Mobile Menu Navigation Hamburger ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
            menuToggle.classList.toggle('toggle-active');
            navMenu.classList.toggle('menu-active');
            header.classList.toggle('toggle-active-header');
            document.body.classList.toggle('no-scroll');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('toggle-active');
                navMenu.classList.remove('menu-active');
                header.classList.remove('toggle-active-header');
                document.body.classList.remove('no-scroll');
            });
        });
    }


    // --- 7. Projects Filters ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.96)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('filter-hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('filter-hide');
                    }
                }, 300);
            });
        });
    });


    // --- 8. Interactive FAQ Accordion Accordions ---
    const faqQuestions = document.querySelectorAll('.faq-question-btn');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isActive = faqItem.classList.contains('faq-active');

            // Close all other FAQ items first
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('faq-active');
                item.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
            });

            // Toggle active state for current question
            if (!isActive) {
                faqItem.classList.add('faq-active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // --- 9. Quote Request Form Validations ---
    const contactForm = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+0-9\s-]{10,15}$/;

    const validateInputField = (input) => {
        const group = input.parentElement;
        let valid = true;

        if (input.required && !input.value.trim()) {
            valid = false;
        } else if (input.type === 'email' && input.value.trim() && !emailPattern.test(input.value.trim().toLowerCase())) {
            valid = false;
        } else if (input.type === 'tel' && input.value.trim() && !phonePattern.test(input.value.trim())) {
            valid = false;
        }

        if (valid) {
            group.classList.remove('input-error');
        } else {
            group.classList.add('input-error');
        }

        return valid;
    };

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => validateInputField(input));
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('input-error');
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let formValid = true;
            inputs.forEach(input => {
                if (!validateInputField(input)) {
                    formValid = false;
                }
            });

            if (formValid) {
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.querySelector('span').textContent;
                const icon = submitBtn.querySelector('i');

                submitBtn.disabled = true;
                submitBtn.querySelector('span').textContent = "Processing Quote...";
                if (icon) icon.className = "fa-solid fa-spinner fa-spin btn-icon";

                // Simulate processing latency (1.6 seconds)
                setTimeout(() => {
                    contactForm.classList.add('form-hidden');
                    
                    setTimeout(() => {
                        successOverlay.classList.add('success-visible');
                        
                        // Reset button states
                        submitBtn.disabled = false;
                        submitBtn.querySelector('span').textContent = originalText;
                        if (icon) icon.className = "fa-solid fa-paper-plane btn-icon";
                    }, 300);
                }, 1600);
            }
        });
    }

    if (resetFormBtn && contactForm) {
        resetFormBtn.addEventListener('click', () => {
            contactForm.reset();
            successOverlay.classList.remove('success-visible');
            
            setTimeout(() => {
                contactForm.classList.remove('form-hidden');
            }, 300);
        });
    }
});
