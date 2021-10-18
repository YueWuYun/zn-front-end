/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
const { formcode1, cacheDataSource } = constant;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
import { buttonVisible } from './buttonVisible';
export default function (props, pks) {
    // 后台还没更新，暂不可用
    let data = {
        pk: pks,
        pageCode: constant.cpagecode
    };
    let cardData = getCacheById(pks, this.cacheDataSource);
    if(cardData){
        datareder(cardData);
        // this.props.form.setAllFormValue({ [formcode1]: cardData[formcode1] });
        // let billno = cardData[formcode1].rows[0].values.billno.value;
        // let id = cardData[formcode1].rows[0].values.pk_cashdraw.value;
        // let billstatus = cardData[formcode1].rows[0].values.billstatus.value;
        // props.setUrlParam(pks)//动态修改地址栏中的id的值
        // this.props.BillHeadInfo.setBillHeadInfoVisible({
        //      // showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        //     showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
        //     billCode: billno
        // });
        // buttonVisible(props,billstatus);
        // updateCache(constant.pk_cashdraw, id, formcode1, this.cacheDataSource);
	}else{
        ajax({
            url: requesturl.querycard,
            data: data,
            success: (res) => {
                if (res) {
                    if (res.data) {
                        datareder(res.data);
                        // this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
                        // let billno = res.data[formcode1].rows[0].values.billno.value;
                        // let id = res.data[formcode1].rows[0].values.pk_cashdraw.value;
                        // let billstatus = res.data[formcode1].rows[0].values.billstatus.value;
                        // props.setUrlParam(pks)//动态修改地址栏中的id的值
                        // // this.setState({ billno: ':'+billno });
                        // this.props.BillHeadInfo.setBillHeadInfoVisible({
                        //     // showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                        //     showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
                        //     billCode: billno
                        // });
                        // buttonVisible(props,billstatus);
                        // updateCache(constant.pk_cashdraw, id, formcode1, this.cacheDataSource);
                    }
                } else {
                    props.form.setAllFormValue({ [formcode1]: { rows: [] } });
                }
            }
        });
    }

    function datareder(billdata){
        props.form.setAllFormValue({ [formcode1]: billdata[formcode1] });
        let billno = billdata[formcode1].rows[0].values.billno.value;
        let id = billdata[formcode1].rows[0].values.pk_cashdraw.value;
        let billstatus = billdata[formcode1].rows[0].values.billstatus.value;
        props.setUrlParam(pks)//动态修改地址栏中的id的值
        props.BillHeadInfo.setBillHeadInfoVisible({
             // showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: billno
        });
        buttonVisible(props,billstatus);
        updateCache(constant.pk_cashdraw, id, formcode1, cacheDataSource);
    }
    
}



/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/