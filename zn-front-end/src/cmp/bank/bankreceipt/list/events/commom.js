/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/
import { base, } from 'nc-lightapp-front';
import { deepClone, width, EditTableCell, resolveColumn } from '../../../commom';
const { NCPopconfirm } = base;

//按钮状态
export function buttonConfig() {
    let { status, isFullScreen, dataSelect, data, isBtnShow } = this.state;
    let isStop = data.stopdate;
    return [
        { content: this.lang('0011'), msg: this.lang('0011') + this.lang('0042'), path: 'add', show: isBtnShow && !isStop },//isBtnShow && !isStop && !status && !data.isNetBank
        { content: this.lang('0015'), msg: this.lang('0015') + this.lang('0042'), path: 'delete.do', show: isBtnShow && !status && dataSelect.length && !isStop },
        { content: this.lang('0014'), msg: this.lang('0014') + this.lang('0042'), path: 'fileImport.do', show: isBtnShow && !isStop },
        { content: this.lang('0013'), msg: this.lang('0044'), path: 'input.do', show: isBtnShow && !isStop },
        { content: this.lang('0017'), msg: this.lang('0017') + this.lang('0042'), path: 'print.do', show: isBtnShow, isSeperate: true },
        { content: this.lang('0055'), path: 'export', show: isBtnShow },
        { content: <i className={`iconfont icon-zui${isFullScreen ? 'xiao' : 'da'}hua`} />, path: 'full', show: true },
        { content: <i className="iconfont icon-shuaxin1" />, path: 'refresh', show: true },
    ];
    // return list.filter(item => item.show);
}

