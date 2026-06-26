class MobileMenu {

    constructor({
        toggleSelector,
        menuSelector,
        triggerSelector,
        dropdownSelector,
        mobileBreakpoint = 768
    }) {

        this.toggle = document.querySelector(toggleSelector);
        this.menu = document.querySelector(menuSelector);

        this.triggerSelector = triggerSelector;
        this.dropdownSelector = dropdownSelector;

        this.mobileBreakpoint = mobileBreakpoint;

        this.init();
    }

    init() {

        if (!this.toggle || !this.menu) {
            return;
        }

        this.bindToggle();
        this.bindOutsideClick();
        this.bindDropdowns();
    }

    bindToggle() {

        this.toggle.addEventListener("click", (event) => {

            event.stopPropagation();

            this.menu.classList.toggle("active");

        });

    }

    bindOutsideClick() {

        document.addEventListener("click", (event) => {

            const clickedInsideMenu =
                this.menu.contains(event.target);

            const clickedToggle =
                this.toggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {

                this.closeMenu();

            }

        });

    }

    bindDropdowns() {

        const triggers = document.querySelectorAll(
            this.triggerSelector
        );

        triggers.forEach(trigger => {

            trigger.addEventListener("click", (event) => {

                if (window.innerWidth > this.mobileBreakpoint) {
                    return;
                }

                event.preventDefault();

                const dropdown =
                    trigger.closest(this.dropdownSelector);

                const menu =
                    dropdown?.querySelector(".mega-menu");

                if (!menu) {
                    return;
                }

                this.closeOtherDropdowns(menu);

                menu.classList.toggle("open");

            });

        });

    }

    closeMenu() {

        this.menu.classList.remove("active");

    }

    closeOtherDropdowns(currentMenu) {

        document
            .querySelectorAll(".mega-menu.open")
            .forEach(menu => {

                if (menu !== currentMenu) {
                    menu.classList.remove("open");
                }

            });

    }

}

class MegaMenu {

    constructor(selector, closeDelay = 250) {

        this.dropdowns = document.querySelectorAll(selector);
        this.closeDelay = closeDelay;

        this.activeDropdown = null;
        this.closeTimer = null;

        this.init();
    }

    init() {

        this.dropdowns.forEach(dropdown => {

            dropdown.addEventListener("mouseenter", () => {

                clearTimeout(this.closeTimer);

                if (
                    this.activeDropdown &&
                    this.activeDropdown !== dropdown
                ) {
                    this.activeDropdown.classList.remove("open");
                }

                dropdown.classList.add("open");
                this.activeDropdown = dropdown;

            });

            dropdown.addEventListener("mouseleave", () => {

                this.closeTimer = setTimeout(() => {

                    dropdown.classList.remove("open");

                    if (this.activeDropdown === dropdown) {
                        this.activeDropdown = null;
                    }

                }, this.closeDelay);

            });

        });

        document.addEventListener("mouseleave", () => {

            this.closeAll();

        });

    }

    closeAll() {

        this.dropdowns.forEach(dropdown => {

            dropdown.classList.remove("open");

        });

        this.activeDropdown = null;
    }

}

class LangDropdown {
    constructor({
        containerSelector = '.lang-dropdown',
        toggleSelector = '.lang-toggle',
        menuSelector = '.lang-menu',
        currentLangSelector = '.current-lang',
        langLinksSelector = '.lang-menu a',
    } = {}) {

        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.toggle = this.container.querySelector(toggleSelector);
        this.menu = this.container.querySelector(menuSelector);
        this.currentLangEl = this.container.querySelector(currentLangSelector);
        this.langLinks = this.container.querySelectorAll(langLinksSelector);

        if (!this.toggle || !this.menu) return;

        this.init();
    }

    init() {
        this.bindToggle();
        this.bindOutsideClick();
        this.bindLangLinks();
    }

    bindToggle() {
        this.toggle.addEventListener("click", (event) => {
            event.stopPropagation();
            this.container.classList.toggle("open");
        });
    }

    bindOutsideClick() {
        document.addEventListener("click", (event) => {
            if (!this.container.contains(event.target)) {
                this.close();
            }
        });
    }

