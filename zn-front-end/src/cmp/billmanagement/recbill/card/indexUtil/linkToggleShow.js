/*i3pKMQ11rd25DOuoe5ccDHg1X9iScIVZZuvYbQ2vxZyb4v8D7eDuYUHqxRF/lVzs*/
import { orgVersionUtil } from "../../util/orgVersionUtil";//多版本显示
import { linkButtonVisable } from "../events/linkButtonVisable";//被联查按钮控制
/**
 * [收款结算]-被联查页面状态加载
 * [被联查只有浏览态]
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const linkToggleShow = function () {
    let status = this.props.getUrlParam('status');//被联查页面只有浏览态
    let src = this.props.getUrlParam('src');//如果来自列表的查询可以显示返回箭头
    this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
    //设置卡片头部状态[包括:名称，单据编号，返回箭头等]
    if (status == 'browse') {
        if (this.billno != null) {
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
                billCode: this.billno  //修改单据号---非必传
            });
            if(src && src ==='list'){
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                });
            }
        } else {
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
            });
            if(src && src ==='list'){
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                });
            }
        }
         //设置卡片，表头和表体的编辑状态
        this.props.cardTable.setStatus(this.tableId, 'browse');
        this.props.form.setFormStatus(this.formId, 'browse');
        orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
        linkButtonVisable.call(this);//按钮控制显隐性
    }
   
}

/*i3pKMQ11rd25DOuoe5ccDHg1X9iScIVZZuvYbQ2vxZyb4v8D7eDuYUHqxRF/lVzs*/