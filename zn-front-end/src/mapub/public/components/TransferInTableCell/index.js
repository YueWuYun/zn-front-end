
/*
 * @PageInfo: 表格单元格渲染的类传参照样式的穿梭组件 成本类型专用
 */
import React, { Component } from 'react';
import { base, high,toast,getMultiLang } from 'nc-lightapp-front';
let { Transfer } = high;
let { NCModal: Modal, NCButton: Button, NCFormControl: FormControl,NCTooltip ,NCHotKeys} = base;
import './index.less';
let { Header, Body, Footer, Title } = Modal;
export default class PopTransfer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: true,
			keysStr_bak: [], // 取消时恢复用
			valObj: this.keysToValueObj(props.keysStr) ,// 存放单元格的display和value，display用于显示，value用于保存
			json:{}
		};

	

	}

	componentWillMount() {
		let callback = (json) => {
				this.setState({ json: json }, () => {
				})
			}
		getMultiLang({ moduleId: 'public', currentLocale: 'simpchn', domainName: 'mapub', callback })
	    }




	toogleModal = () => {
		let { showModal } = this.state;

		if (!showModal) {
			this.setState({ keysStr_bak: JSON.parse(JSON.stringify(this.props.keysStr || '')) });
		}
		this.setState({ showModal: !showModal });
	};

	onTargetKeysChange = (targetKeys) => {
		let new_targetKeys;
		
		if (typeof targetKeys === 'string') {
			new_targetKeys=targetKeys;
		} else if (targetKeys instanceof Array) {
			//平台默认在第一行数据中加了空字符串！
			new_targetKeys=[];
			for(let i=0;i<targetKeys.length;i++)
			{
				if(targetKeys[i]!=="")
				{
					new_targetKeys.push(targetKeys[i]);
				}
			}
		} else {
			new_targetKeys={ display: '', value: '' };
		}

		let valObj = this.keysToValueObj(new_targetKeys);
		//this.props.onTargetKeysChange(valObj.value); // 将拼接成字符串的key传出去，用于单元格的数据保存
		this.setState({ valObj });
	};

	// 根据 key(id) 从树形嵌套结构中获取某一项
	findItemsByKey = (key, data) => {
		let item = null;
		let process = (tree) => {
			return tree.forEach((ele) => {
				if (ele.key == key) {
					item = ele;
				} else if (ele.children) {
					process(ele.children);
				}
			});
		};
		process(data);
		return item;
	};

	// value字符串转成包含display和value的对象
	keysToValueObj = (keys) => {
		// 传进来的keys可能是逗号分隔的key组成的字符串或者targetkeys数组
		let targetKeys;
		if (typeof keys === 'string') {
			targetKeys = this.keysStrToTargetKeys(keys);
		} else if (keys instanceof Array) {
			targetKeys = keys;
		} else {
			return { display: '', value: '' };
		}

		let valueObj = targetKeys.reduce((prev, cur_key, index) => {
			let curItem = this.findItemsByKey(cur_key, this.props.dataSource);
			if (curItem) {
				return {
					display: index == 0 ? curItem.title : prev.display + ',' + curItem.title,
					value: index == 0 ? curItem.key : prev.value + ',' + curItem.key,
					pkvalue:index == 0 ? curItem.pkvalue : prev.pkvalue + ',' + curItem.pkvalue
				};
			} else {
				return prev;
			}
		}, '');
		return valueObj ? valueObj : { display: '', value: '',pkvalue:'' };
	};

	// 逗号分隔的字符串keys转成穿梭组件的targetKeys数组
	keysStrToTargetKeys = (keysStr) => {
		let targetKeys = keysStr.split(',');
		// 从穿梭组件的数据源中匹配每一个key对应的项，找到说明key有效，找不到说明key无效，就不能放在穿梭的targetkeys中,否则会报错
		targetKeys.forEach((key, index) => {
			let item = this.findItemsByKey(key, this.props.dataSource);
			if (!item) {
				targetKeys.splice(index, 1);
			}
		});
		return targetKeys;
	};

	//确认
	confirm =()=>{
		if(this.props.closeFn){
									
			this.props.closeFn(false);
			this.props.onTargetKeysChange(valObj);
			
		}else{
			let {valObj}=this.state;
			//所选数据校验逻辑
			if(this.props.checkout && !this.props.checkout(valObj)){
				return;
			}
			// 将拼接成字符串的key传出去，用于单元格的数据保存
			this.props.onTargetKeysChange(valObj);
			this.setState({ keysStr_bak:valObj.value});
			this.setState({ showModal: false });
			this.props.closeTransferModal && this.props.closeTransferModal('showTransModal', false);
			!this.props.closeTransferModal && this.props.onBlur(valObj);
		}
	}
	//取消
	cancel =()=>{
		if(this.props.closeFn){
			this.props.closeFn(false);
		}else{
			let valObj_bak = this.keysToValueObj(this.state.keysStr_bak);
			this.setState({ showModal: false });
			!this.props.closeTransferModal && this.props.onBlur(valObj_bak); 
			this.props.closeTransferModal && this.props.closeTransferModal('showTransModal', false);
		}
	}


	render() {
		let { keysStr, modalTitle, disabled, ...others } = this.props;
		let { valObj } = this.state;
		let newTargetKeys = valObj.value.split(',');
		const transferProps = {
			...others,
			targetKeys: newTargetKeys, //this.keysStrToTargetKeys(keysStr),
			onTargetKeysChange: this.onTargetKeysChange,
			showSearch: true,
			showMoveBtn: true,
			lazy: { container: 'modal' } // 解决穿梭在模态框中初始不显示内容的bug
		};
		return (
			<div>
				<div className="table-cell refer">
					<sapn className="u-form-control">
						<div>
							<FormControl
								disabled={disabled}
								className="nc-input refer-input"
								value={this.state.valObj.display}
							/>
						</div>
						<span className="icon-refer" onClick={disabled ? null : this.toogleModal} />
					</sapn>
				</div>

				{
					<Modal className="transfer-modal" show={this.state.showModal}  onHide={ this.cancel } fieldid='transferInTableCell' ref={NCModal => (this.NCModal = NCModal)}>
						
						<NCHotKeys
							keyMap={{
								sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
								cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
							}}
							handlers={{
								sureBtnHandler: () => {
									if (this.NCModal && this.NCModal.isTopModal()) {
										this.confirm.bind(this)();
									}
								},
								cancelBtnHandler: () => {
									if (this.NCModal && this.NCModal.isTopModal()) {
										this.cancel.bind(this)();
									}
								}
							}}
							className="simpleModal-hotkeys-wrapper"
							focused={true}
							attach={document.body}
							display="inline-block"
						/>
						
						<Header>
							<Title fieldid ={modalTitle}>{modalTitle}</Title>
						</Header>
						<Body className='trans-body'>
							<Transfer {...transferProps} />
						</Body>
						<Footer>
							<NCTooltip
								placement="top"
								inverse
								overlay={`${this.state.json['public-000000']}  (${
									NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
								})`}
								trigger={["focus", "hover"]}
								className="model-helper-overlay"
							>
								<Button
									disabled={this.props.editModeParam ? !(this.props.editModeParam=='edit') : false}
									onClick={this.confirm}
									colors="primary"
									fieldid='confirm'
								>
									{this.state.json['public-000000']/* 国际化处理： 确定*/}
									(<span className="text-decoration-underline">Y</span>)
								</Button>
							</NCTooltip>

							<NCTooltip
								placement="top"
								inverse
								overlay={`${this.state.json['public-000001']}  (${
									NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
								})`}
								trigger={["focus", "hover"]}
								className="model-helper-overlay"
                    		>
								<Button
									onClick={this.cancel}
									fieldid='cancel'
								>
									{this.state.json&&this.state.json['public-000001']/* 国际化处理： 取消*/}
									(<span className="text-decoration-underline">N</span>)
								</Button>
							</NCTooltip>
						</Footer>
					</Modal>
				}
			</div>
		);
	}
}
