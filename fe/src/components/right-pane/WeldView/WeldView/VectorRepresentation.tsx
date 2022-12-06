import React, { useContext } from 'react';

export default function VectorRepresentationView(props: { vector: THREE.Vector3 }) {
    const getNr = (num: number) => Math.abs(num) < .0001 && Math.abs(num) > 0 ? (num).toExponential(3) : num.toFixed(3);
    const x = getNr(props.vector.x);
    const y = getNr(props.vector.y);
    const z = getNr(props.vector.z);
    return (
        <span>({x}, {y}, {z})</span>
    )
}