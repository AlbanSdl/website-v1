namespace Ripple {
    const componentTag = 'has-ripple'
    function listener(this: HTMLElement, e: MouseEvent) {
        this.style.overflow='hidden'
        this.style.position='relative'
        const bcr = this.getBoundingClientRect()
        const r = document.createElement("div")
        Object.assign(r.style, {
            position:'absolute',
            transform:'translateX(-50%) translateY(-50%)',
            borderRadius:'50%',
            width:'0',
            height:'0',
            transition:'all .5s ease-in-out',
            left:`${e.x - bcr.x - window.scrollX}px`,
            top:`${e.y - bcr.y - window.scrollY}px`,
            background:'var(--color-ripple)',
            pointerEvents:'none'
        })
        this.append(r)
        r.getBoundingClientRect()
        const rSize = Math.max(bcr.height, bcr.width, 600)
        r.style.opacity='0'
        r.style.width=r.style.height=`${rSize}px`
        setTimeout(() => r.remove(), 550)
    }
    export function apply(target: HTMLElement) {
        if (!target.hasAttribute(componentTag)) {
            target.addEventListener('mousedown', listener)
            target.setAttribute(componentTag, '')
            return true
        }
        return false
    }
    export function remove(target: HTMLElement) {
        if (target.hasAttribute(componentTag)) {
            target.removeEventListener('mousedown', listener)
            target.removeAttribute(componentTag)
            return true
        }
        return false
    }
    export function init(className: string = 'button', excludedClasses: string = 'disabled') {
        for (let link of document.getElementsByClassName(className)) 
            if (link instanceof HTMLElement && !link.className.includes(excludedClasses)) apply(link)
    }
}

namespace Link {
    const linkClickedAttribute: string = 'data-being-clicked'
    const linkAttachementAttribute: string = 'data-link'
    export function bind(link: HTMLElement) {
        link.addEventListener('mousedown', function(e) {
            link.setAttribute(linkClickedAttribute, '')
            if (e.button === 1 && e.buttons === 4 && e.which === 2)
                e.preventDefault()
        })
        link.addEventListener('mouseup', function(e) {
            if (!this.hasAttribute(linkClickedAttribute)) return
            this.removeAttribute(linkClickedAttribute)
            e.stopImmediatePropagation()
            const location = this.getAttribute(linkAttachementAttribute)
            if (!!location) {
                const helper = document.createElement('a')
                helper.href = location
                helper.target = e.button === 1 && e.which === 2 ? '_blank' : ''
                helper.click()
            }
        })
        link.setAttribute('draggable', 'true')
        link.addEventListener('dragstart', function(e) {
            this.removeAttribute(linkClickedAttribute)
            e.dataTransfer.setData('text/uri-list', this.getAttribute(linkAttachementAttribute))
        })
    }
    export function init(className: string = 'link') {
        for (let link of document.getElementsByClassName(className)) 
            if (link instanceof HTMLElement) bind(link)
        window.addEventListener('mouseup', () => {
            for (const elem of document.getElementsByClassName(className))
                if (elem.hasAttribute(linkAttachementAttribute) && elem.hasAttribute(linkClickedAttribute))
                    elem.removeAttribute(linkClickedAttribute)
        })
    }
}

window.onload = () => {
    document.getElementById('clear').addEventListener('click', function() {
        window.localStorage.clear();window.sessionStorage.clear()
        this.classList.add('disabled');Ripple.remove(this)
        console.info('Local & session storage cleared')
        const cookies = document.cookie.split(';')
        for (var i = 0; i < cookies.length; i++) 
            if (cookies[i].length > 0)
                document.cookie = `${cookies[i]}=;expires=${new Date(0).toUTCString()}`
    }, {once: true})
    Ripple.init()
    Link.init()
}