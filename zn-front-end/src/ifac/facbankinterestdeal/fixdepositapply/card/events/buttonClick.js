/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, cardCache, print, output, promptBox } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl, printData, card } from '../../cons/constant.js';
const { pageCode, headCode } = card;
import { interestBill } from '../../util/util';
import initTemplate from './initTemplate';
import { buttonVisible } from './buttonVisible';
import { getCardData } from './page';
import { cardOperator } from '../../../../pub/utils/IFACButtonUtil';
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';

let { getCacheById, updateCache, addCache } = cardCache;
let bodyCodeArr = {};
// import { linkContract } from '../../../public/listHeadBtnClick';
import { COMMON_BTN } from '../../cons/constant';
import { refreshBtnClick } from '../../list/events/refresh';
import {loadMultiLang} from "../../../../../tmpub/pub/util/index";
const {
    ADD_BTN,
    EDIT_BTN,
    COPY_BTN,
    DELETE_BTN,
    CURRENT_RATE,
    PERIODIC_RATE,
    SUBMIT_BTN,
    UNSUBMIT_BTN,
    ENTRUST_BTN,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    APPROVALOPINION_BTN,
    QUERYVOUCHER_BTN,
    SETTLEINACCBALACTION_BTN,
    DEBITCONTRACT_BTN,
    CONTRACT_BTN,
    PRINT_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    REFRESH_BTN,
    SAVE_BTN,
    SAVEADD_BTN,
    SAVESUBMIT_BTN,
    CANCEL_BTN } = COMMON_BTN
