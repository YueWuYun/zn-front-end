//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 Created By liqiankun on 2019/3/4
 弹框的外骨架
 **/

import {Component} from 'react';
import { base, getMultiLang } from 'nc-lightapp-front';
const {
    NCModal: Modal,
    NCButton: Button,
    NCDiv
} = base;

class MyModal extends Component{
    constructor(props){
        super(props);
        this.state={
            showModal: false,
            json: {}
        }
    }
    componentWillMount() {
        console.log('modal::::');
        let callback= (json) =>{

            this.setState({json:json})
        }
        getMultiLang({moduleId:['38200'],domainName:'resa',currentLocale:'simpchn',callback});
    }
    render(){
        let {title,minHeight, size, showFooter, children, closeFn,sureFn,fieldid, showModal} = this.props;
        console.log('render::', title, showFooter, children);
        let innrStyle = size =='sm' ? {}: this.props.style
        return (
            <div>
                <Modal
                    fieldid={fieldid}
                    show={showModal}
                    onHide={() => closeFn()}
                    autoFocus={false}
                    enforceFocus={false}
                    size={size}
                >
                    <Modal.Header closeButton>
                        <Modal.Title fieldid={title}>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{...innrStyle}}>
                        {children}
                    </Modal.Body>
                    {
                        showFooter &&
                        <Modal.Footer>
                            <Button fieldid='confirm' onClick={ sureFn } colors="primary">{this.state.json['38200-000021']}</Button>
                            <Button fieldid='cancel' onClick={ closeFn } shape="border" style={{marginRight: 50}}>
                                {this.state.json['38200-000022']}
                            </Button>
                        </Modal.Footer>

                    }
                </Modal>
            </div>
        )
    }
}



export default MyModal;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65