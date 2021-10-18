/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base, toast } from 'nc-lightapp-front';
import './index.less';
let { NCModal, NCButton, NCTextArea } = base;

export default class Modal extends Component {
    static defaultProps= {
        title: '',
        label: '',
        content: '',
        isRequire: true,
        size: 'sm',
        okText: '确定',
        closeText: '取消',
        okShow: true,
        closeShow: true,
        className: '',
        placeholder: '',
        maxlen: 100
    };
    
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.content!== this.props.content) {
            this.setState({
                value: nextProps.content
            });
        }
    }

    strlen = str => { 
        str+= '';
        let len = 0, lens= 0;  
        for (let i=0; i<str.length; i++) {  
            if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {  
                len += 2;  
            } else {  
                len ++;  
            } 
            lens++; 
        }  
        return {len, lens};  
    }
    
	render() {
        let { title, size, show, content, onOk, onClose, okText, closeText, className, okShow, closeShow, label, isRequire, placeholder, maxlen }= this.props;
        let { value }= this.state;
        return (
            <NCModal 
                animation={false}
			    backdrop="static"
                show= {show}
                onHide = {onClose}
                className= {`zijin-modal ${size} ${className}`}
            >
                <NCModal.Header closeButton>
                    <NCModal.Title>{title}</NCModal.Title>
                </NCModal.Header>

                <NCModal.Body>
                    <div className="area-box">
                        <span className="modal-label">{isRequire && <span className="require-icon">*</span>}{label}</span>
                        <NCTextArea
                            value={value}
                            placeholder={placeholder}
                            onChange={e => {
                                if (e.length > maxlen) {
                                    e= e.substr(0, maxlen);
                                }
                                this.setState({
                                    value: e
                                });
                            }}
                        />
                        <span className="value-length">
                            <span className="normal-length">{value.length} </span>
                            / 
                            <span className="max-length"> {maxlen}</span>
                        </span>
                    </div>
                </NCModal.Body>

                <NCModal.Footer>
                    {okShow && <NCButton 
                        className="button-primary" 
                        onClick={() => {
                            if (isRequire && !value) {
                                toast({color: 'warning', content: `请输入${label}`});
                                return;
                            }
                            onOk && onOk();
                        }}
                    >{okText}</NCButton>}
                    {closeShow && <NCButton 
                        onClick={() => {
                            onClose && onClose();
                        }}
                    >{closeText}</NCButton>}
                </NCModal.Footer>

            </NCModal>
        );
	}
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/