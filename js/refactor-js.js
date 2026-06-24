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
});