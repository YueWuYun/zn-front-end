/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/
import { base } from 'nc-lightapp-front';
import moment from 'moment';
import { showMoney, AccSub, getScale, formatMoney, width, resolveColumn } from '../../../commom';
const { NCPopconfirm, NCIcon } = base;
const format= 'YYYY-MM-DD';

//按钮状态
export function buttonConfig (status= 'list') {
    let isShow= this.state.dataSelect.length> 0;
    let list= [
        {content: this.lang('0013'), msg: this.lang('0013') + this.lang('0043'), path: 'audit.do', show: status=== 'list' && isShow},
        {content: this.lang('0014'), msg: this.lang('0014') + this.lang('0043'), path: 'unaudit.do', show: status=== 'list' && isShow},
        {content: this.lang('0017'), path: status=== 'detail' ? 'printdetail.do' : 'printlist.do', show: this.state.isShow, isSeperate: true},
        {content: this.lang('0039'), path: 'output', show: this.state.isShow},
        {content: <i className="iconfont icon-shuaxin1" />, path: 'querydetail.do', show: true},
    ];
    // return list.filter((item, index) => item.show);
    return list;
}

//列表状态
export function listOperation (approver) {
    let list= [
        {content: this.lang('0013'), msg: this.lang('0013') + this.lang('0043'), path: 'audit.do', show: !approver},
        {content: this.lang('0014'), msg: this.lang('0014') + this.lang('0043'), path: 'unaudit.do', show: approver},
        {content: this.lang('0015'), msg: this.lang('0015') + this.lang('0043'), path: 'settle.do', show: false},
        {content: this.lang('0016'), msg: this.lang('0016') + this.lang('0043'), path: 'opposite.do', show: false},
        {content: this.lang('0020'), path: 'querydetail.do', show: true},
        {content: this.lang('0021'), path: 'matching', show: true},
    ];
    return list.filter((item, index) => item.show);
}

