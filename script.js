document.getElementById("generarPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener datos del formulario
    const nombre = document.getElementById("nombre").value;
    const buenoPor = parseFloat(document.getElementById("buenoPor").value) || 0;
    const fechaRecibo = document.getElementById("fechaRecibo").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const numeroNomina = document.getElementById("numeroNomina").value;

    if (!nombre || !buenoPor || !fechaRecibo || !fechaInicio || !fechaFin || !numeroNomina) {
        alert("Todos los campos son obligatorios. Por favor, complete todos los campos.");
        return;
    }

    function formatFecha(fecha) {
        const partesFecha = fecha.split("-");
        const f = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
        return f.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }).toUpperCase();
    }

   function numeroALetras(num) {
    const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
    const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const centenas = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    function convertir(n) {
        if (n < 10) return unidades[n];
        if (n >= 10 && n < 20) return especiales[n - 10];
        if (n >= 20 && n < 30) return (n === 20) ? "VEINTE" : "VEINTI" + unidades[n - 20].toLowerCase();
        if (n < 100) {
            const dec = Math.floor(n / 10);
            const uni = n % 10;
            return decenas[dec] + (uni > 0 ? " Y " + unidades[uni] : "");
        }
        if (n < 1000) {
            const cent = Math.floor(n / 100);
            const resto = n % 100;
            if (n === 100) return "CIEN";
            return centenas[cent] + (resto > 0 ? " " + convertir(resto) : "");
        }
        if (n < 1000000) {
            const miles = Math.floor(n / 1000);
            const resto = n % 1000;
            let milesTexto = miles === 1 ? "MIL" : convertir(miles) + " MIL";
            return milesTexto + (resto > 0 ? " " + convertir(resto) : "");
        }
        return "";
    }

    const parteEntera = Math.floor(num);
    const centavos = Math.round((num - parteEntera) * 100);

    let resultado = convertir(parteEntera) + " PESOS";
    resultado += ` ${centavos.toString().padStart(2, "0")}/100 MN.`;
    return resultado.toUpperCase();
}

    function generarRecibo(yOffset) {
        doc.setFont("helvetica");
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 128);
        doc.text("Compañía Terminal de Manzanillo S.A. de C.V.", 20, 20 + yOffset);
        doc.setLineWidth(0.5);
        doc.line(20, 25 + yOffset, 190, 25 + yOffset);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Manzanillo, Colima a: ${formatFecha(fechaRecibo)}`, 20, 30 + yOffset);
        doc.text("Recibo de Nómina", 70, 40 + yOffset);
        doc.text(`Bueno por: $${buenoPor.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, 55 + yOffset);
        doc.text("RECIBI DE COMPAÑÍA TERMINAL DE MANZANILLO, SA. DE CV. LA CANTIDAD DE: ", 20, 70 + yOffset);
        doc.text(`$${buenoPor.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${numeroALetras(buenoPor)})`, 20, 80 + yOffset);
        doc.text(`POR CONCEPTO DE LA NOMINA NO. ${numeroNomina}`, 20, 90 + yOffset);
        doc.text(`DEL PERIODO: ${formatFecha(fechaInicio)} AL ${formatFecha(fechaFin)}`, 20, 100 + yOffset);
        doc.text(`_________________________________________`, 20, 119 + yOffset);
        doc.text(`NOMBRE: ${nombre}`, 20, 124 + yOffset);
        doc.text(`-----------------------------------------------------------------------------------------------------------------------`, 20, 143 + yOffset);
    }

    generarRecibo(0); // Primera copia en la parte superior
    generarRecibo(140); // Segunda copia desplazada hacia abajo

    const nombreArchivo = `${nombre.replace(/\s+/g, "_")}_NOMINA_${numeroNomina}.pdf`;
    doc.save(nombreArchivo);
});
