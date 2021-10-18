/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, cardCache, print, output, promptBox } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl, printData, card, appCode, list } from '../../cons/constant.js';
const { pageCode, form02, headCode } = card;
import { interestBill } from '../../util/util';
import initTemplate from './initTemplate';
import { buttonVisible } from './buttonVisible';
import { getCardData } from './page';
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { versionsControl } from "../../../../pub/util/util.js";
let { getCacheById, updateCache, addCache } = cardCache;
// import { linkContract } from '../../../public/listHeadBtnClick';
import { COMMON_BTN } from '../../cons/constant';
import { refreshBtnClick } from '../../list/events/refresh';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { elecSignCardPrint } from "../../../../../tmpub/pub/util";
const {
    COPY_BTN,
    DELETE_BTN,
    EDIT_BTN,
    TALLY_BTN,
    UNTALLY_BTN,
    LINK,
    LINK_GROUP,
    DEPOSITBILL,
    AIACT_RATE,
    DEPOSIT_RATE,
    QUERYVOUCHER_BTN,
    PRINT,
    PREVIEW_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    OFFICIALPRINT,
    ELECSIGNINPREVIEW,
    PRINTLIST,
    REFRESH_BTN,
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

        // 头部 取消
        case CANCEL_BTN:
            promptBox({
                color: "warning",
                title: this.state.json['36340FDSR-000008'],/* 国际化处理： 取消*/
                content: this.state.json['36340FDSR-000009'],/* 国际化处理： 确定要取消吗?*/
                beSureBtnClick: cancel.bind(this, props)
            });
            break;
        //头部 记账
        case TALLY_BTN:
            tallyConfirm.call(this, props);
            break;
        //头部 取消记账
        case UNTALLY_BTN:
            unTallyConfirm.call(this, props);
            break;

        case DEPOSITBILL:// 联查存单
            let depositcode = this.props.form.getFormItemsValue(this.formId, 'depositcode').value;
            if (!depositcode) {
                toast({
                    color: 'warning',
                    content: this.state.json['36340RFDR-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            } else {
                ajax({
                    url: '/nccloud/ifac/fixdepositreceipt/linkquery.do', //`${baseReqUrl}${javaUrl.linkcurrentrate}.do`
                    data: {
                        pk: depositcode
                    },
                    success: (res) => {
                        let depositcode = res.data[0].parent.pk_depositreceipt;

                        props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card/index.html', {
                            srcFunCode: '36340FDSR',
                            appcode: '36341FDLQ',
                            pagecode: '36341FDLQ_C01',
                            status: 'browse',
                            islinkquery: true,
                            id: depositcode,
                            scene: "linksce"
                        });
                    }
                });
            }
            break;
        //联查活期利率 
        case AIACT_RATE:
            let pk_aiacrate = props.form.getFormItemsValue(card.headCode, 'pk_aiacrate').value;
            if (pk_aiacrate === null || pk_aiacrate == '' || pk_aiacrate === undefined) {
                toast({ color: "warning", content: this.state.json['36340FDLI-000038'] })/* 国际化处理： 暂无数据*/
                break;
            }
            ajax({
                url: '/nccloud/tmpub/tmbd/linkinterest.do',
                data: {
                    pk: pk_aiacrate
                },
                success: (res) => {
                    let linkpath, appcode, pagecode;
                    if (res.data.rateclass == '2') {
                        linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                            appcode = '36010IRC',
                            pagecode = '36010IRC_card'
                    } else if (res.data.rateclass == '1') {
                        linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                            appcode = '36010IRCG',
                            pagecode = '36010IRCG_card'
                    } else if (res.data.rateclass == '0') {
                        linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                            appcode = '36010IRCO',
                            pagecode = '36010IRCO_card'
                    }
                    props.openTo(linkpath, {
                        appcode: appcode,
                        pagecode: pagecode,
                        status: 'browse',
                        scene: "linksce",
                        // islinkquery: true,
                        id: pk_aiacrate
                    });
                }
            });
            break;
        //联查定期利率 
        case DEPOSIT_RATE:
            let pk_depostrate = props.form.getFormItemsValue(card.headCode, 'pk_depostrate').value;
            if (pk_depostrate === null || pk_depostrate == '' || pk_depostrate === undefined) {
                toast({ color: "warning", content: this.state.json['36340FDLI-000038'] })/* 国际化处理： 暂无数据*/
                break;
            }
            ajax({
                url: '/nccloud/tmpub/tmbd/linkinterest.do',
                data: {
                    pk: pk_depostrate
                },
                success: (res) => {
                    let linkpath, appcode, pagecode;
                    if (res.data.rateclass == '2') {
                        linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                            appcode = '36010IRC',
                            pagecode = '36010IRC_card'
                    } else if (res.data.rateclass == '1') {
                        linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                            appcode = '36010IRCG',
                            pagecode = '36010IRCG_card'
                    } else if (res.data.rateclass == '0') {
                        linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                            appcode = '36010IRCO',
                            pagecode = '36010IRCO_card'
                    }
                    props.openTo(linkpath, {
                        appcode: appcode,
                        pagecode: pagecode,
                        status: 'browse',
                        scene: "linksce",
                        // islinkquery: true,
                        id: pk_depostrate
                    });
                }
            });
            break;
        //联查凭证
        case QUERYVOUCHER_BTN:
            let pkVoucher = this.props.form.getFormItemsValue(card.headCode, 'pk_fixdepositreceipt').value;
            let pk_group = this.props.form.getFormItemsValue(card.headCode, 'pk_group').value;
            let pk_org = this.props.form.getFormItemsValue(card.headCode, 'pk_org').value;
            let billno = this.props.form.getFormItemsValue(card.headCode, 'vbillcode').value;
            let pk_billtype = '36LJ';

            linkVoucherApp(this.props, pkVoucher, pk_group, pk_org, pk_billtype, billno);
            break;

        //头部 打印
        case PRINT:
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
        case OFFICIALPRINT:// 正式打印
            elecSignPrint.call(this, props, true);
            break;

        case ELECSIGNINPREVIEW:// 补充打印
            elecSignPrint.call(this, props, false);
            break;

        case PRINTLIST:// 打印清单
            //let printListData = searchdata.call(this, props);
            // let listPks = [];
            // selectDatas.forEach((item) => {
            //     listPks.push(item.data.values.pk_fixdepositreceipt.value);
            // });
            print(
                'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                `${baseReqUrl}${javaUrl.print}.do`, {
                // billtype: constant.billtype, //单据类型
                // funcode: constant.printfuncode, //功能节点编码，即模板编码
                appcode: appCode, //appcode
                // nodekey: constant.printnodekey, //模板节点标识
                nodekey: 'LIST', //模板节点标识
                // printTemplateID: constant.printtemplateid, //模板id
                oids: pk // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
            }
            );
            break;

        //头部 刷新
        case REFRESH_BTN:
            getCardData.call(this, this.cardUrl, props.getUrlParam('id'), true, true);
            refreshBtnClick.call(this, props);  //使用这个函数会弹出刷新成功，但不知道是否刷新成功
            break;


        default:
            break;
    }
}

