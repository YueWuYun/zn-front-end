/*1uDF/Wh0C521Lg3xQ1ddm7bsFwJWVf6lpj/v7dfFvJwpRpnoPXXf3DkiMZPEqpoI*/
import {  ajax, toast, cacheTools } from 'nc-lightapp-front';
import { SCENE,URL_PARAM } from '../../../../../tmpub/pub/cons/constant.js';//联查使用场景
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
/**
 * [收款]-被联查普通入口
 * [支持单个pk或者多个pk]
 * [单个pk直接跳转卡片,多个pk留在列表]
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const getStandardQueryData = function () {
    //FTS联查收款结算单获取数据信息
    let ids = cacheTools.get(SCENE.LINK) == null ? 
    this.props.getUrlParam(URL_PARAM.PK_SRC) : 
    cacheTools.get(SCENE.LINK);//计入缓存的数据ids
    if(ids){
        let sendData = {
            'pk':ids,
            'pageid': this.pageId,
            'sourceflag':'card'
        }
        ajax({
            url: '/nccloud/cmp/recbill/queryformfts.do',
            data: sendData,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (res.data) {
                        if (res.data.head) {
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                            //页签赋值
                            let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
                            let source_flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                            setSourceFlag.call(this, source_flag);
                            //按钮显示控制[单据状态]
                            this.props.setUrlParam({
                                billno: res.data.head[this.formId].rows[0].values.bill_status.value
                            });
                            this.billno = billno;
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        }
                        this.linkToggleShow();//切换被联查页面状态,
                    } else {
                        //清空数据
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    }
                }
            }
        });
    }else{
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000122') });/* 国际化处理： 未获取到缓存数据，请确定数据是否加入缓存!*/
        return;
    }
}

/*1uDF/Wh0C521Lg3xQ1ddm7bsFwJWVf6lpj/v7dfFvJwpRpnoPXXf3DkiMZPEqpoI*/