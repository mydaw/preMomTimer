let interval;
let currentRepetition = 0;
let totalRepetitions;
let fuerzaTime;
let relaxTime;
let isKegelRunning = false;

const fuerza = {
    txt: "FUERZA",
    color: "#000",
    unicode: ""
};

const relaja = {
    txt: "RELAJA",
    color: "#ddd",
    unicode: ""
};

$('#kegel-start-button').click(function () {

    if (!isKegelRunning) {
        fuerzaTime = parseInt($('#tiempoFuerzaRepeticion').val());
        totalRepetitions = parseInt($('#numeroRepeticiones').val());
        if (isNaN(fuerzaTime) || isNaN(totalRepetitions)) {
            $('#error-zone').text('Ambos valores deben ser números válidos.');
            return;
        }

        currentRepetition = 0;
        isKegelRunning = true;
        clearCanvas();
        $('#kegel-info-zone').hide();
        debugger;
        let startingCounter = 3;
        $('#kegel-repetition-zone').text(empezamos.txt);
        createDots($('#kegel-detail-zone'), startingCounter, empezamos.color, empezamos.unicode);
        let startingInterval = setInterval(() => {
            startingCounter--;
            createDots($('#kegel-detail-zone'), startingCounter, empezamos.color, empezamos.unicode);
            if (startingCounter <= 0) {
                clearInterval(startingInterval);
                startKegelExercise();
            }
        }, 1000);
    }
});

$('#kegel-stop-button').click(function () {
    clearInterval(interval);
    isKegelRunning = false;
    $('#kegel-info-zone').show();
    clearCanvas();
});

function startKegelExercise() {
    currentRepetition = 1;
    executeKegelCycle();
}

function executeKegelCycle() {
    if (currentRepetition > totalRepetitions) {

        $('#kegel-action-zone').text('Fin de la serie');
        $('#kegel-detail-zone').html('<button id="kegel-repeat-button" class="btn btn-success mt-3">REPETIR</button>');
        $('#kegel-repeat-button').click(function () {
            currentRepetition = 0;
            clearCanvas();
            $('#kegel-info-zone').hide();
            $('#kegel-repetition-zone').text(`¡REPETIMOS!`);
            startKegelExercise();
        });
        isKegelRunning = false;
        return;
    }

    let fuerzaCounter = fuerzaTime;
    let relaxCounter = (fuerzaTime * 2);

    $('#kegel-repetition-zone').text(`Repetición ${currentRepetition} de ${totalRepetitions}`);
    $('#kegel-action-zone').text(fuerza.txt);
    createDots($('#kegel-detail-zone'), fuerzaCounter, fuerza.color);

    interval = setInterval(() => {
        fuerzaCounter--;
        $('#kegel-detail-zone .dot').first().remove();

        if (fuerzaCounter < 0) {
            clearInterval(interval);
            $('#kegel-action-zone').text(relaja.txt);
            createDots($('#kegel-detail-zone'), relaxCounter, relaja.color);

            interval = setInterval(() => {
                relaxCounter--;
                $('#kegel-detail-zone .dot').first().remove();

                if (relaxCounter < 0) {
                    clearInterval(interval);
                    currentRepetition++;
                    executeKegelCycle();
                }
            }, 1000);
        }
    }, 1000);
}

function clearCanvas() {
    $('.canvas-zone > div').empty();
}