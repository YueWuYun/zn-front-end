//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, toast, high} from 'nc-lightapp-front';
import Utils from '../../../../public/utils/index';

const {ExcelImport} = high;
const {queryToastFunc} = Utils;
const {NCBackBtn, NCCheckbox} = base;
import {banaccmodalFormAfterEdit, banaccmodalFormBeforeEdit} from './afterEditEvents';
import {banaccmodalButtonClick, rowDoubleClick, onSelected, onSelectedAll, onRowClick} from './clickEvents';

export default class CustBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            browseBtns: ['bammodalAdd', 'bammodalEdit', 'bammodalDel', 'bammodalFilter', 'bammodalRef', 'bammodalEnable', 'bammodalDisable', 'bammodalimport', 'bammodalexport'],
            editBtns: ['bammodalSave', 'bammodalSaveAdd', 'bammodalCancel', 'bammodalSubAdd', 'bammodalSubDel'],
            showList: true,
            showCard: false,
            showSeal: false,
            currentCustPk: '',
            currentCustBankPk: '',
            currentBankaccbas: '',
            custBankParam: {
                custParam: ''
            },
            json: props.json
        }
        this.config = {
            modalGrid: 'custBankaccbas',
            modalCustForm: 'cardcustbankacc',
            modalBankForm: 'accbasinfo',
            modalCardTable: 'bankaccsub'
        }
        this.currentCustPk = props.currentCustPk;
        this.currentOrg = props.currentOrg;
        this.currentCustName = props.currentCustName;
        let meta = this.modifierMeta(props.meta.getMeta(), props);
        props.meta.setMeta(meta, () => {
            this.loadGridData(this.props
                // , (param) => {
                // queryToastFunc()(param)}
            );
        });
    }

    modifierMeta = (meta, props) => {
        //账号字段添加正则校验
        meta[this.config.modalBankForm].items.map((item) => {
            if (item.attrcode == 'accnum') {
                item.reg = new RegExp('^[[a-zA-Z0-9\-]*$');
                item.errorMessage = props.json['10140CUST-000040']
            }
        });
        meta[this.config.modalCardTable].items.find(item => item.attrcode == 'opr') ||
        meta[this.config.modalCardTable].items.push({
            attrcode: 'opr',
            label: props.json['10140CUST-000105'], /* 国际化处理： 操作*/
            itemtype: 'customer',
            width: '180px',
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                return !!!record.values.isdefault.value ? props.button.createOprationButton(['bammodalSetDef'], {
                    area: 'custbankaccsub-opr',
                    onButtonClick: this.oprButtonClick.bind(this, record, index)
                }) : '';
            }
        });
        return meta;
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            })
        }
    }

    oprButtonClick = (record, index, props, key) => {
        switch (key) {
            case'bammodalSetDef':
                let formitems = props.form.getFormItemsValue(this.config.modalCustForm, ['pk_custbank', 'pk_bankaccbas']);
                this.buttonOperator(props, key, Object.assign({
                    pk_cust: this.state.currentCustPk,
                    pk_custbank: formitems[0].value,
                    pk_bankaccbas: formitems[1].value,
                    actionName: key,
                    pk_bankaccsub: record.values.pk_bankaccsub.value,
                    pagecode: props.config.pagecode
                }, this.config), (data) => {
                    this.setCardData(data);
                });
                break;
            default:
                break;
        }
    }
    buttonOperator = (props, id, param, callback) => {
        ajax({
            url: '/nccloud/uapbd/custbankacc/operateHandle.do',
            data: param,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data && data.hasOwnProperty('message')) {
                        toast({color: 'warning', content: data.message});
                    } else {
                        toast({color: 'success', content: this.state.json['10140CUST-000046']});
                        /* 国际化处理： 操作成功！*/
                        callback.call(this, data);
                    }

                }
            }
        })
    }

    /**
     * lifeCycle
     */
    componentDidMount() {
        this.setInitializBtns.call(this);
    }

    setInitializBtns = () => {
        this.props.button.setButtonVisible(this.state.browseBtns, true);
        this.props.button.setButtonVisible(this.state.editBtns, false);
        this.props.button.setMainButton('bammodalAdd', true);
        this.props.button.setMainButton('bammodalSave', true);
        this.props.button.setButtonDisabled(['bammodalEnable', 'bammodalDisable', 'bammodalSubDel', 'bammodalDel', 'bammodalEdit'], true);
    }

    /**
     * 加载列表数据
     * @param props
     * @param callback
     */
    loadGridData = (props, callback) => {
        let {modalGrid} = this.config;
        ajax({
            url: '/nccloud/uapbd/custbankacc/queryGridData.do',
            data: {
                'pk_customer': this.currentCustPk,
                'pageid': props.config.pagecode,
                'showSeal': this.state.showSeal
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        if (data.hasOwnProperty('message') && data.message) {
                            toast({'color': 'warning', 'title': data.message});
                        } else {
                            props.editTable.setTableData(modalGrid, data[modalGrid]);
                            callback && callback.call(this, data[modalGrid]['rows']);
                        }
                    } else {
                        props.editTable.setTableData(modalGrid, {rows: []});
                        callback && callback.call(this, []);
                    }
                    this.setInitializBtns.call(this);
                }
            }

        });
    }
    /**
     * 加载卡片数据，新增，修改，查询
     * @param props
     * @param param
     * @param callback
     */
    loadCardData = (props, param, callback) => {
        const {modalCustForm, modalBankForm, modalCardTable} = this.config;
        ajax({
            url: '/nccloud/uapbd/custbankacc/queryCardData.do',
            data: param,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        this.setCardData.call(this, data, () => {
                            callback && callback.call(this);
                        });
                    }
                }
                props.button.setButtonDisabled(['bammodalDel', 'bammodalEdit'], false);
            }

        });
    }

    setCardData = (data, callback) => {
        const {modalCustForm, modalBankForm, modalCardTable} = this.config;
        let {cardTableData, custFormData, bankFormData, custParam} = data;
        this.setState({
            custBankParam: {
                custParam: custParam
            }
        }, () => {
            let meta = this.props.meta.getMeta();
            if (custParam) {
                let pk_bankdocItem = meta[modalBankForm]['items'].find(item => item['attrcode'] === 'pk_bankdoc');
                pk_bankdocItem.checkStrictly = false;
            }
            this.props.meta.setMeta(meta, () => {
                if (this.state.componentStatus === 'browse') {
                    this.props.button.setButtonVisible(['bammodalEnable'], bankFormData[modalBankForm].rows[0].values.enablestate.value !== '2');
                    this.props.button.setButtonVisible(['bammodalDisable'], bankFormData[modalBankForm].rows[0].values.enablestate.value === '2');
                    this.props.button.setButtonDisabled(['bammodalEnable'], bankFormData[modalBankForm].rows[0].values.enablestate.value === '2');
                    this.props.button.setButtonDisabled(['bammodalDisable'], bankFormData[modalBankForm].rows[0].values.enablestate.value !== '2');
                } else {
                    this.props.button.setButtonVisible(['bammodalEnable'], false);
                    this.props.button.setButtonVisible(['bammodalDisable'], false);
                    //如果是编辑态且状态不是未启用则帐号字段不可修改
                    this.props.form.setFormItemsDisabled(modalBankForm, {'accnum': bankFormData[modalBankForm].rows[0].values.enablestate.value !== '1'});
                }
                bankFormData && this.props.form.setAllFormValue({[modalBankForm]: bankFormData[modalBankForm]});
                custFormData && this.props.form.setAllFormValue({[modalCustForm]: custFormData[modalCustForm]});
                cardTableData && this.props.cardTable.setTableData(modalCardTable, cardTableData[modalCardTable]);
                this.props.form.setFormItemsDisabled([modalBankForm], {'pk_banktype': false});

                callback && callback.call(this);
            });
        });


    }
    /**
     * 卡片列表切换
     *
     * @param props
     */
    toogleCardOrList = (props, componentStatus, cardorlist, callback) => {
        props.button.setButtonVisible(this.state.editBtns, componentStatus !== 'browse');
        props.button.setButtonVisible(this.state.browseBtns, componentStatus === 'browse');
        props.button.setButtonVisible(['bammodalSaveAdd'], componentStatus === 'add');
        this.setState({
            showList: cardorlist === 'list',
            showCard: cardorlist === 'card',
            componentStatus: componentStatus
        }, () => {
            props.form.setFormStatus(this.config.modalBankForm, componentStatus);
            props.cardTable.setStatus(this.config.modalCardTable, componentStatus);
            props.button.setButtonVisible(
                ['bammodalReturn', 'bammodalSetDef'], componentStatus === 'browse' && this.state.showCard);
            callback && callback.call(this);
        });
    }
    handleBtnReturn = () => {
        this.setState({
            currentCustPk: '',
            currentCustBankPk: '',
            currentBankaccbas: ''
        }, () => {
            this.toogleCardOrList(this.props, 'browse', 'list', () => {
                this.loadGridData(this.props, () => {
                });
            });
        });

    }
    /**
     * 创建子表肩部按钮
     *
     */
    getSubTableHead = () => {
        let {button} = this.props;
        let {createButtonApp} = button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons-custbankaccsub',//按钮注册中的按钮区域
                        onButtonClick: banaccmodalButtonClick.bind(this)
                    })}
                </div>
            </div>
        )
    }
    cardTableonSelected = (props, moduleId, record, index, status) => {
        let checkedRows = props.cardTable.getCheckedRows(moduleId);
        props.button.setButtonDisabled(['bammodalSubDel'], checkedRows.length === 0);
    }
    cardTableOnSelectedAll = (props, moduleId, status, length) => {
        props.button.setButtonDisabled(['bammodalSubDel'], !status);
    }

    writebackIbanCode = (ibancode) => {
        this.props.form.setFormItemsValue(this.config.modalBankForm, {
            'accnum': ibancode
        });

    }

    onBeforeEvent = (props, moduleId, key, value, index, record, status) => {
        //银行账户子表默认字段不可编辑，可以在模板上设置，也可以代码实现
        if (key === 'isdefault') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 列表卡片渲染
     * @returns {*}
     */
    renderCardOrList = () => {
        const {cardTable, form, editTable} = this.props;
        const {createEditTable} = editTable;
        const {createForm} = form;
        const {createCardTable} = cardTable;
        const {modalGrid, modalCustForm, modalBankForm, modalCardTable} = this.config;

        if (this.state.showList) {
            return (
                <div className="nc-singleTable-table-area">
                    {createEditTable(modalGrid, {
                        onRowDoubleClick: rowDoubleClick.bind(this),
                        onRowClick: onRowClick.bind(this),
                        showIndex: true
                        //去掉复选框以及勾选复选框的回调
                        //onSelectedAll: onSelectedAll.bind(this),
                        //onSelected: onSelected.bind(this),
                        //showCheck:true
                    })}
                </div>
            )
        } else {
            return (
                <div>
                    <div className="nc-bill-form-area">
                        {createForm(modalCustForm, {
                            onAfterEvent: banaccmodalFormAfterEdit.bind(this)
                        })}
                    </div>
                    <div className="nc-bill-form-area">
                        {createForm(modalBankForm, {
                            onAfterEvent: banaccmodalFormAfterEdit.bind(this),
                            onBeforeEvent: banaccmodalFormBeforeEdit.bind(this)
                        })}
                    </div>
                    <div className="nc-bill-table-area">
                        {createCardTable(modalCardTable, {
                            tableHead: this.getSubTableHead.bind(this),
                            onSelected: this.cardTableonSelected.bind(this),
                            onSelectedAll: this.cardTableOnSelectedAll.bind(this),
                            onBeforeEvent: this.onBeforeEvent.bind(this),
                            showIndex: true,
                            showCheck: true
                        })}
                    </div>
                </div>
            )
        }
    }
    onCheckShowDisable = (value) => {
        this.setState({showSeal: value}, () => {
            this.loadGridData(this.props, () => {
            });
        });
    }

    render() {
        const {button} = this.props;
        const {createButtonApp} = button;
        return (
            <div className="header-button-area" id="banaccModal-button-area">
                <NCBackBtn
                    style={{display: this.state.showCard && this.state.componentStatus !== 'edit' ? '' : 'none'}}
                    onClick={this.handleBtnReturn.bind(this)}>
                </NCBackBtn>
                <div style={{
                    textAlign: 'left',
                    position: 'absolute',
                    height: '31px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <span className="showOff" style={{display: this.state.showList ? '' : 'none'}}>
                        <NCCheckbox onChange={this.onCheckShowDisable.bind(this)}
                                    checked={this.state.showSeal}>{this.state.json['10140CUST-000028']}{/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
                    </span>
                </div>
                <div style={{textAlign: 'right', marginBottom: '8px'}}>
                    {createButtonApp({
                        area: 'banaccModal-button-area',
                        onButtonClick: banaccmodalButtonClick.bind(this),
                        popContainer: document.querySelector('#header-button-area')
                    })}
                </div>
                {this.renderCardOrList()}
                <ExcelImport
                    {...this.props}
                    moduleName='uapbd'//模块名
                    moduleId='custbank'
                    billType='custbank'//单据类型
                    selectedPKS={[]}
                    appcode={this.props.config.appcode}
                    pagecode={this.props.config.pagecode}
                />
            </div>
        )
    }
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65