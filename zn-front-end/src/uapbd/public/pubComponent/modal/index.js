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
    NCDiv, NCHotKeys, NCTooltip
} = base;
import './index.less'
class MyModal extends Component{
    constructor(props){
        super(props);
        this.state={
            showModal: false,
            json: {}
        };
        this.exiting = false;
    }
    componentWillReceiveProps(nextProps, nextState){
        
    }
    componentWillMount() {
        let callback= (json) =>{

            this.setState({json:json})
        }
        getMultiLang({moduleId:['38200'],domainName:'resa',currentLocale:'simpchn',callback});
    }
   
    render(){
        let {title, size, showFooter, children, closeFn, sureFn,fieldid, showModal} = this.props;
        return (
            <div>
                <Modal
                    className={`${this.props.className} selfModal`}
                    fieldid={fieldid}
                    show={showModal && !this.exiting}
                    onHide={() => closeFn()}
                    autoFocus={false}
                    enforceFocus={false}
                    size={size}
                    onExit={() => {
                        // 隐藏开始
                        this.exiting=true
                    }}
                    onExited={() => {
                        this.exiting=false;
                    }}
                    ref={NCModal => (this.NCModal = NCModal)}
                >
					<NCHotKeys
						keyMap={{
							sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
							cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
						}}
						handlers={{
							sureBtnHandler: () => {
								if (this.NCModal && this.NCModal.isTopModal()) {
									sureFn();
								}
							},
							cancelBtnHandler: () => {
								if (this.NCModal && this.NCModal.isTopModal()) {
									closeFn();
								}
							}
						}}
						className="simpleModal-hotkeys-wrapper"
						focused={true}
						attach={document.body}
						display="inline-block"
					/>
                    <Modal.Header closeButton>
                        <Modal.Title >{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {children}
                    </Modal.Body>
                    {
                        showFooter &&
                        <Modal.Footer>
                            <NCTooltip
                                placement="top"
                                inverse
                                overlay={`${this.state.json['38200-000021']}  (${
                                    NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
                                })`}
                                trigger={["focus", "hover"]}
                                className="model-helper-overlay"
                            >
                                <Button onClick={() => sureFn()  } colors="primary" fieldid='confirm' > 
                                    {this.state.json['38200-000021']}(<span className="text-decoration-underline">Y</span>)
                                </Button>
                            </NCTooltip>
                            <NCTooltip
                                placement="top"
                                inverse
                                overlay={`${this.state.json['38200-000022']}  (${
                                    NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                                })`}
                                trigger={["focus", "hover"]}
                                className="model-helper-overlay"
                            >
                                <Button  onClick={() => closeFn() } fieldid='cancel'> 
                                    {this.state.json['38200-000022']}(<span className="text-decoration-underline">N</span>)
                                </Button>
                            </NCTooltip>

                            
                        </Modal.Footer>

                    }
                </Modal>
            </div>
        )
    }
}

{/* <Button fieldid='confirm' onClick={() => sureFn()  } colors="primary">{this.state.json['38200-000021']}</Button>
<Button fieldid='cancel' onClick={() => closeFn() } shape="border" style={{marginRight: 50}}>
    {this.state.json['38200-000022']}
</Button> */}

export default MyModal;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65