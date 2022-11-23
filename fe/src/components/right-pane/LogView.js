import React, {useEffect, useState} from 'react'
import Requests from '../shared/Requests';
import { ToastHelper } from "../../ToastHelper";

export default function LogView(props) {

    const [log, setLog] = useState('')

    useEffect(() => {
        let timeout = null;
        const updateLog = async () => {
            try {
                const result = await Requests.log(props.type, props.model);
                setLog(result)
            }
            catch(e) {
                ToastHelper.error('Could not get the log');
            }
            finally {
                timeout = setTimeout(updateLog, 5000);
            }
        }
        timeout = setTimeout(updateLog, 0);
        return () => clearTimeout(timeout);
    }, [])
    

      return (
        <pre style={{maxHeight: '320px', maxWidth: '70%', display: 'flex', flexDirection: 'column-reverse'}}>
            {log}
        </pre>
      )
}