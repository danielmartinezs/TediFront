import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import axios from 'axios';
const SUBIR_REPORTE_SEMESTRAL = 'reportes/uploadreportesemestral'

function PdfReporteSemestral(datos, detalles, admin, idalumno, alumno, nombrearchivo, veredicto) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const filename = nombrearchivo;
    const timestamp = new Date().getTime();
    let verbool = 0;
    if(veredicto === "Se cumplieron todos los objetivos"){
        verbool = 1;
    }
    const reportTitle = [
        {
            text: 'Alumno(a): '+alumno+'\n'+'Titular de lenguaje: '+admin+'\n'+'Programa Semestral: '+datos[0].planSemestral,
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
        console.log(verbool)
        console.log("subiendo reporte semestral")
        try{
            const response = await axios.post(SUBIR_REPORTE_SEMESTRAL, {
                descripcion: JSON.stringify(datos),
                semestre: datos[0].idSemestre,
                alumno: datos[0].idAlumno,
                complete: verbool,
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