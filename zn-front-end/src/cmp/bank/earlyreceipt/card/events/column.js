/*SfDA7s4Axsvm4XVdA8oRWlLQk70WOKYZwjBzDyG3JRWQolW3guSY0K4qqVGRgjSd*/
import { base } from 'nc-lightapp-front';
import { deepClone, EditTableCell, currIndex, width } from '../../../commom';
const { NCPopconfirm } = base;

export function columns(type, isShow) {
    let { record, searchMap, headReceipt, isEdit, currIndex } = this.state;
    let { isVoucher, pk_corp } = searchMap;
    let nameArr1 = ['', this.lang('0024'), this.lang('0025')];
    let nameArr2 = ['', this.lang('0026'), this.lang('0027')];
    let urlArr = ['', '/nccloud/uapbd/ref/VoucherTypeDefaultGridRef.do', '/nccloud/riart/ref/allBillRef.do'];
    let codeArr = ['', 'uapbd/refer/fiacc/VoucherTypeDefaultGridRef', 'uap/refer/riart/billtype'];
    let isCorpEdit = isEdit && (type == 1);
    let isBankEdit = isEdit && (type == 2);
    let m_source = headReceipt.m_source;

    let list1 = [
        {
            title: <div fieldid="numberindex">{this.lang('0005')}</div>,
            key: 'key',
            dataIndex: 'key',
            show: true,
            width: '80px',
            className: 'pleft20',
            fixed: true,
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{index + 1}</div>
                );
            }
        },
        {
            title: <div fieldid="orgname">{this.lang('0001')}</div>,
            key: 'orgname',
            dataIndex: 'orgname',
            show: isShow,
            width,
            render: (text, record, index) => {
                if (m_source == 2) {
                    return (
                        <EditTableCell
                            fieldid="orgname"
                            isEdit={isCorpEdit && currIndex === index}
                            type="refer"
                            config={{
                                placeholder: this.lang('0001'),
                                refName: this.lang('0001'),
                                name: 'orgname',
                                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                                refType: 'tree',
                                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                                isMultiSelectedEnabled: false,
                                value: {
                                    refname: record.orgname,
                                    refpk: record.pk_corp
                                },
                                queryCondition: {
                                    pk_contrastaccount: headReceipt.m_pk_contrastaccount,
                                    TreeRefActionExt: 'nccloud.web.cmp.ref.contrastAccountRelOrgBuilder'
                                }
                            }}
                            onChange={this.onChange.bind(this, index)}
                        />
                    );
                } else {
                    return (<div>{record.orgname}</div>);
                }
            }
        },
        {
            title: <div fieldid="accountbookname">{this.lang('0022')}</div>,
            key: 'accountbookname',
            dataIndex: 'accountbookname',
            show: isShow,
            width,
            render: (text, record, index) => {
                if (m_source == 1) {
                    return (
                        <EditTableCell
                            fieldid="accountbookname"
                            isEdit={isCorpEdit && currIndex === index}
                            type="refer"
                            config={{
                                name: 'pk_org',
                                refName: this.lang('0022'),
                                queryGridUrl: '/nccloud/cmp/refer/AccountLinkRefModeltest.do',
                                refType: 'grid',
                                refCode: 'cmp/refer/accountlink/CMPAccountLinkGridRef',
                                isMultiSelectedEnabled: false,
                                columnConfig: [{name: [ this.lang('0022'), this.lang('0038'), this.lang('0039') ], code: [ 'refname', 'subjname', 'assname' ]}],
                                value: {
                                    refpk: record.pk_org,
                                    refname: record.accountbookname,
                                },
                                queryCondition: { pk_contrastaccount: headReceipt.m_pk_contrastaccount },
                            }}
                            onChange={this.onChange.bind(this, index)}
                        />
                    );
                }
            }
        },
        {
            title: <div fieldid="m_prepareddate" className={`require-title ${isEdit && 'show'}`}>{this.lang('0023')}</div>,
            key: 'm_prepareddate',
            dataIndex: 'm_prepareddate',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_prepareddate"
                        isEdit={isCorpEdit && currIndex === index}
                        type="datepicker"
                        config={{
                            value: record.m_prepareddate ? record.m_prepareddate.substr(0, 10) : null,
                            name: 'm_prepareddate',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_pk_vouchertype">{this.lang(searchMap.isVoucher === '1' ? '0024' : '0025')}</div>,
            key: 'm_pk_vouchertype',
            dataIndex: 'm_pk_vouchertype',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_pk_vouchertype"
                        isEdit={isCorpEdit && currIndex === index}
                        type="refer"
                        config={{
                            name: 'm_pk_vouchertype',
                            refName: nameArr1[isVoucher],
                            queryGridUrl: urlArr[isVoucher],
                            columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                            refType: 'grid',
                            refCode: codeArr[isVoucher],
                            isMultiSelectedEnabled: false,
                            queryCondition: {
                                GridRefActionExt: 'nccloud.web.cmp.ref.CMPEarlyreceiptBillTypeRefSqlBuilder'
                            },
                            value: {
                                refname: record.m_pk_vouchertype,
                                refpk: record.m_pk_vouchertype
                            }
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_vouchno">{this.lang(searchMap.isVoucher === '1' ? '0026' : '0027')}</div>,
            key: 'm_vouchno',
            dataIndex: 'm_vouchno',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_vouchno"
                        isEdit={isCorpEdit && currIndex === index}
                        type="input"
                        config={{
                            value: record.m_vouchno || '',
                            name: 'm_vouchno',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_jsfsh">{this.lang('0028')}</div>,
            key: 'm_jsfsh',
            dataIndex: 'm_jsfsh',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_jsfsh"
                        isEdit={isCorpEdit && currIndex === index}
                        type="refer"
                        config={{
                            name: 'm_checkstyle',
                            refName: this.lang('0028'),
                            queryGridUrl: '/nccloud/uapbd/sminfo/BalanceTypeGridRef.do',
                            columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                            refType: 'grid',
                            refCode: 'uapbd.refer.sminfo.BalanceTypeGridRef',
                            isMultiSelectedEnabled: false,
                            value: {
                                refname: record.m_jsfsh,
                                refpk: record.m_checkstyle
                            }
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_checkno">{this.lang('0029')}</div>,
            key: 'm_checkno',
            dataIndex: 'm_checkno',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_checkno"
                        isEdit={isCorpEdit && currIndex === index}
                        type="input"
                        config={{
                            value: record.m_checkno || '',
                            name: 'm_checkno',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_explanation">{this.lang('0030')}</div>,
            key: 'm_explanation',
            dataIndex: 'm_explanation',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_explanation"
                        isEdit={isCorpEdit && currIndex === index}
                        type="refer"
                        config={{
                            name: 'm_explanation',
                            refName: this.lang('0030'),
                            queryGridUrl: '/nccloud/fipub/ref/SummaryRef.do',
                            refType: 'grid',
                            refCode: 'fipub.ref.pub.SummaryRef',
                            isMultiSelectedEnabled: false,
                            checkStrictly: false,
                            columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                            value: {
                                refpk: record.m_explanation,
                                refname: record.m_explanation,
                            },
                            queryCondition: {
                                pk_org: pk_corp
                            }
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_debitamount">{this.lang('0006')}</div>,
            key: 'm_debitamount',
            dataIndex: 'm_debitamount',
            className: 'money-right',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_debitamount"
                        isEdit={isCorpEdit && currIndex === index}
                        type="num"
                        config={{
                            value: record.m_debitamount || '',
                            scale: 2,
                            name: 'm_debitamount',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_creditamount">{this.lang('0007')}</div>,
            key: 'm_creditamount',
            dataIndex: 'm_creditamount',
            className: 'money-right',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_creditamount"
                        isEdit={isCorpEdit && currIndex === index}
                        type="num"
                        config={{
                            value: record.m_creditamount || '',
                            scale: 2,
                            name: 'm_creditamount',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_checkdate">{this.lang('0031')}</div>,
            key: 'm_checkdate',
            dataIndex: 'm_checkdate',
            show: true,
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_checkdate"
                        isEdit={isCorpEdit && currIndex === index}
                        type="datepicker"
                        config={{
                            value: record.m_checkdate ? record.m_checkdate.substr(0, 10) : null,
                            name: 'm_checkdate',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
    ];
    let list2 = [
        {
            title: <div fieldid="numberindex">{this.lang('0005')}</div>,
            key: 'key',
            dataIndex: 'key',
            width: '60px',
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{index + 1}</div>
                );
            }
        },
        {
            title: <div fieldid="m_checkdate" className={`require-title ${isEdit && 'show'}`}>{this.lang('0023')}</div>,
            key: 'm_checkdate',
            dataIndex: 'm_checkdate',
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_checkdate"
                        isEdit={isBankEdit && currIndex === index}
                        type="datepicker"
                        config={{
                            value: record.m_checkdate ? record.m_checkdate.substr(0, 10) : null,
                            name: 'm_checkdate',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_explanation">{this.lang('0030')}</div>,
            key: 'm_explanation',
            dataIndex: 'm_explanation',
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_explanation"
                        isEdit={isBankEdit && currIndex === index}
                        type="refer"
                        config={{
                            name: 'm_explanation',
                            refName: this.lang('0030'),
                            queryGridUrl: '/nccloud/fipub/ref/SummaryRef.do',
                            refType: 'grid',
                            refCode: 'fipub.ref.pub.SummaryRef',
                            isMultiSelectedEnabled: false,
                            checkStrictly: false,
                            columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                            value: {
                                refpk: record.m_explanation,
                                refname: record.m_explanation,
                            },
                            queryCondition: {
                                pk_org: searchMap.pk_corp
                            }
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_jsfsh">{this.lang('0028')}</div>,
            key: 'm_jsfsh',
            dataIndex: 'm_jsfsh',
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_jsfsh"
                        isEdit={isBankEdit && currIndex === index}
                        type="refer"
                        config={{
                            name: 'm_checkstyle',
                            refName: this.lang('0028'),
                            queryGridUrl: '/nccloud/uapbd/sminfo/BalanceTypeGridRef.do',
                            columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                            refType: 'grid',
                            refCode: 'uapbd.refer.sminfo.BalanceTypeGridRef',
                            isMultiSelectedEnabled: false,
                            value: {
                                refname: record.m_jsfsh,
                                refpk: record.m_checkstyle
                            }
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_pk_check">{this.lang('0029')}</div>,
            key: 'm_pk_check',
            dataIndex: 'm_pk_check',
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_pk_check"
                        isEdit={isBankEdit && currIndex === index}
                        type="input"
                        config={{
                            value: record.m_pk_check || '',
                            name: 'm_pk_check',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_debitamount">{this.lang('0006')}</div>,
            key: 'm_debitamount',
            dataIndex: 'm_debitamount',
            className: 'money-right',
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_debitamount"
                        isEdit={isBankEdit && currIndex === index}
                        type='num'
                        config={{
                            value: record.m_debitamount || '',
                            scale: 2,
                            name: 'm_debitamount',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="m_creditamount">{this.lang('0007')}</div>,
            key: 'm_creditamount',
            dataIndex: 'm_creditamount',
            className: 'money-right',
            width,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_creditamount"
                        isEdit={isBankEdit && currIndex === index}
                        type='num'
                        config={{
                            value: record.m_creditamount || '',
                            scale: 2,
                            name: 'm_creditamount',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
    ];
    if (type == 1) {
        return list1.filter(item => item.show);
    } else if (type == 2) {
        return list2;
    }
}

export function operationColumn(type, isShow, isBrowse) {
    let { isEdit, dataListCopy, currIndex, billtype } = this.state;
    let arr = [
        {},
        {
            receipt: 'corpReceipt',
            m_pk_receipt: 'm_pk_corpreceipt',
        },
        {
            receipt: 'bankReceipt',
            m_pk_receipt: 'm_pk_bankreceipt',
        }
    ];

    return [{
        title: <div fieldid="opr">{this.lang('0008')}</div>,
        key: 'operation',
        dataIndex: 'operation',
        width,
        fixed: billtype === '1' ? 'right' : false,
        render: (text, record, index) => {
            if (!isBrowse && isShow) {
                if (!isEdit) {
                    return (
                        <div className="opration-wrapper"fieldid="opr">
                            <a  
                                fieldid="update"
                                className="row-edit-option"
                                onClick={() => {
                                    this.setState({
                                        record: deepClone(record),
                                        signal: 'edit',
                                        isEdit: true,
                                        currIndex: index
                                    });
                                }}
                            >
                                {this.lang('0021')}
                            </a>
                            <NCPopconfirm
                                trigger="click"
                                placement="top"
                                content={this.lang('0061')}
                                onClose={() => {
                                    this.statusOperation('delete.do', { m_pk_contrastaccount: record.m_pk_contrastaccount, [arr[type]['receipt']]: [{ [arr[type]['m_pk_receipt']]: record[arr[type]['m_pk_receipt']] }] }, this.lang('0043') + this.lang('0060'));
                                }}
                            >
                                <a fieldid="del" className="row-edit-option">{this.lang('0043')}</a>
                            </NCPopconfirm>
                        </div>
                    );
                } else if (isEdit && index === currIndex) {
                    return (
                        <div className="opration-wrapper"fieldid="opr">
                            <a  
                                fieldid="save"
                                className="row-edit-option"
                                onClick={this.addConfirm}
                            >
                                {this.lang('0063')}
                            </a>
                            <NCPopconfirm
                                trigger="click"
                                placement="top"
                                content={this.lang('0065')}
                                onClose={() => {
                                    this.setState({
                                        dataList: deepClone(dataListCopy),
                                        signal: '',
                                        isEdit: false,
                                        currIndex: -1,
                                    });
                                }}
                            >
                                <a className="row-edit-option" fieldid="cancel">
                                    {this.lang('0064')}
                                </a>
                            </NCPopconfirm>
                        </div>
                    );
                }
            }
        }
    }];
}
/*SfDA7s4Axsvm4XVdA8oRWlLQk70WOKYZwjBzDyG3JRWQolW3guSY0K4qqVGRgjSd*/