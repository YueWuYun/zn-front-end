//qhy8HixY3Po98eZdlyVye1FLOhuVkG79QR4tS+UqX8G0+zV8H/p8KWmKFq9k49xy
//主子表列表

import React, { Component } from 'react';
import { createPage, ajax, base, toast, cardCache } from 'nc-lightapp-front';
const { NCPopconfirm, NCIcon, NCTabs, NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;

const queryList = '/nccloud/uapbd/customer/CustAppQueryBankList.do'
const deleteUrl = '/nccloud/uapbd/customer/CustAppDelBank.do'

class List extends Component {
    constructor(props) {
        super(props);
        this.tableId = props.tableId;
        this.selectedRow = null

        //将修改以及删除按钮移到行上
        let meta = this.props.meta.getMeta()
        let hasOprColumn = false
        meta[this.tableId].items.forEach(item => {
            if (item.attrcode == 'opr') {
                hasOprColumn = true
            }
        })
        props.button.setPopContent('BankListDel', this.props.json['10140CUSTPF-000052']) /* 设置操作列上删除按钮的弹窗提示 */
        if (!hasOprColumn) {
            meta[this.tableId].items.push({
                itemtype: "customer",
                attrcode: 'opr',
                label: this.props.json['10140SPF-000019'],/* 国际化处理： 操作*/
                fixed: 'right',
                className: 'tab le-opr',
                visible: true,
                render: (text, record, index) => {

                    let btnArray = ['BankListEdit', 'BankListDel']

                    return props.button.createOprationButton(
                        btnArray,
                        {
                            area: "brow-action",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => { this.tableRowButtonClick(props, id, text, record, index) }
                        }
                    )
                }
            });
            this.props.meta.setMeta(meta)
        }
    }

    tableRowButtonClick(props, id, text, record, index) {
        switch (id) {
            case 'BankListEdit':
                let info = {
                    isList: true,
                    accnum: record.accnum.value,
                    pk_banktype: record.pk_banktype.value,
                    cardStatus: 'edit'
                }
                if (this.props.bankaccModalChange) {
                    this.props.bankaccModalChange(info)
                }
                break
            case 'BankListDel':
                info = {
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

    updateButtonStatus() {
        this.props.button.setButtonVisible(['BankAdd', 'BankRefresh'], true);
        this.props.button.setButtonVisible(['BankEdit', 'BankDelete', 'BankCancel', 'BankSave', 'BankBack', 'BankSaveAdd'], false);
    }

    componentDidMount() {
        this.getData(this.props)
        setTimeout(() => this.updateButtonStatus(), 1)
    }

    getData(props) {
        let data = {
            mainPk: props.mainPk
        }
        ajax({
            url: queryList,
            data,
            success: res => {
                //setTimeout(() => props.table.setAllTableData(props.tableId, res.data[props.tableId]),1);
                if (res && res.data && res.data.hasOwnProperty(props.tableId)) {
                    props.table.setAllTableData(props.tableId, res.data[props.tableId])
                }
                else {
                    props.table.setAllTableData(props.tableId, { rows: [] })
                }
            }
        })
    }

    buttonClick(props, id) {
        switch (id) {
            case 'BankAdd':
                let row = this.selectedRow
                let info = {
                    isList: true,
                    cardStatus: 'add'
                }
                if (this.props.bankaccModalChange) {
                    this.props.bankaccModalChange(info)
                }
                break;
            case 'BankEdit':
                row = this.selectedRow
                console.log(row)
                info = {
                    isList: true,
                    accnum: row.accnum.value,
                    pk_banktype: row.pk_banktype.value,
                    cardStatus: 'edit'
                }
                if (this.props.bankaccModalChange) {
                    this.props.bankaccModalChange(info)
                }
                break;
            case 'BankDelete':
                row = this.selectedRow
                info = {
                    mainPk: this.props.mainPk,
                    accnum: row.accnum.value,
                    pk_banktype: row.pk_banktype.value
                }
                ajax({
                    url: deleteUrl,
                    data: info,
                    success: res => {
                        this.getData(this.props)
                    }
                })
                break;
            case 'BankRefresh':
                this.getData(this.props)
                break;
        }
    }

    doubleClick = (record, index, e) => {
        let info = {
            isList: true,
            cardStatus: 'browse',
            accnum: record.accnum.value,
            pk_banktype: record.pk_banktype.value
        }
        if (this.props.bankaccModalChange) {
            this.props.bankaccModalChange(info)
        }
    }

    onRowClick(props, moduleId, record, index) {
        this.selectedRow = record
    }

    onSelected = () => { }

    render() {
        let { table, button, search, BillHeadInfo } = this.props;
        let { createSimpleTable } = table;
        let { createButtonApp, createButton } = button;
        const { createBillHeadInfo } = BillHeadInfo;
        return (<div className="nc-bill-list">
            <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                <div className='header-title-search-area'>
                </div>
                <div className="header-button-area">
                    {createButtonApp({
                        area: 'bank-action',
                        buttonLimit: 3,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.header-button-area')

                    })}
                    {/*{buttons.map( (v) =>{*/}
                    {/*return (createButton(v.btncode, {*/}
                    {/*name: v.btnname,*/}
                    {/*onButtonClick: this.buttonClick.bind(this)*/}
                    {/*}))*/}
                    {/*})}*/}
                </div>
            </NCDiv>

            <div style={{ height: '10px' }}></div>
            <div className="nc-bill-table-area">
                {createSimpleTable(this.tableId, {
                    //showCheck:true,
                    onRowClick: this.onRowClick.bind(this),
                    onRowDoubleClick: this.doubleClick.bind(this),
                    showIndex: true,
                    onSelected: this.onSelected.bind(this),
                    onSelectedAll: this.onSelected.bind(this)
                })}
            </div>

        </div>
        );
    }
}

export default List

//qhy8HixY3Po98eZdlyVye1FLOhuVkG79QR4tS+UqX8G0+zV8H/p8KWmKFq9k49xy