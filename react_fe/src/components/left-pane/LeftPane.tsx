import Collapsable from "../shared/Collapsable"
import React, { useEffect, useState } from "react";
import { GeneratorApi } from "../shared/api/GeneratorApi";
import URDFLoader from "urdf-loader";
import { LoadingManager } from 'three';

export default function LeftPane() {

    const [urdfs, setUrdfs] = useState([]);

    useEffect(() => {
        new GeneratorApi().urdfs().then(x => {
            setUrdfs(x);
            console.log(x);
        });
        return () => setUrdfs([]);
    }, [])

    const clickUrdf = (urdf: string) => {
        const manager = new LoadingManager();
        const loader = new URDFLoader( manager );
        loader.packages = {
            packageName : './package/dir/'            // The equivalent of a (list of) ROS package(s):// directory
        };
        loader.load(
        'T12/urdf/T12.URDF',                    // The path to the URDF within the package OR absolute
        robot => {

            // // The robot is loaded!
            // scene.add( robot );

        }
        );
    };

    return (
        <Collapsable title="Unknown" collapsed={true} side="left">
            <div className="text-white">
            {
                urdfs.map((urdf, idx) => <div key={idx} onClick={() => clickUrdf(urdf)}>{urdf}</div>)
            }
            </div>
        </Collapsable>
    )
}