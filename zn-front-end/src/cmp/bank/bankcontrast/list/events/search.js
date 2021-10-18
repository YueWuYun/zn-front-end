/*w/8iNiAH+zj8WJF4+Br6+leOGHjEGCrL/IyREo6F7Dkhehaw9IcJqKTKixkuPCh5*/
import {
    toast
} from 'nc-lightapp-front';
import {
    cancelContrastData
} from './cancel';
import {
    clearProps
} from './main';
import {
    deepClone
} from '../../../commom';

export function list(search) {
    return [{
            itemtype: 'refer',
            label: this.lang('0019'),
            code: 'm_Pk_Corp',
            required: true,
            config: {
                placeholder: this.lang('0019'),
                refName: this.lang('0019'),
                name: 'm_Pk_Corp',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: false,
                isTreelazyLoad: false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true,
                treeConfig: {
                    name: [this.lang('0003'), this.lang('0004')],
                    code: ['refcode', 'refname']
                },
                rootNode: {
                    refname: this.lang('0001'),
                    refpk: 'root'
                },
                queryCondition: {
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
            label: this.lang('0020'),
            code: 'm_Pk_Account',
            required: true,
            config: {
                placeholder: this.lang('0020'),
                refName: this.lang('0020'),
                name: 'm_Pk_Account',
                queryGridUrl: '/nccloud/cmp/refer/CMPContrastAccSpecialGridRef.do',
                // columnConfig: [{name: [ this.lang('0021'), this.lang('0022') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'cmp.refer.bankcontrast.CMPContrastAccSpecialGridRef',
                isMultiSelectedEnabled: false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true,
                columnConfig: [{
                    name: [this.lang('0003'), this.lang('0004')],
                    code: ['refcode', 'refname']
                }],
                value: {
                    refname: search.m_Pk_AccountName,
                    refpk: search.m_Pk_Account
                },
                disabled: !search.m_Pk_Corp,
                queryCondition: {
                    pkOrgArr: search.m_Pk_Corp
                },
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0023'),
            code: 'm_strDate',
            config: {
                placeholder: this.lang('0023'),
                name: 'm_strDate',
                value: search.m_strDate ? [search.m_strDate, search.m_strEndDate] : [],
                dateInputPlaceholder: [this.lang('0109'), this.lang('0110')]
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0024'),
            code: 'bankBegDate',
            config: {
                placeholder: this.lang('0024'),
                name: 'bankBegDate',
                value: search.bankBegDate ? [search.bankBegDate, search.bankEndDate] : [],
                dateInputPlaceholder: [this.lang('0109'), this.lang('0110')]
            }
        },
        {
            itemtype: 'input',
            label: this.lang('0029'),
            code: 'm_strCheckNO',
            config: {
                maxlength: 20,
                placeholder: this.lang('0029'),
                name: 'm_strCheckNO',
                value: search.m_strCheckNO
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0025'),
            code: 'isEqualCheckStyle',
            config: {
                placeholder: this.lang('0025'),
                name: 'isEqualCheckStyle',
                value: search.isEqualCheckStyle,
                selectValue: this.lang(search.isEqualCheckStyle === 'Y' ? '0026' : '0027')
            },
            options: [{
                    display: this.lang('0026'),
                    value: 'Y'
                },
                {
                    display: this.lang('0027'),
                    value: 'N'
                },
            ]
        },
        {
            itemtype: 'refer',
            label: this.lang('0028'),
            code: 'm_strCheckStyle',
            config: {
                placeholder: this.lang('0028'),
                refName: this.lang('0028'),
                name: 'm_strCheckStyle',
                queryGridUrl: '/nccloud/uapbd/sminfo/BalanceTypeGridRef.do',
                columnConfig: [{
                    name: [this.lang('0021'), this.lang('0022')],
                    code: ['refcode', 'refname']
                }],
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
            label: this.lang('0075'),
            code: 'moneyArea',
            config: {
                maxlength: 20,
                name: 'moneyArea',
                values: [search.moneyArea1, search.moneyArea2]
            }
        },
        {
            itemtype: 'refer',
            label: search.contrastsource === '1' ? this.lang('0034') : this.lang('0035'),
            code: 'n_voucherType',
            config: {
                placeholder: search.contrastsource === '1' ? this.lang('0034') : this.lang('0035'),
                refName: search.contrastsource === '1' ? this.lang('0034') : this.lang('0035'),
                name: 'n_voucherType',
                queryGridUrl: search.contrastsource === '1' ? '/nccloud/uapbd/ref/VoucherTypeDefaultGridRef.do' : '/nccloud/riart/ref/allBillRef.do',
                columnConfig: [{
                    name: [this.lang('0021'), this.lang('0022')],
                    code: ['refcode', 'refname']
                }],
                refType: 'grid',
                refCode: search.contrastsource === '1' ? 'uapbd.refer.fiacc.VoucherTypeDefaultGridRef' : 'uap.refer.riart.billtype',
                isMultiSelectedEnabled: false,
                value: {
                    refname: search.n_voucherTypeName,
                    refpk: search.n_voucherType
                },
                disabled: !search.m_Pk_Account,
            }
        },
        {
            itemtype: 'input',
            label: this.lang('0039'),
            code: 'batchNumber',
            config: {
                maxlength: 20,
                placeholder: this.lang('0039'),
                name: 'batchNumber',
                value: search.batchNumber
            }
        },
        {
            itemtype: 'input',
            label: search.contrastsource === '1' ? this.lang('0076') : this.lang('0077'),
            code: 'n_voucherCode1',
            config: {
                maxlength: 20,
                placeholder: search.contrastsource === '1' ? this.lang('0076') : this.lang('0077'),
                name: 'n_voucherCode1',
                value: search.n_voucherCode1
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0031'),
            code: 'moneyAspect',
            config: {
                placeholder: this.lang('0031'),
                name: 'moneyAspect',
                value: search.moneyAspect === '-1' ? undefined : search.moneyAspect,
                selectValue: this.lang(search.moneyAspect === '1' ? '0033' : '0032')
            },
            options: [{
                    display: this.lang('0032'),
                    value: '0'
                },
                {
                    display: this.lang('0033'),
                    value: '1'
                },
            ]
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0030'),
            code: 'n_pjdate',
            config: {
                placeholder: this.lang('0030'),
                name: 'n_pjdate',
                value: search.n_pjdate1 ? [search.n_pjdate1, search.n_pjdate2] : [],
                dateInputPlaceholder: [this.lang('0109'), this.lang('0110')]
            }
        },
        {
            itemtype: 'checkbox',
            label: this.lang('0036'),
            code: 'onlyWrongRec',
            config: {
                name: 'onlyWrongRec',
                checked: search.onlyWrongRec === 'Y' ? true : false
            }
        },
        {
            itemtype: 'checkbox',
            label: this.lang('0037'),
            code: 'm_blnChecked',
            config: {
                name: 'm_blnChecked',
                checked: search.m_blnChecked,
                disabled: search.onlyWrongRec === 'Y'
            }
        },
    ];
}

export const searchData = {
    moneyAspect: '-1',
    onlyWrongRec: 'N',
    m_blnChecked: false,
    isEqualCheckStyle: 'Y',
};

export function onSearchChange(name, val) {
    let {
        searchMap,
        contrastaspect
    } = this.state;
    switch (name) {
        case 'm_Pk_Corp':
            if (searchMap.m_Pk_Corp !== val.refpk) {
                searchMap.m_Pk_Account = null;
                searchMap.m_Pk_AccountName = null;
                searchMap.contrastsource = null;
                cancelContrastData.glContrastVo.m_pk_corp = val.refpk;
                cancelContrastData.glContrastVo.m_pk_contrastaccount = null;
                cancelContrastData.contrastVo.m_pk_contrastaccount = null;
            }
            searchMap.m_Pk_Corp = val.refpk;
            searchMap.m_Pk_CorpName = val.refname;
            break;
        case 'm_Pk_Account':
            if (searchMap.m_Pk_Account !== val.refpk) {
                searchMap.n_voucherType = null;
                searchMap.n_voucherTypeName = null;
            }
            searchMap.m_Pk_Account = val.refpk;
            searchMap.m_Pk_AccountName = val.refname;
            searchMap.contrastsource = val.values && val.values.contrastsource.value;
            cancelContrastData.glContrastVo.m_pk_contrastaccount = val.refpk;
            cancelContrastData.contrastVo.m_pk_contrastaccount = val.refpk;
            contrastaspect = val.values && val.values.contrastaspect.value;
            break;
        case 'm_strCheckStyle':
            searchMap.m_strCheckStyle = val.refpk;
            searchMap.m_strCheckStyleName = val.refname;
            break;
        case 'n_voucherType':
            searchMap.n_voucherType = val.refpk;
            searchMap.n_voucherTypeName = val.refname;
            break;
        case 'm_strDate':
            searchMap.m_strDate = val[0];
            searchMap.m_strEndDate = val[1];
            break;
        case 'bankBegDate':
            searchMap.bankBegDate = val[0];
            searchMap.bankEndDate = val[1];
            break;
        case 'n_pjdate':
            searchMap.n_pjdate1 = val[0];
            searchMap.n_pjdate2 = val[1];
            break;
        case 'onlyWrongRec':
            searchMap.onlyWrongRec = val ? 'Y' : 'N';
            val && (searchMap.m_blnChecked = true);
            break;
        case 'moneyArea':
            searchMap.moneyArea1 = val[0];
            searchMap.moneyArea2 = val[1];
            break;
        default:
            searchMap[name] = val;
    }
    this.setState({
        searchMap,
        contrastaspect
    });
}

export function toSearch() {
    let {
        searchMap
    } = this.state;
    if (!searchMap.m_Pk_Corp || !searchMap.m_Pk_Account) {
        toast({
            color: 'warning',
            content: this.lang('0083'),
            duration: 30
        });
        return;
    }
    let obj = {
        m: 0,
        c: 0,
        mc: 0
    };
    this.setState({
        isShow: true,
        isManual: true,
        isContrast: true,
        corpIndex: -1,
        bankIndex: -1,
        pages: deepClone(pageInfo),
        isBlnChecked: deepClone(searchMap.m_blnChecked),
        bankSelect: [],
        bankBool: [],
        corpSelect: [],
        corpBool: [],
        record: {}
    }, () => {
        clearProps.call(this, ['bankData', 'bankSelect', 'bankBool', 'corpData', 'corpSelect', 'corpBool']);
        this.props.ViewModel.setData('bankShow', deepClone(obj));
        this.props.ViewModel.setData('corpShow', deepClone(obj));
        this.getList();
    });
}

export function clearSearch() {
    this.setState({
        isShow: false,
        corpIndex: -1,
        bankIndex: -1,
        searchMap: {},
        isBlnChecked: false
    });
}

export const pageInfo = {
    bankPageNum: 1,
    bankPageSize: 3000,
    corpPageNum: 1,
    corpPageSize: 3000
};
/*w/8iNiAH+zj8WJF4+Br6+leOGHjEGCrL/IyREo6F7Dkhehaw9IcJqKTKixkuPCh5*/