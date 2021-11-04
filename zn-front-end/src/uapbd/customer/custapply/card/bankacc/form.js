//ewqCnZNx8RypFm9/mjEwtOyxPrQLC75yZBhZnv5LCvT2SFHS6izKX2jBZV9rE24f
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, promptBox, cardCache } from 'nc-lightapp-front';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn,NCDiv } = base;

const queryCardUrl = '/nccloud/uapbd/customer/CustAppQueryBankCard.do'
const saveUrl = '/nccloud/uapbd/customer/CustAppSaveBank.do'
const deleteUrl = '/nccloud/uapbd/customer/CustAppDelBank.do'
const exFieldUrl = '/nccloud/uapbd/customer/CustApplyExField.do'

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId1 = this.props.formId1;
        this.formId2 = this.props.formId2;
        this.tableId = this.props.cardTableId;
        this.cardStatus = this.props.cardStatus

        //关于过滤当前是哪条银行账户信息的字段
        this.accnum = this.props.accnum
        this.pk_banktype = this.props.pk_banktype
        this.state = {
            pk_org: '',
            title_code: '',
            totalcount: 0,
            applycount: 0,
            showAccbase: true,
            showNetBank: false,
            backVisible: true
        }
    }

    componentDidMount() {
        let cardStatus = this.cardStatus

        if (cardStatus && cardStatus == 'add') {
            this.props.form.EmptyAllFormValue(this.props.formId1)
            this.props.form.EmptyAllFormValue(this.props.formId2)
            this.props.cardTable.setTableData(this.props.cardTableId, { rows: [] })
            this.props.form.setFormStatus(this.props.formId1, 'add')
            this.props.form.setFormStatus(this.props.formId2, 'add')
            this.props.cardTable.setStatus(this.props.cardTableId, 'edit')

            ajax({
                url: exFieldUrl,
                data: {
                    pk_country: this.props.form.getFormItemsValue('customer', 'pk_country').value,
                    operation: "bankinfo"
                },
                success: (res) => {
                    if (res.data.pk_currtype) {
                        this.props.cardTable.addRow(this.props.cardTableId, 0, {
                            pk_currtype: {
                                value: res.data.pk_currtype,
                                display: res.data.currtypename
                            }
                        })
                        let accNameValue = this.props.form.getFormItemsValue('customer', 'name')
                        this.props.form.setFormItemsValue(this.props.formId1, {
                            accname: {
                                value: accNameValue.name.value,
                                display: accNameValue.name.display
                            }
                        })
                    }
                }
            })

        }
        else if (cardStatus && cardStatus == 'edit') {
            this.getData(this.props.mainPk, this.accnum, this.pk_banktype)
            setTimeout(() => this.props.form.setFormStatus(this.props.formId1, 'edit'), 1)
            setTimeout(() => this.props.form.setFormStatus(this.props.formId2, 'edit'), 1)
            setTimeout(() => this.props.cardTable.setStatus(this.props.cardTableId, 'edit'), 1)
        }
        else if (cardStatus && cardStatus == 'browse') {
            this.getData(this.props.mainPk, this.accnum, this.pk_banktype)
        }
        this.updateButtonStatus()
    }

    updateButtonStatus() {
        let cardStatus = this.cardStatus
        if (cardStatus && cardStatus == 'browse') {

            if (this.accnum && this.pk_banktype) {
                this.props.button.setButtonVisible(['BankAdd', 'BankEdit', 'BankDelete', 'BankRefresh', 'BankDefault'], true);
                this.props.button.setButtonVisible(['BankCancel', 'BankSave', 'BankAddLine', 'BankBack', 'BankSaveAdd'], false);
            }
            else {
                this.props.button.setButtonVisible(['BankAdd'], true);
                this.props.button.setButtonVisible(['BankCancel', 'BankSave', 'BankAddLine', 'BankBack', 'BankSaveAdd', 'BankEdit', 'BankDelete', 'BankRefresh', 'BankDefault'], false);

            }

            this.setState({
                backVisible: true
            })
        }
        else {
            let visibleAction = ['BankCancel', 'BankSave', 'BankAddLine']
            let unVisibleAction = ['BankAdd', 'BankEdit', 'BankDelete', 'BankRefresh', 'BankBack', 'BankDefault']
            if (this.cardStatus == 'add') {
                visibleAction.push('BankSaveAdd')
            }
            else {
                unVisibleAction.push('BankSaveAdd')
            }
            this.props.button.setButtonVisible(unVisibleAction, false);
            this.props.button.setButtonVisible(visibleAction, true);
            this.setState({
                backVisible: false
            })
        }
    }

    getData(mainPk, accnum, pk_banktype) {
        let data = {
            mainPk,
            accnum,
            pk_banktype
        }

        ajax({
            url: queryCardUrl,
            data,
            success: res => {
                this.props.form.setAllFormValue({ [this.props.formId1]: res.data.head.custbank })
                this.props.form.setAllFormValue({ [this.props.formId2]: res.data.head.custbank })
                if (res.data.body && res.data.body[this.props.cardTableId])
                    this.props.cardTable.setTableData(this.props.cardTableId, res.data.body[this.props.cardTableId])

            }
        })
    }

    buttonClick(props, id) {
        switch (id) {
            case 'BankAdd':
                this.props.form.EmptyAllFormValue(this.props.formId1)
                this.props.form.EmptyAllFormValue(this.props.formId2)
                this.props.cardTable.setTableData(this.props.cardTableId, { rows: [] })
                setTimeout(() => this.props.form.setFormStatus(this.props.formId1, 'edit'), 1)
                setTimeout(() => this.props.form.setFormStatus(this.props.formId2, 'edit'), 1)
                setTimeout(() => this.props.cardTable.setStatus(this.props.cardTableId, 'edit'), 1)
                this.cardStatus = 'add'
                setTimeout(() => this.updateButtonStatus(), 1)
                ajax({
                    url: exFieldUrl,
                    data: {
                        pk_country: this.props.form.getFormItemsValue('customer', 'pk_country').value,
                        operation: "bankinfo"
                    },
                    success: (res) => {
                        if (res.data.pk_currtype) {
                            this.props.cardTable.addRow(this.props.cardTableId, 0, {
                                pk_currtype: {
                                    value: res.data.pk_currtype,
                                    display: res.data.currtypename
                                }
                            })
                            let accNameValue = this.props.form.getFormItemsValue('customer', 'name')
                            this.props.form.setFormItemsValue(this.props.formId1, {
                                accname: {
                                    value: accNameValue.name.value,
                                    display: accNameValue.name.display
                                }
                            })
                        }
                    }
                })
                break;
            case 'BankEdit':
                this.props.form.setFormStatus(this.props.formId1, 'edit')
                this.props.form.setFormStatus(this.props.formId2, 'edit')
                this.props.cardTable.setStatus(this.props.cardTableId, 'edit')
                this.cardStatus = 'edit'
                setTimeout(() => this.updateButtonStatus(), 1)
                break;
            case 'BankSave':
                let finalData = {
                    isAdd: this.cardStatus == 'add' ? true : false
                }
                if (!this.getValueFromForm(finalData))
                    return;
                finalData.mainPk = this.props.mainPk
                ajax({
                    url: saveUrl,
                    data: finalData,
                    success: res => {
                        this.props.form.setFormStatus(this.props.formId1, 'browse')
                        this.props.form.setFormStatus(this.props.formId2, 'browse')
                        this.props.cardTable.setStatus(this.props.cardTableId, 'browse')
                        this.props.form.setAllFormValue({ [this.props.formId1]: res.data.head.custbank })
                        this.props.form.setAllFormValue({ [this.props.formId2]: res.data.head.custbank })
                        if (res.data.body && res.data.body[this.props.cardTableId])
                            this.props.cardTable.setTableData(this.props.cardTableId, res.data.body[this.props.cardTableId])
                        //this.getData(this.props.mainPk,this.accnum,this.pk_banktype)
                        this.accnum = res.data.head.custbank.rows[0].values.accnum.value
                        this.pk_banktype = res.data.head.custbank.rows[0].values.pk_banktype.value
                        this.cardStatus = 'browse'
                        this.updateButtonStatus()
                    }
                })
                break;
            case 'BankDelete':

                promptBox({
                    color: "warning",
                    title: this.props.json['10140CUSTPF-000022'],/* 国际化处理： 确认删除*/
                    content: this.props.json['10140CUSTPF-000023'],/* 国际化处理： 是否确认要删除？*/
                    beSureBtnClick: () => {
                        let info = {
                            mainPk: this.props.mainPk,
                            accnum: this.accnum,
                            pk_banktype: this.pk_banktype
                        }
                        ajax({
                            url: deleteUrl,
                            data: info,
                            success: res => {
                                info = {
                                    isList: false
                                }
                                if (this.props.bankaccModalChange) {
                                    this.props.bankaccModalChange(info)
                                }
                            }
                        })
                    }
                })
                break;
            case 'BankCancel':
                promptBox({
                    color: "warning",
                    title: this.props.json['10140CUSTPF-000027'],/* 国际化处理： 确认取消*/
                    content: this.props.json['10140CUSTPF-000028'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: () => {

                        this.props.form.setFormStatus(this.props.formId1, 'browse')
                        this.props.form.setFormStatus(this.props.formId2, 'browse')
                        this.props.cardTable.setStatus(this.props.cardTableId, 'browse')
                        this.props.form.EmptyAllFormValue(this.props.formId1)
                        this.props.cardTable.setTableData(this.props.cardTableId, { rows: [] })

                        if (this.accnum && this.pk_banktype) {
                            this.getData(this.props.mainPk, this.accnum, this.pk_banktype)
                        }
                        // else {
                        //     let listData = this.props.table.getAllTableData(this.props.tableId);
                        //     if (listData && listData.rows && listData.rows.length > 0) {
                        //         this.accnum = listData.rows[0].values.accnum.value;
                        //         this.pk_banktype = listData.rows[0].values.pk_banktype.value;
                        //         this.getData(this.props.mainPk, this.accnum, this.pk_banktype)
                        //     }
                        // }
                        this.cardStatus = 'browse'
                        this.updateButtonStatus()
                    }
                })
                break;
            case 'BankAddLine':
                setTimeout(() => this.props.cardTable.addRow(this.props.cardTableId), 1)
                break;
            case 'BankBack':
                let info = {
                    isList: false
                }
                if (this.props.bankaccModalChange) {
                    this.props.bankaccModalChange(info)
                }
                break;
            case 'BankDefault':
                let checkedRows = this.props.cardTable.getCheckedRows(this.props.cardTableId);

                if (!checkedRows || checkedRows.length == 0) {
                    toast({ content: this.props.json['10140CUSTPF-000009'], color: 'danger' })/* 国际化处理： 请选择要设置的默认账户!*/
                }
                else {
                    //参照NC，只对选中的第一行做校验
                    let checkedRow = checkedRows[0];
                    let isdefault = checkedRow.data.values.isdefault.value;
                    if (isdefault && isdefault != null && isdefault == true) {
                        toast({ content: this.props.json['10140CUSTPF-000010'], color: 'danger' })/* 国际化处理： 该子户已经是默认账户*/
                    }
                    else {
                        this.props.modal.show('modal', {
                            title: this.props.json['10140CUSTPF-000011'],/* 国际化处理： 询问*/
                            content: this.props.json['10140CUSTPF-000012'],/* 国际化处理： 请确定要改变默认账户吗？*/
                            beSureBtnClick: this.setBankAccSubDefault.bind(this, checkedRow.index)
                        })
                    }
                }
                break;
            case 'BankSaveAdd':
                finalData = {
                    isAdd: this.props.cardStatus == 'add' ? true : false
                }
                if (!this.getValueFromForm(finalData))
                    return;
                finalData.mainPk = this.props.mainPk
                ajax({
                    url: saveUrl,
                    data: finalData,
                    success: res => {
                        this.props.form.EmptyAllFormValue(this.props.formId1)
                        this.props.form.EmptyAllFormValue(this.props.formId2)
                        this.props.cardTable.setTableData(this.props.cardTableId, { rows: [] })
                        setTimeout(() => this.props.form.setFormStatus(this.props.formId1, 'edit'), 1)
                        setTimeout(() => this.props.form.setFormStatus(this.props.formId2, 'edit'), 1)
                        setTimeout(() => this.props.cardTable.setStatus(this.props.cardTableId, 'edit'), 1)
                        this.cardStatus = 'add'
                        setTimeout(() => this.updateButtonStatus(), 1)
                        ajax({
                            url: exFieldUrl,
                            data: {
                                pk_country: this.props.form.getFormItemsValue('customer', 'pk_country').value,
                                operation: "bankinfo"
                            },
                            success: (res) => {
                                if (res.data.pk_currtype) {
                                    this.props.cardTable.addRow(this.props.cardTableId, 0, {
                                        pk_currtype: {
                                            value: res.data.pk_currtype,
                                            display: res.data.currtypename
                                        }
                                    })
                                    let accNameValue = this.props.form.getFormItemsValue('customer', 'name')
                                    this.props.form.setFormItemsValue(this.props.formId1, {
                                        accname: {
                                            value: accNameValue.name.value,
                                            display: accNameValue.name.display
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
                break
            default:
                console.log(id, index);
                break;
        }
    }

    onAfterEvent(props, moduleId, key, value, oldValue) {
        if (oldValue == null || oldValue.value == null || (oldValue.value && value.value != oldValue.value)) {
            if (key == 'pk_banktype') {
                let meta = props.meta.getMeta()
                let targetItem = meta.accbasinfo.items.find((item) => item.attrcode == 'pk_bankdoc')
                targetItem.queryCondition = () => {
                    return {
                        pk_banktype: value.value
                    }
                }
                props.meta.setMeta(meta)
            }
            else if (key == 'pk_bankdoc') {
                if (value && value.value) {
                    ajax({
                        url: exFieldUrl,
                        data: { operation: 'bankdoc', primaryKey: value.value },
                        success: (res) => {
                            if (res.data) {
                                let setObj = {
                                    pk_banktype: {
                                        value: res.data.value,
                                        display: res.data.display
                                    }
                                }
                                this.props.form.setFormItemsValue(this.formId1, setObj)
                                this.props.form.setFormItemsDisabled(this.formId1, { pk_banktype: true })
                            }
                        }
                    })
                }
                else {
                    this.props.form.setFormItemsDisabled(this.formId1, { pk_banktype: false })
                    this.props.form.setFormItemsValue(this.formId1, { pk_banktype: { value: null, display: null } })
                }
            }
        }
    }


    //默认币种设置
    setBankAccSubDefault = (index) => {
        let finalData = {
            isAdd: false
        }
        this.getValueFromForm(finalData)
        finalData.mainPk = this.props.mainPk

        let rows = finalData.cardTable.model.rows;

        rows.forEach(row => {
            row.values.isdefault.value = false;
        });

        rows[index].values.isdefault.value = true;

        ajax({
            url: saveUrl,
            data: finalData,
            success: res => {

                this.props.cardTable.setStatus(this.props.cardTableId, 'browse')
                this.props.form.setAllFormValue({ [this.props.formId1]: res.data.head.custbank })
                this.props.form.setAllFormValue({ [this.props.formId2]: res.data.head.custbank })
                if (res.data.body && res.data.body[this.props.cardTableId])
                    this.props.cardTable.setTableData(this.props.cardTableId, res.data.body[this.props.cardTableId])
                //this.getData(this.props.mainPk,this.accnum,this.pk_banktype)
                this.accnum = res.data.head.custbank.rows[0].values.accnum.value
                this.pk_banktype = res.data.head.custbank.rows[0].values.pk_banktype.value
                this.cardStatus = 'browse'
                this.updateButtonStatus()
            }
        })
    }

    getValueFromForm(finalData) {
        if (!this.props.form.isCheckNow([this.props.formId1, this.props.formId2]))
            return false;
        let formValue1 = this.props.form.getAllFormValue(this.props.formId1)
        let formValue2 = this.props.form.getAllFormValue(this.props.formId2)
        delete formValue1.rows[0].values.bankaccsub
        delete formValue2.rows[0].values.bankaccsub
        finalData.form1 = { model: formValue1 }
        finalData.form2 = { model: formValue2 }
        finalData.cardTable = {
            model: {
                rows: this.props.cardTable.getVisibleRows(this.props.cardTableId)
            }
        }

        let currTypeInfo = this.props.cardTable.getAllRows(this.props.cardTableId)

        if (currTypeInfo == null || currTypeInfo.length == 0) {
            toast({ color: 'danger', content: this.props.json['10140CUSTPF-000013'] })/* 国际化处理： 客户银行账户必须设置一个币种！*/
            return false
        }
        else {
            return true
        }
    }

    //删除单据
    delConfirm = () => {
        ajax({
            url: deleteUrl,
            data: {
                deleteinfo: [
                    {
                        id: this.props.getUrlParam('id'),
                        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
                    }
                ]
            },
            success: (res) => {
                if (res) {
                    this.props.linkTo('../list/index.html',{
                        pagecode:'10140CUSTPF_custpflist'
                    });
                }

            }
        });
    };

    //获取列表肩部信息
    getTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'bank-body',//按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this)
                    })}
                    {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ['close', 'open', 'max', 'setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }

    render() {
        let { cardTable, form, button, modal, cardPagination,BillHeadInfo } = this.props;
        const { createCardPagination } = cardPagination;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp, createButton } = button;
        let { createModal } = modal;
        const { createBillHeadInfo } = BillHeadInfo;
        let iconItem = this.state.showAccbase ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showAccbase ? "show-form" : "hide-form"

        let iconItem2 = this.state.showNetBank ? 'icon-jiantouxia1' : 'icon-jiantouyou'
        let groupItem2 = this.state.showNetBank ? "show-form" : "hide-form"
        return (
            <div id='nc-bill-card'>
                <div className="nc-bill-card">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} div className='nc-bill-header-area'>
                            <NCBackBtn className='title-search-detail' style={{ 'line-height': '32px', display: this.state.backVisible ? 'inline' : 'none' }}
                                onClick={this.buttonClick.bind(this, this.props, 'BankBack')}></NCBackBtn>
                            <div className='header-title-search-area'>
                            </div>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'bank-action',//按钮注册中的按钮区域
                                    //buttonLimit: 5,
                                    onButtonClick: this.buttonClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                                {/*{buttons.map( (v) =>{*/}
                                {/*return (createButton(v.btncode, {*/}
                                {/*name: v.btnname,*/}
                                {/*onButtonClick: this.buttonClick.bind(this)*/}
                                {/*}))*/}
                                {/*})}*/}
                            </div>
                        </NCDiv>
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
                                <span className="name">{this.props.json['10140CUSTPF-000014']/* 国际化处理： 账户基本信息*/}</span>
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
                                <span className="name">{this.props.json['10140CUSTPF-000015']/* 国际化处理： 网银信息*/}</span>
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
                            showIndex: true,
                            showCheck: true
                        })}
                    </div>
                    {createModal('delete', {
                        title: this.props.json['10140CUSTPF-000016'],/* 国际化处理： 注意*/
                        content: this.props.json['10140CUSTPF-000017'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: this.delConfirm.bind(this)
                    })}
                    {createModal('modal', {})}
                </div>
            </div>

        );
    }
}

export default Card

//ewqCnZNx8RypFm9/mjEwtOyxPrQLC75yZBhZnv5LCvT2SFHS6izKX2jBZV9rE24f