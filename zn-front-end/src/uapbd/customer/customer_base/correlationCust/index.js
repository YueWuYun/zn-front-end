//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import {ajax, base, toast } from 'nc-lightapp-front';
export  default  function CorrelationCust(props){
    const{form} = props;
    const{createForm} = form;
    return(
        <div>
            <div className="nc-bill-form-area">
                {createForm(props.config.associateSup, {
                    onAfterEvent:modalAfterEvent
                })}
            </div>
        </div>
    )

}
function modalAfterEvent(){
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65