//记账
const tallyConfirm = function (props) {
    let that = this;
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(card.headCode, card.primaryId).value;
    let ts = props.form.getFormItemsValue(card.headCode, 'ts').value;
    pkMapTs[pk] = ts;
    ajax({
        url: `${baseReqUrl}${javaUrl.tally}.do`,
        data: {
            pkMapTs,
            pageCode: card.pageCode
        },
        success: (res) => {
            let pk_fixdepositreceipt = null;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(
                    res.formulamsg,  //参数一：返回的公式对象
                    {                //参数二：界面使用的表格类型
                        card_table_id: "cardTable"
                    }
                );
            }
            if (res.success) {
                toast({ color: 'success', content: that.state.json['36340FDSR-000040'] });/* 国际化处理： 保存成功*/
                if (res.data) {
                    if (res.data.head && res.data.head[this.formId]) {
                        props.form.setAllFormValue({ [that.formId]: res.data.head[that.formId] });
                        pk_fixdepositreceipt = res.data.head[that.formId].rows[0].values.pk_fixdepositreceipt.value;
                    }
                    if (res.data.body && res.data.body[that.tableId]) {
                        props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
                    }


                    updateCache(card.primaryId, pk_fixdepositreceipt, res.data, that.formId, card.cardCache, res.data.head[card.headCode].rows[0].values);

                }
                buttonVisible.call(this, this.props);
                // this.props.pushTo('/card', {
                //   status: 'browse',
                //   id: pk_fixdepostopening ,
                //   saveres:false,
                //   pagecode: card_page_id
                // });
                versionsControl(that.props, card.headCode);
                orgVersionView(this.props, this.formId);//组织版本视图
                // this.toggleShow();
            }
        }
    });
};


//取消记账
const unTallyConfirm = function (props) {
    let that = this;
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(card.headCode, card.primaryId).value;
    let ts = props.form.getFormItemsValue(card.headCode, 'ts').value;
    pkMapTs[pk] = ts;
    ajax({
        url: `${baseReqUrl}${javaUrl.untally}.do`,
        data: {
            pkMapTs,
            pageCode: card.pageCode
        },
        success: (res) => {
            let pk_fixdepositreceipt = null;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(
                    res.formulamsg,  //参数一：返回的公式对象
                    {                //参数二：界面使用的表格类型
                        card_table_id: "cardTable"
                    }
                );
            }
            if (res.success) {
                toast({ color: 'success', content: this.state.json['36340FDSR-000041'] });/* 国际化处理： 保存成功*/
                if (res.data) {
                    if (res.data.head && res.data.head[this.formId]) {
                        props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        pk_fixdepositreceipt = res.data.head[this.formId].rows[0].values.pk_fixdepositreceipt.value;
                    }
                    if (res.data.body && res.data.body[this.tableId]) {
                        props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }
                    updateCache(card.primaryId, pk_fixdepositreceipt, res.data, this.formId, card.cardCache, res.data.head[card.headCode].rows[0].values);


                }
                buttonVisible.call(this, this.props);
                versionsControl(this.props, card.headCode);
                orgVersionView(this.props, this.formId);//组织版本视图

            }
        }
    });
};

/**
* 正式打印和补充打印
* @param {*} props 
* @param {*} offical 
*/
const elecSignPrint = function (props, offical) {
    let nodekey;
    if (offical) {
        nodekey = 'OFFICIAL';
    } else {
        nodekey = 'INOFFICIAL';
    }
    elecSignCardPrint(props, {
        url: `${baseReqUrl}${javaUrl.officeprint}.do`,
        offical,
        appCode: appCode,
        nodeKey: nodekey,
        headCode: card.headCode,
        field_id: card.primaryId,
        field_billno: 'vbillcode',
        validateFunc: (selectData) => {
            return null;
        }
    })
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
    props.form.setFormItemsDisabled(this.formId, { pk_org: true });
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

function saveOperation(props, data, type) {
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
                    toast({ color: 'success', content: this.state.json['36340FDSR-000011'] });/* 国际化处理： 保存成功*/
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
                        this.btnOperation(javaUrl.commit, this.state.json['36340FDSR-000017'], res.data.head[this.formId].rows[0].values[this.primaryId].value);/* 国际化处理： 提交成功!*/
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