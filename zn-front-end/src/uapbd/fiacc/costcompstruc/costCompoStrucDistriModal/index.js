//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage,base,getMultiLang} from 'nc-lightapp-front';
import {module,multiLangCode} from '../list/constants';
import SubCf from '../subCF';
let { NCModal: Modal, NCButton: Button,NCTooltip ,NCHotKeys,NCDiv,NCModal} = base;
class CostCompoStrucDistriModal extends Component {
	constructor(props) {
		super(props);
		this.state={
			transfershowModal:true,//穿梭框是否显示
			json:{}
		}
	}
	componentDidMount() {
		let callback = (json) => {
			this.setState({ json: json }, () => {
			});
		}
		getMultiLang({ moduleId: [multiLangCode], currentLocale: 'simpchn', domainName: module, callback });
		
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.show){
			this.appcode =nextProps.appcode;
			this.pageId = nextProps.pageId;
			if(this.updatepriceflag){
				//initTemplate.call(this, this.props,this.initShow);
			}
			this.updatepriceflag = false;
			
			
		}
	}	

	
	close = () =>{
		this.props.isModalShow();
	}

	confirm = () =>{
		//this.props.isModalShow();
	}
	render() {
		let { title,closeName,confirm,show,form} = this.props;
		let {createForm} = form
		return (
			<div>
				<NCModal
					show={show}
					onHide={this.close.bind(this)}
					size={'lg'}
					backdrop={'static'}
					ref={NCModal => (this.NCModal = NCModal)}
				>
			
						<NCHotKeys
							keyMap={{
								sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
								cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
							}}
							handlers={{
								sureBtnHandler: () => {
									// 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
									if (this.NCModal && this.NCModal.isTopModal()) {
										console.log(
											"createModal  sureBtnHandler 事件回调",
											this.NCModal.isTopModal()
										);
										this.confirm.bind(this)();
									}
								},
								cancelBtnHandler: () => {
									// 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
									if (this.NCModal && this.NCModal.isTopModal()) {
										console.log("createModal cancelBtnHandler 事件回调");
										this.close.bind(this)();
									}
								}
							}}
							className="simpleModal-hotkeys-wrapper"
							focused={true}
							attach={document.body}
							display="inline-block"
						/>
					
					<NCModal.Header closeButton>
						<NCModal.Title>{title}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<NCDiv>
						<SubCf
							showFormModal={this.state.transfershowModal}
							parent={this}
               		 	/>
						</NCDiv>
					</NCModal.Body>

					
						<NCModal.Footer>
						
									<NCTooltip
										placement="top"
										inverse
										overlay={`${confirm}  (${
											NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
										})`}
										trigger={["hover", "focus"]}
										className="model-helper-overlay"
									>
										<Button
											onClick={this.confirm.bind(this)}
											colors="primary"
											tabIndex="0"
										>
											{confirm}(<span className="text-decoration-underline">Y</span>)
										</Button>
									</NCTooltip>

									<NCTooltip
										placement="top"
										inverse
										overlay={`${closeName}  (${
											NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
										})`}
										trigger={["focus", "hover"]}
										className="model-helper-overlay"
									>
										<Button
											onClick={this.close.bind(this)}
											shape="border"
											tabIndex="0"
										>
											{closeName}(<span className="text-decoration-underline">N</span>)
										</Button>
									</NCTooltip>
								
						</NCModal.Footer>
			
				</NCModal>
			</div>
		);
	}
}

CostCompoStrucDistriModal = createPage({})(CostCompoStrucDistriModal);

export default CostCompoStrucDistriModal;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65