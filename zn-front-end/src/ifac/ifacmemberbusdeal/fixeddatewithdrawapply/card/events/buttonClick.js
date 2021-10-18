/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast, print, output,promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import { loadMultiLang} from "../../../../../tmpub/pub/util/index";
import { getCurrentLastId, deleteCacheData, getNextId, } from '../../../../../tmpub/pub/util/cache';
import { cardOperator } from '../../../../pub/utils/IFACButtonUtil';
import {mysaveCommit} from "./method";
import initTemplate from './initTemplate';
import { pageInfoClick } from "../events";
let { FixedWithDrawApplyConst, pageCodeCard, base_url, app_code, nodekey, formId, pkname } = CONSTANTS;
let bodyCodeArr = {};
export default function (props, key) {
    let saveObj = {};
    let valformData = {}
    let validateData={}
    let saveformData={}
    switch (key) { 
        case 'Refresh':
            this.qryData(true);
            break;
        //头部新增
        case 'Add':
            props.form.EmptyAllFormValue(formId);
            this.props.setUrlParam({
                status: 'add'
            });
            initTemplate.call(this, props);
            this.billID = '';
            props.form.EmptyAllFormValue(formId);
            break;
        //修改
        case 'Edit':
            let editData = this.props.form.getAllFormValue(formId);
            props.pushTo('/card', {
                status: 'edit',
                id:editData.rows[0].values['pk_fwithdrawapply'].value,
            });
            this.qryData();
            break;
        //删除
        case 'Delete':
            let delData = this.props.form.getAllFormValue(formId);
            promptBox({
                color: "warning",
                title: loadMultiLang(props, '36340FDWA-000013'),/* 国际化处理： 删除*/
                content: loadMultiLang(props, '36340FDWA-000012'),/* 国际化处理： 确认要删除吗?*/
                beSureBtnClick: delBill.bind(this, props,delData)
            });	
            break;
        //头部 复制
        case 'Copy':
            let copyData = this.props.form.getAllFormValue(formId);
            copyBill.call(this, props, copyData);
            break;
        //取消
        case 'Cancel':
            promptBox({
                color: "warning",
                title: loadMultiLang(this.props, '36340FDWA-000019'), // 弹框表头信息/* 国际化处理： 确认取消*/
                content: loadMultiLang(this.props, '36340FDWA-000018'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick: cancel.bind(this, props) //点击确定按钮事件
                })
            break;
        //头部保存
        case 'Save':
            this.isSaveAdd = false;
            saveObj[formId] = 'form';
            valformData = this.props.form.getAllFormValue(formId);
            saveformData = this.props.createMasterChildData(pageCodeCard, formId);
            validateData = {
                pageid: pageCodeCard,
                model: {
                    areacode: formId,
                    rows: valformData.rows,
                    areaType: 'form'
                }
            }
            // 公式验证
            this.props.validateToSave(validateData, this.saveBill.bind(this, false, saveformData),saveObj, '');
            break;
        //保存新增
        case 'SaveAdd':
            this.isSaveAdd = true;
            saveObj[formId] = 'form';
            valformData = this.props.form.getAllFormValue(formId);
            saveformData = this.props.createMasterChildData(pageCodeCard, formId);
            validateData = {
                pageid: pageCodeCard,
                model: {
                    areacode: formId,
                    rows: valformData.rows,
                    areaType: 'form'
                }
            }
            this.props.validateToSave(validateData, this.saveBill.bind(this, false, saveformData), saveObj, '');
            // add.call(this, props);
            break;
        //保存提交
        case 'SaveCommit':
            mysaveCommit.call(this, props);
            break;
        //头部 提交
        case 'Commit':  
            cardOperator(
                props,
                pageCodeCard,
                formId,
                bodyCodeArr,
                'pk_fwithdrawapply',
                base_url + 'FDWDWACommitAction.do',
                loadMultiLang(this.props, '36340FDWA-000033')/* 国际化处理： 提交成功！*/,
                FixedWithDrawApplyConst.dataSource,
                commitAssign.bind(this), true);/* 国际化处理： 提交成功！*/
            break;
        //头部 收回
        case 'UnCommit':
            cardOperator(
                props,
                pageCodeCard,
                formId,
                bodyCodeArr,
                'pk_fwithdrawapply',
                base_url + 'FDWDWAUnCommitAction.do',
                loadMultiLang(this.props, '36340FDWA-000034'),
                FixedWithDrawApplyConst.dataSource,
                (data, props) => {
                    this.toggleShow();
                });/* 国际化处理： 收回成功！*/
            break;
        case 'File':
            fileMgr.call(this, props);
            break;
        // 委托
        case 'Consign':
            cardOperator(
                props,
                pageCodeCard,
                formId, bodyCodeArr,
                'pk_fwithdrawapply',
                base_url + 'FDWDWAConsignAction.do',
                loadMultiLang(this.props, '36340FDWA-000030'),
                FixedWithDrawApplyConst.dataSource,
                (props, data) => {
                    this.toggleShow();
                });/* 国际化处理： 委托成功！*/
            break;
        // 取消委托
        case 'UnConsign':
            cardOperator(
                props,
                pageCodeCard,
                formId,
                bodyCodeArr,
                'pk_fwithdrawapply',
                base_url + 'FDWDWAUnConsignAction.do',
                loadMultiLang(this.props, '36340FDWA-000031'),
                FixedWithDrawApplyConst.dataSource,
                (props, data) => {
                    this.toggleShow();
                });/* 国际化处理： 取消委托！*/
            break;
        // 联查审批意见
        case 'AppRoveIdea':
            let approveData = this.props.form.getAllFormValue(formId);
            let apprpk =approveData.rows[0].values['pk_fwithdrawapply'].value;
            this.setState({ 
                showApproveDetail: true,
                billID: apprpk
            });
            break;
        // 联查存单
        case 'LinkDepositBill':
            let linkData = this.props.form.getAllFormValue(formId);
            let depositcode = linkData.rows[0].values['pk_depositreceipt'].value;
            if(!depositcode){
                toast({
                    color: 'warning',
                    content: loadMultiLang(this.props, '36340FDWA-000010') //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            } else {
                ajax({
                    url: '/nccloud/ifac/memberdeposit/querycardlinkaction.do',
                    data: {
                        pk:depositcode,
                        pageCode: "36341FDLQ_C01"
                    },
                    success: (res) => {
                        if (res.data) {
                            this.props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card', 
                            {
                                srcFunCode:'36340FDWA',
                                appcode: '36341FDLQ',
                                pagecode: '36341FDLQ_C01',
                                status: 'browse',
                                islinkquery: true,
                                id:res.data,
                                scene: "linksce"
                            });
                        } 
                    }
                })
            }
            break;
        case 'Printbtn':
            let printData = this.props.form.getAllFormValue(formId);
            let pks = [];
            pks.push(printData.rows[0].values['pk_fwithdrawapply'].value);
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url + 'FDWDWAPrintaction.do',
                {
                    appcode: app_code,
                    nodekey: nodekey,//模板节点标识
                    oids: pks
                }
            );
            break;
        // 输出
        case 'Output':
            let outputData = this.props.form.getAllFormValue(formId);
            let outputpks = [];
            outputpks.push(outputData.rows[0].values['pk_fwithdrawapply'].value);
            output({
                url: base_url + 'FDWDWAPrintaction.do',
                data: {
                    nodekey: nodekey,
                    appcode: app_code,
                    oids: outputpks,
                    outputType: 'output'
                }
            });
            break;
    }
}

//取消按钮
const cancel = function (props) {
    let status = props.getUrlParam("status");
    if (status == 'edit') {
        props.setUrlParam({
            status: 'browse',
            id: props.getUrlParam('id')
        });
        // this.pageChange(props.getUrlParam('id'));
        this.qryData();
        // 因为表体采用setTableData设置的值，所以回退不会起效，重新查询
    } else if (status == 'add' || status == 'copy') {
        let nextId = getCurrentLastId(FixedWithDrawApplyConst.dataSource);
        if (nextId) {
            props.setUrlParam({
                status: 'browse',
                id: nextId,
                isCopy: false
            });
            this.qryData();
            //因为上一条可能是新增加入缓存的数据，缓存中只存储表头数据，所以需要重新查询
            // this.pageChange(nextId);
        } else {
            props.form.EmptyAllFormValue(formId);
            props.pushTo('/card', {
                status: 'browse',
            });
            props.form.EmptyAllFormValue(formId);
            props.initMetaByPkorg();
            props.form.setFormItemsDisabled(formId, { "pk_org": true });
            this.toggleShow();
        }
    } else {
        window.history.back();
    }
}
/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
    if (!data) {
        return;
    }
    if (Array.isArray(data)) {
        data = data[0];
    }
    let { workflow } = data;
    //有指派信息，则指派，没有则重绘界面
    if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
        this.setState({ assignData: data, assignShow: data });
    } else {
        this.toggleShow()
    }
}
/**
 * 删除数据
 */