    bindLangLinks() {
        this.langLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const lang = link.dataset.lang;
                if (lang && this.currentLangEl) {
                    this.currentLangEl.textContent = lang.toUpperCase();
                }
                this.close();
                this.onLanguageChange(lang);
            });
        });
    }

    close() {
        this.container.classList.remove("open");
    }

    onLanguageChange(lang) {
        console.log(`Idioma cambiado a: ${lang}`);
    }
}

class TwoColSection {
    constructor({
        navLinksSelector = '.col-nav .nav-link',
        detailItemsSelector = '.detail-item',
        sectionSelector = '.two-col-section',
        nextSectionSelector = '#next-section',
        scrollOffset = 80,
        activeClass = 'active'
    } = {}) {
        this.navLinks = document.querySelectorAll(navLinksSelector);
        this.detailItems = document.querySelectorAll(detailItemsSelector);
        this.section = document.querySelector(sectionSelector);
        this.nextSection = document.querySelector(nextSectionSelector);
        this.scrollOffset = scrollOffset;
        this.activeClass = activeClass;

        if (!this.navLinks.length || !this.detailItems.length) {
            console.warn('TwoColSection: elementos no encontrados');
            return;
        }
    this.init();
    }

    init() {
        this.bindScroll();
        this.bindClicks();
        this.observeSectionEnd();
        setTimeout(() => this.updateActiveLink(), 100);
    }

    updateActiveLink() {
        let currentId = '';
        const scrollPosition = window.scrollY + this.scrollOffset + 40; 
        this.detailItems.forEach(item => {
        const offsetTop = item.offsetTop;
        const offsetBottom = offsetTop + item.offsetHeight;
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            currentId = item.id;
        }
        });

        this.navLinks.forEach(link => {
            link.classList.remove(this.activeClass);
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add(this.activeClass);
            }
        });
    }

    bindScroll() {
        const throttledUpdate = this.throttle(() => this.updateActiveLink(), 100);
        window.addEventListener('scroll', throttledUpdate);
        window.addEventListener('resize', throttledUpdate);
    }

    bindClicks() {
        this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - this.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                this.navLinks.forEach(l => l.classList.remove(this.activeClass));
                link.classList.add(this.activeClass);
            }
        });
        });
    }

    observeSectionEnd() {
        if (!this.section || !this.nextSection) return;

        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
            this.nextSection.scrollIntoView({ behavior: 'smooth' });
            observer.disconnect();
            }
        });
        }, {
            threshold: 0,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(this.section);
    }

    throttle(fn, delay) {
        let lastCall = 0;
        return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(this, args);
        }
        };
    }
}

class TestimonialCarousel {
    constructor(config) {
        this.testimonials = config.testimonials || [];
        this.container = document.querySelector(config.containerSelector || '.testimonial-carousel');
        this.textElement = this.container.querySelector('.testimonial-text');
        this.authorElement = this.container.querySelector('.testimonial-author');
        this.roleElement = this.container.querySelector('.testimonial-role');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        this.intervalTime = config.intervalTime || 5000;
        this.typingSpeed = config.typingSpeed || 20;
        this.currentIndex = 0;
        this.typingTimer = null;
        this.intervalTimer = null;
        this.isTyping = false;
        this.init();
    }

    init() {
        if (!this.testimonials.length) return;
        this.createDots();
        this.showTestimonial(0);
        this.startAutoPlay();
    }

