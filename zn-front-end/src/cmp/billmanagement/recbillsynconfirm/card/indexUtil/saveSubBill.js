/*TeytldWPnXV5g4CoxrgXxudYLNciVl8jHUEkPnPg+KDgaT/WDjRKRZw9XdXltUEm*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量优化
import { saveCommit } from "../../../../../tmpub/pub/util";
//缓存
let { updateCache, addCache } = cardCache;

/**
 * [收款协同]-保存提交
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveSubBill = function () {
   
    saveCommitMicro.call(this, this.props);
}
/**保存提交 */
const saveCommitMicro = function (props) {
    saveCommit(props, {
        pageCode: this.pageId,
        headCode: this.formId,
        bodyCode: this.tableId,
        url: '/nccloud/cmp/recbill/recbillsavesubmitmicro.do',
        assign : this.getAssginUsedr,
        showAssignFunc: (res) => {
            let { data } = res;
            let { workflow } = data;
            //有指派信息，则指派，没有则重绘界面
            if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                //弹出指派框
                this.compositedata = res.data;
                this.setState({
                    isSaveSub: true,//保存提交标识
                    compositedisplay: true
                });
            }
        },
        updateViewFunc: (res) => {
            if (res.data.head) {
                let return_status = res.data.head[this.formId].rows[0].values.bill_status.value;
                if (res.data.head[this.formId].rows[0].values.ntberrmsg && res.data.head[this.formId].rows[0].values.ntberrmsg.value) {
                    let reform_message = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                    if (return_status && return_status == -10) {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') + reform_message });
                    } else {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') + reform_message });/* 超额提示预警，预算提示*/
                    }
                } else {
                    if (return_status && return_status == -10) {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') });
                    } else {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') });/* 超额提示预警，预算提示*/
                    }
                }
                this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                let subbillno = res.data.head[this.formId].rows[0].values.bill_no.value;
                this.billno = subbillno;
            }

            //根据后台返回的数据进行缓存处理<pass>
            if (res.data.body && res.data.body[this.tableId]) {
                let body = res.data.body;//差异缓存处理
                body[this.tableId] = this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId])
                if (body) {
                    res.data.body = body;//差异缓存处理
                }
            }
            //跳转页面
            let sub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
            let sub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
            //增加缓存
            let card_sub_status = this.props.getUrlParam('status');
            if (!card_sub_status || card_sub_status == 'add' || card_sub_status == 'copy') {
                //新增缓存
                addCache(sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
            } else {
                //更新缓存
                updateCache(this.pkname, sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
            }
            this.setState({
                compositedisplay: false
            });
            this.compositedata = null;
            this.getAssginUsedr=null;
            this.props.setUrlParam({
                status: 'browse',
                id: sub_pk_recbill,
                billno: sub_billstatue,
                pagecode: this.pageId
            });
            let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
            setSourceFlag.call(this, source_Flag);
            this.toggleShow();//切换页面状态

        }
    })
}
/*TeytldWPnXV5g4CoxrgXxudYLNciVl8jHUEkPnPg+KDgaT/WDjRKRZw9XdXltUEm*/