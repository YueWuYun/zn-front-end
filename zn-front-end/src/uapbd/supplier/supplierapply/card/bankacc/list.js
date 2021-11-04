//qhy8HixY3Po98eZdlyVye1FLOhuVkG79QR4tS+UqX8G0+zV8H/p8KWmKFq9k49xy
//主子表列表

import React, { Component } from 'react';
import "./index.less"
import { createPage, ajax, base ,toast} from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;

const queryList = '/nccloud/uapbd/supplierapply/queryBankaccListAction.do'
const deleteUrl = '/nccloud/uapbd/supplierapply/deleteBankaccAction.do'

class List extends Component {
	constructor(props) {
		super(props);
        this.tableId = props.tableId;
        this.selectedRow = null

        //将修改按钮移到行上
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
                    if(this.props.applyType != 3 && this.props.applyType != 4) {
                        btnArray.push('RowBankEdit','BankRowDel')
                    }
        
                    return props.button.createOprationButton(
                        btnArray,
                        {
                            area: "row-action",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                        }
                    )
                }
            });
            this.props.button.setPopContent('BankRowDel', this.props.json['10140SPF-000017']); /* 设置操作列上删除按钮的弹窗提示 */
            this.props.meta.setMeta(meta)
        }
    }
    
    updateButtonStatus() {
        //若是停用和启用的供应商申请单，银行账户是不允许编辑的
        let visibleActions = ['BankRefresh']
        let unVisibleActions = ['BankCancel','BankSave', 'BankSaveAdd', 'BankBack','BankCardRefresh','BankEdit', 'BankDelete']
        if(this.props.applyType == 3 ||this.props.applyType == 4) {
            unVisibleActions.push(...['BankAdd'])
        }
        else {
            visibleActions.push('BankAdd')
        }
        this.props.button.setButtonVisible(visibleActions, true);
        this.props.button.setButtonVisible(unVisibleActions, false);
        if(this.selectedRow == null) {
            this.props.button.setButtonDisabled({BankDelete: true})
        }
        else {
            this.props.button.setButtonDisabled({BankDelete: false})
        }
    }

    componentDidMount() {
        this.getData(this.props)
        setTimeout(() => this.updateButtonStatus(),1)
    }

    tableButtonClick(props, id, text, record, index) {
        switch(id) {
            case "RowBankEdit":
                this.editRow(props, id, text, record, index)
                break
            case "BankRowDel":
                let info = {
                    mainPk: this.props.mainPk,
                    accnum: record.accnum.value,
                    pk_banktype: record.pk_banktype.value
                }
                ajax({
                    url: deleteUrl,
                    data: info,
                    success: res => {
                        this.getData(this.props)
                    }
                })
                break
        }
         
    }

    editRow(props, id, text, record, index) {
        let info = {
            isList: true,
            accnum: record.accnum.value,
            pk_banktype: record.pk_banktype.value,
            cardStatus: 'edit'
        }
        if(this.props.bankaccModalChange) {
            this.props.bankaccModalChange(info)
        }
    }

    getData(props, callback) {
        let data = {
            mainPk: props.mainPk
        }
        ajax({
            url: queryList,
            data,
            success: res => {
                //setTimeout(() => props.table.setAllTableData(props.tableId, res.data[props.tableId]),1);
                if(res && res.data && res.data.hasOwnProperty(props.tableId)) {
                    props.table.setAllTableData(props.tableId, res.data[props.tableId])
                }
                else {
                    props.table.setAllTableData(props.tableId, {rows: []})
                }
            }
        })

        if(callback && typeof callback == 'function') {
            callback()
        }
    }

    buttonClick(props,id) {
        switch(id) {
            case 'BankAdd': 
                let row = this.selectedRow
                let info = {
                    isList: true,
                    cardStatus: 'add'
                }
                if(this.props.bankaccModalChange) {
                    this.props.bankaccModalChange(info)
                }
                break;
            case 'BankEdit':
                row = this.selectedRow
                info = {
                    isList: true,
                    accnum: row.accnum.value,
                    pk_banktype: row.pk_banktype.value,
                    cardStatus: 'edit'
                }
                if(this.props.bankaccModalChange) {
                    this.props.bankaccModalChange(info)
                }
                break;
            case 'BankRefresh':
                this.getData(this.props,() => {
                    this.selectedRow = null
                    this.updateButtonStatus()
                })
                break;
        }
    }

	doubleClick = (record, index, e)=>{
        let info = {
                isList: true,
                cardStatus: 'browse',
                accnum: record.accnum.value,
                pk_banktype: record.pk_banktype.value
        }
        if(this.props.bankaccModalChange) {
            this.props.bankaccModalChange(info)
        }
    }
    
    onRowClick(props,moduleId,record,index) {
        this.selectedRow = record
        this.updateButtonStatus()
	}

	render() {
		let { table, button, search } = this.props;
		let { createSimpleTable } = table;
		let { createButtonApp } = button;
		return (<div className="nc-bill-list">
				<div className='nc-bill-header-area'>
					<div className='header-title-search-area'>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'bank-action',
                            buttonLimit: 3, 
                            onButtonClick: this.buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</div>

				<div style={{height:'10px'}}></div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
                        //showCheck:true,
                        onRowClick: this.onRowClick.bind(this),
                        onRowDoubleClick: this.doubleClick.bind(this),
                        showIndex: true
					})}
				</div>
                
			</div>
        );
	}
}

export default List

//qhy8HixY3Po98eZdlyVye1FLOhuVkG79QR4tS+UqX8G0+zV8H/p8KWmKFq9k49xy