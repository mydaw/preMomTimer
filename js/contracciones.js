var contraccionDuration = 60; // Duración de la contracción en segundos
var inspiracionDuration = 5; // Duración de la inspiración en segundos, ajustable según se requiera
var espiracionDuration = (contraccionDuration / 2) - inspiracionDuration; // Duración de la espiración en segundos
var contraccionesInterval;
var contraccionIndex = 0;
var respirationIndex = 0;
var numTotalContracciones;
let isRunning = false;
var selectedRespiracion = null;

const contraccion = {
    txt: "CONTRACCION",
    color: "#841a1b",
    duration: contraccionDuration,
    unicode: ""
};

const inspira = {
    txt: "COGE AIRE",
    color: "#000",
    duration: 0,
    unicode: ""
};

const espira = {
    txt: "EMPUJA",
    txtFuerte: "¡EMPUJA FUERTE!",
    txtOtra: "¡OTRA VEZ!",
    txtLarga: "¡SOPLA!",
    color: "#ddd",
    colorOtro: "#d0d",
    duration: 0,
    unicode: ""
};

const respiraciones = {
    respiracionAbdominal: (function () {

        const inspiracionDuration = 6;
        const espiracionDuration = (contraccionDuration / 2) - inspiracionDuration;
        const respiracionDuration = inspiracionDuration + espiracionDuration;

        return {
            txt: "Respiración abdominal",
            inspiracionDuration: inspiracionDuration,
            espiracionDuration: espiracionDuration,
            respiracionDuration: respiracionDuration,
            type: 'Abdominal',
            steps: `
            <ol>
                <li>Póngase una mano sobre el abdomen justo debajo de las costillas y la otra mano sobre el pecho.</li>
                <li>Respire hondo por la nariz y deje que el abdomen le empuje la mano. El pecho no debería moverse.</li>
                <li>Exhale a través de los labios fruncidos como si estuviese silbando. Sienta cómo se hunde la mano sobre su abdomen y utilícela para expulsar todo el aire hacia afuera.</li>
                <li>Respire de esta manera entre las contracciones o durante ellas. Tómese su tiempo con cada respiración.</li>
            </ol>`
        };
    })(),

    respiracionJadeante: (function () {
        const respiracionDuration = 10;
        const inspiracionDuration = 4;
        const espiracionDuration = respiracionDuration - inspiracionDuration;
        let espiracionCortaDuration = 1;
        let espiracionLargaDuration = 4;

        return {
            txt: "Respiración jadeante",
            inspiracionDuration: inspiracionDuration,
            espiracionDuration: espiracionDuration,
            espiracionCortaDuration: espiracionCortaDuration,
            espiracionCortaRep: 2,
            espiracionLargaDuration: espiracionLargaDuration,
            espiracionLargaRep: 1,
            respiracionDuration: respiracionDuration,

            type: 'Jadeante',
            steps: `
            <ol>
                <li>En cuanto comience una contracción, inspire profundamente por la nariz.</li>
                <li>Exhale con 2 jadeos cortos seguidos por un soplido más largo. Este tipo de respiración puede describirse como "ji-ji-hoo".</li>
                <li>Esta respiración en la que se inhala y se exhala jadeando debería durar unos 10 segundos.</li>
                <li>Repita este tipo de respiración hasta que la contracción se detenga.</li>
            </ol>`
        };
    })()
};

$('#tipoRespiracion').change(function () {
    const selectedType = $(this).val();
    const selectedRespiracion = respiraciones[selectedType];
    $('#respiracionSteps').html(selectedRespiracion.steps);
});

$('#tipoRespiracion').trigger('change');

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
        }, 100);
    }
});


function startContracciones() {
    contraccionIndex = 1;
    const selectedType = $('#tipoRespiracion').val();
    selectedRespiracion = respiraciones[selectedType];
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
    let inspiracionCounter = selectedRespiracion.inspiracionDuration;
    let espiracionCounter = selectedRespiracion.espiracionDuration;
    let espiracionCortaCounter = selectedRespiracion?.espiracionCortaDuration * selectedRespiracion?.espiracionCortaRep;
    let espiracionCortaBreak = espiracionCortaCounter / 2;
    let espiracionLargaCounter = selectedRespiracion?.espiracionLargaDuration * selectedRespiracion?.espiracionLargaRep;

    generarCirculo($('#contracciones-zone'), contraccion.duration, contraccion.color);
    contraccionesInterval = setInterval(() => {
        contraccionCounter--;
        eliminarPartesCirculo('#contracciones-zone', 1);

        if (inspiracionCounter > 0) {
            createDots($('#contracciones-detail-zone'), inspiracionCounter, inspira.color);
            inspiracionCounter--;
            $('#contracciones-action-zone').text(inspira.txt);
            $('#contracciones-repetition-zone').text('Respiración ' + (respirationIndex + 1));
        } else if (espiracionCounter > 0) {
            debugger;
            espiracionCounter--;
            if (selectedRespiracion.type == 'Jadeante') {
                /*$('#contracciones-repetition-zone').text('');*/
                
                if (espiracionCortaCounter > 0) {
                    createDots($('#contracciones-detail-zone'), 1, espira.color);
                    espiracionCortaCounter--;
                    $('#contracciones-action-zone').text(espira.txtFuerte);
                    if (espiracionCortaCounter < espiracionCortaBreak) {
                        createDots($('#contracciones-detail-zone'), 1, espira.colorOtro);
                        $('#contracciones-action-zone').text(espira.txtOtra);
                    }
                } else {
                    if (espiracionLargaCounter > 0) {
                        espiracionLargaCounter--;
                        $('#contracciones-action-zone').text(espira.txtLarga);
                        createDots($('#contracciones-detail-zone'), espiracionLargaCounter, espira.color);
                    }
                }
            } else {
                $('#contracciones-action-zone').text(espira.txt);
                $('#contracciones-detail-zone').text('Quedan ' + espiracionCounter + ' segundos');
            }
        }

        if (inspiracionCounter === 0 && espiracionCounter === 0) {
            respirationIndex++;
            inspiracionCounter = selectedRespiracion.inspiracionDuration;
            espiracionCounter = selectedRespiracion.espiracionDuration;
            espiracionCortaCounter = selectedRespiracion?.espiracionCortaDuration * selectedRespiracion?.espiracionCortaRep;
            espiracionLargaCounter = selectedRespiracion?.espiracionLargaDuration * selectedRespiracion?.espiracionLargaRep;

            if (respirationIndex % 2 === 0) {
                contraccionIndex++;
                $('#contracciones-repetition-zone').text('Respiración ' + (respirationIndex / 2));
            }
        }

        if (contraccionCounter === 0) {
            clearInterval(contraccionesInterval);
            executeContraccionesCycle();
        }
    }, 100);//1000
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

