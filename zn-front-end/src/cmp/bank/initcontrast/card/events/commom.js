/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/
import { base } from 'nc-lightapp-front';
import React from 'react';
import { deepClone, EditTableCell, showMoney } from '../../../commom';
import { startClick, cancelstartClick, stopClick, settleClick, UnsettleClick, getBusiDate } from '../../public';
import {  toast } from 'nc-lightapp-front';

const { NCPopconfirm } = base;
 
export function columns() {
    let { status, detail }= this.state;
    let isEdit= ['add', 'edit'].includes(status);
    return [
        { 
            title: <div fieldid="numberindex">{this.lang('0005')}</div>, 
            key: 'key', 
            dataIndex: 'key',
            className: 'pleft20', 
            width: '10%', 
            className: 'width10',
            render: (text, childRecord, index) => {
                return (
                    <div fieldid="numberindex">{index + 1}</div>
                );
            } 
        },
        { 
            title: <div className={`require-title ${isEdit && 'show'}`} fieldid="accountorgname">{this.lang('0010')}</div>, 
            key: 'accountorgname', 
            dataIndex: 'accountorgname', 
            width: '25%', 
            className: 'width25',
            render: (text, childRecord, index) => {
                return (
                    <EditTableCell
                        fieldid="accountorgname"
                        isEdit={isEdit}
                        type="accountbook"
                        config={{
                            name: 'm_pk_corp',
                            refName: this.lang('0010'),
                            refType: 'tree',
                            refCode: 'uapbd.ref.AccountBookTreeRef',
                            isMultiSelectedEnabled: false,
                            isTreelazyLoad:false,
                            value: {
                                refname: childRecord.accountorgname, 
                                refpk: childRecord.m_pk_corp
                            },
                            queryCondition: {
                                pkrelorg: detail.m_pk_corp,
                                pk_bankaccsub: detail.pk_account,
                                TreeRefActionExt: 'nccloud.web.cmp.ref.CMPAccountBookDefaultBuilder'
                            }
                        }}
                        onChange={onChange.bind(this, index)}
                    />
                );
            } 
        },
        { 
            title: <div className={`require-title ${isEdit && 'show'}`} fieldid="projectname">{this.lang('0011')}</div>, 
            key: 'projectname', 
            dataIndex: 'projectname',
            width: '25%', 
            className: 'width25',
            render: (text, childRecord, index) => {
                return (
                    <EditTableCell 
                        fieldid="projectname"
                        isEdit={isEdit}
                        type="accountrefer"
                        config={{
                            name: 'm_pk_subject',
                            refName: this.lang('0011'),
                            queryTreeUrl: '/nccloud/uapbd/ref/AccountModelRefer.do',
                            refType: 'gridTree',
                            isMultiSelectedEnabled: false,
                            value: {
                                refname: childRecord.projectname, 
                                refpk: childRecord.m_pk_subject
                            },
                            disabled: !childRecord.m_pk_corp,
                            queryCondition: {pk_accountingbook: childRecord.m_pk_corp},
                            isAccountRefer: true,
                            rootNode: {refname: this.lang('0078'), refpk: 'root'}
                        }}
                        onChange={onChange.bind(this, index)}
                    />
                );
            }  
        },
        { 
            title: <div fieldid="m_memo">{this.lang('0012')}</div>, 
            key: 'm_memo', 
            dataIndex: 'm_memo', 
            width: '25%',
            className: 'width25', 
            render: (text, childRecord, index) => {
                return (
                    <EditTableCell
                        fieldid="m_memo"
                        isEdit={isEdit}
                        type="input"
                        config={{
                            name: 'm_memo',
                            refName: this.lang('0012'),
                            readonly: true,
                            disabled: !childRecord.m_pk_subject,
                            value: childRecord.m_memo
                        }}
                        onChange={onChange.bind(this, index)}
                        onClick= {() => {
                            if(this.state.glEnable){
                                this.setState(
                                    {AssidModalShow: true, key: index}, () => {
                                        getBusiDate.call(this, 'AssidModal', '0024');
                                    }
                                );
                            }else{
                                toast({color: 'danger', content: '模快[总账gl]未启用，不能执行该操作'});

                            }
                        }}
                    />
                );
            }  
        },
        { 
            title:<div fieldid="operation"> {this.lang('0008')}</div>,
            key: 'operation', 
            dataIndex: 'operation',
            width: '15%',  
            className: 'width15',
            render: (text, childRecord, index) => {
                if (['add', 'edit'].includes(status)) {
                    return (
                        <div fieldid="operation">
                        <span className="opration-wrapper">
                            <NCPopconfirm
                                fieldid="operation"
                                trigger="click"
                                placement="top"
                                content={this.lang('0063')}
                                onClose={() => {
                                    detail.accountLinks.splice(index, 1);
                                    this.setState({
                                        record: deepClone(detail),
                                        detail,
                                    });
                                }}
                            >
                                <a className="row-edit-option" filedid="delrow">{this.lang('0081')}</a>
                            </NCPopconfirm>
                        </span>
                        </div>
                    );
                }else{
                    return (
                        <div fieldid="operation">
                        <span className="opration-wrapper">&nbsp;</span>
                        </div>
                    ); 
                }
            } 
        },
    ];
}

