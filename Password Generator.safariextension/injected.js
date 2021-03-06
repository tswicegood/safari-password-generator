// make sure that this is only executed once, at the top level
if (window.top === window) {

    var modal = false;
    var modalId = "passwordGeneratorModal";

    function handleMessage(event) {
        if (event.name === "togglePasswordGeneratorModal") {
            togglePasswordGeneratorModal(event);
        } else if (event.name === "receiveGeneratedPassword") {
            receiveGeneratedPassword(event);
        }
    }

    function receiveGeneratedPassword(event) {
        var input = document.getElementById("passwordDialog_generated");
        // weird bug - I get a TypeError if I reference input.value on an <Enter>
        // w/o first referencing the input var.
        input;
        input.value = event.message.generatedPassword;
        input.select();
        document.execCommand("copy");
    }

    function togglePasswordGeneratorModal(event) {
        if (modal !== false) {
            hidePasswordGeneratorModal();
        } else {
            showPasswordGeneratorModal(event);
        }
    }

    function hidePasswordGeneratorModal() {
        document.body.removeChild(modal);
        modal = false;
        return;
    }

    function showPasswordGeneratorModal(event) {
        displayState = true;

        modal = document.createElement('div');
        modal.id = "modalDialogBackground";
        modal.style.cssText = "width:" + window.innerWidth + "px;height:" + window.innerHeight + "px; " + event.message.modalCss;
        modal.onclick = function(event) {
            if (event.target.id === "modalDialogBackground") {
                hidePasswordGeneratorModal();
            }
        };
        document.body.appendChild(modal);

        modal.innerHTML = event.message.dialogHTML;
        modal.children[1].style.marginTop = (window.innerHeight / 2 - 150) + "px";

        var input = document.getElementById("passwordDialog_master");
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

}
