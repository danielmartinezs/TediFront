import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import axios from 'axios';
const SUBIR_PROGRAMA_SEMESTRAL = 'reportes/uploadplansemestral'

function PdfProgramaSemestral(datos, periodo, admin, idalumno, alumno, nombrearchivo) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const filename = nombrearchivo;
    const timestamp = new Date().getTime();
    const reportTitle = [
        {
            text: 'Alumno(a): '+alumno+'\n'+'Titular de lenguaje: '+admin+'\n'+'Programa Semestral: '+datos[0].planSemestral,
            fontSize: 11,
            bold: true,
            margin: [15, 20, 0, 45]
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

    const subirProgramaSemestral = async () => {
        console.log("subiendo programa semestral")
        try{
            const response = await axios.post(SUBIR_PROGRAMA_SEMESTRAL, {
                nombre: filename,
                descripcion: JSON.stringify(datos),
                semestre: periodo[0].idSemestre,
                alumno: idalumno
            })
            console.log(response);
        } catch(error) {
            console.log(error);
        }
    }
    const pdf = pdfMake.createPdf(docDefinition);  
    subirProgramaSemestral();
    pdf.download(filename);
}

export default PdfProgramaSemestral