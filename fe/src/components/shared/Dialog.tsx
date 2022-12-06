import React, { useEffect, useState } from 'react'

export default function Dialog(props: {className?: string, title?: string, children: any, callback?: () => void, confirmText?: string, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {

    const [isOpen, setIsOpenState] = useState(true);
    const setIsOpen = (val: boolean) => {
        setIsOpenState(val);
        props.setIsOpen(val);
    } 
    useEffect(() => setIsOpen(props.isOpen), [props.isOpen]);

    return (
        <div className={"modal text-black" + (isOpen ? ' d-block' : '')} tabIndex={-1}>
            <div className={"modal-dialog modal-dialog-scrollable " + props.className}>
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{props.title}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsOpen(false)}></button>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIsOpen(false)}>Close</button>
                    {props.callback && <button type="button" className="btn btn-primary" onClick={() => props.callback?.call(null)}>{props.confirmText ?? 'Ok'}</button>}
                </div>
                </div>
            </div>
        </div>
    );
}