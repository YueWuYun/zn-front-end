/*q+Tp88nQNo7z782f3GAtCFKK0PzcIzOrnTcHXcNKtcyyje4ALrUe3sIGwvrMIl8T*/
import moment from 'moment';
import { showMoney } from '../../../commom';

//列表状态
export function listOperation (start, end) {
    let list= [
        {content: this.lang('0021'), path: 'edit', show: !start && !end},
        {content: this.lang('0043'), msg: this.lang('0043') + this.lang('0060'), path: 'delete.do', show: !start && !end},
        {content: this.lang('0044'), msg: this.lang('0044') + this.lang('0060'), path: 'start.do', show: !start && !end},
        {content: this.lang('0045'), msg: this.lang('0045') + this.lang('0060'), path: 'change', show: start && !end},
        {content: this.lang('0046'), msg: this.lang('0046') + this.lang('0060'), path: 'cancelstart.do', show: start && !end},
        {content: this.lang('0047'), msg: this.lang('0047') + this.lang('0060'), path: 'stop.do', show: start && !end},
    ];
    return list.filter((item, index) => item.show);
}

export function headerConfig (headReceipt) {
    return [
        {
            label: this.lang('0001'),
            value: headReceipt.orgName,
            config: {
                name: 'orgName',
            }
        },
        {
            label: this.lang('0048'),
            config: {
                name: 'm_contrastaccountname',
            },
            value: headReceipt.m_contrastaccountname
        },
        {
            label: this.lang('0049'),
            config: {
                name: 'accountLinks',
            },
            value: headReceipt.accountLinks && headReceipt.accountLinks[0] && headReceipt.accountLinks[0]['bankaccname']
        },
        {
            label: this.lang('0050'),
            config: {
                name: 'currnetname',
            },
            value: headReceipt.currnetname
        },
        {
            label: this.lang('0051'),
            config: {
                name: 'm_debitamount',
            },
            value: showMoney(0==parseInt(headReceipt.m_debitamount) ? headReceipt.m_creditamount: headReceipt.m_debitamount)
        },
        {
            label: this.lang('0052'),
            config: {
                name: 'm_source',
            },
            value: headReceipt.m_source== 1 ? this.lang('0011') : this.lang('0012')
        },
        {
            label: this.lang('0013'),
            config: {
                name: 'm_startdate',
            },
            value: headReceipt.m_startdate
        },
        {
            label: this.lang('0015'),
            config: {
                name: 'm_stopdate',
            },
            value: headReceipt.m_stopdate
        },
    ];
}

export function list (search) {
    let nameArr= ['', this.lang('0024'), this.lang('0025')];
    let urlArr= ['', '/nccloud/uapbd/ref/VoucherTypeDefaultGridRef.do', '/nccloud/riart/ref/allBillRef.do'];
    let codeArr= ['', 'uapbd/refer/fiacc/VoucherTypeDefaultGridRef', 'uap/refer/riart/billtype'];

    return [
        {
            itemtype: 'refer',
            label: this.lang('0001'),
            code: 'pk_corp',
            required: true,
            config: {
                placeholder: this.lang('0001'),
                refName: this.lang('0001'),
                disabled: true,
                name: 'pk_corp',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: false,
                treeConfig: {name: [ '名称' ],code: [ 'refcode','refname']},
                rootNode: { refname: '财务组织', refpk: 'root' },
                value: {
                    refname: search.pk_corpName, 
                    refpk: search.pk_corp
                },
                queryCondition: {
                    isShowDisabledData:'N', 
                },
            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0048'),
            code: 'contrastaccount',
            required: true,
            config: {
                placeholder: this.lang('0048'),
                refName: this.lang('0048'),
                disabled: true,
                name: 'contrastaccount',
                queryGridUrl: '/nccloud/cmp/refer/CMPContrastAccGridRef.do',
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'cmp.refer.bankcontrast.CMPContrastAccGridRef',
                isMultiSelectedEnabled: false,
                value: {
                    refname: search.contrastaccountName, 
                    refpk: search.contrastaccount
                },
                queryCondition: {pkOrgArr: search.pk_corp},
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0053'),
            code: 'date',
            config: {
                placeholder: this.lang('0053'), 
                name: 'date',
                value: search.date1 ? [search.date1, search.date2] : [],
                dateInputPlaceholder: [this.lang('0078'), this.lang('0079')]

            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0028'), 
            code: 'check',
            config: {
                placeholder: this.lang('0028'), 
                refName: this.lang('0028'),
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
            label: this.lang('0029'),
            code: 'checkno',
            config: {
                placeholder: this.lang('0029'), 
                name: 'checkno',
                maxlength: 20,
                value: search.checkno
            }
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0031'), 
            code: 'pjdate',
            config: {
                placeholder: this.lang('0031'), 
                name: 'pjdate',
                value: search.pjdate1 ? [search.pjdate1, search.pjdate2] : [],
                dateInputPlaceholder: [this.lang('0078'), this.lang('0079')]
            }
        },
        {
            itemtype: 'rangenum',
            label: this.lang('0055'), 
            code: 'moneyArea',
            config: {
                maxlength: 20,
                name: 'moneyArea',
                values: [search.moneyArea1, search.moneyArea2]
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0056'),
            code: 'moneyAspect',
            config: {
                maxlength: 40,
                placeholder: this.lang('0056'),
                name: 'moneyAspect',
                value: search.moneyAspect
            },
            options: [
                {
                    display: this.lang('0006'),
                    value: 0
                },
                {
                    display:  this.lang('0007'),
                    value: 1
                },
            ]
        },
        {
            itemtype: 'refer',
            label: nameArr[search.isVoucher],
            code: 'voucherType',
            config: {
                placeholder: nameArr[search.isVoucher],
                refName: nameArr[search.isVoucher],
                name: 'voucherType',
                queryGridUrl: urlArr[search.isVoucher],
                columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: codeArr[search.isVoucher],
                isMultiSelectedEnabled: false,
                value: {
                    refname: search.voucherType, 
                    refpk: search.voucherType
                }
            }
        },
        {
            itemtype: 'input',
            label: `${this.lang('0027')}(${this.lang('0035')})`,
            code: 'voucherCode1',
            config: {
                maxlength: 20,
                placeholder: `${this.lang('0027')}(${this.lang('0035')})`,
                name: 'voucherCode1',
                value: search.voucherCode1
            }
        },
        {
            itemtype: 'checkbox',
            label: this.lang('0036'),
            code: 'flag',
            config: {
                name: 'flag',
                checked: search.flag=== '1' ? true : false
            }
        },
        {
            itemtype: 'checkbox',
            label: this.lang('0057'),
            code: 'onlyWrongRec',
            config: {
                name: 'onlyWrongRec',
                checked: search.onlyWrongRec=== 'Y' ? true : false,
                disabled: search.flag=== '1'
            }
        },
    ];
}
/*q+Tp88nQNo7z782f3GAtCFKK0PzcIzOrnTcHXcNKtcyyje4ALrUe3sIGwvrMIl8T*/