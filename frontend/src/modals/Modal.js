import React from 'react';
import './styles2.scss';

/**
 * Modal component
 * @param {{active: boolean, title: string, header: JSX, body: JSX, footer: JSX}} props 
 */
export default function Modal(props) {

    if (!props.active) return null;

    const title = (props.title) ? props.title : '';
    return (
        <div className='modal is-active'>
            <div className='modal-background' onClick={props.closeModal} />
            <div className='modal-card'>
                <header className='modal-card-head'>
                    <p className='modal-card-title title is-marginless'>{title}</p>
                    <div className='has-text-centered is-flex-grow-1'>
                        <div className='is-inline-block'>
                            {props.header}
                        </div>
                    </div>
                    <div className='is-flex-grow-1'>
                        <button className='delete is-pulled-right' onClick={props.closeModal} />
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
