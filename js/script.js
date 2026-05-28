
class Navbar{

    constructor(){
        this.menuToggle = document.querySelector(".js-menu-toggle");
        this.navCenter = document.querySelector(".nav-center");
        this.links = document.querySelectorAll(".js-nav-link");
        this.currentPath = window.location.pathname;
        this.init();
    }

    init(){
        this.setActiveLink();
        this.toggleMenu();
    }

    setActiveLink(){
        this.links.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if(this.currentPath === linkPath || 
                (this.currentPath === "/" && linkPath === "/")){
                    link.classList.add("active");
            }
        });
    }

    toggleMenu(){
        this.menuToggle.addEventListener("click", () => {
            this.navCenter.classList.toggle("active");
        })
    }
}

class Tabs {

    constructor(){
        this.buttons = document.querySelectorAll(".tab-btn");
        this.panels = document.querySelectorAll(".tab-panel");
        if (!this.buttons.length) return;
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener("click", () => {
                this.switchTab(button);
            });
        });
    }

    switchTab(button) {
        const target = button.dataset.tab;

        this.buttons.forEach(btn => btn.classList.remove("active"));
        this.panels.forEach(panel => panel.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(target).classList.add("active");
    }
}

class TestimonialCarousel {

    constructor() {
        this.cards = document.querySelectorAll(".testimonial-card");
        this.nextBtn = document.querySelector(".js-testimonial-next");
        this.prevBtn = document.querySelector(".js-testimonial-prev");
        this.currentIndex = 0;
        this.interval = null;

        if (!this.cards.length) return;

        this.init();
    }

    init() {
        this.showCard(this.currentIndex);

        this.nextBtn?.addEventListener("click", () => 
            {
                this.next();
                this.resetAutoPlay();
            });
        this.prevBtn?.addEventListener("click", () => 
            {
                this.prev();
                this.resetAutoPlay();
            });

        this.startAutoPlay();
    }

    startAutoPlay() {
        this.interval = setInterval(() => this.next(), 6000);
    }

    resetAutoPlay() {
        if(this.interval) {
            clearInterval(this.interval);
        }

        this.startAutoPlay();
    }

    showCard(index) {
        this.cards.forEach(card => card.classList.remove("active"));
        this.cards[index].classList.add("active");
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.showCard(this.currentIndex);
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.showCard(this.currentIndex);
    }
}

class FAQAccordion {

    constructor() {

        this.items = document.querySelectorAll(".faq-item");

        if(!this.items.length) return;

        this.init();
    }

    init() {

        this.items.forEach(item => {

            const question = item.querySelector(".faq-question");

            question.addEventListener("click", () => {

                const isActive = item.classList.contains("active");

                this.items.forEach(el => {
                    el.classList.remove("active");
                });

                if(!isActive){
                    item.classList.add("active");
                }

            });

        });

    }

}

class CounterAnimator {

    constructor () {

        this.cards = document.querySelectorAll(".stat-card");
        this.section = document.querySelector(".counter-cards");

        if(!this.cards.length || !this.section) return;

        this.observeSection();
    }

    init() {

        this.cards.forEach((card) => {

            const counter = card.querySelector('[data-counter]');

            if (!counter) return;

            const limit = Number(card.dataset.limit || 0);
            const begin = Number(card.dataset.begin || 0);

            let current = 1;

            const showNumber = () => {

                counter.classList.remove(
                    "animate-entry",
                    "animate-exit"
                );

                void counter.offsetWidth;

                counter.classList.add("animate-entry");

                setTimeout(() => {

                    counter.textContent = current;

                    counter.classList.remove("animate-entry");

                    counter.classList.add("animate-exit");

                }, 120);

                current++;


                let delay = 90;

                if(current >= limit - 1){
                    delay = 420;
                }

                if(current <= limit){
                    setTimeout(showNumber, delay);
                }

            };

            setTimeout(showNumber, begin);

        });

    }

    observeSection() {

        const observer = new IntersectionObserver((entries, obs) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                this.init();

                obs.unobserve(entry.target);

            });

        }, {
            threshold: 0.35
        });

        observer.observe(this.section);

    }

}


document.addEventListener("DOMContentLoaded", () => {
    new Navbar();
    new Tabs();
    new TestimonialCarousel();
    new FAQAccordion();
    new CounterAnimator();
})
