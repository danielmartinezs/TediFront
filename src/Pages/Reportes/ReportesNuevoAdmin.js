import React from 'react'
import {Accordion} from'react-bootstrap'
import pdf from './ReporteSemestral.pdf'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function ReportesNuevoAdmin() {

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [
        {
            text: "HELLO CLIENT WORLD",
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

    pdfMake.createPdf(docDefinition).download();
    /* return (
        <div className='text-center'>
            <h1>Edición de Reportes</h1>
        </div>
    ) */
}

export default ReportesNuevoAdmin