import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import axios from 'axios';
const SUBIR_REPORTE = 'reportes/uploadreporte'

function PdfCreator(datos) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const filename = 'reporte.pdf';
    const timestamp = new Date().getTime();
    const reportTitle = [
        {
            text: "Reporte de Alumnos",
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45]
        }
    ];
    const details = [];
    const firma = [];
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        header: [reportTitle],
        content: [details],
        footer: [firma]
    };

    const subirReporte = async () => {
        try{
            const response = await axios.post(SUBIR_REPORTE, {
                nombre: filename,
                fc: timestamp,
                fm: timestamp
            })
            console.log(response);
        } catch(error) {
            console.log(error);
        }
    }

    const pdf = pdfMake.createPdf(docDefinition);  
    //subirReporte();
    pdf.download(filename);
}

export default PdfCreator