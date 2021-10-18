/*VCOhuYOHHPl0lXCSW08qM0J5QKQx0oX6VH/ZlupS304=*/
import { base } from 'nc-lightapp-front';
import { Num } from '../../../commom';
const { NCCheckbox, NCRadio, NCSwitch,NCDiv } = base;

export const autoSearchData= {
    m_date: true, 				// boolean true 制单日期 false 票据日期
    m_blnSameCheckStyle: true, 	// boolean 结算方式相同
    m_blnSameVoucherNo: false, 	// boolean 凭证号相同
    m_bSameNumber: true, 		//boolean标识码相同
    m_bSameTranserial: false, 	//boolean银行交易流水号相同
    m_blnSameCheckNo: true, 	//boolean票据号相同
    m_bOppUnitName: false, 		//boolean 对方单位相同
    m_iDateSpan: 12,			//日期相差多少天
    gap: true,                  //日期相差
};

export function onChange(val, name) {
    let { autoSearch }= this.state;
    switch (name) {
        case 'gap':
            autoSearch.gap= val;
            if (!val) {
                autoSearch.m_iDateSpan= null;
                autoSearch.m_date= null;
            } else {
                autoSearch.m_iDateSpan= 12;
            }
            break;
        case 'm_blnSameCheckNo':
            autoSearch.m_blnSameCheckNo= val;
            !val && (autoSearch.m_iAfterBit= null);
            break;
        default: 
            autoSearch[name]= val; 
    }
    this.setState({autoSearch});
}

// 快速对账内容
export function autoContent() {
    let { autoSearch }= this.state;
    return (
        <NCDiv fieldid="auto" areaCode={NCDiv.config.FORM}>
        <ul className="quick-content auto"> 
            <li>
            <div style={{display: 'flex'}}>
                <div fieldid="datedifference"style={{display: 'flex'}}>
                <span className="width130" >{this.lang('0062')}</span>
                <NCSwitch
                    checked={autoSearch.gap}
                    onChange={e => onChange.call(this, e, 'gap')}
                />
                </div>
                <div fieldid="datedifferencedays"style={{display: 'flex'}}>
                <span className="marginL147 marginR16" style={{'margin-left':'85px'}}>{this.lang('0090')}</span>
                <Num
                    value={autoSearch.m_iDateSpan || ''}
                    scale={0}
                    disabled={!autoSearch.gap}
                    onChange={e => onChange.call(this, e, 'm_iDateSpan')}
                />
                </div>
            </div>
                <NCRadio.NCRadioGroup
                    selectedValue={autoSearch.m_date}
                    name="gap"
                    onChange={e => onChange.call(this, e, 'm_date')}
                >
                    <div className="width130">
                    <NCRadio style={{'margin-left':'34px'}} disabled={!autoSearch.gap} value={true}>{this.lang('0048')}</NCRadio>
                    </div>
                    <div className="width130">
                    <NCRadio style={{'margin-left':'79px'}} disabled={!autoSearch.gap} value={false}>{this.lang('0030')}</NCRadio>
                    </div>
                </NCRadio.NCRadioGroup>
            </li>
            <li>
            <div style={{display: 'flex'}}> 
                <div fieldid="m_blnSameCheckNo_checkbox">
                <span className="width130">{this.lang('0063')}</span>
                <NCCheckbox
                    checked={autoSearch.m_blnSameCheckNo}
                    onChange={e => onChange.call(this, e, 'm_blnSameCheckNo')}
                />
                </div>
                <div fieldid="m_iAfterBit">
                <span className="marginL147 marginR16" style={{'margin-left':'100px'}}>{this.lang('0064')}</span>
                <Num
                    value={autoSearch.m_iAfterBit || ''}
                    disabled={!autoSearch.m_blnSameCheckNo}
                    scale={0}
                    className="width90"
                    onChange={e => onChange.call(this, e, 'm_iAfterBit')}
                /><span className="width30" style={{width:'70px'}}>{this.lang('0065')+this.lang('0007')}</span>
                </div>
            </div>
            </li>
            <li>
                <div style={{display: 'flex'}}>
                <div fieldid="m_blnSameCheckStyle_checkbox">
                <span className="width130">{this.lang('0066')}</span>
                <NCCheckbox
                    checked={autoSearch.m_blnSameCheckStyle}
                    onChange={e => onChange.call(this, e, 'm_blnSameCheckStyle')}
                />
                </div>
                <div fieldid="m_blnSameVoucherNo_checkbox">
                <span className="marginL147 marginR16" style={{'margin-left':'100px'}}>{this.lang('0067')}({this.lang('0068')})</span>
                <NCCheckbox
                    checked={autoSearch.m_blnSameVoucherNo}
                    onChange={e => onChange.call(this, e, 'm_blnSameVoucherNo')}
                />
                </div>
                </div>
            </li>
            <li>
            <div style={{display: 'flex'}}>
            <div fieldid="m_bSameNumber_checkbox">
                <span className="width130">{this.lang('0069')}</span>
                <NCCheckbox
                    checked={autoSearch.m_bSameNumber}
                    onChange={e => onChange.call(this, e, 'm_bSameNumber')}
                />
                </div>
            <div fieldid="m_bOppUnitName_checkbox">
                <span className="marginL147 marginR16" style={{'margin-left':'100px'}}>{this.lang('0070')}</span>
                <NCCheckbox
                    checked={autoSearch.m_bOppUnitName}
                    onChange={e => onChange.call(this, e, 'm_bOppUnitName')}
                />
                </div>
                </div>
            </li>
            <li>
            <div fieldid="m_bSameTranserial_checkbox">
                <span className="width130">{this.lang('0107')}</span>
                <NCCheckbox
                    checked={autoSearch.m_bSameTranserial}
                    onChange={e => onChange.call(this, e, 'm_bSameTranserial')}
                />
                </div>
            </li>
        </ul>
        </NCDiv>
    );
}

export function autoClick() {
    let { autoSearch, searchMap }= this.state;
    this.btnRequire('autocontrast.do', {glContrastVo: {m_pk_contrastaccount: searchMap.m_Pk_Account}, qconvo: autoSearch, queryVO: {...searchMap, m_Pk_Account: [searchMap.m_Pk_Account]}}, this.lang.call(this, '0007')+ this.lang.call(this, '0092'))
}
/*VCOhuYOHHPl0lXCSW08qM0J5QKQx0oX6VH/ZlupS304=*/