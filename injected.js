var modal = false;
var modalId = "passwordGeneratorModal";

function displayElement(event) {
    console.debug('displayElement called');
    if (event.name !== "displayPasswordGenerator") {
        return;
    }

    if (modal !== false) {
        document.body.removeChild(modal);
        modal = false;
        return;
    }

    displayState = true;

    modal = document.createElement('div');
    modal.style.cssText = "width:" + window.innerWidth + "px;height:" + window.innerHeight + "px; " + event.message.modalCss;
    document.body.appendChild(modal);
}

safari.self.addEventListener("message", displayElement, false);

