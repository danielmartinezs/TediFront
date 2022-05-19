import { useState } from 'react';
import surveyJson from '../../components/surveyjs';
import { StylesManager, Model } from 'survey-core';
import * as Survey  from 'survey-react';
import 'survey-react/survey.css'
import 'bootstrap/dist/css/bootstrap.min.css';
StylesManager.applyTheme("modern");

function CuestionariosAdmin() {
    const [datos, setDatos] = useState([]);

    const dataHandler = (e) => {
        setDatos(e)
    }

    return(
        <div>
            <Survey.Survey
            json={surveyJson}
            onComplete={(e) => dataHandler(e.valuesHash)}/>
        </div>
    )
}

export default CuestionariosAdmin;