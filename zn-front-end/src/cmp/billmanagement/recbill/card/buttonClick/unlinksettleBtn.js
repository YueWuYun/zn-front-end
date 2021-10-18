/*8yIwvr8LjXsThYjPnGT+TUp11LEmcAxGgkP/6S24mxV5HbNM25GNbWOsPA/diZ9R*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { pageInfoClick } from '../events';checkCancelSettle
import { checkCancelSettle } from './checkSingleSettle';
//缓存
let {  getNextId } = cardCache;

/**
 * [收款结算单]-取消关联结算按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unlinksettleBtn = function () {

    if (!this.props.getUrlParam('id')) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000008') });/* 国际化处理： 操作失败，参数id无法获取!*/
        return;
    }
    //取消关联结算信息校验
    if(!checkCancelSettle.call(this)){
        return ;
    }
    //删除后直接进入下一行
    let delpk = this.props.getUrlParam('id');
    if (delpk) {
        this.deleteId = delpk;//删除单据pk
    }
    /**
     * id：数据主键的值
     * dataSource: 缓存数据命名空间
     */
    let nextId = getNextId(delpk, this.dataSource);

    let unlinksettleBtn_dataArr = [];
    unlinksettleBtn_dataArr.push(this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value);//主键数组
    //自定义请求数据
    let send_data = {
        'pks': unlinksettleBtn_dataArr
    };

    ajax({
        url: '/nccloud/cmp/recbill/recbillunlinksettle.do',
        data: send_data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000096') });/* 国际化处理： 取消关联结算成功*/
                this.deleteCacheData();//删除缓存
                if (nextId != null) {
                    pageInfoClick.call(this, this.props, nextId);
                } else {
                    this.cancleSkyPage();//跳转空白页面
                }
            }
        }
    });


}

/*8yIwvr8LjXsThYjPnGT+TUp11LEmcAxGgkP/6S24mxV5HbNM25GNbWOsPA/diZ9R*/