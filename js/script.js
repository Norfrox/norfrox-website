
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

class FAQCarousel{
    
    constructor(){
        this.track = document.querySelector(".js-faq-track");
        this.nextBtn = document.querySelector(".faq-nav.next");
        this.prevBtn = document.querySelector(".faq-nav.prev");

        if(!this.track) return

        this.init();
    }

    init(){
        this.nextBtn?.addEventListener("click", () => this.scrollNext());
        this.prevBtn?.addEventListener("click", () => this.scrollPrev());
    }

    scrollNext(){
        const card = this.track.querySelector(".faq-card");
        const gap = 20;

        const scrollAmount = card.offsetWidth + gap;

        this.track.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
    }

    scrollPrev(){
        const card = this.track.querySelector(".faq-card");
        const gap = 20;

        const scrollAmount = card.offsetWidth + gap;

        this.track.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });
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

document.addEventListener("DOMContentLoaded", () => {
    new Navbar();
    new FAQCarousel();
    new Tabs();
    new TestimonialCarousel();
})
