// DOM Ready
document.addEventListener("DOMContentLoaded", function() {

    // --- Header Scroll Effect, Mobile Menu & Logo Swap ---
    const header = document.querySelector('.header');
    const headerLogoImg = document.querySelector('.header__logo-img'); 
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelectorAll('.nav__link, .header__btn');

    function updateHeaderState() {
        const isScrolled = window.scrollY > 50;
        const isMenuOpen = header.classList.contains('header--menu-open');

        if (isScrolled || isMenuOpen) {
            header.classList.add('header--scrolled');
            headerLogoImg.src = 'media/logo_h_blck.svg'; 
        } else {
            header.classList.remove('header--scrolled');
            headerLogoImg.src = 'media/logo_h_monowht.svg'; 
        }
    }

    window.addEventListener('scroll', updateHeaderState);

    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            header.classList.toggle('header--menu-open');
            updateHeaderState();
        });
    }

    // Close menu when a link is clicked on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 992) {
                burger.classList.remove('is-active');
                header.classList.remove('header--menu-open');
                updateHeaderState();
            }
        });
    });

    // --- Register GSAP ScrollTrigger ---
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Parallax Animations ---
    gsap.to(".hero__sky-back", { yPercent: 30, scrollTrigger: { trigger: ".paralax-hero", start: "top top", end: "bottom top", scrub: true }});
    gsap.to(".hero__content", { yPercent: -50, scrollTrigger: { trigger: ".paralax-hero", start: "top top", end: "bottom top", scrub: true }});
    gsap.to(".hero__mountains-front", { yPercent: 50, scrollTrigger: { trigger: ".paralax-hero", start: "top top", end: "bottom top", scrub: true }});

    // --- Hero Content Initial Load Animation ---
    const heroContentTl = gsap.timeline({ delay: 0.3 });
    
    heroContentTl.from('.hero__large-logo', { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" })
                 .from('.hero__title', { x: 30, opacity: 0, duration: 0.8 }, '-=0.8')
                 .from('.hero__subtitle', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
                 .from('.hero__actions .btn-primary', { 
                     y: 20, 
                     opacity: 0, 
                     duration: 0.6, 
                     clearProps: "all" 
                 }, '-=0.2');

    // --- Services Accordion Wow-Effect ---
    const panels = document.querySelectorAll('.service-panel');
    let activePanel = null;

    panels.forEach((panel) => {
        const body = panel.querySelector('.service-panel__body');
        const subtitle = panel.querySelector('.service-panel__subtitle');
        const closeBtn = panel.querySelector('.service-panel__close');

        gsap.set(body, { height: 0, opacity: 0, marginTop: 0 });
        gsap.set(closeBtn, { autoAlpha: 0, scale: 0.8 });

        panel.addEventListener('click', (e) => {
            if (e.target === closeBtn) return;
            if (activePanel === panel) return;

            if (activePanel) {
                activePanel.classList.remove('active');
                gsap.to(activePanel.querySelector('.service-panel__body'), { height: 0, opacity: 0, marginTop: 0, duration: 0.4, ease: 'power2.inOut' });
                gsap.to(activePanel.querySelector('.service-panel__subtitle'), { opacity: 0.8, duration: 0.3 });
                gsap.to(activePanel.querySelector('.service-panel__close'), { autoAlpha: 0, scale: 0.8, duration: 0.3 });
            }

            panel.classList.add('active');
            gsap.to(subtitle, { opacity: 0.3, duration: 0.3 });
            gsap.to(body, { height: 'auto', opacity: 1, marginTop: 20, duration: 0.6, ease: 'power2.out', delay: 0.2 });
            gsap.to(closeBtn, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.3 });
            activePanel = panel;
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('active');
            gsap.to(body, { height: 0, opacity: 0, marginTop: 0, duration: 0.4, ease: 'power2.inOut' });
            gsap.to(subtitle, { opacity: 0.8, duration: 0.3, delay: 0.2 });
            gsap.to(closeBtn, { autoAlpha: 0, scale: 0.8, duration: 0.3 });
            activePanel = null;
        });
    });

    // --- ANIMATED LOGISTICS FLOW (How It Works) ---
    gsap.to('.flow-line__progress-wrap', {
        height: '100%', ease: 'none',
        scrollTrigger: { trigger: '.flow-wrapper', start: 'top 85%', end: 'bottom 85%', scrub: true }
    });

    const flowSteps = document.querySelectorAll('.flow-step');
    flowSteps.forEach((step, index) => {
        const icon = step.querySelector('.flow-step__icon-wrap');
        const content = step.querySelector('.flow-step__content');
        
        const isEven = index % 2 !== 0; 
        gsap.set(content, { x: isEven ? 40 : -40, opacity: 0 }); 
        gsap.set(icon, { scale: 0, opacity: 0 });

        const stepTl = gsap.timeline({
            scrollTrigger: { trigger: step, start: 'top 90%', toggleActions: 'play none none reverse' }
        });

        stepTl.to(icon, { 
                scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)",
                onStart: () => step.classList.add('flow-step--active'),
                onReverseComplete: () => step.classList.remove('flow-step--active')
            })
            .to(content, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");
    });

    // --- Stats Counter Animation ---
    const statsSection = document.querySelector('.stats-reviews');
    if (statsSection) {
        const statNumbers = document.querySelectorAll('.stat-number');
        gsap.set('.stat-item', { y: 30, opacity: 0 });

        ScrollTrigger.create({
            trigger: '.stats-grid',
            start: 'top 85%',
            once: true, 
            onEnter: () => {
                gsap.to('.stat-item', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
                statNumbers.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    const suffix = stat.getAttribute('data-suffix') || '';
                    gsap.to(stat, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 }, 
                        ease: "power2.out",
                        onUpdate: function() {
                            stat.innerText = Math.ceil(this.targets()[0].innerText) + suffix;
                        }
                    });
                });
            }
        });

        gsap.from('.testimonials-wrapper', {
            y: 40, opacity: 0, duration: 0.8, delay: 0.5,
            scrollTrigger: { trigger: '.stats-reviews', start: 'top 75%', once: true }
        });
    }

    // --- Coverflow Carousel Logic ---
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (cards.length > 0) {
        let currentIndex = 0; 
        const totalCards = cards.length;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right');
                
                if (index === currentIndex) {
                    card.classList.add('active'); 
                } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
                    card.classList.add('prev'); 
                } else if (index === (currentIndex + 1) % totalCards) {
                    card.classList.add('next'); 
                } else {
                    let diff = (index - currentIndex + totalCards) % totalCards;
                    if (diff > totalCards / 2) {
                        card.classList.add('hidden-left');
                    } else {
                        card.classList.add('hidden-right');
                    }
                }
            });
        }

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if(card.classList.contains('prev') || card.classList.contains('next')) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- Scroll Animations for other sections ---
    gsap.from('.services .section-title, .services__accordion', { y: 40, opacity: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.services', start: 'top 85%', toggleActions: 'play none none none' }});
    gsap.from('.why-us .section-title, .why-us__grid > *, .why-us__image-placeholder', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: '.why-us', start: 'top 85%', toggleActions: 'play none none none' }});
    gsap.from('.contact .section-title, .contact__desc, .contact__info, .contact__form', { y: 30, opacity: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.contact__content', start: 'top 85%', toggleActions: 'play none none none' }});
    gsap.from('.footer__col', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: '.footer', start: 'top 95%', toggleActions: 'play none none none' }});

});