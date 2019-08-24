import React, { useState, useEffect } from 'react';
import './styles2.scss';

/**
 * Modal component
 * @param {{title: string, header: JSX.Element, body: JSX.Element, footer: JSX.Element}} props 
 */
export default function Modal(props) {

    // The active state decides if modal is shown or not. 
    // When the modal is inactive, it will be active again when the body changes
    const [active, setActive] = useState(true);
    const closeModal = () => setActive(false);
    useEffect(() => {
        setActive(true);
    }, [props.body]);

    if (!active) return null;

    const title = (props.title) ? props.title : '';
    return (
        <div className='modal is-active'>
            <div className='modal-background' onClick={closeModal} />
            <div className='modal-card'>
                <header className='modal-card-head'>
                    <p className='modal-card-title title is-marginless'>{title}</p>
                    <div className='has-text-centered is-flex-grow-1'>
                        <div className='is-inline-block'>
                            {props.header}
                        </div>
                    </div>
                    <div className='is-flex-grow-1'>
                        <button className='delete is-pulled-right' onClick={closeModal} />
                    </div>
                </header>
                <section className='modal-card-body is-flex'>
                    {props.body}
                </section>
                <footer className='modal-card-foot is-flex-end'>
                    {props.footer}
                </footer>
            </div>
        </div>
    );
}
