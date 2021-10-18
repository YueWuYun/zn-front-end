/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import './index.less';
let { NCModal, NCButton } = base;

export default class SbModal extends Component {
    static defaultProps= {
        show: false,
        title: '',
        size: 'sm',
        lang: {
            ok: '确定',
            close: '取消',
        },
        okShow: true,
        closeShow: true,
        className: ''
    };
    
	constructor(props) {
		super(props);
		this.state = {
			
		};
    }
    
	render() {
        let { title, size, show, content, onOk, onClose, lang, className, okShow, closeShow }= this.props;
        let { close, ok }= lang;
        return (
            <NCModal 
                animation={false}
			    backdrop="static"
                show= {show}
                fieldid={title}
                onHide = {onClose}
                className= "popover-shadow"
            >
                <NCModal.Header closeButton>
                    <NCModal.Title>{title}</NCModal.Title>
                </NCModal.Header>

                <NCModal.Body>
                    {content}
                </NCModal.Body>

                <NCModal.Footer>
                    {okShow && <NCButton 
                        fieldid="sure"
                        className="button-primary" 
                        onClick={() => {
                            onOk && onOk();
                        }}
                    >{ok}</NCButton>}
                    {closeShow && <NCButton 
                        fieldid="cancel"
                        onClick={() => {
                            onClose && onClose();
                        }}
                    >{close}</NCButton>}
                </NCModal.Footer>

            </NCModal>
        );
	}
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/