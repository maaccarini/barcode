const allCampCod = document.querySelectorAll('.input-field-box');

function compare() {
    if (allCampCod.item(0).value == allCampCod.item(2).value && allCampCod.item(1).value == allCampCod.item(3).value) {
        alert('Ok');
    }
    else {
        alert(`Não Ok`);
    }
}

function clean() {
    for (let input of allCampCod) {
        input.value = '';
    }
}
let currentInput = null;

// Start the scanner
function startScanner(inputElement) {
    currentInput = inputElement;

    // Show scanner container
    document.getElementById("scanner-container").style.display = "flex";

    // Initialize Quagga
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById("scanner"),
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
        },
    }, (err) => {
        if (err) {
            console.error(err);
            alert("Failed to initialize scanner.");
            stopScanner();
            return;
        }
        Quagga.start();
    });

    // Handle barcode detection
    Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        if (currentInput) {
            currentInput.value = code;
        }
        stopScanner();
    });
}

function stopScanner() {
    Quagga.stop();
    document.getElementById("scanner-container").style.display = "none";
    currentInput = null;
}

allCampCod.forEach((input) => {
    input.addEventListener('click', () => startScanner(input));
});
