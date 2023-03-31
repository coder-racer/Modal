class Modal {
    static #zindex = 60;
    static #modalCounter = 1;
    static #modalList = [];
    static #openModals = [];

    static #getNewModalId() {
        return this.#modalCounter++;
    }

    static #getZIndex() {
        return this.#zindex++;
    }

    static getModals() {
        return this.#modalList;
    }

    static create(config = {}) {
        let modal = new Modal(config);
        this.#modalList.push(modal)
        return modal;
    }

    static getOpenModals() {
        return Modal.#openModals
    }

    static #getModal(title, body, index, z_index) {
        return `
            <div data-id="${index}" class="modal " style="--z-index: ${z_index}">
                <div class="title">${title}</div>
                <div class="close">✖</div>
                <div class="modal_body">
                    ${body}
                </div>
            </div>
        `
    }

    config = {
        title: "Настройки",
        body: '',
        show: true,
        type: "fit-content",
        autoRemove: true,
        autoClose: 1500,
        autoCloseTime: true,

    }

    index = -1
    zIndex = -1

    constructor(config) {
        this.config = {...this.config, ...config}
        this.index = Modal.#getNewModalId();
        if (this.config.show) {
            this.show();
        }
    }

    show() {
        this.#renderModal()

        Modal.#openModals.push(this)

        window.requestAnimationFrame(() => {
            document.querySelector(".modal_background").classList.add("modal_background_active")
            document.querySelector(`.modal[data-id="${this.index}"]`).classList.add("modal_active");
        })

        if (this.config.autoClose) {
            setTimeout(() => {
                this.close();
            }, this.config.autoCloseTime);
        }
    }

    close() {
        Modal.#openModals = Modal.#openModals.filter((el) => {
            return el !== this
        });

        if (!Modal.getOpenModals().length)
            document.querySelector(".modal_background").classList.remove("modal_background_active")

        document.querySelector(`.modal[data-id="${this.index}"]`).classList.remove("modal_active");

        if (this.config.autoRemove)
            setTimeout(() => this.remove(), 2000);
    }

    remove() {
        Modal.#modalList.forEach((el, index) => {
            Modal.#modalList.splice(index, 1)
        })

        document.querySelector(`.modal[data-id="${this.index}"]`).remove()
    }

    #renderModal() {
        if (!document.querySelector(`.modal[data-id="${this.index}"]`)) {
            let html = Modal.#getModal(this.config.title, this.config.body, this.index, Modal.#getZIndex())

            document.body.insertAdjacentHTML('beforeend', html)
            document.querySelector(`.modal[data-id="${this.index}"]`).querySelector(".close").addEventListener('click', () => {
                this.close()
            })
        }

        if (!document.querySelector(".modal_background")) {
            document.body.insertAdjacentHTML("beforeend", `<div class="modal_background"></div>`)
        }
    }

}
