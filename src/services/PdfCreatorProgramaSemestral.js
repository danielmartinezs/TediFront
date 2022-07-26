import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import axios from 'axios';
const SUBIR_REPORTE = 'reportes/uploadreporte'

function PdfProgramaSemestral(datos, admin, alumno, nombrearchivo) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    console.log(datos)
    console.log(admin)
    console.log(alumno)
    const filename = nombrearchivo;
    const timestamp = new Date().getTime();
    const reportTitle = [
        {
            text: 'Alumno(a): '+alumno,
            fontSize: 11,
            bold: true,
            margin: [15, 20, 0, 45]
        },
        {
            text: admin,
            fontSize: 11,
            bold: true,
            margin: [25, 40, 0, 45]
        }
    ];

    const objetivos = datos.map((objective) => {
        return [
            {
                text: objective.objetivo,
                fontSize: 15,
                margin: [15, 20, 0, 45]
            },
            {
                text: objective.descripcion,
                fontSize: 15,
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
                        { text: 'Objetivos', style: 'tableHeader' },
                        { text: 'Descripción', style: 'tableHeader' }
                    ],
                    ...objetivos
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

export default PdfProgramaSemestral