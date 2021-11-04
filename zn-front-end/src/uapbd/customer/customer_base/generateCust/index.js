//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {ajax, base, toast } from 'nc-lightapp-front';
export  default  function(props){
    const{form} = props;
    const{createForm} = form;
    return(
        <div>
            <div className="nc-bill-form-area">
                {createForm(props.config.createSupplier, {
                    onAfterEvent: modalAfterEvent
                })}
            </div>
        </div>
    )
}
function modalAfterEvent(){

}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65