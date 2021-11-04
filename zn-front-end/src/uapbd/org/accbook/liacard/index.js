//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, high, cardCache, getBusinessInfo, createPageIcon } from 'nc-lightapp-front';
import { initTemplate, afterEvent, buttonClick, pageInfoClick } from './events';
// import ShareInGroup from '../shareingroup/index';
// import ShareJGroup from '../sharejgroup/index';
// import UserMigrate from '../usermigrate/index';
import Transfer from '../../../public/excomponents/Transfer';
import UploadImg from '../../../public/packages/uploadImg';
import Utils from '../../../public/utils';
import './index.less';
const { NCForm, NCFormControl, NCMessage, NCCheckbox, NCTabs, NCButton, NCBackBtn } = base;
const NCTabPane = NCTabs.NCTabPane;
const NCFormItem = NCForm.NCFormItem;
const { getCacheById, updateCache, setDefData, getDefData } = cardCache;

class UserCard extends Component {
    constructor(props) {
        let businessInfo = getBusinessInfo();
        super(props);
        this.status = props.getUrlParam('status');
        this.state = {
            cur_pk_group: businessInfo.groupId,
            usergroup: 'default',
            group: 'default',
            firstStepOrgValue: {},
            usermigrate: {},
            oprType: '1',
            iscopy: false,
            backbtnstatus: '',
            user_usergroup: {},// 用户的用户组数据
            user_group: {},// 用户的集团数据
            reforg: '', //参照pk_org
            imgModalShow: false,//签名图片框
            signImgUrl: '',//签名图片框
            cuserid: '',//签名图片框
            istoprocessuser: false,//分配权限能否跳转
            json: {},
            inlt: null
        };
        if (props.getUrlParam('status') == 'add') {
            props.button.setButtonsVisible({
                add: false,
                edit: false,
                del: false,
                save: true,
                saveandadd: true,
                cancel: true,
                auxiliary: false,
                print: false,
                disrole: false,
                resetuserpsw: false,
                qmpicture: false,
                copy: false,
                lock: false,
                unLock: false,
                enable: false,
                disable: false
            });
        }
        if (props.getUrlParam('status') == "edit") {
            props.button.setButtonsVisible({
                add: false,
                edit: false,
                del: false,
                save: true,
                saveandadd: false,
                cancel: true,
                auxiliary: false,
                print: false,
                disrole: false,
                resetuserpsw: false,
                qmpicture: false,
                copy: false,
                lock: false,
                unLock: false,
                enable: false,
                disable: false
            });
        }
        if (props.getUrlParam('status') == "browse") {
            props.button.setButtonsVisible({
                add: true,
                edit: true,
                del: true,
                save: false,
                saveandadd: false,
                cancel: false,
                auxiliary: true,
                print: true,
                disrole: true,
                resetuserpsw: true,
                qmpicture: true,
                copy: true,
                lock: false,
                unLock: false,
                enable: false,
                disable: false
            });
        }
        if (props.getUrlParam('status') == "copy") {
            props.button.setButtonsVisible({
                add: false,
                edit: false,
                del: false,
                save: true,
                saveandadd: true,
                cancel: true,
                auxiliary: false,
                print: false,
                disrole: false,
                resetuserpsw: false,
                qmpicture: false,
                copy: false,
                lock: false,
                unLock: false,
                enable: false,
                disable: false
            });
        }
    }
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log(未加载到多语资源);   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源*/
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': 'user-001', 'domainName': 'uap', callback });
    }
    componentDidMount() {
        
        this.setState({
            backbtnstatus: this.props.getUrlParam('status') != 'browse' ? 'none' : ''
        })
    }

    getusermigrate(data) {
        const transMigrate = {
            key: data.key,
            value: data.value
        }
        this.setState({
            usermigrate: transMigrate
        })
    }
    getusergroup(data) {
        const righttreedata = data;
        this.setState({
            user_usergroup: righttreedata
        })
    }
    getgroup(data) {
        const rightgroupdata = data;
        this.setState({
            user_group: rightgroupdata
        });
    }
    getreforg(data) {
        const reforg = data;
        this.setState({
            reforg: reforg
        });
    }
   

    render() {
        let { form, table, modal, cardPagination } = this.props;
        let { createCardPagination } = cardPagination;
        let { createForm } = form;
        let { createSimpleTable } = table;
        let { createModal } = modal;
        let { NCDiv } = base;
        let { createBillHeadInfo } = this.props.BillHeadInfo;
        if (this.transImgModalShow) {
            document.getElementById('dd').style.display = 'block'
        }
        return (
            <div className="nc-bill-card rbac-user-card">
                <div className="nc-bill-top-area">
                    <NCDiv areaCode={NCDiv.config.HEADER}>
                        <div className="nc-bill-header-area">
                            <div className="header-title-search-area">
                                <span>
                                    {createBillHeadInfo({
                                        title: '责任核算账簿',
                                        backBtnClick: () => {
                                            this.props.pushTo('/list', { pagecode: '101001CB_accbook' });
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="header-button-area">
                                {this.props.button.createButtonApp({
                                    area: 'header-button-area',
                                    buttonLimit: 10,
                                    onButtonClick: buttonClick.bind(this),
                                    popContainer: document.querySelector('.header-button-area')
                                })}
                                {/* {this.props.button.createButtonApp({
                                    area: 'header-button-area',
                                    buttonLimit: 10,
                                    onButtonClick: this.getCurSerId.bind(this),
                                    popContainer: document.querySelector('.header-button-area')
                                })} */}
                                {this.props.getUrlParam('status') == 'browse' && createCardPagination({
                                    handlePageInfoChange: pageInfoClick.bind(this),
                                    dataSource: 'uapbd.org.accbook.acccache'
                                })}
                            </div>
                        </div>
                    </NCDiv>
                    <div className="nc-bill-form-area">
                        {createForm("liabilitybook_card", {
                            onAfterEvent: afterEvent.bind(this),
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {/* <NCTabs fnavtype="turn" contenttype="moveleft" defaultActiveKey="1">
                            <NCTabPane tab={this.state.json['1880000025-000012']} key="1">
                                {createSimpleTable('userGroup', { height: 300 })}
                            </NCTabPane>
                            <NCTabPane tab={this.state.json['1880000025-000013']} key="2">
                                {createSimpleTable('shareorglist', { height: 300 })}
                            </NCTabPane>
                        </NCTabs> */}
                    </div>
                </div>

                {createModal('modal', {})}
                {createModal('newpsw', {})}
                {createModal('groupinnershare', {})}
                {createModal('groupjshare', {})}
                {createModal('usermigrate', {})}
                
                
            </div>

        )
    }
}

UserCard = createPage({
    initTemplate: initTemplate,
})(UserCard);
// ReactDOM.render(<UserCard />, document.querySelector('#app'));
export default UserCard;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65