export function list (search) {
    return [
        {
            itemtype: 'refer',
            label: this.lang('0022'),
            code: 'pkOrgArr',
            required: true,
            config: {
                placeholder: this.lang('0022'),
                refName: this.lang('0022'),
                name: 'pkOrgArr',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: true,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                treeConfig: {name:[ this.lang('0003'),this.lang('0004')],code: [ 'refcode','refname']},
                rootNode: { refname: this.lang('0001'), refpk: 'root' },
                queryCondition: {
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroupBuilder',
                },
                isTreelazyLoad:false,
                value: search.pkOrgArr
            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0023'),
            code: 'pkContrastAccountArr',
            required: true,
            config: {
                placeholder: this.lang('0023'),
                refName: this.lang('0023'),
                name: 'pkContrastAccountArr',
                queryGridUrl: '/nccloud/cmp/refer/CMPContrastAccGridRef.do',
                refType: 'grid',
                refCode: 'cmp.refer.bankcontrast.CMPContrastAccGridRef',
                columnConfig: [{name: [ this.lang('0024'), this.lang('0025') ],code: [ 'refcode', 'refname' ]}],
                isMultiSelectedEnabled: true,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                value: search.pkContrastAccountArr,
                disabled: !search.pkOrgArr || !search.pkOrgArr.length,
                queryCondition: {pkOrgArr: search.pkOrgArr && search.pkOrgArr.map(item => item.refpk).join(',')},
            }
        },
        {
            itemtype: 'datepicker',
            label: this.lang('0026'),
            code: 'endDate',
            config: {
                placeholder: this.lang('0026'),
                name: 'endDate',
                value: search.endDate
            
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0027'),
            code: 'firstAuditDate',
            config: {
                placeholder: this.lang('0027'),
                name: 'firstAuditDate',
                value: search.firstAuditDate ? [search.firstAuditDate, search.secondAuditDate] : [],
                dateInputPlaceholder: [this.lang('0057'), this.lang('0058')]
            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0028'),
            code: 'auditPersonPk',
            config: {
                placeholder: this.lang('0028'),
                refName: this.lang('0028'),
                name: 'auditPersonPk',
                queryGridUrl: '/nccloud/riart/ref/userDefaultRefTreeAction.do',
                columnConfig: [{name: [ this.lang('0024'), this.lang('0025') ],code: [ 'refcode', 'refname']}],
                refType: 'grid',
                refCode: 'riart.refer.userDefault.UserDefaultRefAction',
                isMultiSelectedEnabled: false,
                value: {
                    refname: search.auditPersonPkName, 
                    refpk: search.auditPersonPk
                }
            }
        }
    ];
}

export function columns() {
    let { page, size }= this.state.pages;
    let list= [
        { 
            title: <div fieldid="numberindex">{this.lang('0046')}</div> , 
            key: 'index', 
            dataIndex: 'index',
            width: '60px',
            fixed: true,
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{(page - 1) * size + index + 1}</div>
                );
            } 
        },
        { 
            title: <div fieldid="pk_org">{this.lang('0022')}</div>, 
            key: 'pk_org', 
            dataIndex: 'pk_org',
            width,
            render: text => {
                return (
                    <div fieldid="pk_org">{text ?text && text.split('&&&')[1] : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="account">{this.lang('0031')}</div>, 
            key: 'account', 
            dataIndex: 'account', 
            width,
            render: text => {
                return (
                    <div fieldid="account">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="linkmemo">{this.lang('0032')}</div>, 
            key: 'linkmemo', 
            dataIndex: 'linkmemo', 
            width,
            render: text => {
                return (
                    <div fieldid="linkmemo">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="startdate">{this.lang('0033')}</div>, 
            key: 'startdate', 
            dataIndex: 'startdate', 
            width,
            render: text => {
                return (
                    <div fieldid="startdate">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="begdate">{this.lang('0034')}</div>, 
            key: 'begdate', 
            dataIndex: 'begdate', 
            width,
            render: text => {
                return (
                    <div fieldid="begdate">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="enddate">{this.lang('0026')}</div>, 
            key: 'enddate', 
            dataIndex: 'enddate', 
            width,
            render: text => {
                return (
                    <div fieldid="enddate">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="bankbalance">{this.lang('0038')}</div>,
            key: 'bankbalance', 
            dataIndex: 'bankbalance', 
            className: 'money-right', 
            width,
            render: text => {
                return (
                    <div fieldid="bankbalance">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="bankbalanceafter">{this.lang('0009')}</div>, 
            key: 'bankbalanceafter', 
            dataIndex: 'bankbalanceafter',  
            className: 'money-right',
            width, 
            render: text => {
                return (
                    <div fieldid="bankbalanceafter">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            }   
        },
        { 
            title: <div fieldid="billbalance">{this.lang('0006')}</div>, 
            key: 'billbalance', 
            dataIndex: 'billbalance', 
            className: 'money-right', 
            width,
            render: text => {
                return (
                    <div fieldid="billbalance">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            }  
        },
        { 
            title: <div fieldid="billbalanceafter">{this.lang('0009')}</div>, 
            key: 'billbalanceafter', 
            dataIndex: 'billbalanceafter', 
            className: 'money-right', 
            width,
            render: text => {
                return (
                    <div fieldid="billbalanceafter">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            }  
        },
        { 
            title: <div fieldid="gap">{this.lang('0035')}</div>, 
            key: 'gap', 
            dataIndex: 'gap',
            className: 'money-right', 
            width,
            render: (text, record) => {
                let gap= AccSub(record.bankbalanceafter || 0, record.billbalanceafter || 0);
                let scale= getScale(record.bankbalanceafter);
                return (
                    <div fieldid="gap">{gap ? Number(gap).formatMoney(scale) : <span>{Number(0.00).formatMoney(scale)}</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="approver">{this.lang('0028')}</div>, 
            key: 'approver', 
            dataIndex: 'approver',
            width,
            render: text => {
                return (
                    <div fieldid="approver">{text ? text : <span>&nbsp;</span>}</div>
                );
            }  
        },
        { 
            title: <div fieldid="approvedate">{this.lang('0027')}</div>, 
            key: 'approvedate', 
            dataIndex: 'approvedate',
            width,
            render: text => {
                return (
                    <div fieldid="approvedate">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="operation">{this.lang('0036')}</div>, 
            key: 'operation', 
            dataIndex: 'operation', 
            width: '300px',
            fixed: 'right',
            render: (text, record) => {
                let showArr= listOperation.call(this, record.approver);
                return (
                    <div className="single-line-and-ellipsis" fieldid="operation">
                        <span className="opration-wrapper">
                        { 
                            showArr.map((item, index) => {
                                return (
                                    <div className="nc-hotkeys-wrapper" style={{display: 'inline-block'}}>
                                        {item.path=== 'unaudit.do' ? 
                                            <NCPopconfirm
                                                trigger="click"
                                                placement="top"
                                                content={this.lang('0037')}
                                                onClose={audit.bind(this, record, item)}
                                            >
                                                <a className="row-edit-option" fieldid="unaudit">
                                                    {item.content}
                                                </a> 
                                            </NCPopconfirm> : 
                                            <a
                                                className="row-edit-option" 
                                                fieldid={item.path==='querydetail.do'?'querydetail':item.path==='matching'?'matching':'audit'}
                                                onClick={() => {
                                                    if (item.path=== 'querydetail.do') {//余额调节表
                                                        this.setState(
                                                            {   
                                                                printRecord: record,
                                                                record: {
                                                                    ...record, 
                                                                    pk_org: record.pk_org && record.pk_org.split('&&&')[0]
                                                                }
                                                            }, () => {
                                                                this.btnRequire(item.path, {balanceAdjustVo: record}, item.msg);
                                                            }
                                                        );
                                                    } else if (item.path=== 'matching') {//联查勾对
                                                        this.props.openTo('/cmp/bank/bankmatching/main/index.html#/list', {
                                                            data: JSON.stringify({
                                                                m_Pk_Corp: record.pk_org && record.pk_org.split('&&&')[0],
                                                                m_Pk_CorpName: record.pk_org && record.pk_org.split('&&&')[1],
                                                                m_Pk_Account: record.pk_account,
                                                                m_Pk_AccountName: record.account,
                                                                m_strDate: record.begdate || record.startdate,
                                                                m_strEndDate: record.enddate,
                                                                appcode: '3607DQMS',
                                                                pagecode: '3607DQMS_L01',
                                                                nccloud_menu_name_self:'勾兑情况表'
                                                            })
                                                        });
                                                    } else {//确认、取消确认
                                                        audit.call(this, record, item);
                                                    }
                                                }}
                                            >
                                                {item.content}
                                            </a>
                                        }
                                    </div>
                                )
                            })
                        }
                        </span>
                    </div>
                );
            } 
        },
    ];
    return resolveColumn(list);
}

function audit (record, item) {
    let data= {
        balanceAdjustArr: [{
            ...record, 
            pk_org: record.pk_org && record.pk_org.split('&&&')[0]
        }]
    };
    if (item.path=== 'opposite.do') {
        data.confirmFlag= 'false';
    };
    this.setState(
        {
            record,
            isBatch: false
        }, () => {
            this.btnRequire(item.path, data, item.msg);
        }
    );
}

export const searchData= {
    endDate: moment().format(format)
};
/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/