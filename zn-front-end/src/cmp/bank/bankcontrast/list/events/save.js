/*MX3RhixOptuJjuf+A87Tzk+VtrDP2y7dSO5GLRBofrY=*/
import { toast } from 'nc-lightapp-front';
import { getProps } from './main';

export function saveOperation () {//保存按钮，较复杂，额外拿出来操作
    let { compareFlag, adjustFlag, searchMap, isContrast, contrastaspect }= this.state;
    let bank= (this.props.ViewModel.getData('bankSelect') || []).slice(1);
    let corp= (this.props.ViewModel.getData('corpSelect') || []).slice(1);
    let bankShow= getProps.call(this, 'bankShow');
    let corpShow= getProps.call(this, 'corpShow');
    let bank_m= contrastaspect=== '0' ? bankShow.m : bankShow.c;
    let bank_c= contrastaspect=== '0' ? bankShow.c : bankShow.m;
    let bank_mc= contrastaspect=== '0' ? bankShow.mc : (-1 * bankShow.mc);
    if (!(((adjustFlag=== '0') && (bank_m=== corpShow.m) && (bank_c=== corpShow.c)) || ((adjustFlag=== '1') && (bank_mc=== corpShow.mc)))) {
        toast({color: 'warning', content: this.lang('0087')});
        return;
    }
    if (!isContrast) {
        bank= this.state.bankSelect;
        corp= this.state.corpSelect;
    }
    let bankSelect= [], corpSelect= [];
    for (let item1 of bank) {
        bankSelect= bankSelect.concat(item1);
    }
    for (let item2 of corp) {
        corpSelect= corpSelect.concat(item2);
    }
    
    if (!corpSelect.length) {
        toast({color: 'warning', content: this.lang('0080')});
        return;
    }
    if (!bankSelect.length && corpSelect.length< 2) {
        toast({color: 'warning', content: this.lang('0081')});
        return;
    }
    
    let data= {
        compareFlag: isContrast ? '0' : compareFlag,
        adjustFlag,
        glContrastVo: {
            m_pk_contrastaccount: searchMap.m_Pk_Account
        },
        banks: [],
        units: []
    };
    for (let item of corpSelect) {
        data.units.push({
            isContrast: true,
            isContrastOld: item.m_caved,
            fk_detail: item.m_vo.m_Pk_detail || item.m_vo.m_pk_corpreceipt,
            pk_contrastaccount: item.m_vo.m_pk_contrastaccount,
            checkdate: item.m_vo.m_prepareddate,
            creditamount: item.m_vo.m_creditamount,
            debitamount: item.m_vo.m_debitamount,
            batchnumber: item.m_vo.batchnumber,
        });
    }
    for (let item of bankSelect) {
        data.banks.push({
            isContrast: true,
            isContrastOld: item.m_caved,
            styleflag: item.styleflag,
            pk_bankreceipt: item.m_vo.m_pk_bankreceipt,
            checkdate: item.m_vo.m_checkdate,
            creditamount: item.m_vo.m_creditamount,
            debitamount: item.m_vo.m_debitamount,
            pk_contrastaccount: item.m_vo.m_pk_contrastaccount,
            batchnumber: item.m_vo.batchnumber,
        });
    }
    
    this.btnRequire('save.do', data, this.lang(adjustFlag=== '0' ? '0017' : '0018') + this.lang('0082'));
}
/*MX3RhixOptuJjuf+A87Tzk+VtrDP2y7dSO5GLRBofrY=*/