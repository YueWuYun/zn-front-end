/*D58bcanNatGpQfXcJupE9ya6cSi6PenqFcXPQn64fh7qk+D0oDn2JRpmsiS8BJlv*/
import { base, toast } from 'nc-lightapp-front';
import { deepClone, HeaderList, Num } from '../../../commom';
import moment from 'moment';
const { NCCheckbox, NCRadio, NCSwitch, NCDiv} = base;
const format= 'YYYY-MM-DD';
const formatTime= 'YYYY-MM-DD 23:59:59';

export const contrastSearchData= {
    gap: true,
    m_date: true,// boolean ture为制单日期，false为票据日期
    m_iDateSpan: 12,
    m_blnSameCheckNo: true,// true为票据号相同
    m_blnSameCheckStyle: true// boolean结算方式相同
};

export const quickSearchData= {
    moneyAspect: '-1',
    m_strDate: moment().format(format), 
    m_strEndDate: moment().format(formatTime),
    bankBegDate: moment().format(format), 
    bankEndDate: moment().format(formatTime)
};

export function quickList (search) {
    return [
        {
            type: 'refer',
            label: this.lang('0019'),
            code: 'pk_corp',
            required: true,
            config: {
                placeholder: this.lang('0019'),
                refName: this.lang('0019'),
                name: 'pk_corp',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: true,
                isTreelazyLoad:false,
                treeConfig: {name: [ '名称' ],code: [ 'refcode','refname']},
                rootNode: { refname: '财务组织', refpk: 'root' },
                queryCondition: {
                    isShowDisabledData:'N', 
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroupBuilder' 
                },
                value: search.pk_corp
            }
        },
        {
            type: 'refer',
            label: this.lang('0020'),
            code: 'm_Pk_Account',
            required: true,
            config: {
                placeholder: this.lang('0020'),
                refName: this.lang('0020'),
                name: 'm_Pk_Account',
                queryGridUrl: '/nccloud/cmp/refer/CMPContrastAccSpecialGridRef.do',
                columnConfig: [{name: [ this.lang('0021'), this.lang('0022') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: 'cmp.refer.bankcontrast.CMPContrastAccSpecialGridRef',
                isMultiSelectedEnabled: true,
                value: search.m_Pk_Account,
                disabled: !search.pk_corp || (search.pk_corp && !search.pk_corp.length),
                queryCondition: {pkOrgArr: search.pk_corp && search.pk_corp.map(item => item.refpk).join(',')},
            }
        },
        {
            type: 'rangepicker',
            label: this.lang('0023'),
            required: true,
            code: 'm_strDate',
            config: {
                placeholder: this.lang('0023'),
                name: 'm_strDate',
                value: search.m_strDate ? [search.m_strDate, search.m_strEndDate] : []
            }
        },
        {
            type: 'rangepicker',
            label: this.lang('0024'),
            required: true,
            code: 'bankBegDate',
            config: {
                placeholder: this.lang('0024'),
                name: 'bankBegDate',
                value: search.bankBegDate ? [search.bankBegDate, search.bankEndDate] : []
            }
        },
        {
            type: 'refer',
            label: this.lang('0028'),
            code: 'm_strCheckStyle',
            config: {
                placeholder: this.lang('0028'), 
                refName: this.lang('0028'),
                name: 'm_strCheckStyle',
                queryGridUrl: '/nccloud/uapbd/sminfo/BalanceTypeGridRef.do',
                columnConfig: [{name: [ this.lang('0021'), this.lang('0022') ],code: [ 'refcode', 'refname' ]}],
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
            type: 'input',
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
            type: 'rangenum',
            label: this.lang('0075'),
            code: 'moneyArea',
            config: {
                maxlength: 20,
                name: 'moneyArea',
                values: [search.moneyArea1, search.moneyArea2]
            }
        },
        {
            type: 'select',
            label: this.lang('0031'),
            code: 'moneyAspect',
            config: {
                placeholder: this.lang('0031'),
                name: 'moneyAspect',
                value: search.moneyAspect=== '-1' ? undefined : search.moneyAspect,
                selectValue: this.lang(search.moneyAspect=== '1' ? '0033' : '0032')
            },
            options: [
                {
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
            type: 'refer',
            label: search.vType=== 1 ? this.lang('0034') : this.lang('0035'),
            code: 'n_voucherType',
            config: {
                placeholder: search.vType=== 1 ? this.lang('0034') : this.lang('0035'),
                refName: search.vType=== 1 ? this.lang('0034') : this.lang('0035'),
                name: 'n_voucherType',
                queryGridUrl: search.vType=== 1 ? '/nccloud/uapbd/ref/VoucherTypeDefaultGridRef.do' : '/nccloud/riart/ref/allBillRef.do',
                columnConfig: [{name: [ this.lang('0021'), this.lang('0022') ],code: [ 'refcode', 'refname' ]}],
                refType: 'grid',
                refCode: search.vType=== 1 ? 'uapbd.refer.fiacc.VoucherTypeDefaultGridRef' : 'uap.refer.riart.billtype',
                isMultiSelectedEnabled: false,
                value: {
                    refname: search.n_voucherTypeName, 
                    refpk: search.n_voucherType
                },
                disabled: search.vType=== 3
            }
        },
        {
            type: 'input',
            label: this.lang('0038'),
            code: 'n_voucherCode1',
            config: {
                maxlength: 20,
                placeholder: this.lang('0038'), 
                name: 'n_voucherCode1',
                value: search.n_voucherCode1
            }
        },
    ];
}

export function onChange(val, name) {
    let { quickSearch, contrastSearch }= this.state;
    switch (name) {
        case 'pk_corp':
            if (JSON.stringify(quickSearch.pk_corp)!== JSON.stringify(val)) {
                quickSearch.m_Pk_Account= [];
            }
            quickSearch.pk_corp= val;
            break;
        case 'm_Pk_Account':
            if (JSON.stringify(quickSearch.m_Pk_Account)!== JSON.stringify(val)) {
                quickSearch.n_voucherType= null;
                quickSearch.n_voucherTypeName= null;
            }
            quickSearch.m_Pk_Account= val;
            let source= val.map(item => item.values.contrastsource.value);
            if (source.includes('1') && !source.includes('2')) {
                quickSearch.vType= 1;
            } else if (!source.includes('1') && source.includes('2')) {
                quickSearch.vType= 2;
            } else if ((source.includes('1') && source.includes('2')) || (!source.includes('1') && !source.includes('2'))) {
                quickSearch.vType= 3;
            }
            break;
        case 'm_strCheckStyle':
            quickSearch.m_strCheckStyle= val.refpk;
            quickSearch.m_strCheckStyleName= val.refname;
            break;
        case 'n_voucherType':
            quickSearch.n_voucherType= val.refpk;
            quickSearch.n_voucherTypeName= val.refname;
            break;
        case 'm_strDate':
            quickSearch.m_strDate= val[0];
            quickSearch.m_strEndDate= val[1];
            break;
        case 'bankBegDate':
            quickSearch.bankBegDate= val[0];
            quickSearch.bankEndDate= val[1];
            break;
        case 'moneyArea':
            quickSearch.moneyArea1= val[0];
            quickSearch.moneyArea2= val[1];
            break;

        case 'gap':
            contrastSearch.gap= val;
            if (!val) {
                contrastSearch.m_iDateSpan= null;
                contrastSearch.m_date= null;
            } else {
                contrastSearch.m_iDateSpan= 12;
            }
            break;
        case 'm_date':
            contrastSearch.m_date= val;
            break;
        case 'm_iDateSpan':
            contrastSearch.m_iDateSpan= val;
            break;
        case 'm_blnSameCheckNo':
            contrastSearch.m_blnSameCheckNo= val;
            !val && (contrastSearch.m_iAfterBit= null);
            break;
        case 'm_iAfterBit':
            contrastSearch.m_iAfterBit= val;
            break;
        case 'm_blnSameCheckStyle':
            contrastSearch.m_blnSameCheckStyle= val;
            break;
        default: 
            quickSearch[name]= val; 
    }
    this.setState({quickSearch, contrastSearch});
}

// 快速对账内容
export function quickContent() {
    let { quickSearch, contrastSearch }= this.state;
    return (
        <div>
            <NCDiv fieldid="quick" areaCode={NCDiv.config.FORM}>
            <HeaderList
                onChange={onChange.bind(this)}
                configList={quickList.call(this, quickSearch)}
                status="edit"
                showType="two-column"
                type="modal"
                lang={{
                    start: this.lang('0105'),
                    end: this.lang('0106'),
                }}
            />
            <ul className="quick-content quick">
                <li>
                    <div style={{display: 'flex'}}>
                        <div fieldid="datedifference" style={{display: 'flex'}}>
                            <span className="width130">{this.lang('0062')}</span>
                            <NCSwitch
                                checked={contrastSearch.gap}
                                onChange={e => onChange.call(this, e, 'gap')}
                            />
                        </div>
                        <div fieldid="datedifference_days" style={{display: 'flex'}}>
                            <span className="width130">{this.lang('0090')}</span>
                            <Num
                                value={contrastSearch.m_iDateSpan || ''}
                                disabled={!contrastSearch.gap}
                                scale={0}
                                onChange={e => onChange.call(this, e, 'm_iDateSpan')}
                            />
                        </div>
                    </div>
                    <NCRadio.NCRadioGroup 
                            selectedValue={contrastSearch.m_date}
                            name="gap"
                            onChange={e => onChange.call(this, e, 'm_date')}
                        >
                        <div className="width130">
                        <NCRadio style={{'margin-left':'34px'}} disabled={!contrastSearch.gap} value={true} >{this.lang('0048')}</NCRadio>
                        </div>
                        <div className="width130">
                        <NCRadio style={{'margin-left':'54px'}} disabled={!contrastSearch.gap} value={false}>{this.lang('0030')}</NCRadio>
                        </div>
                    </NCRadio.NCRadioGroup>
                </li>
                <li>
                    <div style={{display: 'flex'}}>
                        <div fieldid="m_blnSameCheckNo_checkbox">
                            <span className="width130">{this.lang('0063')}</span>
                            <NCCheckbox
                                checked={contrastSearch.m_blnSameCheckNo}
                                onChange={e => onChange.call(this, e, 'm_blnSameCheckNo')}
                            />
                        </div>
                        <div fieldid="m_iAfterBit">
                            <span className="width130">{this.lang('0007')}</span>
                            <Num
                                value={contrastSearch.m_iAfterBit || ''}
                                disabled={!contrastSearch.m_blnSameCheckNo}
                                scale={0}
                                className="width90"
                                onChange={e => onChange.call(this, e, 'm_iAfterBit')}
                            /><span className="width30">{this.lang('0065')}</span>
                        </div>
                    </div>
                </li>
                <li>
                <div fieldid="m_blnSameCheckStyle_checkbox">
                    <span className="width130">{this.lang('0066')}</span>
                    <NCCheckbox
                        checked={contrastSearch.m_blnSameCheckStyle}
						onChange={e => onChange.call(this, e, 'm_blnSameCheckStyle')}
					/>
                    </div>
                </li>
            </ul>
            </NCDiv>
        </div>
    );
}

export function quickClick() {
    let { quickSearch, contrastSearch }= this.state;
    let queryVO= deepClone(quickSearch);
    if (!queryVO.pk_corp || !queryVO.pk_corp.length || !queryVO.m_Pk_Account || !queryVO.m_Pk_Account.length || !queryVO.m_strDate || !queryVO.bankBegDate) {
        toast({color: 'warning', content: this.lang('0083')});
        return;
    }
    queryVO.pk_corp= queryVO.pk_corp.map(item => item.refpk);
    queryVO.m_Pk_Account= queryVO.m_Pk_Account.map(item => item.refpk);
    this.btnRequire('autocontrastbg.do', {qconvo: contrastSearch, queryVO}, this.lang('0012') + this.lang('0082'))
}
/*D58bcanNatGpQfXcJupE9ya6cSi6PenqFcXPQn64fh7qk+D0oDn2JRpmsiS8BJlv*/