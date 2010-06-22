var modal = false;
var modalId = "passwordGeneratorModal";

function handleMessage(event) {
    console.debug('handleMessage called');
    console.debug(event);
    if (event.name === "displayPasswordGenerator") {
        displayPasswordGenerator(event);
    } else if (event.name === "receiveGeneratedPassword") {
        receiveGeneratedPassword(event);
    }
}

function receiveGeneratedPassword(event) {
    var input = document.getElementById("passwordDialog_generated");
    input.value = event.message.generatedPassword;
    input.select();
    document.execCommand("copy");
}

function displayPasswordGenerator(event) {
    if (modal !== false) {
        document.body.removeChild(modal);
        modal = false;
        return;
    }

    displayState = true;

    modal = document.createElement('div');
    modal.style.cssText = "width:" + window.innerWidth + "px;height:" + window.innerHeight + "px; " + event.message.modalCss;
    document.body.appendChild(modal);

    modal.innerHTML = event.message.dialogHTML;
    modal.children[1].style.marginTop = (window.innerHeight / 2 - 150) + "px";

    console.debug("focusing");;
    var input = document.getElementById("passwordDialog_master");
    console.debug(input);
    input.focus();
    var form = document.getElementById('passwordForm');
    form.onsubmit = function() {
        safari.self.tab.dispatchMessage("generatePassword", {
            master: document.getElementById("passwordDialog_master").value,
            site: document.getElementById("passwordDialog_site").value
        });
        return false;
    }
}

safari.self.addEventListener("message", handleMessage, false);

