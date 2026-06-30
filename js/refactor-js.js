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

        if (this.section) {
            if (currentId === 'detail-autoscaling') {
                this.section.classList.add('light-mode');
            } else {
                this.section.classList.remove('light-mode');
            }
        }
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
                        behavior: 'auto'
                    });
                    this.navLinks.forEach(l => l.classList.remove(this.activeClass));
                    link.classList.add(this.activeClass);

                    if (this.section) {
                        if (targetId === '#detail-autoscaling') {
                            this.section.classList.add('light-mode');
                        } else {
                            this.section.classList.remove('light-mode');
                        }
                    }
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

class CapabilitiesAnimator {
    constructor(config = {}) {
        this.cards = document.querySelectorAll(config.selector || '.capabilities-card');
        this.threshold = config.threshold || 0.2;
        this.rootMargin = config.rootMargin || '0px 0px -50px 0px';

        if (!this.cards.length) {
            console.warn('CapabilitiesAnimator: no se encontraron tarjetas');
            return;
        }

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
                });
            }, {
                threshold: this.threshold,
                rootMargin: this.rootMargin
        });

        this.cards.forEach(card => observer.observe(card));
        this._observer = observer;
        } else {
            this.cards.forEach(card => card.classList.add('visible'));
        }
    }

    destroy() {
        if (this._observer) {
            this._observer.disconnect();
        }
    }
}

class FadeInAnimator {
    constructor(config = {}) {
        this.items = document.querySelectorAll(config.selector || '.mission-card, .project-card, .capabilities-card');
        this.threshold = config.threshold || 0.25;
        this.rootMargin = config.rootMargin || '0px 0px -80px 0px';

        if (!this.items.length) {
        console.warn('FadeInAnimator: no se encontraron elementos');
        return;
        }
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
            });
        }, {
            threshold: this.threshold,
            rootMargin: this.rootMargin
        });
        this.items.forEach(item => observer.observe(item));
        this._observer = observer;
        } else {
        this.items.forEach(item => item.classList.add('visible'));
        }
    }

    destroy() {
        if (this._observer) this._observer.disconnect();
    }
}

class StatsCounter {
    constructor(config = {}) {
        this.items = document.querySelectorAll(config.selector || '.stat-number');
        this.threshold = config.threshold || 0.3;
        this.duration = config.duration || 2000; // ms

        if (!this.items.length) {
            console.warn('StatsCounter: no se encontraron elementos');
            return;
        }
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const value = parseFloat(target.dataset.target);
                        this.animateNumber(target, value);
                        observer.unobserve(target);
                    }
                });
            }, {
                threshold: this.threshold,
                rootMargin: '0px 0px -50px 0px'
            });

            this.items.forEach(item => observer.observe(item));
            this._observer = observer;
        } else {
            this.items.forEach(item => {
                const value = parseFloat(item.dataset.target);
                item.textContent = this.formatNumber(value);
            });
        }
    }

    animateNumber(element, targetValue) {
        const startTime = performance.now();
        const duration = this.duration;
        const isDecimal = targetValue % 1 !== 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let current;

            if (isDecimal) {
                current = Math.floor(eased * targetValue * 10) / 10;
            } else {
                current = Math.floor(eased * targetValue);
            }

            if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else if (targetValue >= 1000000) {
                const millions = current / 1000000;
                if (millions >= 1) {
                    element.textContent = millions.toFixed(1) + 'M';
                } else {
                    element.textContent = Math.floor(current / 1000) + 'K';
                }
            } else if (targetValue >= 1000) {
                element.textContent = current.toLocaleString();
            } else {
                element.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = this.formatNumber(targetValue);
            }
        };

        requestAnimationFrame(update);
    }

    formatNumber(value) {
        if (value >= 1000000) {
            const millions = value / 1000000;
            if (millions % 1 === 0) {
                return millions.toFixed(0) + 'M';
            } else {
                return millions.toFixed(1) + 'M';
            }
        } else if (value >= 1000) {
            const thousands = value / 1000;
            if (thousands % 1 === 0) {
                return thousands.toFixed(0) + 'K';
            } else {
                return thousands.toFixed(1) + 'K';
            }
        } else {
            if (value % 1 !== 0) {
                return value.toFixed(1);
            }
            return value.toLocaleString();
        }
    }

    destroy() {
        if (this._observer) this._observer.disconnect();
    }
}


class CTASection {
  constructor(config = {}) {
    this.section = document.querySelector(config.selector || '.cta-section');
    this.threshold = config.threshold || 0.3;

    if (!this.section) {
      console.warn('CTASection: no se encontró la sección');
      return;
    }
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.section.classList.add('visible');
            observer.unobserve(this.section);
          }
        });
      }, {
        threshold: this.threshold,
        rootMargin: '0px 0px -80px 0px'
      });

      observer.observe(this.section);
      this._observer = observer;
    } else {
      this.section.classList.add('visible');
    }
  }

  destroy() {
    if (this._observer) this._observer.disconnect();
  }
}


document.addEventListener("DOMContentLoaded", () => {

    if (document.querySelector('.js-menu-toggle')) {
        new MobileMenu({
            toggleSelector: '.js-menu-toggle',
            menuSelector: '.nav-links',
            triggerSelector: '.drop-trigger',
            dropdownSelector: '.mega-dropdown',
            mobileBreakpoint: 768
        });
    }

    if (document.querySelector('.mega-dropdown')) {
        new MegaMenu(".mega-dropdown", 300);
    }


    if (document.querySelector('.lang-dropdown')) {
        new LangDropdown({
            containerSelector: '.lang-dropdown',
            toggleSelector: '.lang-toggle',
            menuSelector: '.lang-menu',
            currentLangSelector: '.current-lang',
            langLinksSelector: '.lang-menu a'
        }); 
    }

    if (document.querySelector('.col-nav')) {
        new TwoColSection({
            navLinksSelector: '.col-nav .nav-link',
            detailItemsSelector: '.detail-item',
            sectionSelector: '.two-col-section',
            nextSectionSelector: '#next-section',
            scrollOffset: 100,
            activeClass: 'active'
        });
    }

    if (document.querySelector('.testimonial-carousel')) {
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
    }

    if (typeof TimelineAnimator !== 'undefined' && document.querySelector('.timeline-h-item')) {
        new TimelineAnimator({
        itemSelector: '.timeline-h-item',
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
        });
    }

    if (typeof CapabilitiesAnimator !== 'undefined' && document.querySelector('.capabilities-card')) {
        new CapabilitiesAnimator({
        selector: '.capabilities-card',
        threshold: 0.25,
        rootMargin: '0px 0px -80px 0px'
        });
    }

    if (document.querySelector('.mission-card')) {
        new FadeInAnimator({
        selector: '.mission-card',
        threshold: 0.25,
        rootMargin: '0px 0px -60px 0px'
        });
    }

    if (document.querySelector('.stat-number')) {
        new StatsCounter({
        selector: '.stat-number',
        threshold: 0.3,
        duration: 2000
        });
    }

new CTASection({
    selector: '.cta-section',
    threshold: 0.3
  });

});