    createDots() {
        this.testimonials.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.dataset.index = i;
        dot.addEventListener('click', () => this.goTo(i));
        this.dotsContainer.appendChild(dot);
        });
    }

    goTo(index) {
        if (this.isTyping) return;
        clearTimeout(this.intervalTimer);
        this.currentIndex = index;
        this.showTestimonial(index);
        this.startAutoPlay();
    }

    showTestimonial(index) {
        const testimonial = this.testimonials[index];
        if (!testimonial) return;
        document.querySelectorAll('.carousel-dots span').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        });
        this.typeText(testimonial.text, testimonial.author, testimonial.role);
    }

    typeText(text, author, role) {
        this.isTyping = true;
        this.textElement.textContent = '';
        this.authorElement.textContent = '';
        this.roleElement.textContent = '';
        const height = this.textElement.offsetHeight;
        this.textElement.style.minHeight = `${height}px`;

        let charIndex = 0;
        clearInterval(this.typingTimer);
        const typeAuthorAndRole = () => {
        let authorIndex = 0;
        let roleIndex = 0;

        const authorTimer = setInterval(() => {
            if (authorIndex < author.length) {
            this.authorElement.textContent += author.charAt(authorIndex);
            authorIndex++;
            } else {
            clearInterval(authorTimer);
            // Escribir rol
            const roleTimer = setInterval(() => {
                if (roleIndex < role.length) {
                this.roleElement.textContent += role.charAt(roleIndex);
                roleIndex++;
                } else {
                clearInterval(roleTimer);
                this.isTyping = false;
                clearTimeout(this.intervalTimer);
                this.intervalTimer = setTimeout(() => this.next(), this.intervalTime);
                }
            }, this.typingSpeed);
            }
        }, this.typingSpeed);
        };

        this.typingTimer = setInterval(() => {
        if (charIndex < text.length) {
            this.textElement.textContent += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(this.typingTimer);
            setTimeout(typeAuthorAndRole, 300);
        }
        }, this.typingSpeed);
    }

    next() {
        if (this.isTyping) return;
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goTo(nextIndex);
    }

    startAutoPlay() {
        clearTimeout(this.intervalTimer);
        this.intervalTimer = setTimeout(() => {
        this.next();
        }, this.intervalTime);
    }

    destroy() {
        clearInterval(this.typingTimer);
        clearTimeout(this.intervalTimer);
    }
}

class TimelineAnimator {
    constructor(config = {}) {
        this.items = document.querySelectorAll(config.itemSelector || '.timeline-h-item');
        this.observerOptions = {
        threshold: config.threshold || 0.3,
        rootMargin: config.rootMargin || '0px 0px -50px 0px'
        };
        this.observer = null;

        if (!this.items.length) {
        console.warn('TimelineAnimator: no se encontraron elementos con el selector especificado.');
        return;
        }

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
            });
        }, this.observerOptions);

        this.items.forEach(item => this.observer.observe(item));
        } else {
        this.items.forEach(item => item.classList.add('visible'));
        }
    }

    destroy() {
        if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
        }
    }
    refresh() {
        this.destroy();
        this.init();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MobileMenu({
        toggleSelector: '.js-menu-toggle',
        menuSelector: '.nav-links',
        triggerSelector: '.drop-trigger',
        dropdownSelector: '.mega-dropdown',
        mobileBreakpoint: 768
    });
    new MegaMenu(".mega-dropdown", 300);
    new LangDropdown({
        containerSelector: '.lang-dropdown',
        toggleSelector: '.lang-toggle',
        menuSelector: '.lang-menu',
        currentLangSelector: '.current-lang',
        langLinksSelector: '.lang-menu a'
    });    
    new TwoColSection({
        navLinksSelector: '.col-nav .nav-link',
        detailItemsSelector: '.detail-item',
        sectionSelector: '.two-col-section',
        nextSectionSelector: '#next-section',
        scrollOffset: 80,
        activeClass: 'active'
    });


    const testimonials = [
        {
            text: "Norfrox supported us in developing our website and strengthening our digital presence. Thanks to their work, we’ve been able to reach more clients and project a much more professional image for our company.",
            author: "Javier Godinez",
            role: "Founder & CEO, Servicios Industriales de Aguascalientes"
        },
        {
            text: "I decided to trust Norfrox for the development of my online store, and they exceeded my expectations. They delivered exactly what was promised, with outstanding quality. Highly recommended.",
            author: "Francisco Esparza",
            role: "Lead Developer at Darwiins"
        },
        {
            text: "They developed a platform for our restaurant that significantly improved our day-to-day operations. The final result exceeded our expectations and now makes our daily work much easier.",
            author: "Roberts C.",
            role: "Restaurant Owner"
        }
    ];

    new TestimonialCarousel({
        containerSelector: '.testimonial-carousel',
        testimonials: testimonials,
        intervalTime: 6000,
        typingSpeed: 20
    });

    new TimelineAnimator({
        itemSelector: '.timeline-h-item',
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

});