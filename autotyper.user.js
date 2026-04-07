// ==UserScript==
// @name         autotyper
// @namespace    http://github.com/maicnx/
// @version      2025-05-25
// @description  type long text easy
// @author       guest82644
// @match        *://computernewb.com/collab-vm/
// @match        *://computernewb.com/collab-vm/user-vm/
// @match        *://bonziworld.me
// @match        *://wizevm.live
// @match        *://test.crustywindo.ws/slots/*
// @match        *://www.befacivm.us.to/*
// @match        *://cvmbeta.befacivm.us.to/*
// @match        *://collab.woozy.eu.org
// @match        *://*.collabvm.org
// @match        *://vm.toroking.top
// @match        *://localhost
// @match        *://stinkyvm.loophole.site
// @match        *://bore.pub/*
// @match        *://guh.alwaysdata.net/*
// @match        *://collab.woozy.eu.org/*
// @match        *://creeper.befacivm.us.to/*
// @match        *://cvmbeta.befacivm.us.to/*
// @match        *://computer.antilunex.qzz.io/*
// @match        *://collabvm.pvabel.net/*
// @match        *://collabvm.shijimanet.com/*
// @match        *://amazingvm.geoegii555.eu.org/*
// @match        *://nvme.site/*
// @match        *://poteto.befacivm.us.to/*
// @match        *://winadamvm.qzz.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=computernewb.com
// @grant        none
// ==/UserScript==

let delay = +(localStorage.getItem("autoTypeDelay") || 16)
function sleep(t) {
	return new Promise(resolve => setTimeout(resolve, t))
}
let typing = false

const needsShift = ["%", "_", ":", "@", "~", "!", "#", "$", "^", "&", "(", ")", "+", "<", ">", '"', "{", "}", "*", "|", "?"] // Characters to press shift on
const shift = { key: "Shift", code: "ShiftLeft", keyCode: 16, location: 1, shiftKey: true }
const manualCodes = { [10]: 65293/*enter*/, [9]: 65289/*tab*/ }

async function autoType(str) {
    typing = true
    changeButtonText("Stop Typing")
    const canvas = document.body.querySelector("canvas")
    canvas.focus()
    let vm
    if (window.collabvm) vm = collabvm.getVM()
	for (let i = 0; i < str.length; i++) {
        if (!typing) break;
		const char = str[i]
        const isShift = needsShift.includes(char)
        if (isShift) {
            canvas.dispatchEvent(new KeyboardEvent("keydown", shift))
        }
        let code = char.charCodeAt(0)
        code = manualCodes[code] || code
        if (location.hostname !== "test.crustywindo.ws" && canvas.className === "") {
            vm.send("turn")
            while (canvas.className !== "focused") {
                await sleep(250)
            }
        }
        if (vm) { vm.send("key", code, "1") } else { canvas.dispatchEvent(new KeyboardEvent("keydown", { key: char, keyCode: code, location: 0 })) }
        if (!ultraFast.checked || char === str[i + 1]) { // sometimes it drops double letters
            //await sleep(delay)
            if (vm) { vm.send("key", code, "0") } else { canvas.dispatchEvent(new KeyboardEvent("keyup", { key: char, keyCode: code, location: 0 })) }
        }
        await sleep(delay)
        if (isShift) {
            canvas.dispatchEvent(new KeyboardEvent("keyup", shift))
        }
	}
    typing = false
    changeButtonText("Auto Type")
}

const buttons = document.body.querySelector("#btns")
const typeButton = buttons.querySelector("button").cloneNode(true)
typeButton.id = "autoTypeBtn"
function changeButtonText(t) {
    if (location.hostname === "test.crustywindo.ws") {
        typeButton.childNodes[2].nodeValue = t
    } else {
        typeButton.children[1].id = "autoTypeBtnText"
        typeButton.children[1].innerHTML = t
    }
}
changeButtonText("Auto Type")
typeButton.addEventListener("click", e => {
    e.preventDefault()
    if (typing) { typing = false; return }
    const str = prompt("Enter text to autotype:")
    str && autoType(str)
})
const menu = document.createElement("div")
menu.style.width = "100%"
menu.style.height = "100dvh"
menu.style.background = "#000000aa"
menu.style.zIndex = "99998"
menu.style.display = "none"
menu.style.alignItems = "center"
menu.style.justifyContent = "center"
menu.style.position = "absolute"
menu.style.top = "0"
menu.style.left = "0"
const options = document.createElement("div")
options.style.width = "40%"
options.style.padding = "1em"
options.style.background = "#eee"
options.style.zIndex = "99999"
const closeBtn = document.createElement("button")
closeBtn.innerHTML = "Close"
closeBtn.addEventListener("click", ()=>{menu.style.display="none"})
options.appendChild(closeBtn)
options.appendChild(document.createElement("br"))
const fastLabel = document.createElement("label")
fastLabel.for = "ultraFast"
fastLabel.innerHTML = "Ultra Fast (BREAKS ON LINUX GUESTS)"
fastLabel.style.color = "#000"
const ultraFast = document.createElement("input")
ultraFast.type = "checkbox"
ultraFast.id = "ultraFast"
ultraFast.checked = !!+localStorage.getItem("autoTypeUltraFast")
ultraFast.addEventListener("change",()=>localStorage.setItem("autoTypeUltraFast",+ultraFast.checked))
options.appendChild(ultraFast)
options.appendChild(fastLabel)
menu.appendChild(options)
document.body.appendChild(menu)
typeButton.addEventListener("contextmenu", e => {
    e.preventDefault()
    /*const input = +prompt("Enter new delay:", delay)
    if (input !== NaN) {
        delay = input
        localStorage.setItem("autoTypeDelay", delay)
    }*/
    menu.style.display = "flex"
})
buttons.insertBefore(typeButton, buttons.querySelector("#staffbtns"))

document.body.querySelector("#chat-input").autocomplete = "off"
