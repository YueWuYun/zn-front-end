/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/
import moment from 'moment';
import { formatMoney, width, resolveColumn,showMoney } from '../../../commom';
const format = "YYYY-MM-DD";

export function buttonConfig () {
    let { isFullScreen, isShow }= this.state;
    return [
        {content: this.lang('0044'), path: 'switch', show: false},
        {content: this.lang('0014'), path: 'corp', show: !isShow},
        {content: this.lang('0015'), path: 'bank', show: !isShow},
        {content: <i className={`iconfont icon-zui${isFullScreen ? 'xiao' : 'da'}hua`} />, path: 'full', show: false},
        {content: <i className="iconfont icon-shuaxin1" />, path: 'refresh', show: false},
    ];
}

export function bankColumns (data) {
    let list= [
        { 
            title: <div fieldid="numberindex">{this.lang('0005')}</div> ,
            key: 'index', 
            dataIndex: 'index', 
            width: '80px',
            className: 'pleft20', 
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{index=== data.length - 1 ? this.lang('0036') : (index + 1)}</div>
                );
            }
        },
        { 
            title: <div fieldid="date">{this.lang('0016')}</div>, 
            key: 'date', 
            dataIndex: 'date', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="date">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="explanation">{this.lang('0008')}</div>, 
            key: 'explanation', 
            dataIndex: 'explanation', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="explanation">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="checkStyleName">{this.lang('0013')}</div>, 
            key: 'checkStyleName', 
            dataIndex: 'checkStyleName', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="checkStyleName">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="checkNo">{this.lang('0009')}</div>, 
            key: 'checkNo', 
            dataIndex: 'checkNo', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="checkNo">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="debitamount">{this.lang('0006')}</div>, 
            key: 'debitamount', 
            dataIndex: 'debitamount', 
            className: 'money-right', 
            width, 
            render: text => {
                return (
                    <div fieldid="debitamount">{text ?  showMoney(text) : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="creditamount">{this.lang('0007')}</div>, 
            key: 'creditamount', 
            dataIndex: 'creditamount', 
            className: 'money-right', 
            width,  
            render: text => {
                return (
                    <div fieldid="creditamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="caved">{this.lang('0030')}</div>, 
            key: 'caved', 
            dataIndex: 'caved', 
            width, 
            render: (text) => {
                return (
                    <div fieldid="caved">{text=== true ? this.lang('0032') : text=== false ? this.lang('0033') : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="batchNumber">{this.lang('0034')}</div>, 
            key: 'batchNumber', 
            dataIndex: 'batchNumber', 
            width, 
            render: (text) => {
                return (
                    <div fieldid="batchNumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="netBankNumber">{this.lang('0035')}</div>, 
            key: 'netBankNumber', 
            dataIndex: 'netBankNumber',
            width, 
            render: (text) => {
                return (
                    <div fieldid="netBankNumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        }
      
    ];
    return resolveColumn(list);
}

export function corpColumns (data) {
    let list= [
        { 
            title: <div fieldid="numberindex">{this.lang('0005')}</div>,
            key: 'index', 
            dataIndex: 'index', 
            width: '80px',
            className: 'pleft20', 
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{index=== data.length-1 ? this.lang('0036') : (index + 1)}</div>
                );
            }
        },
        { 
            title: <div fieldid="date">{this.lang('0016')}</div>, 
            key: 'date', 
            dataIndex: 'date',
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="date">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="pk_corp">{this.lang('0001')}</div>, 
            key: 'pk_corp', 
            dataIndex: 'pk_corp', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="pk_corp">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="pk_accLink">{this.lang('0010')}</div>, 
            key: 'pk_accLink', 
            dataIndex: 'pk_accLink', 
            width: '200px', 
            render: (text, record, index) => {
                return (
                    <div fieldid="pk_accLink">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="pk_subject">{this.lang('0011')}</div>, 
            key: 'pk_subject', 
            dataIndex: 'pk_subject', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="pk_subject">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="pk_ass">{this.lang('0012')}</div>, 
            key: 'pk_ass', 
            dataIndex: 'pk_ass', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="pk_ass">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="explanation">{this.lang('0008')}</div>, 
            key: 'explanation', 
            dataIndex: 'explanation',
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="explanation">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="receiptNo">{this.lang('0031')}</div>, 
            key: 'receiptNo', 
            dataIndex: 'receiptNo',
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="receiptNo">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="checkDate">{this.lang('0017')}</div>, 
            key: 'checkDate', 
            dataIndex: 'checkDate',
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="checkDate">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="checkStyleName">{this.lang('0013')}</div>, 
            key: 'checkStyleName', 
            dataIndex: 'checkStyleName',
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="checkStyleName">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="checkNo">{this.lang('0009')}</div>, 
            key: 'checkNo', 
            dataIndex: 'checkNo', 
            width, 
            render: (text, record, index) => {
                return (
                    <div fieldid="checkNo">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="debitamount">{this.lang('0006')}</div>, 
            key: 'debitamount', 
            dataIndex: 'debitamount', 
            className: 'money-right', 
            width, 
            render: text => {
                return (
                    <div fieldid="debitamount">{text ?  showMoney(text) : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="creditamount">{this.lang('0007')}</div>, 
            key: 'creditamount', 
            dataIndex: 'creditamount',
            className: 'money-right',
            width,  
            render: text => {
                return (
                    <div fieldid="creditamount">{text ?  showMoney(text) : <span>&nbsp;</span>}</div>
                );
            }  
        },
        { 
            title: <div fieldid="caved">{this.lang('0030')}</div>, 
            key: 'caved', 
            dataIndex: 'caved', 
            width, 
            render: (text) => {
                return (
                    <div fieldid="caved">{text=== true ? this.lang('0032') : text=== false ? this.lang('0033') : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="batchNumber">{this.lang('0034')}</div>, 
            key: 'batchNumber', 
            dataIndex: 'batchNumber',
            width, 
            render: (text) => {
                return (
                    <div fieldid="batchNumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="netBankNumber">{this.lang('0035')}</div>, 
            key: 'netBankNumber', 
            dataIndex: 'netBankNumber', 
            width, 
            render: (text) => {
                return (
                    <div fieldid="netBankNumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        }
       
    ];
    return resolveColumn(list);
}

export function list (search) {
    let list= [
        {
            itemtype: 'refer',
            label: this.lang('0001'),
            code: 'm_Pk_Corp',
            required: true,
            show: true,
            config: {
                placeholder: this.lang('0001'),
                refName: this.lang('0001'),
                name: 'm_Pk_Corp',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: false,
                isTreelazyLoad:false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                treeConfig: {name:[ this.lang('0003'),this.lang('0004')],code: [ 'refcode','refname']},
                rootNode: { refname: this.lang('0001'), refpk: 'root' },
                queryCondition: {
                    isDataPowerEnable: 'Y',
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroupBuilder'
                },
                value: {
                    refname: search.m_Pk_CorpName, 
                    refpk: search.m_Pk_Corp
                }
            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0002'),
            code: 'm_Pk_Account',
            required: true,
            show: true,
            config: {
                placeholder: this.lang('0002'),
                refName: this.lang('0002'),
                name: 'm_Pk_Account',
                queryGridUrl: '/nccloud/cmp/refer/CMPContrastAccGridRef.do',
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ], code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'cmp.refer.bankcontrast.CMPContrastAccGridRef',
                isMultiSelectedEnabled: false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                value: {
                    refname: search.m_Pk_AccountName, 
                    refpk: search.m_Pk_Account
                },
                disabled: !search.m_Pk_Corp,
                queryCondition: {pkOrgArr: search.m_Pk_Corp},
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0016'),
            code: 'm_strDate',
            required: true,
            show: search.type=== 'true',
            config: {
                placeholder: this.lang('0016'),
                name: 'm_strDate',
                value: search.m_strDate ? [search.m_strDate, search.m_strEndDate] : [],
                dateInputPlaceholder: [this.lang('0047'), this.lang('0048')]
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0017'),
            code: 'n_pjdate',
            show: search.type=== 'true',
            config: {
                maxlength: 20,
                placeholder: this.lang('0017'), 
                name: 'n_pjdate',
                value: search.n_pjdate1 ? [search.n_pjdate1, search.n_pjdate2] : [],
                dateInputPlaceholder: [this.lang('0047'), this.lang('0048')]
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0019'),
            code: 'm_blnChecked',
            show: search.type=== 'true',
            config: {
                maxlength: 40,
                placeholder: this.lang('0019'),
                name: 'm_blnChecked',
                value: search.m_blnChecked== null ? undefined : search.m_blnChecked,
                selectValue: this.lang(search.m_blnChecked ? '0021' : '0022')
            },
            options: [
                {
                    display: this.lang('0021'),
                    value: true
                },
                {
                    display: this.lang('0022'),
                    value: false
                },
            ]
        },
        {
            itemtype: 'select',
            label: this.lang('0023'),
            code: 'moneyAspect',
            show: search.type=== 'true',
            config: {
                maxlength: 40,
                placeholder: this.lang('0023'),
                name: 'moneyAspect',
                value: search.moneyAspect=== '-1' ? undefined : search.moneyAspect,
                selectValue: search.moneyAspect=== '-1' ? undefined : this.lang(search.moneyAspect=== '1' ? '0007' : '0006')
            },
            options: [
                {
                    display: this.lang('0006'),
                    value: '0'
                },
                {
                    display: this.lang('0007'),
                    value: '1'
                },
            ]
        },
        {
            itemtype: 'refer',
            label: this.lang('0013'),
            code: 'm_strCheckStyle',
            show: search.type=== 'true',
            config: {
                maxlength: 20,
                placeholder: this.lang('0013'),
                refName: this.lang('0013'),
                name: 'm_strCheckStyle',
                queryGridUrl: '/nccloud/uapbd/sminfo/BalanceTypeGridRef.do',
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'uapbd.refer.sminfo.BalanceTypeGridRef',
                isMultiSelectedEnabled: false,
                value: {
                    refname: search.m_strCheckStyleName, 
                    refpk: search.m_strCheckStyle
                }
            }
        },
        {
            itemtype: 'rangenum',
            label: this.lang('0037'),
            code: 'moneyArea',
            show: search.type=== 'true',
            config: {
                maxlength: 20,
                name: 'moneyArea',
                values: [search.moneyArea1, search.moneyArea2]
            }
        },
        {
            itemtype: 'datepicker',
            label: this.lang('0024'),
            code: 'bankEndDate',
            required: true,
            show: search.type!== 'true',
            config: {
                placeholder: this.lang('0024'),
                name: 'bankEndDate',
                value: search.bankEndDate
            }
        },
        {
            itemtype: 'num',
            label: this.lang('0025'),
            code: 'Deadline',
            show: search.type!== 'true',
            config: {
                maxlength: 20,
                placeholder: this.lang('0025'),
                name: 'Deadline',
                scale: 0,
                value: search.Deadline
            }
        },
    ];
    return list.filter(item => item.show);
}

export const searchData1= {
    type: 'true',
    moneyAspect: '-1',
    m_blnChecked: null,
    m_strDate: moment().format('YYYY-MM-01'),
    m_strEndDate: moment().format(format),
}; 

export const searchData2= {
    type: 'false',
    bankEndDate: moment().format(format),
}; 

export function headerConfig (headReceipt, search) {
    return [
        {
            label: this.lang('0001'),
            config: {
                name: 'm_Pk_CorpName',
            },
            value: search.m_Pk_CorpName
        },
        {
            label: this.lang('0002'),
            config: {
                name: 'm_Pk_AccountName',
            },
            value: search.m_Pk_AccountName
        },
        {
            label: this.lang('0026'),
            config: {
                name: 'bankAccCode',
            },
            value: headReceipt.bankAccCode
        },
    ];
}

/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/