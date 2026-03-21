
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

document.addEventListener("DOMContentLoaded", () => {
    new Navbar();
})
