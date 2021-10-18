/*VcOrD49QzbhDt4hEK/IMD3cCf54YNBpg/cZXO8R7/EfsMZVNthG4JJMyAjOToCrB*/
import { ajax,toast, cardCache} from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量查询
//缓存
let { updateCache, addCache} = cardCache;

/**
 * [外币兑换]-保存按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveBill = function () {

    var start = new Date().getTime();//起始时间
    if (this.props.getUrlParam('copyFlag') === 'copy') {
        this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
        this.props.form.setFormItemsValue(this.formId, { ts: null });
    }
    let firstStatus = this.props.getUrlParam('status');
    //必输项校验
    let flag = this.props.form.isCheckNow(this.formId);
    let tableflag = this.props.cardTable.checkTableRequired(this.tableId);
    if (flag && tableflag) {

        // let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
        //上行流量优化
        let CardData = createSimpleBillData(this.props,this.pageId, this.formId, this.tableId);
        let url = '/nccloud/cmp/recbill/recbillinsert.do'//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = '/nccloud/cmp/recbill/recbillupdate.do'//修改保存
        }
        //关联结算信息保存方法url
        let settlement_src = this.props.getUrlParam('src');
        console.log(settlement_src, 'from_settle_to_save');
        if (settlement_src) {
            url = '/nccloud/cmp/recbill/settlesave.do'//结算信息保存
            CardData={
                'billcard':CardData,
                'pk':this.settlepkinfo//结算信息pk
            }
        }
        ajax({
            url: url,
            data: CardData,
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        this.props.beforeUpdatePage();//打开开关
                        if (res.data.head) {
                            if(res.data.head[this.formId].rows[0].values.ntberrmsg && res.data.head[this.formId].rows[0].values.ntberrmsg.value){
                                let reform_message = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                                toast({ color: 'warning', content: reform_message });/* 超额提示预警，预算提示*/
                            }else{
                                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000001') });/* 国际化处理： 保存成功*/
                            }
                            
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                            let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                            setSourceFlag.call(this,source_Flag);
                            // this.source_flag(source_Flag);//来源系统翻译
                        }
                        //根据后台返回的数据进行缓存处理<pass>
                        if (res.data.body && res.data.body[this.tableId]) {
                            let body =  res.data.body;//差异缓存处理
                            body[this.tableId] = this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId])
                            if(body){
                                res.data.body = body;//差异缓存处理
                            }
                        }
                        this.props.updatePage(this.formId, this.tableId);//关闭开关
                        //直接从前台获取赋值给body
                        // if(!res.data.body && CardData.body){
                        //     res.data.body = CardData.body;//差异缓存处理:直接取前台数据
                        // }
                        let pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                        let billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
                        let billnoNo = res.data.head[this.formId].rows[0].values.bill_no.value;
                        this.settlepkinfo = null;
                        this.billno=billnoNo;
                        this.props.setUrlParam({
                            status: 'browse',
                            id: pk_recbill,
                            billno: billstatue,
                            pagecode: this.pageId
                        });
                        this.toggleShow();//切换页面状态
                        //增加缓存
                        // addCacheId(this.formId, savepk);
                        if (!firstStatus || firstStatus == 'add' || firstStatus == 'copy') {
                            //新增缓存
                            addCache(pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        } else {
                            //更新缓存
                            updateCache(this.pkname, pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        }
                        
                    }
                }

            }
        });
    }
    var end = new Date().getTime();//接受时间
    var time = (end - start) + "ms";
    console.log(time, "============耗时总时间") //返回函数执行需要时间
}

/*VcOrD49QzbhDt4hEK/IMD3cCf54YNBpg/cZXO8R7/EfsMZVNthG4JJMyAjOToCrB*/