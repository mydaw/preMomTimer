const empezamos = {
    txt: "EMPEZAMOS EN...",
    color: "#9c9c9c",
    unicode: '★'
};

$('.menu-toggle').click(function () {
    $('.menu').toggle();
});

function createDots(container, count, color, unicodeChar = '●') {
    container.empty();
    for (let i = 0; i < count; i++) {
        container.append(`<span class="dot" style="color: ${color};">${unicodeChar || '●'}</span>`);
    }
}
function generarCirculo(elemento, partes, color) {
    var angulo = 360 / partes;
    var radio = 40; // Radio del círculo
    var centroX = elemento.width() / 2; // Centro horizontal del contenedor
    var centroY = 0; // Arriba del contenedor
    for (var i = 0; i < partes; i++) {
        $('<div class="parte-circulo"></div>').css({
            'background-color': color,
            'transform-origin': '50% 0', // Cambia el punto de origen a la parte superior
            'transform': 'rotate(' + (i * angulo) + 'deg) translate(' + centroX + 'px, ' + centroY + 'px) rotate(-' + (i * angulo) + 'deg)' // Cambia la rotación y la traslación
        }).appendTo(elemento);
    }
}

function eliminarPartesCirculo(elemento, partes) {
    $(elemento + ' .parte-circulo:lt(' + partes + ')').remove();
}


function createGradientDots(container, count, color, unicodeChar = '●') {
    container.empty();
    debugger;
    // Convertir el color a formato RGB
    let rgb = hexToRgb(color);

    //// Calcular el color más intenso y el más suave
    //let intenseColor = { r: Math.min(255, rgb.r + 50), g: Math.min(255, rgb.g + 50), b: Math.min(255, rgb.b + 50) };
    //let mildColor = { r: Math.max(0, rgb.r - 50), g: Math.max(0, rgb.g - 50), b: Math.max(0, rgb.b - 50) };
    // Calcular el color más intenso y el más suave
    let intenseColor = { r: Math.min(255, rgb.r + 100), g: Math.min(255, rgb.g + 100), b: Math.min(255, rgb.b + 100) };
    let mildColor = { r: Math.max(0, rgb.r - 100), g: Math.max(0, rgb.g - 100), b: Math.max(0, rgb.b - 100) };

    // Crear los puntos del gradiente
    for (let i = 0; i < count; i++) {
        // Calcular el factor de interpolación para el gradiente
        let ratio;
        if (i < count / 2) {
            ratio = i / ((count / 2) - 1); // Gradiente ascendente hacia el color intenso
        } else {
            ratio = (count - i - 1) / ((count / 2) - 1); // Gradiente descendente hacia el color suave
        }

        // Interpolar entre el color más intenso y el color base
        let interpolatedColor = interpolateColor(intenseColor, rgb, ratio);

        // Interpolar entre el color base y el color más suave
        if (i >= count / 2) {
            interpolatedColor = interpolateColor(rgb, mildColor, ratio);
        }

        // Convertir el color del punto de nuevo a formato hexadecimal
        let hexColor = rgbToHex(interpolatedColor);

        // Agregar el punto al contenedor
        container.append(`<span class="dot" style="color: ${hexColor};">${unicodeChar || '●'}</span>`);
    }
}

// Función para interpolar entre dos colores RGB
function interpolateColor(color1, color2, ratio) {
    let r = Math.round(color1.r * (1 - ratio) + color2.r * ratio);
    let g = Math.round(color1.g * (1 - ratio) + color2.g * ratio);
    let b = Math.round(color1.b * (1 - ratio) + color2.b * ratio);
    return { r, g, b };
}

// Función para convertir un color hexadecimal a RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Función para convertir un color RGB a hexadecimal
function rgbToHex(rgb) {
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}
