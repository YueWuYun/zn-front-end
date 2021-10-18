/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/
import moment from 'moment';
const format = "YYYY-MM-DD";

//列表状态
export function listOperation (start, end) {
    return [
        {content: this.lang('0014'), path: 'edit', show: !start && !end},
        {content: this.lang('0015'), msg: this.lang('0015') + this.lang('0049'), path: 'delete.do', show: !start && !end},
        {content: this.lang('0037'), msg: this.lang('0037') + this.lang('0049'), path: 'start.do', show: !start && !end},
        {content: this.lang('0038'), path: 'change', show: start && !end},
        {content: this.lang('0039'), msg: this.lang('0039') + this.lang('0049'), path: 'cancelstart.do', show: start && !end},
        {content: this.lang('0040'), msg: this.lang('0040') + this.lang('0049'), path: 'stop.do', show: start && !end},
    ];
    // return list.filter((item, index) => item.show);
}

export function list (search) {
    let list= [
        {
            itemtype: 'refer',
            label: this.lang('0001'),
            code: 'pk_orgs',
            required: true,
            show: true,
            config: {
                placeholder: this.lang('0001'), 
                refName: this.lang('0001'), 
                name: 'pk_orgs',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: true,
                isTreelazyLoad:false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                treeConfig: {name: [  this.lang('0003'),this.lang('0004') ],code: [ 'refcode','refname']},
                rootNode: { refname: this.lang('0001'), refpk: 'root' },
                queryCondition: {
                    isDataPowerEnable: 'Y',
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroupBuilder'
                },
                value: search.pk_orgs,
            }
        },
        {
            itemtype: 'refer',
            label: this.lang('0002'),
            code: 'pk_contrastaccounts',
            required: true,
            show: true,
            config: {
                placeholder: this.lang('0002'),
                refName: this.lang('0002'),
                name: 'pk_contrastaccounts',
                queryGridUrl: '/nccloud/cmp/refer/CMPContrastAccGridRef.do',
                 columnConfig: [{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'cmp.refer.bankcontrast.CMPContrastAccGridRef',
                isMultiSelectedEnabled: true,
                value: search.pk_contrastaccounts,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                disabled: !search.pk_orgs || !search.pk_orgs.length,
                queryCondition: {pkOrgArr: search.pk_orgs && search.pk_orgs.map(item => item.refpk).join(',')}, 
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0024'),
            code: 'datetype',
            show: search.type=== 'reach',
            config: {
                maxlength: 40,
                placeholder: this.lang('0024'),
                name: 'datetype',
                value: search.datetype,
                selectValue: this.lang(search.datetype=== 'business' ? '0025' : '0026')
            },
            options: [
                {
                    display: this.lang('0025'),
                    value: 'business'
                },
                {
                    display: this.lang('0026'),
                    value: 'receipt'
                },
            ]
        },
        {
            itemtype: 'rangepicker',
            label: this.lang('0016'),
            code: 'appBegDate',
            show: search.type=== 'reach',
            config: {
                placeholder: this.lang('0016'), 
                name: 'appBegDate',
                value: search.appBegDate ? [search.appBegDate, search.appEndDate] : []
            }
        },
        {
            itemtype: 'num',
            label: this.lang('0027'),
            code: 'subdays',
            required: true,
            show: search.type=== 'reach',
            config: {
                maxlength: 20,
                placeholder: this.lang('0027'),
                name: 'subdays',
                scale: 0,
                value: search.subdays
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0028'),
            code: 'errortype',
            show: search.type=== 'reach',
            config: {
                placeholder: this.lang('0028'),
                name: 'errortype',
                value: search.errortype=== 'fkerror,skerror' ? undefined : search.errortype,
                selectValue: this.lang(search.errortype=== 'fkerror' ? '0007' : '0006')
            },
            options: [
                {
                    display: this.lang('0007'),
                    value: 'fkerror'
                },
                {
                    display: this.lang('0006'),
                    value: 'skerror'
                },
            ]
        },
        {
            itemtype: 'datepicker',
            label: this.lang('0045'),
            code: 'enddate',
            required: true,
            show: search.type!== 'reach',
            config: {
                placeholder: this.lang('0045'), 
                name: 'enddate',
                value: search.enddate
            }
        },
        {
            itemtype: 'num',
            label: this.lang('0017'),
            code: 'unmtdays',
            required: true,
            show: search.type!== 'reach',
            config: {
                maxlength: 20,
                placeholder: this.lang('0017'), 
                name: 'unmtdays',
                scale: 0,
                value: search.unmtdays
            }
        },
        {
            itemtype: 'select',
            label: this.lang('0018'),
            code: 'unmttype',
            show: search.type!== 'reach',
            config: {
                name: 'unmttype',
                placeholder: this.lang('0018'),
                value: search.unmttype=== 'unitunmt,bankunmt' ? undefined : search.unmttype,
                selectValue: this.lang(search.unmttype=== 'unitunmt' ? '0019' : '0020')
            },
            options: [
                {
                    display: this.lang('0019'),
                    value: 'unitunmt'
                },
                {
                    display: this.lang('0020'),
                    value: 'bankunmt'
                },
            ]
        },
        // {
        //     itemtype: 'num',
        //     label: this.lang('0046'),
        //     code: 'moneyBegin',
        //     show: true,
        //     config: {
        //         maxlength: 20,
        //         placeholder: this.lang('0046'), 
        //         name: 'moneyBegin',
        //         value: search.moneyBegin
        //     }
        // },
        // {
        //     itemtype: 'num',
        //     label: this.lang('0047'),
        //     code: 'moneyEnd',
        //     show: true,
        //     config: {
        //         maxlength: 20,
        //         placeholder: this.lang('0047'), 
        //         name: 'moneyEnd',
        //         value: search.moneyEnd
        //     }
        // },
        {
            itemtype: 'rangenum',
            label: this.lang('0037'),
            code: 'money',
            show: search.type,
            config: {
                maxlength: 20,
                name: 'money',
                values: [search.moneyBegin, search.moneyEnd]
            }
        },
    ];
    return list.filter((item, index) => item.show);
}

export const searchData1= {
    type: 'reach',
    appBegDate: moment().format('YYYY-MM-01'),
    appEndDate: moment().format(format),
    errortype: 'fkerror,skerror',
    datetype: 'business'
}; 

export const searchData2= {
    type: 'unreach',
    unmttype: 'unitunmt,bankunmt',
    enddate: moment().format(format)
}; 
/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/