/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
    // 当前单据的pk
    let pk = props.form.getFormItemsValue(this.formId, this.primaryId) && props.form.getFormItemsValue(this.formId, this.primaryId).value;

    switch (id) {
        //头部 新增
        case ADD_BTN:
            let adddata = { pk: null };
            ajax({
                url: `${baseReqUrl}${javaUrl.addpermission}.do`,
                data: adddata,
                success: (res) => {
                    if (res.success) {
                        add.call(this, props, 'add');
                    }
                }
            });
            break;
        //头部 复制
        case COPY_BTN:
            // copy.call(this, props , pk );
            
            this.props.pushTo("/card", {
                status: "copy",
                id: pk,
                pagecode: this.pageId
            });
            initTemplate.call(this, props);
            this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });           
            break;
        //头部保存
        case SAVE_BTN:
            saveBill.call(this, props, 'save');
            break;
        //头部保存提交
        case SAVESUBMIT_BTN:
            // saveBill.call(this, props, 'savecommit');
            saveCommitBill.call(this, props, 'save'); //保存提交有问题 zhaoxbk 2020-2-24
            break;
        //头部保存新增
        case SAVEADD_BTN:
            saveAddBill.call(this, props, 'add');
            break;
        //头部修改
        case EDIT_BTN:
            let querydata = { pk: pk };
            ajax({
                url: `${baseReqUrl}${javaUrl.editpermission}.do`,
                data: querydata,
                success: (res) => {
                    if (res.success) {
                        edit.call(this, props, 'edit');
                    }
                }
            });
            this.props.pushTo("/card", {
                status: "edit",
                id: pk,
                pagecode: this.pageId
            });
            initTemplate.call(this, props);
            break;
        //头部删除
        case DELETE_BTN:
            promptBox({
                color: "warning",
                title: this.state.json['36340FDSA-000005'],/* 国际化处理： 删除*/
                content: this.state.json['36340FDSA-000006'],/* 国际化处理： 确定要删除吗?*/
                beSureBtnClick: this.btnOperation.bind(this, javaUrl.delete, this.state.json['36340FDSA-000007'])/* 国际化处理： 删除成功!*/
            });
            break;
        // 头部 取消
        case CANCEL_BTN:
            promptBox({
                color: "warning",
                title: this.state.json['36340FDSA-000008'],/* 国际化处理： 取消*/
                content: this.state.json['36340FDSA-000009'],/* 国际化处理： 确定要取消吗?*/
                beSureBtnClick: cancel.bind(this, props)
            });
            break;
        //头部 提交
        case SUBMIT_BTN:
            this.btnOperation(javaUrl.commit, this.state.json['36340FDSA-000017'], pk);/* 国际化处理： 提交成功!*/
            break;
        //头部 收回
        case UNSUBMIT_BTN:
            this.btnOperation(javaUrl.uncommit, this.state.json['36340FDSA-000010'], pk);/* 国际化处理： 收回成功!*/
            //cardOperator(props, card.pageCode, card.headCode, bodyCodeArr, card.primaryId, `${baseReqUrl}${javaUrl.uncommit}.do`, this.state.json['36340FDSA-000010'], card.cardCache, this.toggleShow.bind(this));/* 国际化处理： 收回成功！*/
            break;
        //头部 委托办理
        case ENTRUST_BTN:
            this.btnOperation(javaUrl.entrust, this.state.json['36340FDSA-000028'], pk);/* 国际化处理： 委托办理成功!*/
            break;
        //头部 取消委托
        case UNENTRUST_BTN:
            this.btnOperation(javaUrl.unentrust, this.state.json['36340FDSA-000029'], pk);/* 国际化处理： 取消委托成功!*/
            break;
        //头部 审批详情
        case APPROVALOPINION_BTN:
            this.billInfo = { billId: pk };
            this.setState({ showApproveDetail: true });
            break;
        //头部 联查--结算账户余额 
        case SETTLEINACCBALACTION_BTN:
            let pk_settleacc;
            if (this.props.form.getFormItemsValue(this.formId, 'pk_settleacc')
                && this.props.form.getFormItemsValue(this.formId, 'pk_settleacc').value) {
                    pk_settleacc = this.props.form.getFormItemsValue(this.formId, 'pk_settleacc').value;
            }
            this.setState({
                currentpk: pk_settleacc,
                accModalShow: true,
            });
            break;
        //头部 打印
        case PRINT_GROUP:
            print(
                'pdf',
                `${baseReqUrl}${javaUrl.print}.do`,
                {
                    ...printData,
                    oids: [pk]
                }
            );
            break;
        //下拉 打印        
        case PRINT_BTN:
            print(
                'pdf',
                `${baseReqUrl}${javaUrl.print}.do`,
                {
                    ...printData,
                    oids: [pk]
                }
            );
            break;
        //头部 输出
        case OUTPUT_BTN:
            output({
                url: `${baseReqUrl}${javaUrl.print}.do`,
                data: {
                    ...printData,
                    outputType: 'output',
                    oids: [pk],
                }
            });
            break;
        //联查凭证
        case QUERYVOUCHER_BTN:
            //interestBill.call(this, pks[0]);
            // let pkVoucher = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
            // let pk_group = selectDatas[0].data.values['pk_group'].value;
            // let pk_org = selectDatas[0].data.values['pk_org'].value;
            // let billno = selectDatas[0].data.values['vbillcode'].value;
            // let pk_billtype = selectDatas[0].data.values['pk_billtypeid'].value;
            // linkVoucherApp(props, pkVoucher, pk_group, pk_org, pk_billtype, billno);
            let pkVoucher = this.props.form.getFormItemsValue(card.headCode, 'pk_deposit').value;
            let pk_group = this.props.form.getFormItemsValue(card.headCode, 'pk_group').value;
            let pk_org = this.props.form.getFormItemsValue(card.headCode, 'pk_org').value;
            let billno = this.props.form.getFormItemsValue(card.headCode, 'vbillcode').value;
            let pk_billtype = this.props.form.getFormItemsValue(card.headCode, 'pk_billtypeid').value;

            linkVoucherApp(this.props, pkVoucher, pk_group, pk_org, pk_billtype, billno);
            break;
        //头部 附件
        case ENCLOSURE_BTN:
            fileMgr.call(this);
            break;
        //头部 刷新
        case REFRESH_BTN:
            getCardData.call(this, this.cardUrl, props.getUrlParam('id'), true, true);
            refreshBtnClick.call(this, props);  //使用这个函数会弹出刷新成功，但不知道是否刷新成功
            break;
        //头部 生成资金上收单
        case 'toDelivery': 
           
            let sourceid = pk;//来源主键
            if(!sourceid){
            toast({
                color: 'warning',
                content:loadMultiLang(this.props, '36340FDSA-000027') //{/* 国际化处理： 未查询出符合条件的数据！*/}
            });
            return;
            } 

            ajax({
                url: `/nccloud/ifac/fixeddatewithdraw/FDWToDeliveryCheck.do`,
                data: {
                    "pks": [sourceid],
                 },
                success: (res) => {
                    if (res.success) {
                        this.props.openTo('/sf/delivery/delivery/main/index.html#/card', 
                        {
                            srcFunCode:'36320FDA',
                            appcode: '36320FDA',
                            pagecode: '36320FDA_card',                   
                            status: 'add',
                            sourceid:sourceid
                        });
                    }
                }
            });
        break;
        default:
            break;
    }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add(props, status) {
    props.setUrlParam({ status });
    props.initMetaByPkorg();
    clearAll.call(this, props);
    initTemplate.call(this, props);
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props, type) {
    props.setUrlParam({ status: type });
    buttonVisible.call(this, props);
    setEditStatus.call(this, type);
    orgVersionView(this.props, this.formId);//组织版本视图
    props.resMetaAfterPkorgEdit();
    props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
    let id = props.getUrlParam('id');
    props.setUrlParam({ status: 'browse' });
    if (id) {
        getCardData.call(this, this.cardUrl, id, false, true);
        setEditStatus.call(this, 'browse');
        buttonVisible.call(this, props);
    } else {
        clearAll.call(this, props);
    }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 * @param {*} type   save保存、add保存新增、commit保存提交
 */
function saveBill(props, type) {
    let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
    if (!flagForm) {
        return;
    }
    let data = this.props.createExtCardData(this.pageId, this.formId);
    //console.log(data, this.props.meta.getMeta(), 'data');
    let billdata = props.form.getAllFormValue(this.formId);
    let validateData = {
        pageid: pageCode,
        model: {
            areacode: headCode,
            rows: billdata.rows,
            areaType: 'form'
        }
    }
    let saveobj = {};
    saveobj[this.formId] = 'form';
    props.validateToSave(validateData, () => saveOperation.call(this, props, data, type), saveobj, '');
}


/**
 * 保存提交
 * @param {*} props  页面内置对象
 * @param {*} type   save保存、add保存新增、commit保存提交
 */
function saveCommitBill(props, type) {
    let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
    if (!flagForm) {
        return;
    }
    let data = this.props.createExtCardData(this.pageId, this.formId);
    //console.log(data, this.props.meta.getMeta(), 'data');
    let billdata = props.form.getAllFormValue(this.formId);
    let validateData = {
        pageid: pageCode,
        model: {
            areacode: headCode,
            rows: billdata.rows,
            areaType: 'form'
        }
    }
    let saveobj = {};
    saveobj[this.formId] = 'form';
    props.validateToSave(validateData, () => saveCommitOperation.call(this, props, data, type), saveobj, '');
}

function saveCommitOperation(props, data, type) {
    let isAdd = this.props.getUrlParam('status') === 'add';
    ajax({
        url: `${baseReqUrl}${type}.do`,
        data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    let id = res.data.head[this.formId].rows[0].values[this.primaryId].value;
                    let ts = res.data.head[this.formId].rows[0].values.ts.value;
                    this.idTs = { id, ts };
                    // if(type=='savecommit'){
                    //     toast({ color: 'success', content: this.state.json['36340FDSA-000040'] });/* 国际化处理： 保存提交成功*/
                    // }else{
                    //     toast({ color: 'success', content: this.state.json['36340FDSA-000011'] });/* 国际化处理： 保存成功*/
                    // }
                    type = 'commit';
                    // 缓存
                    if (isAdd) {
                        addCache(id, res.data, this.formId, this.dataSource);
                        addCache(id, res.data, this.formId, this.cache);
                    } else {
                        updateCache(this.primaryId, id, res.data, this.formId, this.dataSource);
                        updateCache(this.primaryId, id, res.data, this.formId, this.cache);
                    }
                    if (type === 'add') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                        let addqdata = { pk: null };
                        props.setUrlParam({
                            id: '',
                            status: 'add'
                        });
                        add.call(this, props, 'add');
                        // ajax({
                        //     url: `${baseReqUrl}${javaUrl.addpermission}.do`,
                        //     data: addqdata,
                        //     success: (res) => {
                        //         if (res.success) {
                        //             props.setUrlParam({
                        //                 id: '',
                        //                 status: 'add'
                        //             });
                        //             add.call(this, props, 'add');
                        //         }else{
                        //             props.setUrlParam({
                        //                 id,
                        //                 status: 'browse'
                        //             });
                        //             this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        //             buttonVisible.call(this, this.props);
                        //         }
                        //     }
                        // });
                    } else if (type === 'commit') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        this.btnOperation(javaUrl.commit, this.state.json['36340FDSA-000017'], res.data.head[this.formId].rows[0].values[this.primaryId].value);/* 国际化处理： 提交成功!*/
                    } else {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                        orgVersionView(props, this.formId);
                    }
                }
            }
        }
    });
}


