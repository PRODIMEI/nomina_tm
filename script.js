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
        const decenas = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
        const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
        let parteEntera = Math.floor(num);
        let centavos = Math.round((num - parteEntera) * 100);

        function convertir(num) {
            if (num < 10) return unidades[num];
            if (num < 100) return decenas[Math.floor(num / 10)] + (num % 10 !== 0 ? " Y " + unidades[num % 10] : "");
            if (num < 1000) return centenas[Math.floor(num / 100)] + (num % 100 !== 0 ? " " + convertir(num % 100) : "");
            if (num < 1000000) return (num < 2000 ? "MIL" : convertir(Math.floor(num / 1000)) + " MIL") + (num % 1000 !== 0 ? " " + convertir(num % 1000) : "");
            return "";
        }

        let resultado = convertir(parteEntera) + " PESOS";
        resultado += ` ${centavos.toString().padStart(2, "0")}/100 MN.`;
        return resultado;
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
