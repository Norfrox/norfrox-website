
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

document.addEventListener("DOMContentLoaded", () => {
    new Navbar();
    new FAQCarousel();
    new Tabs();
})