function saveOperation(props, data, type) {
    let isAdd = this.props.getUrlParam('status') === 'add';
    let isCopy = this.props.getUrlParam('status') === 'copy';
    ajax({
        url: `${baseReqUrl}${type}.do`,
        data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    let id = res.data.head[this.formId].rows[0].values[this.primaryId].value;
                    let ts = res.data.head[this.formId].rows[0].values.ts.value;
                    this.idTs = { id, ts };
                    if(type=='savecommit'){
                        toast({ color: 'success', content: this.state.json['36340FDSA-000040'] });/* 国际化处理： 保存提交成功*/
                    }else{
                        toast({ color: 'success', content: this.state.json['36340FDSA-000011'] });/* 国际化处理： 保存成功*/
                    }
                    
                    // 缓存
                    if (isAdd || isCopy) {
                        addCache(id, res.data, this.formId, this.dataSource);
                        addCache(id, res.data, this.formId, this.cache);
                    } else {
                        updateCache(this.primaryId, id, res.data, this.formId, this.dataSource);
                        updateCache(this.primaryId, id, res.data, this.formId, this.cache);
                    }
                    if (type === 'add') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                        let addqdata = { pk: null };
                        props.setUrlParam({
                            id: '',
                            status: 'add'
                        });
                        add.call(this, props, 'add');
                        // ajax({
                        //     url: `${baseReqUrl}${javaUrl.addpermission}.do`,
                        //     data: addqdata,
                        //     success: (res) => {
                        //         if (res.success) {
                        //             props.setUrlParam({
                        //                 id: '',
                        //                 status: 'add'
                        //             });
                        //             add.call(this, props, 'add');
                        //         }else{
                        //             props.setUrlParam({
                        //                 id,
                        //                 status: 'browse'
                        //             });
                        //             this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        //             buttonVisible.call(this, this.props);
                        //         }
                        //     }
                        // });
                    } else if (type === 'commit') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        this.btnOperation(javaUrl.commit, this.state.json['36340FDSA-000017'], res.data.head[this.formId].rows[0].values[this.primaryId].value);/* 国际化处理： 提交成功!*/
                    } else {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                        orgVersionView(props, this.formId);
                    }
                }
            }
        }
    });
}
/**
 * 保存新增
 * @param {*} props  页面内置对象
 * @param {*} type   save保存、add保存新增、commit保存提交
 */
