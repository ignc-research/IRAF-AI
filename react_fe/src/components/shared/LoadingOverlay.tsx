import React, { useEffect, useState } from 'react'

export default function LoadingOverlay(props: {isOpen: boolean, children: any}) {

    const [isOpen, setIsOpenState] = useState(true);
    const setIsOpen = (val: boolean) => {
        setIsOpenState(val);
    } 
    useEffect(() => setIsOpen(props.isOpen), [props.isOpen]);

    return (
        <div className={"position-absolute text-white start-0 top-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-secondary bg-gradient bg-opacity-75 " + (isOpen ? 'd-block' : 'd-none')} style={{zIndex: 100000}}>
          <img width="128" height="128" className='mb-2' src="/loading.gif" />
          {props.children}
        </div>
    );
}