function onChange (index, val, name) {
    let { detail }= this.state;
    switch(name) {
        case 'm_pk_corp':
            if (detail.accountLinks[index].m_pk_corp!== val.refpk) {
                detail.accountLinks[index].m_pk_subject= null;
                detail.accountLinks[index].projectname= null;
            }
            detail.accountLinks[index].m_pk_corp= val.refpk;
            detail.accountLinks[index].accountorgname= val.refname;
            break;
        case 'm_pk_subject':
            detail.accountLinks[index].m_pk_subject= val.refpk;
            detail.accountLinks[index].projectname= val.refname;
            break;
        default:
            detail.accountLinks[index][name]= val;
    }
    this.setState({detail});
}

export function btnClick (item) {
    let { record }= this.state;
    switch (item.path) {
        case 'add': 	//新增
            this.setState({
                status: 'add',
                showType: 'edit',
            });
            this.props.setUrlParam({
                status: 'add',
            });
            break;
        case 'save': 	//保存
            this.addEdit();
            break;
        case 'cancel': 	//取消
            this.props.modal.show('cancelModal', {title: this.lang('0034'), content: this.lang('0077')});
            break;
        case 'edit': 	//修改
            this.setState({
                status: 'edit',
                showType: 'eidt',
            });
            this.props.setUrlParam({
                status: 'edit',
            });
            break;
        case 'delete.do': 	//删除
            this.props.modal.show('deleteModal', {title: this.lang('0015'), content: this.lang('0063')});
            break;
        case 'change': 	//变更
            this.setState({
                status: 'change',
                showType: 'eidt',
            });
            this.props.setUrlParam({
                status: 'change',
            });
            break;
        case 'start.do': 	//启用
            startClick.call(this, record);
            break;
        case 'cancelstart.do': 	//取消启用
            cancelstartClick.call(this, record);
            break;
        case 'stop.do': 	//停用
            stopClick.call(this, record);
            break;
        case 'settle.do': 	//结转下年
            settleClick.call(this, record);
            break;
        case 'Unsettle.do': 	//取消结转
            UnsettleClick.call(this, record);
            break;
        case 'refresh': 	//取消结转
            this.getDetail();
            break;
    }
}

export const copyData= {
    m_source: '1',
    contrastscope: '1',
    isPublic: 'Y',
    m_contrastaspect: '0',
    m_isConTally: true,
    accountLinks: []
}

