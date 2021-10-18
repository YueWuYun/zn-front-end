/*Lebxt4F5KvEENOn1VQ4nMEJ0xswev7hhiY1HNV4Za6IL/6/ROmEFvXFTFgOaFiXS*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
import appBase from '../../base';
const { api } = appBase;
//缓存
let {
    updateCache, addCache
} = cardCache;

/**
 * [收款结算]-提交指派
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const submittAssginBtn = function () {
    let card_sub_status = this.props.getUrlParam('status');
    if (!this.props.getUrlParam('id')) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000008') });/* 国际化处理： 操作失败，参数id无法获取!*/
        return;
    }
    if (!this.getConstAssginUsedr) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000113')   // 提示内容,非必输/* 国际化处理： 请选择指派人!*/
        });
        return;
    }
    let submitdataArr = [];
    submitdataArr.push(this.props.getUrlParam('id'));
    let subimtBtnData = {
        'pks': submitdataArr,
        'pageid': this.pageId,
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value,
        'param': this.getConstAssginUsedr//指派人信息
    };
    ajax({
        url: '/nccloud/cmp/recbill/submiassgin.do',
        data: subimtBtnData,
        success: (res) => {
            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000009') });/* 国际化处理： 提交成功*/
            if (res && res.data) {
                if (res.data.head) {

                    //begin tm tangleic 20200220 增加预算提示信息
                    api.comm.showTbbMsg({ props: this.props, row: res.data.head[this.formId].rows[0] });
                    //end tm tangleic

                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    let subbillno = res.data.head[this.formId].rows[0].values.bill_no.value;
                    this.billno = subbillno;//单据编号
                    let sub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                    let sub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
                    this.props.setUrlParam({
                        status: 'browse',
                        id: sub_pk_recbill,
                        billno: sub_billstatue,
                        pagecode: this.pageId
                    });
                    let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                    // this.source_flag(source_Flag);//来源系统翻译
                    setSourceFlag.call(this, source_Flag);
                    this.setState({
                        compositedisplay: false
                    });
                    this.compositedata = null;
                    this.getConstAssginUsedr=null;
                    this.toggleShow();//切换页面状态
                    //差异缓存处理:直接取前台数据
                    let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);//表单取值
                    if (!res.data.body && CardData.body) {
                        res.data.body = CardData.body;
                    }
                    //增加缓存
                    if (!card_sub_status || card_sub_status == 'add' || card_sub_status == 'copy') {
                        //新增缓存
                        addCache(sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                    } else {
                        //更新缓存
                        updateCache(this.pkname, sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                    }
                    this.setState({
                        isSaveSub: false,//保存提交标识
                        compositedisplay: false
                    });
                    this.compositedata = null;
                }
            }
        }
    });
}

/*Lebxt4F5KvEENOn1VQ4nMEJ0xswev7hhiY1HNV4Za6IL/6/ROmEFvXFTFgOaFiXS*/