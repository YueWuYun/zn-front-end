/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output, promptBox } from 'nc-lightapp-front';
import { card, printData, baseReqUrl, javaUrl, list, appCode } from '../../cons/constant.js';
import { bodyBtnOperation } from './bodyButtonClick';
import { searchBtnClick } from './search';
import { interestBill } from '../../util/util';
import { COMMON_BTN } from '../../cons/constant';
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
// import { linkContract } from '../../../public/listHeadBtnClick';
import { refreshBtnClick } from './refresh';
import { elecSignListPrint } from "../../../../../tmpub/pub/util";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
const {
    BTN_GROUP,
    ADD_BTN,
    COPY_BTN,
    DELETE_BTN,
    EDIT_BTN,
    TALLY_BTN,
    UNTALLY_BTN,
    LINK,
    LINK_GROUP,
    DEPOSITBILL,
    DEPOSIT_RATE,
    AIACT_RATE,
    QUERYVOUCHER_BTN,
    PRINT,
    PREVIEW_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    OFFICIALPRINT,
    ELECSIGNINPREVIEW,
    PRINTLIST,
    REFRESH_BTN,
    EDIT_INNER_BTN,
    DELETE_INNER_BTN,
    SUBMIT_INNER_BTN,
    UNSUBMIT_INNER_BTN,
    ENTRUST_INNER_BTN,
    UNENTRUST_INNER_BTN,
} = COMMON_BTN;

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
    let selectDatas = props.table.getCheckedRows(this.tableId);//获取已勾选数据
    // if ([TALLY_BTN, UNTALLY_BTN, 'Loan'].includes(id) && selectDatas.length > 1) {
    //     toast({ color: 'warning', content: this.state.json['36340FDSR-000021'] });/* 国际化处理： 请选中单条数据进行操作!*/
    //     return;
    // }
    let pks = selectDatas && selectDatas.map(item => item.data.values && item.data.values[this.primaryId] && item.data.values[this.primaryId].value);
    switch (id) {

        //记账
        case TALLY_BTN:
            tallyHeadConfirm.call(this, props);

            break;
        //取消记账
        case UNTALLY_BTN:
            unTallyHeadConfirm.call(this, props);
            break;

        //头部 打印
        case PRINT:
            print(
                'pdf',
                `${baseReqUrl}${javaUrl.print}.do`,
                {
                    ...printData,
                    oids: pks
                }
            );
            break;
        case OFFICIALPRINT:// 正式打印OFFICIALPRINT
            elecSignPrint.call(this, props, true);
            break;

        case ELECSIGNINPREVIEW:// 补充打印ELECSIGNINPREVIEW
            elecSignPrint.call(this, props, false);
            break;

        //头部 输出
        case OUTPUT_BTN:
            output({
                url: `${baseReqUrl}${javaUrl.print}.do`,
                data: {
                    ...printData,
                    outputType: 'output',
                    oids: pks,
                }
            });
            break;
        //头部 预览
        case PREVIEW_BTN:
            print(
                'pdf',
                `${baseReqUrl}${javaUrl.print}.do`,
                {
                    ...printData,
                    oids: pks
                }
            );
            break;
        //头部 联查--存单 /nccloud/resources/icdmc/icdmc/innerdebitcontract/main/index.html#/card
        case DEPOSITBILL:
            let depositcode = selectDatas[0].data.values.depositcode.value;

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
            break;

        //联查活期利率 
        case AIACT_RATE:
            let link_rateData = props.table.getCheckedRows(this.tableId);
            let pk_aiacrate = link_rateData[0].data.values.pk_aiacrate ? link_rateData[0].data.values.pk_aiacrate.value : null;
            if (link_rateData.length != 1) {
                // toast({
                //     color: 'warning',
                //     content: this.state.json['36340FDLI-000021']/* 国际化处理： 请选中单条数据进行操作*/
                // });
                // return;
            }
            // link_rateData.forEach((val) => {
            //     if (val.data.values.pk_aiacrate && val.data.values.pk_aiacrate.value) {
            //         pk_aiacrate = val.data.values.pk_aiacrate.value;
            //     }
            // });

            if (!pk_aiacrate) {
                toast({ color: "warning", content: this.state.json['36340FDLI-000038'] })/* 国际化处理： 暂无数据*/
                break;
            }

            ajax({
                url: '/nccloud/tmpub/tmbd/linkinterest.do', //`${baseReqUrl}${javaUrl.linkcurrentrate}.do`
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
                        // islinkquery: true,
                        scene: "linksce",
                        id: pk_aiacrate
                    });
                }
            });
            break;
        //联查定期利率 
        case DEPOSIT_RATE:
            link_rateData = props.table.getCheckedRows(this.tableId);
            let pk_depostrate = link_rateData[0].data.values.pk_depostrate ? link_rateData[0].data.values.pk_depostrate.value : null;
            // if (link_rateData.length != 1) {
            //     toast({
            //         color: 'warning',
            //         content: this.state.json['36340FDLI-000021']/* 国际化处理： 请选中单条数据进行操作*/
            //     });
            //     return;
            // }
            // link_rateData.forEach((val) => {
            //     if (val.data.values.pk_depostrate && val.data.values.pk_depostrate.value) {
            //         pk_depostrate = val.data.values.pk_depostrate.value;
            //     }
            // });

            if (!pk_depostrate) {
                toast({ color: "warning", content: this.state.json['36340FDLI-000038'] })/* 国际化处理： 暂无数据*/
                break;
            }

            ajax({
                url: '/nccloud/tmpub/tmbd/linkinterest.do', //`${baseReqUrl}${javaUrl.linkcurrentrate}.do`
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
                        // islinkquery: true,
                        scene: "linksce",
                        id: pk_depostrate
                    });
                }
            });
            break;

        case QUERYVOUCHER_BTN:
            //interestBill.call(this, pks[0]);
            let pkVoucher = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
            let pk_group = selectDatas[0].data.values['pk_group'].value;
            let pk_org = selectDatas[0].data.values['pk_org'].value;
            let billno = selectDatas[0].data.values['vbillcode'].value;
            let pk_billtype = '36LJ';
            linkVoucherApp(props, pkVoucher, pk_group, pk_org, pk_billtype, billno);
            break;
        case PRINTLIST:// 打印清单
            //let printListData = searchdata.call(this, props);
            let listPks = [];
            selectDatas.forEach((item) => {
                listPks.push(item.data.values.pk_fixdepositreceipt.value);
            });
            print(
                'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                `${baseReqUrl}${javaUrl.print}.do`, {
                // billtype: constant.billtype, //单据类型
                // funcode: constant.printfuncode, //功能节点编码，即模板编码
                appcode: appCode, //appcode
                // nodekey: constant.printnodekey, //模板节点标识
                nodekey: 'LIST', //模板节点标识
                // printTemplateID: constant.printtemplateid, //模板id
                oids: listPks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
            }
            );
            break;
        //头部 刷新
        case REFRESH_BTN:
            refreshBtnClick.call(this, props);
            break;
        default:
            break;
    }
}
//确认
const tallyHeadConfirm = function (props) {
    listMultiOperator(props, list.pageCode, list.tableCode, list.primaryId, `${baseReqUrl}${javaUrl.tally}.do`, this.state.json['36340FDSR-000001'], list.listCache,null,null,buttonDisabled.bind(this));/* 国际化处理：记账成功*/
};

