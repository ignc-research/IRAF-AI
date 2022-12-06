import React, {useEffect, useState} from 'react'
import { ToastHelper } from "../../ToastHelper";
import { PoseEstimationApi } from '../shared/api/PoseEstimationApi';

export default function LogView(props: { type: string, model: any }) {

    const [log, setLog] = useState('')

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        const updateLog = async () => {
            try {
                const result = await new PoseEstimationApi().log(props.type, props.model);
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
        return timeout ? () => clearTimeout(timeout as any) : () => null;
    }, [])
    

      return (
        <pre style={{maxHeight: '320px', maxWidth: '70%', display: 'flex', flexDirection: 'column-reverse'}}>
            {log}
        </pre>
      )
}