export function columns(search) {
    let { page, size } = this.state.pages;
    let { isEdit, currIndex, dataListCopy, status } = this.state;
    let list = [
        {
            title: <div fieldid="numberindex">{this.lang('0005')}</div>,
            key: 'key',
            dataIndex: 'key',
            width: '60px',
            fixed: true,
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{(page - 1) * size + index + 1}</div>
                );
            }
        },
        {
            title: <div fieldid="m_checkdate" className={`require-title ${isEdit && 'show'}`}>{this.lang('0016')}</div>,
            key: 'm_checkdate',
            dataIndex: 'm_checkdate',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="checkdate"
                        isEdit={isEdit && currIndex === index}
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
            title: <div fieldid='m_explanation'>{this.lang('0018')}</div>,
            key: 'm_explanation',
            dataIndex: 'm_explanation',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="m_explanation"
                        isEdit={isEdit && currIndex === index}
                        type="refer"
                        config={{
                            name: 'm_explanation',
                            refName: this.lang('0018'),
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
                                pk_org:search.pk_corp
                      
                            }
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid='m_checkstyle'>{this.lang('0019')}</div>,
            key: 'm_checkstyle',
            dataIndex: 'm_checkstyle',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid='m_checkstyle'
                        isEdit={isEdit && currIndex === index}
                        type="refer"
                        config={{
                            name: 'm_checkstyle',
                            refName: this.lang('0019'),
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
            title: <div fieldid='m_pk_check'>{this.lang('0020')}</div>,
            key: 'm_pk_check',
            dataIndex: 'm_pk_check',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid='m_pk_check'
                        isEdit={isEdit && currIndex === index}
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
            title: <div fieldid='m_debitamount'>{this.lang('0006')}</div>,
            key: 'm_debitamount',
            dataIndex: 'm_debitamount',
            className: 'money-right',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid='m_debitamount'
                        isEdit={isEdit && currIndex === index}
                        type="num"
                        config={{
                            value: record.m_debitamount || '',
                            name: 'm_debitamount',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid='m_creditamount'>{this.lang('0007')}</div>,
            key: 'm_creditamount',
            dataIndex: 'm_creditamount',
            className: 'money-right',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid='m_creditamount'
                        isEdit={isEdit && currIndex === index}
                        type="num"
                        config={{
                            value: record.m_creditamount || '',
                            name: 'm_creditamount',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid='m_jsbalance'>{this.lang('0021')}</div>,
            key: 'm_jsbalance',
            dataIndex: 'm_jsbalance',
            className: 'money-right',
            width,
            isEdit,
            render: text => {
                return (
                    <div fieldid='m_jsbalance'>{text ? Number(text).formatMoney() : ''}</div>
                );
            }
        },
        {
            title: <div fieldid="oppunitname">{this.lang('0022')}</div>,
            key: 'oppunitname',
            dataIndex: 'oppunitname',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="oppunitname"
                        isEdit={isEdit && currIndex === index}
                        type="input"
                        config={{
                            value: record.oppunitname || '',
                            name: 'oppunitname',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="nusage">{this.lang('0023')}</div>,
            key: 'nusage',
            dataIndex: 'nusage',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="nusage"
                        isEdit={isEdit && currIndex === index}
                        type="input"
                        config={{
                            value: record.nusage || '',
                            name: 'nusage',
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="netbanknumber">{this.lang('0024')}</div>,
            key: 'netbanknumber',
            dataIndex: 'netbanknumber',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="netbanknumber"
                        isEdit={isEdit && currIndex === index}
                        type="input"
                        config={{
                            value: record.netbanknumber || '',
                            name: 'netbanknumber',
                            disabled: status !== 'add'
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="transerial">{this.lang('0074')}</div>,
            key: 'transerial',
            dataIndex: 'transerial',
            width,
            isEdit,
            render: (text, record, index) => {
                return (
                    <EditTableCell
                        fieldid="transerial"
                        isEdit={isEdit && currIndex === index}
                        type="input"
                        config={{
                            value: record.transerial || '',
                            name: 'transerial',
                            disabled: status !== 'add'
                        }}
                        onChange={this.onChange.bind(this, index)}
                    />
                );
            }
        },
        {
            title: <div fieldid="operation">{this.lang('0008')}</div>,
            key: 'operation',
            dataIndex: 'operation',
            width,
            fixed: 'right',
            render: (text, record, index) => {
                if (!isEdit) {
                    return (
                        <div className="opration-wrapper" fieldid="operation">
                            {!this.state.data.stopdate && <a
                                className="row-edit-option"
                                fieldid="update"
                                onClick={() => {
                                    this.setState({
                                        status: 'edit',
                                        isEdit: true,
                                        currIndex: index
                                    });
                                }}
                            >
                                {this.lang('0012')}
                            </a>}
                            {!this.state.data.stopdate && <NCPopconfirm
                                trigger="click"
                                placement="top"
                                content={this.lang('0041')}
                                onClose={() => {
                                    let data = [{
                                        m_pk_bankreceipt: record.m_pk_bankreceipt,
                                        m_pk_contrastaccount: record.m_pk_contrastaccount,
                                        flag: record.flag,
                                        m_years: record.m_years
                                    }];
                                    this.statusOperation('delete.do', data, this.lang('0015') + this.lang('0042'));
                                }}
                            >
                                <a className="row-edit-option" fieldid="del">
                                    {this.lang('0015')}
                                </a>
                            </NCPopconfirm>}
                        </div>
                    );
                } else if (isEdit && index === currIndex) {
                    return (
                        <div className="opration-wrapper" fieldid="operation">
                            <a
                                className="row-edit-option"
                                fieldid="save"
                                onClick={this.saveConfirm}
                            >
                                {this.lang('0052')}
                            </a>
                            <NCPopconfirm
                                trigger="click"
                                placement="top"
                                content={this.lang('0054')}
                                onClose={() => {
                                    this.setState({
                                        dataList: deepClone(dataListCopy),
                                        status: '',
                                        isEdit: false,
                                        currIndex: -1,
                                    });
                                }}
                            >
                                <a className="row-edit-option" fieldid="cancel">
                                    {this.lang('0053')}
                                </a>
                            </NCPopconfirm>
                        </div>
                    );
                }
            }
        },
    ];
    return resolveColumn(list);
}

export const searchData = {
    flag: 0,
    onlyWrongRec: false,
    moneyAspect: -1
};

export function list(search) {
    return [
        {
            itemtype: 'refer',
            label: this.lang('0001'),
            code: 'pk_corp',
            required: true,
            config: {
                placeholder: this.lang('0001'),
                refName: this.lang('0001'),
                name: 'pk_corp',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: false,
                isTreelazyLoad: false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true,
                treeConfig: {name:[ this.lang('0003'),this.lang('0004')],code: [ 'refcode','refname']},
                rootNode: { refname: this.lang('0001'), refpk: 'root' },
                queryCondition: {
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroupBuilder'
                },
                value: {
                    refname: search.pk_corpName,
                    refpk: search.pk_corp
                }
            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0002'),
            code: 'contrastaccount',
            required: true,
            config: {
                placeholder: this.lang('0002'),
                refName: this.lang('0002'),
                name: 'contrastaccount',
                queryGridUrl: '/nccloud/cmp/refer/CMPContrastAccGridRef.do',
                 columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'cmp.refer.bankcontrast.CMPContrastAccGridRef',
                isMultiSelectedEnabled: false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true,
                value: {
                    refname: search.contrastaccountName,
                    refpk: search.contrastaccount
                },
                disabled: !search.pk_corp,
                queryCondition: { pkOrgArr: search.pk_corp },
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0016'),
            code: 'date',
            config: {
                placeholder: this.lang('0016'),
                name: 'date',
                value: search.date1 ? [search.date1, search.date2] : [],
                dateInputPlaceholder: [this.lang('0077'), this.lang('0078')]
            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0019'),
            code: 'check',
            config: {
                placeholder: this.lang('0019'),
                refName: this.lang('0019'),
                name: 'check',
                queryGridUrl: '/nccloud/uapbd/sminfo/BalanceTypeGridRef.do',
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'uapbd.refer.sminfo.BalanceTypeGridRef',
                isMultiSelectedEnabled: false,
                value: {
                    refname: search.checkName,
                    refpk: search.check
                }
            }
        },
        {
            itemtype: 'input',
            label: this.lang('0020'),
            code: 'checkno',
            config: {
                maxlength: 20,
                placeholder: this.lang('0020'),
                name: 'checkno',
                value: search.checkno
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0027'),
            code: 'moneyAspect',
            config: {
                maxlength: 40,
                placeholder: this.lang('0027'),
                name: 'moneyAspect',
                value: search.moneyAspect === -1 ? undefined : search.moneyAspect,
                selectValue: search.moneyAspect === -1 ? undefined : this.lang(search.moneyAspect === 1 ? '0007' : '0006')
            },
            options: [
                {
                    display: this.lang('0006'),
                    value: 0
                },
                {
                    display: <div fieldid={this.lang('0007')+"_select"}>{this.lang('0007')}</div>,
                    value: 1
                },
            ]
        },
        {
            itemtype: 'rangenum',
            code: 'moneyArea',
            config: {
                maxlength: 20,
                name: 'moneyArea',
                values: [search.moneyArea1, search.moneyArea2]
            }
        },
        {
            itemtype: 'input',
            label: this.lang('0022'),
            code: 'oppunit',
            config: {
                maxlength: 20,
                placeholder: this.lang('0022'),
                name: 'oppunit',
                value: search.oppunit
            }
        },
        // {
        //     itemtype: 'input',
        //     label: this.lang('0074'),
        //     code: 'transerial',
        //     config: {
        //         maxlength: 20, 
        //         placeholder: this.lang('0074'),
        //         name: 'transerial', 
        //         value: search.transerial
        //     }
        // },
        {
            itemtype: 'refer',
            code: 'explanation',
            label: this.lang('0018'),
            config: {
                name: 'explanation',
                refName: this.lang('0018'),
                placeholder: this.lang('0018'),
                disabled: !search.pk_corp,
                queryGridUrl: '/nccloud/fipub/ref/SummaryRef.do',
                refType: 'grid',
                refCode: 'fipub.ref.pub.SummaryRef',
                isMultiSelectedEnabled: false,
                checkStrictly: false,
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                value: {
                    refpk: search.explanation,
                    refname: search.explanation,
                },
                queryCondition: {
                    pk_org: search.pk_corp
                }
            }
        },
        {
            itemtype: 'checkbox',
            label: this.lang('0025'),
            code: 'onlyWrongRec',
            config: {
                name: 'onlyWrongRec',
                checked: search.onlyWrongRec,
            }
        },
        {
            itemtype: 'checkbox',
            label: this.lang('0026'),
            code: 'flag',
            config: {
                name: 'flag',
                disabled: search.onlyWrongRec,
                checked: search.flag == 1 ? true : false
            }
        },
    ];
}

export function onSearchChange(name, val) {
    let { searchMap } = this.state;
    switch (name) {
        case 'pk_corp':
            if (searchMap.pk_corp !== val.refpk) {
                searchMap.contrastaccount = null;
                searchMap.contrastaccountName = null;
                searchMap.explanation = null;
            }
            searchMap.pk_corp = val.refpk;
            searchMap.pk_corpName = val.refname;
            searchMap.pk_group = JSON.stringify(val) !== '{}' ? (val.values.pk_group && val.values.pk_group.value) : null;
            break;
        case 'contrastaccount':
            searchMap.contrastaccount = val.refpk;
            searchMap.contrastaccountName = val.refname;
            break;
        case 'check':
            searchMap.check = val.refpk;
            searchMap.checkName = val.refname;
            break;
        case 'explanation':
            searchMap.explanation = val.refname;
            break;
        case 'date':
            searchMap.date1 = val[0];
            searchMap.date2 = val[1];
            break;
        case 'onlyWrongRec':
            searchMap.onlyWrongRec = val;
            val && (searchMap.flag = 1);
            break;
        case 'flag':
            searchMap.flag = val ? 1 : 0;
            break;
        case 'moneyArea':
            searchMap.moneyArea1 = val[0];
            searchMap.moneyArea2 = val[1];
            break;
        default:
            searchMap[name] = val;
    }
    this.setState({ searchMap });
}

export function headerConfig(headReceipt, search) {
    return [
        {
            label: this.lang('0001'),
            config: {
                name: 'pk_corpName',
            },
            value: search.pk_corpName
        },
        {
            label: this.lang('0002'),
            config: {
                name: 'contrastaccountname',
            },
            value: headReceipt.contrastaccountname
        },
        {
            label: this.lang('0028'),
            config: {
                name: 'bankAcountCode',
            },
            value: headReceipt.bankAcountCode
        },
        {
            label: this.lang('0029'),
            config: {
                name: 'currtypeName',
            },
            value: headReceipt.currtypeName
        },
        {
            label: this.lang('0030'),
            config: {
                name: 'nowB',
            },
            value: headReceipt.nowB ? Number(headReceipt.nowB).formatMoney() : ''
        },
        {
            label: this.lang('0032'),
            config: {
                name: 'contrastsource',
            },
            value: headReceipt.contrastsource == 1 ? this.lang('0033') : headReceipt.contrastsource == 2 ? this.lang('0034') : '',
        },
        {
            label: this.lang('0031'),
            config: {
                name: 'startdate',
            },
            value: headReceipt.startdate
        },
        {
            label: this.lang('0035'),
            config: {
                name: 'stopdate',
            },
            value: headReceipt.stopdate
        },
    ];
}
/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/