function saveAddBill(props, type) {
    let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
    if (!flagForm) {
        return;
    }
    let data = this.props.createExtCardData(this.pageId, this.formId);
    //console.log(data, this.props.meta.getMeta(), 'data');
    let billdata = props.form.getAllFormValue(this.formId);
    let validateData = {
        pageid: pageCode,
        model: {
            areacode: headCode,
            rows: billdata.rows,
            areaType: 'form'
        }
    }
    let saveobj = {};
    saveobj[this.formId] = 'form';
    props.validateToSave(validateData, () => saveAddOperation.call(this, props, data, type), saveobj, '');
}

function saveAddOperation(props, data, type) {
    let isAdd = this.props.getUrlParam('status') === 'add';
    ajax({
        url: `${baseReqUrl}${javaUrl.save}.do`,
        data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    let id = res.data.head[this.formId].rows[0].values[this.primaryId].value;
                    let ts = res.data.head[this.formId].rows[0].values.ts.value;
                    this.idTs = { id, ts };
                    toast({ color: 'success', content: this.state.json['36340FDSA-000011'] });/* 国际化处理： 保存成功*/
                    // 缓存
                    if (isAdd) {
                        addCache(id, res.data, this.formId, this.dataSource);
                        addCache(id, res.data, this.formId, this.cache);
                    } else {
                        updateCache(this.primaryId, id, res.data, this.formId, this.dataSource);
                        updateCache(this.primaryId, id, res.data, this.formId, this.cache);
                    }
                    if (type === 'add') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                        let addqdata = { pk: null };
                        props.setUrlParam({
                            id: '',
                            status: 'add'
                        });
                        add.call(this, props, 'add');
                    } else if (type === 'commit') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        this.btnOperation(javaUrl.commit, this.state.json['36340FDSA-000017'], res.data.head[this.formId].rows[0].values[this.primaryId].value);/* 国际化处理： 提交成功!*/
                    } else {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                        orgVersionView(props, this.formId);
                    }
                }
            }
        }
    });
}

/**
 * 清空所有的数据
 * @param {*} props  页面内置对象
 */
export function clearAll(props) {
    props.form.EmptyAllFormValue(this.formId);
    buttonVisible.call(this, props);
    orgVersionView(this.props, this.formId);//组织版本视图
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus(status) {
    this.props.form.setFormStatus(this.formId, status);
}

/**
 * 附件管理
 */
function fileMgr() {
    let billId = this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    let billNo = this.props.form.getFormItemsValue(this.formId, 'vbillcode').value;
    this.showUploader = !this.showUploader;
    this.billInfo = { billId, billNo };
    this.forceUpdate();
}

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/