//取消确认
const unTallyHeadConfirm = function (props) {
    listMultiOperator(props, list.pageCode, list.tableCode, list.primaryId, `${baseReqUrl}${javaUrl.untally}.do`, this.state.json['36340FDSR-000010'], list.listCache,null,null,buttonDisabled.bind(this));/* 国际化处理： 取消记账成功*/
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
    elecSignListPrint(props, {
        url: `${baseReqUrl}${javaUrl.officeprint}.do`,
        offical,
        appCode: appCode,
        nodeKey: nodekey,
        tableCode: list.tableCode,
        field_id: list.primaryId,
        field_billno: 'vbillcode',
        validateFunc: (selectData) => {
            // let billstatus = selectData && selectData.data && selectData.data.values && selectData.data.values[cons.field.billstatus] && selectData.data.values[cons.field.billstatus].value;
            // if (cons.state.billstate.payok != billstatus) {
            //     return loadMultiLang(props, '36300DC-000008')/** 单据状态非转账成功！ */;
            // }
            // return null;
        }
    })
}

export function buttonDisabled() {
    let selected = this.props.table.getCheckedRows(this.tableId);
    let btnArray = [
        // BTN_GROUP,
        // ADD_BTN,
        COPY_BTN,
        EDIT_BTN,
        DELETE_BTN,
        TALLY_BTN,
        UNTALLY_BTN,
        // LINK,
        LINK_GROUP,
        DEPOSITBILL,
        DEPOSIT_RATE,
        AIACT_RATE,
        QUERYVOUCHER_BTN,
        PRINT,
        PREVIEW_BTN,
        PRINT_GROUP,
        OFFICIALPRINT,
        ELECSIGNINPREVIEW,
        PRINTLIST,
        OUTPUT_BTN];
    let btnObj = {};
    for (let item of btnArray) {
        btnObj[item] = !selected.length;
    }
    if (selected.length) {

        let billstate;
        //处理选择数据
        selected.forEach((val) => {
            billstate = val.data.values.billstate.value;
        });
        //判断是否是未记账状态，如果是则设置取消按钮按钮不可用
        if (billstate == '1') {
            btnObj[UNTALLY_BTN] = true;
        } else {
            btnObj[TALLY_BTN] = true;
        }

        if (selected.length > 1) {

            //设置部分按钮不可用
            // btnObj[DEPOSITBILL] = true;
            // btnObj[QUERYVOUCHER_BTN] = true;
            // btnObj[DEPOSIT_RATE] = true;
            // btnObj[AIACT_RATE] = true;

        }
    }
    this.props.button.setButtonDisabled(btnObj);
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
function fileMgr(props, selectDatas) {
    let billNo = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['applycode'] && selectDatas[0].data.values['applycode'].value;
    let billId = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
    this.showUploader = !this.showUploader;
    this.billInfo = { billId, billNo };
    this.forceUpdate();
}

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/