export function configContent() {
    let { detail }= this.state;
    let isChange= this.props.getUrlParam('status')=== 'change';
    let isEdit= this.props.getUrlParam('status')=== 'edit';

    return [
        {   
            label: this.lang('0035'),
            type: 'input',
            value: detail.m_contrastaccountname,
            required: true,
            config: {
                value: detail.m_contrastaccountname || '',
                name: 'm_contrastaccountname',
            }
        },
        {
            label: this.lang('0001'),
            type: 'refer',
            value: detail.orgName,
            required: true,
            config: {
                name: 'm_pk_corp',
                disabled: isChange, 
                refName: this.lang('0001'),
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: false,
                //isShowDisabledData:true,
                isTreelazyLoad: false,
                treeConfig: {name:[ this.lang('0003'),this.lang('0004')],code: [ 'refcode','refname']},
                rootNode: { refname: this.lang('0001'), refpk: 'root' },
                value: {
                    refname: detail.orgName, 
                    refpk: detail.m_pk_corp
                },
                queryCondition: {
                    isDataPowerEnable: 'Y',
                    isShowDisabledData:'N',
                 
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroup4InitBuilder'
                }
            }
        },
        {
            label: this.lang('0032'),
            type: 'refer',
            value: detail.pk_accountName, 
            required: true,
            config: {
                name: 'pk_account',
                disabled: isChange || !detail.m_pk_corp,
                refName: this.lang('0032'),
                queryTreeUrl: '/nccloud/uapbd/ref/BankaccSubUseTreeRef.do',
                queryGridUrl: '/nccloud/uapbd/ref/BankaccSubUseGridRef.do',
                refType: 'gridTree',
                columnConfig: [{name: [ this.lang('0002'), this.lang('0037'), this.lang('0055'), this.lang('0056'), this.lang('0057'), this.lang('0058'), this.lang('0026'), this.lang('0059') ],code: [ 'refcode', 'refname', 'bd_bankdoc.name', 'bd_banktype.name', 'bd_bankaccsub.code', 'bd_bankaccsub.name', 'bd_currtype.name', 'bd_bankaccsub.acctype as acctype' ]}],
                rootNode: { refname: this.lang('0001'), refpk: 'root' },
                refCode: 'uapbd.refer.pub.BankaccSubUseTreeGridRef',
                isMultiSelectedEnabled: false,
                value: {
                    refname: detail.pk_accountName, 
                    refpk: detail.pk_account
                },
                queryCondition: {
                    GridRefActionExt: 'nccloud.web.cmp.ref.CMPContrastBankAccountRefSqlBuilder',
                    pk_org: detail.m_pk_corp,
                    refnodename: this.lang('0067')
                }
            }
        },
        {
            label: this.lang('0039'),
            type: 'select',
            required: true,
            value: detail.m_source=== '1' ? this.lang('0028') : this.lang('0029'),
            options: [
                {display: this.lang('0028'), value: '1'},
                {display: this.lang('0029'), value: '2'}
            ],
            config: {
                value: detail.m_source,
                name: 'm_source',
                disabled: isChange || isEdit
            }
        },
        {
            label: this.lang('0040'),
            type: 'checkbox',
            value: detail.m_isConTally ? this.lang('0041') : this.lang('0042'),
            config: {
                checked: detail.m_isConTally,
                name: 'm_isConTally',
                disabled: isChange || detail.m_source=== '2'
            }
        },
        {
            label: this.lang('0043'),
            type: 'select',
            
            value: detail.contrastscope=== '1' ? this.lang('0044') : this.lang('0045'),
            options: [
                {display: this.lang('0044'), value: '1'},
                {display: this.lang('0045'), value: '2'}
            ],
            config: {
                value: detail.contrastscope,
                name: 'contrastscope',
                disabled: isChange || isEdit
            }
        },
        {
            label: this.lang('0046'),
            type: 'select',
            value: detail.m_contrastaspect=== '0' ? this.lang('0047') : this.lang('0048'),
            options: [
                {display: this.lang('0047'), value: '0'},
                {display: this.lang('0048'), value: '1'}
            ],
            config: {
                value: detail.m_contrastaspect || '',
                name: 'm_contrastaspect',
                disabled: isChange
            }
        },
        {
            label: this.lang('0049'),
            type: 'select',
            required: true,
            value: detail.isPublic=== 'Y' ? this.lang('0050'):this.lang('0051'),
            options: [
                { display: this.lang('0050'), value: 'Y'},
                { display: this.lang('0051'), value: 'N'}
            ],
            config: {
                value: detail.isPublic || '',
                name: 'isPublic',
            } 
        },
        {
            label: this.lang('0052'),
            type: 'refer',
            value: detail.pk_user && detail.pk_user.map(item => item.refname).join(','),
            required: detail.isPublic=== 'N',
            config: {
                name: 'pk_user',
                refName:this.lang('0052'),
                disabled: detail.isPublic=== 'Y',
                queryGridUrl: '/nccloud/riart/ref/userDefaultRefTreeAction.do',
                refType: 'grid',
                refCode: 'riart/refer/userDefault/UserDefaultRefAction',
                isMultiSelectedEnabled: true,
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                value: detail.pk_user,
            }
        },
        {
            label: this.lang('0053'),
            type: 'refer',
            value: detail.currnetname, 
            config: {
                name: 'm_pk_currtype',
                disabled: true,
                queryGridUrl: '/nccloud/uapbd/ref/CurrtypeGridRef.do',
                refType: 'grid',
                refName: this.lang('0053'),
                refCode: 'uapbd.refer.pubinfo.CurrtypeGridRef',
                isMultiSelectedEnabled: false,
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                value: {
                    refname: detail.currnetname, 
                    refpk: detail.m_pk_currtype
                }
            }
        },
        {
            label: this.lang('0054'),
            type: 'input',
            value: showMoney(0==parseInt(detail.m_debitamount) ? detail.m_creditamount : detail.m_debitamount),
            config: {
            value: showMoney(0==parseInt(detail.m_debitamount)? detail.m_creditamount : detail.m_debitamount),
                name: 'm_debitamount',
                disabled: true
            }
        },
        {
            label: this.lang('0009'),
            type: 'datepicker',
            value: detail.m_startdate,
            config: {
                value: detail.m_startdate || '',
                name: 'm_startdate',
                disabled: true
            }
        },
    ];
}
/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/