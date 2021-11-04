//ewqCnZNx8RypFm9/mjEwtOyxPrQLC75yZBhZnv5LCvT2SFHS6izKX2jBZV9rE24f
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { timingSafeEqual } from 'crypto';
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;

const queryCardUrl = '/nccloud/uapbd/supplierapply/queryBankaccCardAction.do'
const saveUrl = '/nccloud/uapbd/supplierapply/saveBankaccAction.do'
const deleteUrl = '/nccloud/uapbd/supplierapply/deleteBankaccAction.do'
const exFieldUrl = '/nccloud/uapbd/supplierapply/supExField.do'

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId1 = this.props.formId1;
		this.formId2 = this.props.formid2;
		this.tableId = this.props.cardTableId;
		this.cardStatus = this.props.cardStatus
		
		//关于过滤当前是哪条银行账户信息的字段
		this.accnum = this.props.accnum
		this.pk_banktype = this.props.pk_banktype
		this.state = {
			pk_org : '',
			title_code : '',
			totalcount : 0,
			applycount : 0,
			showAccbase: true,
			showNetBank: false,
			refresh: 0
		}

		//将设为默认按钮移到行上
        let meta = this.props.meta.getMeta()
        let hasOprColumn = false
        meta[this.tableId].items.forEach(item => {
            if(item.attrcode == 'opr') {
                hasOprColumn = true
            }
        })
        if(!hasOprColumn) {
            meta[this.tableId].items.push({
                itemtype: "customer",
                attrcode: 'opr',
                label: this.props.json['10140SPF-000019'],/* 国际化处理： 操作*/
                fixed: 'right',
                className : 'tab le-opr',
                visible: true,
                render: (text, record, index) => {
        
                    let btnArray = []

                    //若是供应商申请单的申请类型为启用或者停用的话，那么不显示行编辑按钮
                    if(this.props.applyType != 3 && this.props.applyType != 4 && !record.values.isdefault.value) {
                        btnArray.push('SetDefault')
                    }
        
                    return props.button.createOprationButton(
                        btnArray,
                        {
                            area: "curr-body",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                        }
                    )
                }
            });
            this.props.button.setPopContent('SetDefault', this.props.json['10140SPF-000063']); /* 设置操作列上删除按钮的弹窗提示 */
            this.props.meta.setMeta(meta)
        }
	}

	componentDidMount() {
		let cardStatus = this.cardStatus
		if(cardStatus && cardStatus == 'add') {
			setTimeout(() => this.props.form.EmptyAllFormValue(this.props.formId1),1)
			setTimeout(() => this.props.form.EmptyAllFormValue(this.props.formId2),1)
			setTimeout(() => this.props.cardTable.setTableData(this.props.cardTableId,{rows : []}),1)
			setTimeout(() => this.props.form.setFormStatus(this.props.formId1,'edit'),1)
			setTimeout(() => this.props.form.setFormStatus(this.props.formId2,'edit'),1)
			setTimeout(() => this.props.cardTable.setStatus(this.props.cardTableId,'edit'),1)

			ajax({
                url: exFieldUrl,
                data: {
                    pk_country: this.props.form.getFormItemsValue('supplier_baseInfo','pk_country').value,
                    operation: "bankinfo"
                },
                success: (res) => {
                    setTimeout(() => {
                        if(res.data.pk_currtype) {
                            this.props.cardTable.addRow(this.props.cardTableId,0,{pk_currtype: {
                                value: res.data.pk_currtype,
                                display: res.data.currtypename
                            }})
                            let accNameValue = this.props.form.getFormItemsValue('supplier_baseInfo','name')
                            this.props.form.setFormItemsValue(this.props.formId1,{accname: {
                                value: accNameValue.name.value,
                                display: accNameValue.name.display
                            }})
                        }
                        this.props.form.setFormItemsValue(this.props.formId1, {enablestate: {
                            value: '1',
                            display: this.props.json['10140SPF-000061']
                        }})
                    })
                }
            })
		}
		else if(cardStatus && cardStatus == 'edit') {
			this.getData(this.props.mainPk,this.accnum,this.pk_banktype)
			setTimeout(() => this.props.form.setFormStatus(this.props.formId1,'edit'),1)
			setTimeout(() => this.props.form.setFormStatus(this.props.formId2,'edit'),1)
			setTimeout(() => this.props.cardTable.setStatus(this.props.cardTableId,'edit'),1)
		}
		else if(cardStatus && cardStatus == 'browse') {
			this.getData(this.props.mainPk,this.accnum,this.pk_banktype)
		}
		setTimeout(() => this.updateButtonStatus(),1)
	}

	updateButtonStatus() {
		let cardStatus = this.cardStatus
		let visibleActions = []
		let unVisibleActions = []
        this.props.button.setButtonDisabled({BankDelLine: true})
        this.props.button.setButtonDisabled({BankDelete: false})
		if(this.props.applyType == 3 || this.props.applyType == 4) {
			this.props.button.setButtonVisible(['BankRefresh','BankCardRefresh'], true)
			this.props.button.setButtonVisible(['BankCancel', 'BankSaveAdd', 'BankSave','BankRefresh','BankBack','BankAddLine','BankDelLine','BankAdd','BankEdit','BankDelete','SetDefault'], false)
			this.setState({
				backVisible: true
			})
		}
        else if(cardStatus && cardStatus == 'browse') {
			this.props.button.setButtonVisible(['BankAdd','BankEdit','BankDelete','BankRefresh','BankCardRefresh','SetDefault'],true);
			this.props.button.setButtonVisible(['BankCancel','BankSave', 'BankSaveAdd', 'BankRefresh','BankBack','BankAddLine','BankDelLine'],false);
			this.setState({
				backVisible: true
			})
		}
		else {
            visibleActions = ['BankCancel','BankSave', 'BankAddLine','BankDelLine']
            unVisibleActions = ['BankAdd','BankEdit','BankDelete','BankRefresh','BankBack','BankRefresh','BankCardRefresh','SetDefault']

            if(cardStatus && cardStatus == 'add') {
                visibleActions.push('BankSaveAdd')
            }
            else {
                unVisibleActions.push('BankSaveAdd')
            }
			this.props.button.setButtonVisible(unVisibleActions, false);
            this.props.button.setButtonVisible(visibleActions, true);
			this.setState({
				backVisible: false
			})
		}
	}
	
	tableButtonClick(props, id, text, record, index) {
		let pk_currtype = record.values.pk_currtype.value

		//对于设为默认的操作，前端处理下：当前银行账户存在默认币种，默认币种由其中一个变为另外一个的情形
		//对于多个银行账户且其他银行账户含有默认币种，然后设置当前银行账户的一个币种为默认币种的情形，后端做处理
		let allRow = this.props.cardTable.getAllRows(this.props.cardTableId)
		allRow.forEach(row => {
			if(row.values.pk_currtype.value == pk_currtype) {
				row.values.isdefault = {
					value: true,
					display: this.props.json['10140SPF-000012']/* 国际化处理： 是*/
				}
			}
			else {
				row.values.isdefault = {
					value: false,
					display: this.props.json['10140SPF-000013']/* 国际化处理： 否*/
				}
			}
		})
		this.props.cardTable.setTableData(this.props.cardTableId,{rows: allRow},() => {
			this.buttonClick(this.props,'BankSave')	
		})
	}

	getData(mainPk,accnum,pk_banktype) {
		let data = {
			mainPk,
			accnum,
			pk_banktype
		}

		ajax({
			url: queryCardUrl,
			data,
			success: res => {
				this.props.form.setAllFormValue({[this.props.formId1]: res.data.head.supbankacc})
				this.props.form.setAllFormValue({[this.props.formId2]: res.data.head.supbankacc})
				if(res.data.body[this.props.cardTableId])
					this.props.cardTable.setTableData(this.props.cardTableId,res.data.body[this.props.cardTableId])
				
			}
		})
	}

	buttonClick(props,id) {
		switch(id) {
			case 'BankAdd':
				this.props.form.EmptyAllFormValue(this.props.formId1)
				this.props.form.EmptyAllFormValue(this.props.formId2)
				this.props.cardTable.setTableData(this.props.cardTableId,{rows : []})
				setTimeout(() => this.props.form.setFormStatus(this.props.formId1,'add'),1)
				setTimeout(() => this.props.form.setFormStatus(this.props.formId2,'add'),1)
				setTimeout(() => this.props.cardTable.setStatus(this.props.cardTableId,'edit'),1)
				this.cardStatus = 'add'
				setTimeout(() => this.updateButtonStatus(),1)

				ajax({
					url: exFieldUrl,
					data: {
						pk_country: this.props.form.getFormItemsValue('supplier_baseInfo','pk_country').value,
						operation: "bankinfo"
					},
					success: (res) => {
						if(res.data.pk_currtype) {
							this.props.cardTable.addRow(this.props.cardTableId,0,{pk_currtype: {
								value: res.data.pk_currtype,
								display: res.data.currtypename
							}})
							let accNameValue = this.props.form.getFormItemsValue('supplier_baseInfo','name')
							this.props.form.setFormItemsValue(this.props.formId1,{accname: {
								value: accNameValue.name.value,
								display: accNameValue.name.display
							}})
						}
						//启用状态字段修正一下
						this.props.form.setFormItemsValue(this.props.formId1, {enablestate: {
							value: '1',
							display: this.props.json['10140SPF-000061']
						}})
					}
				})
				break;
			case 'BankEdit': 
				this.props.form.setFormStatus(this.props.formId1,'edit')
				this.props.form.setFormStatus(this.props.formId2,'edit')
				this.props.cardTable.setStatus(this.props.cardTableId,'edit')
				this.cardStatus = 'edit'
				this.props.cardTable.selectAllRows(false)
				setTimeout(() => this.updateButtonStatus(),1)
				break;
			case 'BankSave':
				let finalData = {
					isAdd: this.cardStatus == 'add' ? true : false
				}
				if(!this.getValueFromForm(finalData)) {
					return
				}
				finalData.mainPk = this.props.mainPk
				ajax({
					url: saveUrl,
					data: finalData,
					success: res => {
						this.props.form.setFormStatus(this.props.formId1,'browse')
						this.props.form.setFormStatus(this.props.formId2,'browse')
						this.props.cardTable.setStatus(this.props.cardTableId,'browse') 
						this.props.form.setAllFormValue({[this.props.formId1]: res.data.head.supbankacc})
						this.props.form.setAllFormValue({[this.props.formId2]: res.data.head.supbankacc})
						if(res.data.body[this.props.cardTableId])
							this.props.cardTable.setTableData(this.props.cardTableId,res.data.body[this.props.cardTableId])
						//this.getData(this.props.mainPk,this.accnum,this.pk_banktype)
						this.accnum = res.data.head.supbankacc.rows[0].values.accnum.value
						this.pk_banktype = res.data.head.supbankacc.rows[0].values.pk_banktype.value
						this.cardStatus = 'browse'
						this.updateButtonStatus()
					}
				})
				break;
			case 'BankDelete':
				//this.props.modal.show('deleteBankacc')
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.json['10140SPF-000008'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
					content: this.props.json['10140SPF-000009'],             // 提示内容,非必输/* 国际化处理： 您确定要删除所选数据吗*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.json['10140SPF-000010'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.props.json['10140SPF-000011'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.delConfirm.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break;
			case 'BankCancel':
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.json['10140SPF-000027'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.props.json['10140SPF-000028'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.json['10140SPF-000010'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.props.json['10140SPF-000011'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						//特殊处理一下新增时卡片界面取消按钮的操作
						if(this.cardStatus == 'add') {
							let info = {
								isList: false
							}
							//跳转回列表界面
							this.props.bankaccModalChange(info)
							return
						}
						this.props.form.cancel(this.formId1)
						this.props.form.cancel(this.formId2)
						this.props.cardTable.resetTableData(this.tableId)
						this.props.form.setFormStatus(this.props.formId1,'browse')
						this.props.form.setFormStatus(this.props.formId2,'browse')
						this.props.cardTable.setStatus(this.props.cardTableId,'browse') 
						this.cardStatus = 'browse'
						this.updateButtonStatus()
					}
				})
				break
			case 'BankAddLine':
				setTimeout(() => this.props.cardTable.addRow(this.props.cardTableId),1)
				break;
			case 'BankDelLine':
				let checkedRows = this.props.cardTable.getCheckedRows(this.props.cardTableId)
				let delIndex = []
				checkedRows.forEach(item => {
					delIndex.push(item.index)
				})
				setTimeout(() => this.props.cardTable.delRowsByIndex(this.props.cardTableId,delIndex))
				break
			case 'SetDefault':
				checkedRows = this.props.cardTable.getCheckedRows(this.props.cardTableId)
				if(checkedRows.length > 0) {
					let checkedRow = checkedRows[0]
					let pk_currtype = checkedRow.data.values.pk_currtype.value

					//对于设为默认的操作，前端处理下：当前银行账户存在默认币种，默认币种由其中一个变为另外一个的情形
					//对于多个银行账户且其他银行账户含有默认币种，然后设置当前银行账户的一个币种为默认币种的情形，后端做处理
					let allRow = this.props.cardTable.getAllRows(this.props.cardTableId)
					allRow.forEach(row => {
						if(row.values.pk_currtype.value == pk_currtype) {
							row.values.isdefault = {
								value: true,
								display: this.props.json['10140SPF-000012']/* 国际化处理： 是*/
							}
						}
						else {
							row.values.isdefault = {
								value: false,
								display: this.props.json['10140SPF-000013']/* 国际化处理： 否*/
							}
						}
					})
					this.props.cardTable.setTableData(this.props.cardTableId,{rows: allRow},() => {
						this.buttonClick(this.props,'BankSave')	
					})
					//this.buttonClick(this.props,'BankSave')	
					// if(!checkedRow.data.values.isdefault.value) {
					// 	this.props.cardTable.setValByKeyAndIndex(this.props.cardTableId,checkedRow.index, 'isdefault', {value: true,display: '是'})
					// 	this.buttonClick(this.props,'BankSave')
					// }
				}
				break
			case 'BankBack':
				let info = {
					isList: false
				}
				//跳转回列表界面
				this.props.bankaccModalChange(info)
				break
			case 'BankCardRefresh':
				this.getData(this.props.mainPk,this.accnum,this.pk_banktype)
                break
            case "BankSaveAdd":
                finalData = {
                    isAdd: this.cardStatus == 'add' ? true : false
                }
                if(!this.getValueFromForm(finalData)) {
                    return
                }
                finalData.mainPk = this.props.mainPk
                ajax({
                    url: saveUrl,
                    data: finalData,
                    success: res => {
                        this.buttonClick(this.props, 'BankAdd')
                    }
                })
                break
		}
	}

	getValueFromForm(finalData) {
		let formValue1 = this.props.form.getAllFormValue(this.props.formId1)
		let formValue2 = this.props.form.getAllFormValue(this.props.formId2)
		delete formValue1.rows[0].values.bankaccsub
		delete formValue2.rows[0].values.bankaccsub
		finalData.form1 = {model: formValue1}
		finalData.form2 = {model: formValue2}
		let currTypeInfo = this.props.cardTable.getAllRows(this.props.cardTableId)
		finalData.cardTable = {
			model: {
				rows: this.props.cardTable.getAllRows(this.props.cardTableId)
			}
		}

		//构建必输项校验错误提示信息（isCheckNow不提供相应的提示信息？？？？？）
		let emtpyNesItems = []
		let meta = this.props.meta.getMeta()
		meta[this.formId1].items.forEach(item => {
			if(item.required) {
				if(formValue1.rows[0].values[item.attrcode].value == null || formValue1.rows[0].values[item.attrcode].value == '') {
					emtpyNesItems.push(item.label)
				}
			}
		})

		//提示
		let formErrorMsg = null
		if(emtpyNesItems.length > 0) {
			formErrorMsg = `${this.props.json['10140SPF-000018']}：\n[${emtpyNesItems.join('],[')}]`/* 国际化处理： 下列字段值不能为空*/
			toast({content: formErrorMsg, color: 'danger'})
			return false
		}

		if(currTypeInfo == null || currTypeInfo.length == 0) {
			toast({color: 'warning',content: this.props.json['10140SPF-000014']})/* 国际化处理： 客商银行账户必须设置一个币种！*/
			return false
		}
		else {
			return true
		}
	}

	onAfterEvent(props, moduleId, key, value, oldValue) {
		if(oldValue == null || oldValue.value == null || (oldValue.value && value.value != oldValue.value)) {
			if(key == 'pk_banktype') {
				let meta = props.meta.getMeta()
				let targetItem = meta.accbasinfo.items.find((item) => item.attrcode == 'pk_bankdoc')
				targetItem.queryCondition = () => {
					return {
						pk_banktype: value.value
					}
				}
				props.meta.setMeta(meta)
			}
			else if(key == 'pk_bankdoc') {
				if(value && value.value) {
					ajax({
						url: exFieldUrl,
						data: {operation: 'bankdoc', primaryKey: value.value},
						success: (res) => {
							if(res.data) {
								let setObj = {
									pk_banktype: {
										value: res.data.value,
										display: res.data.display
									}
								}
								this.props.form.setFormItemsValue(this.formId1, setObj)
								this.props.form.setFormItemsDisabled(this.formId1,{pk_banktype: true})
							}
						}
					})
				}
				else {
					this.props.form.setFormItemsDisabled(this.formId1,{pk_banktype: false})
					this.props.form.setFormItemsValue(this.formId1, {pk_banktype: {value: null, display: null}})
				}
			}
		}
	}

	getTableHead() {
		let {createButtonApp} = this.props.button
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
						area: 'bank-body',
						onButtonClick: this.buttonClick.bind(this)
					})}
				</div>
			</div>
		)
	}

	cardTableSelectChange() {
		let checkedRows = this.props.cardTable.getCheckedRows(this.props.cardTableId)
		this.props.button.setButtonDisabled({'BankDelLine': checkedRows.length <= 0})
	}

	//删除单据
	delConfirm = () => {
		let info = {
			mainPk: this.props.mainPk,
			accnum: this.accnum,
			pk_banktype: this.pk_banktype
		}
		ajax({
			url: deleteUrl,
			data: info,
			success: res => {
				// this.props.form.EmptyAllFormValue(this.props.formId1)
				// this.props.form.EmptyAllFormValue(this.props.formId2)
				// this.props.cardTable.setTableData(this.props.cardTableId,{rows : []})
				//还是直接跳转回卡片界面吧，不然删除啦，刷新啦，都会报错，还要做控制……
				info = {
					isList: false
				}
				//跳转回列表界面
				this.props.bankaccModalChange(info)
			}
		})
	};

	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const {createCardPagination} = cardPagination;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let iconItem = this.state.showAccbase ? 'icon-jiantouxia1' : 'icon-jiantouyou'

		let groupItem = this.state.showAccbase ? "show-form" : "hide-form"

		let iconItem2 = this.state.showNetBank ? 'icon-jiantouxia1' : 'icon-jiantouyou'
		let groupItem2 = this.state.showNetBank ? "show-form" : "hide-form"
		return (
			<div  id='nc-bill-card'>
					<div className="nc-bill-card">
						<NCAffix>
							<div className='nc-bill-header-area'>
								<NCBackBtn className='title-search-detail' style={{'line-height':'32px',display: this.state.backVisible ? 'inline' : 'none'}}
											onClick={ this.buttonClick.bind(this,this.props,'BankBack') }></NCBackBtn>
								<div className='header-title-search-area'>
									
								</div>
								<div className="header-button-area">
									{createButtonApp({
										area: 'bank-action',//按钮注册中的按钮区域
										//buttonLimit: 5, 
										onButtonClick: this.buttonClick.bind(this) 
										//popContainer: document.querySelector('.header-button-area')
									})}
								</div>
			                </div>
						</NCAffix>
						<div className="nc-bill-form-area">
							<div className='group-form-wrapper'>
								<div className="group-form-name">
									<span
										className={`toggle-form-icon iconfont ${iconItem}`}
										onClick={() => {
											let show = !this.state.showAccbase
											this.setState({
												showAccbase: show
											});
										}}
									/>
									<span className="name">{this.props.json['10140SPF-000015']/* 国际化处理： 账户基本信息*/}</span>
								</div>
								<div className={`group-form-item ${groupItem} `}>
									{createForm(this.props.formId1, {
										onAfterEvent: this.onAfterEvent.bind(this)
									})}
								</div>
							</div>
							<div className='group-form-wrapper'>
								<div className="group-form-name">
									<span
										className={`toggle-form-icon iconfont ${iconItem2}`}
										onClick={() => {
											let show = !this.state.showNetBank
											this.setState({
												showNetBank: show
											});
										}}
									/>
									<span className="name">{this.props.json['10140SPF-000016']/* 国际化处理： 网银信息*/}</span>
								</div>
								<div className={`group-form-item ${groupItem2} `}>
									{createForm(this.props.formId2, {
										
									})}
								</div>
							</div>
						</div>
						<div className="nc-bill-table-area">
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this),
								selectedChange: this.cardTableSelectChange.bind(this),
								onSelectedAll: this.cardTableSelectChange.bind(this),
								showIndex:true,
								showCheck: true
							})}
						</div>
						{createModal('deleteBankacc', {
							title: this.props.json['10140SPF-000008'],/* 国际化处理： 确认删除*/
							content: this.props.json['10140SPF-000017'],/* 国际化处理： 您确定要删除所选数据吗?*/
							beSureBtnClick: this.delConfirm.bind(this)
						})}
					</div>
			</div>
			
		);
	}
}

export default Card

//ewqCnZNx8RypFm9/mjEwtOyxPrQLC75yZBhZnv5LCvT2SFHS6izKX2jBZV9rE24f