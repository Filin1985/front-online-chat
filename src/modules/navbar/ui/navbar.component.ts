import {UsersApiServiceInterface, UsersProfileResponse} from "../../users/service/users-api.types";
import {StorageServiceInterface} from "../../../shared/services/storage.service";
import {UserContextServiceInterface} from "../../../shared/services/user-context.service";

export interface NavbarComponentInterface {
    render: () => void
}

export default class NavbarComponent implements NavbarComponentInterface{
    private navEl: HTMLElement | null =null
    private divEl: HTMLDivElement | null = null
    private logoEl: HTMLAnchorElement | null = null
    private buttonEl: HTMLButtonElement | null = null
    private spanEl: HTMLSpanElement | null = null
    private collapseEl: HTMLDivElement | null = null
    private ulEl: HTMLUListElement | null = null
    private signInEl: HTMLAnchorElement | null = null
    private signInButtonEl: HTMLButtonElement | null = null
    private headerEl: HTMLElement | null = null
    private dropdownEl: HTMLDivElement | null = null

    constructor(
        headerEl: HTMLElement | null,
        private userApiService: UsersApiServiceInterface,
        private storageService: StorageServiceInterface,
        private userContextService: UserContextServiceInterface
    ) {
        this.headerEl = headerEl

        this.userContextService.subscribe((userData) => {
            this.updateDropdown(userData)
        })
    }

    async render() {
        this.createNavEl()
        this.creatContainerDivEl()
        this.createLogoLinkEl()
        this.createCollapseButtonEl()
        this.createSpanEl()
        this.createCollapseDivEl()
        this.createUlEl()
        this.createSignInLinkEl()
        this.createSignInButtonEl()

        if (this.headerEl && this.navEl && this.divEl && this.logoEl && this.buttonEl && this.spanEl && this.collapseEl && this.ulEl && this.signInEl && this.signInButtonEl) {
            this.navEl.appendChild(this.divEl)
            this.divEl.appendChild(this.logoEl)
            this.divEl.appendChild(this.buttonEl)
            this.buttonEl.appendChild(this.spanEl)
            this.divEl.appendChild(this.collapseEl)
            this.collapseEl.appendChild(this.ulEl)
            this.collapseEl.appendChild(this.signInEl)

            const userProfile = await this.userContextService.fetchUser()

            // Условный рендер
            if (userProfile) {
                const dropdownEl = this.createDropdownEl(userProfile.name)
                this.dropdownEl = dropdownEl
                this.signInEl.appendChild(dropdownEl)
            }
            else {
                this.signInEl.appendChild(this.signInButtonEl)
            }

            this.headerEl.appendChild(this.navEl)
        }
    }

    private updateDropdown(userProfile: UsersProfileResponse | null) {
        if (userProfile && this.dropdownEl) {
            const buttonInDropdown = this.dropdownEl.querySelector('button') as HTMLButtonElement
            buttonInDropdown.innerText = userProfile?.name || 'Username'
        }
    }

    private createNavEl() {
        const navEl = document.createElement('nav')
        navEl.className = 'navbar navbar-expand-lg bg-body-tertiary'

        this.navEl = navEl
    }

    private creatContainerDivEl() {
        const divEl = document.createElement('div')
        divEl.className = 'container-fluid'

        this.divEl = divEl
    }

    private createLogoLinkEl() {
        const logoEl = document.createElement('a')
        logoEl.className = 'navbar-brand'
        logoEl.href = '/'
        logoEl.innerText = 'Online chat'

        this.logoEl = logoEl
    }

    private createCollapseButtonEl() {
        const buttonEl = document.createElement('button')
        buttonEl.className = 'navbar-toggler'
        buttonEl.type = 'button'
        buttonEl.dataset.bsToggle = 'collapse'
        buttonEl.dataset.bsTarget = '#navbarSupportedContent'
        buttonEl.setAttribute('aria-controls', 'navbarSupportedContent')
        buttonEl.setAttribute('aria-expanded', 'false')

        this.buttonEl = buttonEl
    }

    private createSpanEl() {
        const spanEl = document.createElement('span')
        spanEl.className = 'navbar-toggler-icon'

        this.spanEl = spanEl
    }

    private createCollapseDivEl() {
        const collapseEl = document.createElement('div')
        collapseEl.className = 'collapse navbar-collapse'
        collapseEl.id = 'navbarSupportedContent'

        this.collapseEl = collapseEl
    }

    private createUlEl() {
        const ulEl = document.createElement('ul')
        ulEl.className = 'navbar-nav me-auto mb-2 mb-lg-0'

        this.ulEl = ulEl
    }

    private createSignInLinkEl() {
        const signInEl = document.createElement('a')
        signInEl.href = '/sign-in'

        this.signInEl = signInEl
    }

    private createSignInButtonEl() {
        const signInButtonEl = document.createElement('button')
        signInButtonEl.className = 'btn btn-outline-success'
        signInButtonEl.type = 'submit'
        signInButtonEl.innerText = 'Sign in'

        this.signInButtonEl = signInButtonEl
    }

    private createDropdownEl(username: string | null) {
        const dropdownEl = document.createElement('div')
        dropdownEl.className = 'dropdown'

        const buttonEl = document.createElement('button')
        buttonEl.className = 'btn btn-secondary dropdown-toggle'
        buttonEl.type = 'button'
        buttonEl.dataset.bsToggle = 'dropdown'
        buttonEl.setAttribute('aria-expanded', 'false')
        buttonEl.innerText = username || 'Username'

        const ulEl = document.createElement('ul')
        ulEl.className = 'dropdown-menu dropdown-menu-end'

        const liEl1 = document.createElement('li')
        const aEl1 = document.createElement('a')
        aEl1.className = 'dropdown-item'
        aEl1.href = '/profile'
        aEl1.innerText = 'Profile'
        liEl1.appendChild(aEl1)

        const liEl2 = document.createElement('li')
        const aEl2 = document.createElement('a')
        aEl2.className = 'dropdown-item'
        aEl2.innerText = 'Logout'
        aEl2.addEventListener('click', () => { this.logout() })
        liEl2.appendChild(aEl2)

        dropdownEl.appendChild(buttonEl)
        dropdownEl.appendChild(ulEl)
        ulEl.appendChild(liEl1)
        ulEl.appendChild(liEl2)

        return dropdownEl
    }

    private async logout() {
        await this.userApiService.logout()
        this.storageService.removeFromStorage('accessToken')
        this.storageService.removeFromStorage('userProfile')
        window.location.reload()
    }
}