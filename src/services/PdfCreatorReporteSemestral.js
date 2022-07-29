import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import axios from 'axios';
const SUBIR_REPORTE_SEMESTRAL = 'reportes/uploadreportesemestral'

function PdfReporteSemestral(datos, detalles, admin, alumno, nombrearchivo, veredicto) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    console.log(datos)
    console.log(detalles)
    console.log(admin)
    console.log(alumno)
    console.log(nombrearchivo)
    console.log(veredicto)
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
            margin: [15, 20, 0, 45]
        },
        {
            text: 'Programa Semestral'+datos[0].planSemestral,
            fontSize: 11,
            bold: true,
            margin: [15, 20, 0, 45]
        }
    ];

    const objetivos = detalles.map((details) => {
        return [
            {
                text: details.objetivo,
                fontSize: 11,
                margin: [15, 20, 0, 45]
            },
            {
                text: details.descripcion,
                fontSize: 11,
                margin: [15, 20, 0, 45]
            },
            {
                text: details.cumplido,
                fontSize: 11,
                margin: [15, 20, 0, 45]
            }
        ]
    });
    

    console.log(objetivos)

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: [
                    [
                        { text: 'Objetivos', style: 'tableHeader' },
                        { text: 'Descripción', style: 'tableHeader' },
                        { text: 'Cumplido', style: 'tableHeader' }
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

    const subirReporteSemestral = async () => {
        console.log("subiendo reporte semestral")
        try{
            const response = await axios.post(SUBIR_REPORTE_SEMESTRAL, {
                nombre: filename,
                descripcion: JSON.stringify(datos),
                semestre: datos[0].periodo,
                alumno: alumno,
                complete: veredicto,
            })
            console.log(response);
        } catch(error) {
            console.log(error);
        }
    }

    const pdf = pdfMake.createPdf(docDefinition);  
    subirReporteSemestral();
    pdf.download(filename);
}

export default PdfReporteSemestral