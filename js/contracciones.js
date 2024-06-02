var contraccionDuration = 60; // Duración de la contracción en segundos
var inspiracionDuration = 5; // Duración de la inspiración en segundos, ajustable según se requiera
var espiracionDuration = (contraccionDuration / 2) - inspiracionDuration; // Duración de la espiración en segundos
var contraccionesInterval;
var contraccionIndex = 0;
var respirationIndex = 0;
var numTotalContracciones;
let isRunning = false;

const contraccion = {
    txt: "CONTRACCION",
    color: "#841a1b",
    duration: contraccionDuration,
    unicode: ""
};

const inspira = {
    txt: "COGE AIRE",
    color: "#000",
    duration: inspiracionDuration,
    unicode: ""
};

const espira = {
    txt: "EMPUJA",
    color: "#ddd",
    duration: espiracionDuration,
    unicode: ""
};

$('#contracciones-start-button').click(function () {
    if (!isRunning) {
        numTotalContracciones = parseInt($('#numeroRepeticiones').val());
        if (isNaN(numTotalContracciones) || numTotalContracciones <= 0) {
            $('#errorZone').text('Por favor, introduce un número válido de contracciones.');
            return;
        }
        $('#errorZone').text('');

        contraccionIndex = 0;
        respirationIndex = 0;
        $('#contracciones-info-zone').hide();

        let startingCounter = 3;
        $('#contracciones-repetition-zone').text(empezamos.txt);
        createDots($('#contracciones-detail-zone'), startingCounter, empezamos.color, empezamos.unicode);
        let startingInterval = setInterval(() => {
            startingCounter--;
            createDots($('#contracciones-detail-zone'), startingCounter, empezamos.color, empezamos.unicode);
            if (startingCounter <= 0) {
                clearInterval(startingInterval);
                $('#contracciones-repetition-zone').text('');
                startContracciones();
            }
        }, 1000);

    }
});


function startContracciones() {
    contraccionIndex = 1;
    executeContraccionesCycle();
}



function executeContraccionesCycle() {
    if (contraccionIndex >= numTotalContracciones) {
        $('#contracciones-action-zone').text('Fin de la serie');
        $('#contracciones-detail-zone').html('<button id="contracciones-repeat-button" class="btn btn-success mt-3">REPETIR</button>');
        $('#contracciones-repeat-button').click(function () {
            contraccionIndex = 0;
            $('#contracciones-repetition-zone').text('');
            clearCanvas();
            $('#contracciones-info-zone').hide();
            startContracciones();
        });
        isRunning = false;
        return;
    }

    let contraccionCounter = contraccion.duration;
    let inspiracionCounter = inspira.duration;
    let espiracionCounter = espira.duration;

    generarCirculo($('#contracciones-zone'), contraccion.duration, contraccion.color);
    contraccionesInterval = setInterval(() => {
        contraccionCounter--;
        eliminarPartesCirculo('#contracciones-zone', 1);

        if (inspiracionCounter > 0) {
            inspiracionCounter--;
            $('#contracciones-action-zone').text(inspira.txt);
            $('#contracciones-repetition-zone').text('Respiración ' + (respirationIndex + 1));

            $('#contracciones-detail-zone').text('Quedan ' + inspiracionCounter + ' segundos');
        } else if (espiracionCounter > 0) {
            espiracionCounter--;
            $('#contracciones-action-zone').text(espira.txt);
            $('#contracciones-detail-zone').text('Quedan ' + espiracionCounter + ' segundos');
        }

        if (inspiracionCounter === 0 && espiracionCounter === 0) {
            respirationIndex++;
            inspiracionCounter = inspira.duration;
            espiracionCounter = espira.duration;

            if (respirationIndex % 2 === 0) {
                contraccionIndex++;
                $('#contracciones-repetition-zone').text('Respiración ' + (respirationIndex / 2));
            }
        }

        if (contraccionCounter === 0) {
            clearInterval(contraccionesInterval);
            executeContraccionesCycle();
        }
    }, 1000);
}

$('#contracciones-stop-button').click(function () {
    clearInterval(contraccionesInterval);
    isRunning = false;
    $('#contracciones-info-zone').show();
    clearCanvas();
});

function clearCanvas() {
    $('.contracciones-zone > div').empty();
    $('.parte-circulo').remove();
}

