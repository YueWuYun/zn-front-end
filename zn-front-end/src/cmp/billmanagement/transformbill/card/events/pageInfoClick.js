/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { buttonVisible } from './buttonVisible';
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
export default function (props, pks) {
    
    // 后台还没更新，暂不可用
    let data = {
        pk: pks,
        pageCode: constant.cpagecode
    };
    let billstatus,isinner,balatypepk,settlesatus,billno,id
    let cardData = getCacheById(pks, this.cacheDataSource);
    if(cardData){
		// this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });
        // billstatus = cardData[this.formId].rows[0].values.busistatus.value;
		// isinner = cardData[this.formId].rows[0].values.isinner_pay.value;
		// balatypepk = cardData[this.formId].rows[0].values.pk_balatype.value;
		// settlesatus = cardData[this.formId].rows[0].values.settlesatus.value;
        // buttonVisible(this.props, billstatus, balatypepk, isinner, settlesatus);
        this.props.form.setAllFormValue({ [this.formId]:cardData[this.formId] });
        billno = cardData[this.formId].rows[0].values.vbillno.value;
        id = cardData[this.formId].rows[0].values.pk_transformbill.value;
        billstatus = cardData[this.formId].rows[0].values.busistatus.value;
		isinner = cardData[this.formId].rows[0].values.isinner_pay.value;
		balatypepk = cardData[this.formId].rows[0].values.pk_balatype.value;
		settlesatus = cardData[this.formId].rows[0].values.settlesatus.value;
        this.props.BillHeadInfo.setBillHeadInfoVisible({
            // showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: billno
        });
        //动态修改地址栏中的id的值
        props.setUrlParam(pks)
        buttonVisible(this.props, billstatus, balatypepk, isinner, settlesatus);
        updateCache(this.billpk, id, this.formId, this.cacheDataSource);

	}else{
        ajax({
            url: requesturl.querycard,
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                        billno = res.data[this.formId].rows[0].values.vbillno.value;
                        id = res.data[this.formId].rows[0].values.pk_transformbill.value;
                        billstatus = res.data[this.formId].rows[0].values.busistatus.value;
						isinner = res.data[this.formId].rows[0].values.isinner_pay.value;
						balatypepk = res.data[this.formId].rows[0].values.pk_balatype.value;
						settlesatus = res.data[this.formId].rows[0].values.settlesatus.value;
                        this.props.BillHeadInfo.setBillHeadInfoVisible({
                            // showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
                            billCode: billno
                        });
                        //动态修改地址栏中的id的值
                        props.setUrlParam(pks)
                        buttonVisible(this.props, billstatus, balatypepk, isinner, settlesatus);
                        updateCache(this.billpk, id, this.formId, this.cacheDataSource);
                    }
                    
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                }
            }
        });
    }
    
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/