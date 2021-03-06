import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import axios from 'axios';
const SUBIR_REPORTE = 'reportes/uploadreporte'

function PdfCreator(datos, admin, qa, nombrearchivo) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    console.log(datos)
    console.log(admin)
    console.log(qa)
    const filename = nombrearchivo;
    const timestamp = new Date().getTime();
    const reportTitle = [
        {
            text: 'Alumno(a): '+datos[0].nombre,
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45]
        }
    ];

    const respuestas = qa.map((answer) => {
        return [
            {
                text: answer.id,
                fontSize: 11,
                margin: [15, 20, 0, 45]
            },
            {
                text: answer.value,
                fontSize: 11,
                margin: [15, 20, 0, 45]
            }
        ]
    });

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['*', '*'],
                body: [
                    [
                        { text: 'Pregunta', style: 'tableHeader' },
                        { text: 'Respuesta', style: 'tableHeader' }
                    ],
                    ...respuestas
                ]
            },
            layout: 'lightHorizontalLines'
        }
    ];

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