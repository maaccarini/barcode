const clearBttn = document.getElementById('form-button__clear');
const allCampCod = document.querySelectorAll('.input__form');
const closeScannerBttn = document.getElementById('scanner-button__close');
const extendBttn = document.getElementById('expand-button__view');
const valuesBarcode = [];

//Restart
clearBttn.addEventListener('click', () => clearInputCamps());

//Close Scanner
closeScannerBttn.addEventListener('click', () => stopScanner());

//Extend Window Button
extendBttn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        extendWindow();
    } else {
        document.exitFullscreen();
    }
});

//Event defines to all InputBox
allCampCod.forEach((input) => {
    input.addEventListener('click', () => startScanner(input));
    input.addEventListener('focus', (event) => {
        setTimeout(function () {
            event.target.blur();  // remove focus and decline keyboard.
        }, 100);
    });
});

// Start the scanner
function startScanner(inputElement) {
    // Show scanner container
    document.querySelector('.video-scanner').style.display = 'block';
    let currentInput = inputElement;
    // Initialize Quagga
    Quagga.init({
        locate: true,
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('.video-scanner'),
            constraints: {
                facingMode: "environment",
                width: {ideal: 1280},
                height: {ideal: 720},
            },
            area: { // defines rectangle of the detection/localization area
                top: "0",    // top offset
                right: "0",  // right offset
                left: "0",   // left offset
                bottom: "0"  // bottom offset
            },
            numOfWorkers: 4,
        },
        locator: {
            patchSize: "large",
            halfSample: true,
        },
        decoder: {
            readers: ['code_39_reader'],
        },
        debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
        },
    }, (err) => {
        if (err) {
            console.error(err);
            alert('Failed to initialize scanner.');
            stopScanner();
            return;
        }
        document.querySelector('.video-scanner video').style.display = 'flex';
        Quagga.start();
    });
    // Handle barcode detection
    Quagga.onDetected((data) => {
        const result = data.codeResult.code;
        if (currentInput) {
            currentInput.value = result;
            valuesBarcode.push(currentInput.value);
            if (currentInput.id === 'form-insert-4') {
                compareValuesBox(valuesBarcode);
            }
            if (currentInput.id === 'form-insert-3') {
                compareValuesBoxOneThree(valuesBarcode);
            }
        }
        stopScanner();
    });
}

function stopScanner() {
    document.querySelector('.video-scanner').style.display = 'none';
    Quagga.stop();
    Quagga.offDetected();
    currentInput = null;
}

function changeColorInputBox(inputBox, color) {
    inputBox.style.cssText = `background-color:${color};`;
}

function clearInputCamps() {
    for (let input of allCampCod) {
        input.value = '';
        changeColorInputBox(input, '000000');
        while (valuesBarcode.length != 0) {
            valuesBarcode.pop();
        }
    }
}

function extendWindow() {
    let elemento = document.documentElement; // Usa o elemento raiz <html>

    if (elemento.requestFullscreen) {
        elemento.requestFullscreen();
    } else if (elemento.mozRequestFullScreen) { // Firefox
        elemento.mozRequestFullScreen();
    } else if (elemento.webkitRequestFullscreen) { // Chrome, Safari e Opera
        elemento.webkitRequestFullscreen();
    } else if (elemento.msRequestFullscreen) { // IE/Edge
        elemento.msRequestFullscreen();
    }
}

function compareValuesBoxOneThree(array) {
    const inputBox0 = allCampCod.item(0);
    const inputBox2 = allCampCod.item(2);
    if (array[0] === array[2] && array[1] != array[3]) {
        changeColorInputBox(inputBox0, '#0DE500');
        changeColorInputBox(inputBox2, '#0DE500');
    }
    else {
        changeColorInputBox(inputBox0, '#E60B00');
        changeColorInputBox(inputBox2, '#E60B00');
    }
}

function compareValuesBox(array) {
    const inputBox0 = allCampCod.item(0);
    const inputBox2 = allCampCod.item(2);
    const inputBox1 = allCampCod.item(1);
    const inputBox3 = allCampCod.item(3);
    if (array[0] === array[2] && array[1] === array[3]) {
        for (let input of allCampCod) {
            changeColorInputBox(input, '#0DE500');
            alert('OK!');
        }
    }
    else if (array[0] === array[2] && array[1] != array[3]) {
        changeColorInputBox(inputBox0, '#0DE500');
        changeColorInputBox(inputBox2, '#0DE500');
        changeColorInputBox(inputBox1, '#E60B00');
        changeColorInputBox(inputBox3, '#E60B00');
        alert('Não Ok! Código EMBALAGEM.');
    }
    else if (array[0] != array[2] && array[1] === array[3]) {
        changeColorInputBox(inputBox0, '#E60B00');
        changeColorInputBox(inputBox2, '#E60B00');
        changeColorInputBox(inputBox1, '#0DE500');
        changeColorInputBox(inputBox3, '#0DE500');
        alert('Não Okay! Código OC.');
    }
    else {
        for (let input of allCampCod) {
            changeColorInputBox(input, '#E60B00');
            alert('Não Ok!');
        }
    }
}
