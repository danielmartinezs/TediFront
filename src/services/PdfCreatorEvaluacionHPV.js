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
            text: 'Alumno(a): '+datos[0].nombre+' '+datos[0].apellido,
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45]
        }
    ];

    let respuestas = qa;
    console.log(JSON.parse(datos[0].comentarios))
    for(let i = 0; i<respuestas.length; i++){
        respuestas[i].comment = JSON.parse(datos[0].comentarios)
    }
    console.log(respuestas)

    const comments = JSON.parse(datos[0].comentarios).map((comment) => {
        return [
            {
                text: comment.comment,
                fontSize: 11,
                margin: [15, 25, 0, 45]
            }
        ]
    });

    console.log(comments)

    for(let i = 0; i<comments.length; i++){
        console.log(comments[i][0].text)
        if(comments[i][0].text === ''){
            console.log('in')
            comments[i][0].text = 'Sin comentarios'
        }
    }

    console.log(comments)

    for(let i = 0; i<respuestas.length; i++){
        respuestas[i].comment = comments[i]
    }

    respuestas = qa.map((answer, index) => {
        return [
            {
                text: (index+1)+'. '+answer?.pregunta,
                fontSize: 11,
                margin: [15, 25, 0, 45]
            },
            {
                text: answer.value,
                fontSize: 11,
                margin: [15, 25, 0, 45]
            },
            {
                text: answer.comment,
                fontSize: 11,
                margin: [15, 25, 0, 45]
            }
        ]
    });

    console.log(respuestas)

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: [
                    [
                        { text: 'Pregunta', style: 'tableHeader' },
                        { text: 'Respuesta', style: 'tableHeader' },
                        { text: 'Comentarios', style: 'tableHeader'}
                    ],
                    ...respuestas,
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
    subirReporte();
    pdf.download(filename);
}

export default PdfCreator