const delBill = function (props, record) {
    let pkMapTs = {};
    let pk = record.rows[0].values['pk_fwithdrawapply'].value;
    let ts = record.rows[0].values['ts'].value;
    pkMapTs[pk] = ts;
    ajax({
        url: base_url + 'FDWDWADeleteaction.do',
        data: {
            pkMapTs,
            pageCode: pageCodeCard
        },
        success: (res) => {
            if (res.success) {
                toast({ color: 'success', content: loadMultiLang(this.props, '36340FDWA-000013') + loadMultiLang(this.props, '36340FDWA-000021') });/* 国际化处理： 删除成功*/
                let nextId = getNextId(this.props, pk, FixedWithDrawApplyConst.dataSource);
                deleteCacheData(this.props, pkname, pk, FixedWithDrawApplyConst.dataSource);
                pageInfoClick.call(this, this.props, nextId);
            }
        }
    });
}
/**
 * 复制数据
 */
const copyBill = function (props, record) {
    let pk = record.rows[0].values['pk_fwithdrawapply'].value;
    ajax({
        url: base_url + 'FDWDWACopyAction.do',
        data: {
            pk,
            pageCode: pageCodeCard
        },
        success: (res) => {
            if (res.data.head) {
                this.props.form.EmptyAllFormValue(formId);
                this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                this.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
                this.props.form.setFormItemsDisabled(formId, { 'pk_depositorg': false, 'pk_depositreceipt': false, 'pk_settleacc': false, 'withdrawdate': false, 'withdrawamount': false, 'remark': false });
            }
            this.props.setUrlParam({
                status: 'add'
            });
            this.toggleShow();
        }
    })
}
/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
    let selectDatas = this.props.form.getAllFormValue(formId);
    let billID = selectDatas.rows[0].values['pk_fwithdrawapply'].value;
    let billNO = selectDatas.rows[0].values['vbillcode'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billID,
        billNO
    });
}


/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/