//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast, high, cardCache } from 'nc-lightapp-front';
import { initTemplate, afterEvent, buttonClick, beforeEvent, beformheadEvent } from './events';
import './index.less';

const { NCForm, NCFormControl, NCMessage, NCCheckbox, NCTabs, NCButton, NCBackBtn } = base;
const NCTabPane = NCTabs.NCTabPane;
const NCFormItem = NCForm.NCFormItem;
const { getCacheById, updateCache, setDefData, getDefData, addCache } = cardCache;
let dataSource = 'uap.bcbd.barappobject.barappobjectcache';
class BarappObjectCard extends Component {
    constructor(props) {
        super(props);
        this.status = props.getUrlParam('status');
        this.state = {
            json: {},
            backbtnstatus: '',
            loginfo: {},
            json: {}
        };
    }
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log("未加载到多语资源");   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源*/
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': '1057-1057baor', 'domainName': 'uap', callback });
    }
    componentDidMount() {
        this.getData();
        this.getLoginfo();
        this.setpagestatus(this.props.getUrlParam('status'));
    }

    getLoginfo() {
        let _this = this;
        ajax({
            url: '/nccloud/bcbd/login/loginfo.do',
            loading: false,
            success: (result) => {
                _this.setState({
                    loginfo: result.data
                })
            }
        });
    }

    setpagestatus(status) {
        this.pagestatus = status;
        this.setState({
            backbtnstatus: status == 'browse' ? '' : 'none'
        })
        switch (status) {
            case 'browse':
                this.props.button.setButtonVisible(['save', 'cancel'], false);
                this.props.button.setButtonVisible(['add', 'edit', 'delete', 'attrcalssify'], true);
                this.props.button.setButtonDisabled(['addline', 'delline'], true);
                this.props.form.setFormStatus('head', 'browse');
                this.props.cardTable.setStatus('body', 'browse');
                break;
            case 'add':
                this.props.form.EmptyAllFormValue('head');
                this.props.cardTable.setTableData('body', { rows: [] });
            case 'edit':
                this.props.form.setFormStatus('head', 'edit');
                this.props.cardTable.setStatus('body', 'edit');
                this.props.button.setButtonVisible(['save', 'cancel'], true);
                this.props.button.setButtonVisible(['add', 'edit', 'delete', 'attrcalssify'], false);
                this.props.button.setButtonDisabled(['addline', 'delline'], false);
                break;
        }
    }

    getData(pk, status) {
        let pk_barappobject = this.props.getUrlParam('pk_barappobject');
        if (pk) {
            pk_barappobject = pk;
        }
        let _this = this;
        _this.pk_barappobject = pk_barappobject;
        if (!pk_barappobject) {
            _this.props.form.EmptyAllFormValue('head');
            _this.props.cardTable.setTableData('body', { rows: [] });
            return;
        }
        ajax({
            url: '/nccloud/bcbd/barappregister/querydetail.do',
            data: pk_barappobject,
            success: (res) => {
                if (res && res.data) {
                    if (res.data.errmsg) {
                        toast({ color: 'danger', content: res.data.errmsg });
                        return;
                    }
                    if (res.data.headForm) {
                        _this.props.setUrlParam({ pk_barappobject: res.data.headForm.head.rows[0].values.pk_barappobject.value });
                        _this.props.form.setAllFormValue({ 'head': res.data.headForm.head });
                        if (status == 'add') {
                            addCache(pk_barappobject, res.data.headForm.head, 'head', res.data.headForm.head.rows[0].values);
                        } else if (status == 'edit') {
                            updateCache('pk_barappobject', pk_barappobject, res.data.headForm.head, 'head', dataSource, res.data.headForm.head.rows[0].values);
                        }
                    } else {
                        _this.props.form.setAllFormValue({ 'head': {} });
                    }
                    if (res.data.bodyMapGrid) {
                        _this.props.cardTable.setTableData('body', res.data.bodyMapGrid.body);
                    } else {
                        _this.props.cardTable.setTableData('body', { rows: [] });
                    }
                }
            }
        });
    }

    render() {
        let { button, form, modal, ncmodal, cardTable } = this.props;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createForm } = form;
        let { createModal } = modal;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        let that = this;
        const { NCDiv } = base;
        return (
            <div className="nc-bill-card">
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            <span>
                                {createBillHeadInfo({
                                    title: `${this.state.json['barappobject-000008']/* 国际化处理： 条码对象注册*/}`,
                                    initShowBackBtn: this.state.backbtnstatus == 'none' ? false : true, //标题
                                    backBtnClick: () => {//返回按钮的点击事件
                                        that.props.pushTo('/list', {
                                            pk_barappobject: that.pk_barappobject,
                                            pagecode:'1057BAOR_list'
                                        });
                                    }
                                })}
                            </span>
                        </div>
                        <div className="header-button-area">
                            {this.props.button.createButtonApp({
                                area: 'head',
                                buttonLimit: 10,
                                onButtonClick: buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                </NCDiv>
                <div className="nc-bill-form-area">
                    {createForm("head", {
                        onBeforeEvent: beformheadEvent.bind(this)
                    })}
                    {createCardTable('body', {
                        showIndex: true,
                        showCheck: true,
                        hideSwitch:()=>{return false},
                        onAfterEvent: afterEvent.bind(this),
                        onBeforeEvent: beforeEvent.bind(this),
                        tableHead: () => {
                            return createButtonApp({
                                area: 'body',
                                onButtonClick: buttonClick.bind(this),
                                popContainer: document.querySelector('.light-tabs')
                            })
                        }
                    })}
                </div>
                {createModal('attrclass', {})}
                {this.props.ncmodal.createModal('ncmodal', {})}
            </div>
        )
    }
}

BarappObjectCard = createPage({
    initTemplate: initTemplate,
})(BarappObjectCard);
export default BarappObjectCard;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65