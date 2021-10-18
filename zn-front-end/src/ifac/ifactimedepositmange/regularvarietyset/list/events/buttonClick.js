/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output, promptBox } from 'nc-lightapp-front';
import { card, printData, baseReqUrl, javaUrl ,list} from '../../cons/constant.js';
import { bodyBtnOperation } from './bodyButtonClick';
import { searchBtnClick } from './search';
import { interestBill } from '../../util/util';
import { COMMON_BTN, BTN_AREA } from '../../../../public/cons/constant';
// import { linkContract } from '../../../public/listHeadBtnClick';
import { refreshBtnClick } from './refresh';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { listMultiOperator } from '../../../../pub/utils/IFACButtonUtil';
const {
    BTN_GROUP,
    ADD_BTN,
    COPY_BTN,
    DELETE_BTN,
    EDIT_BTN,
    SUBMIT_BTN,
    SUBMIT_GROUP,
    UNSUBMIT_BTN,
    ENTRUST_BTN,
    ENTRUST_GROUP,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    LINK,
    LINK_GROUP,
    CURRENT_RATE,
    PERIODIC_RATE,
    PREVIEW_BTN,
    APPROVALOPINION_BTN,
    DEBITCONTRACT_BTN,
    CONTRACT_BTN,
    PRINT_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
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
    if ([APPROVALOPINION_BTN, DEBITCONTRACT_BTN, CONTRACT_BTN, 'Loan', ENCLOSURE_BTN].includes(id) && selectDatas.length > 1) {
        toast({ color: 'warning', content: this.state.json['36340DV-000021'] });/* 国际化处理： 请选中单条数据进行操作!*/
        return;
    }
    let pks = selectDatas && selectDatas.map(item => item.data.values && item.data.values[this.primaryId] && item.data.values[this.primaryId].value);
    switch (id) {
        //联查活期利率 
        case CURRENT_RATE:
            let link_rateData = props.table.getCheckedRows(this.tableId);
            let pk_aiacrate = link_rateData[0].data.values.pk_aiacrate.value;
            // if (link_rateData.length != 1) {
            //     toast({
            //         color: 'warning',
            //         content: this.state.json['36340DV-000021']/* 国际化处理： 请选中单条数据进行操作*/
            //     });
            //     return;
            // }
            // link_rateData.forEach((val) => {
            //     if (val.data.values.pk_aiacrate && val.data.values.pk_aiacrate.value) {
            //         pk_aiacrate = val.data.values.pk_aiacrate .value;
            //     }
            // });

            if(!pk_aiacrate){
                toast({color:"warning",content:this.state.json['36340DV-000038']})/* 国际化处理： 暂无数据*/
                break;
            }

            ajax({
                url: '/nccloud/tmpub/tmbd/linkinterest.do', //`${baseReqUrl}${javaUrl.linkcurrentrate}.do`
                data: {
                    pk: pk_aiacrate
                },
                success: (res) => {
                    let linkpath,appcode,pagecode;
                    if(res.data.rateclass=='2'){
                        linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                        appcode = '36010IRC',
                        pagecode = '36010IRC_card'
                    }else if(res.data.rateclass=='1'){
                        linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                        appcode = '36010IRCG',
                        pagecode = '36010IRCG_card'
                    }else if(res.data.rateclass=='0'){
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
                        id:pk_aiacrate
                    });
                }
            });
            break;
            //联查定期利率 
        case PERIODIC_RATE:
                link_rateData = props.table.getCheckedRows(this.tableId);
                let pk_depositrate = link_rateData[0].data.values.pk_depositrate.value;
                // if (link_rateData.length != 1) {
                //     toast({
                //         color: 'warning',
                //         content: this.state.json['36340DV-000021']/* 国际化处理： 请选中单条数据进行操作*/
                //     });
                //     return;
                // }
                // link_rateData.forEach((val) => {
                //     if (val.data.values.pk_depositrate && val.data.values.pk_depositrate.value) {
                //         pk_depositrate = val.data.values.pk_depositrate .value;
                //     }
                // });
    
                if(!pk_depositrate){
                    toast({color:"warning",content:this.state.json['36340DV-000038']})/* 国际化处理： 暂无数据*/
                    break;
                }
    
                ajax({
                    url: '/nccloud/tmpub/tmbd/linkinterest.do', //`${baseReqUrl}${javaUrl.linkcurrentrate}.do`
                    data: {
                        pk: pk_depositrate
                    },
                    success: (res) => {
                        let linkpath,appcode,pagecode;
                        if(res.data.rateclass=='2'){
                            linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                            appcode = '36010IRC',
                            pagecode = '36010IRC_card'
                        }else if(res.data.rateclass=='1'){
                            linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                            appcode = '36010IRCG',
                            pagecode = '36010IRCG_card'
                        }else if(res.data.rateclass=='0'){
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
                            id:pk_depositrate
                        });
                    }
                });
                break;
           
        //头部 新增
        case ADD_BTN:
            props.pushTo('/card', {
                status: 'add',
                pagecode: card.pageCode
            });
            // let adddata = {pk: null};
            // ajax({
            //     url: `${baseReqUrl}${javaUrl.addpermission}.do`,
            //     data: adddata,
            //     success: (res) => {
            //         if (res.success) {
            //             props.pushTo('/card', {
            //                 status: 'add',
            //                 pagecode: card.pageCode
            //             });
            //         }
            //     }
            // });

            break;

        // 头部 复制
        case COPY_BTN:
            // if (selectDatas.length && selectDatas.length != 1) {
            //     // 复制只能选择一条数据复制
            //     toast({ color: "warning", content: this.state.json['3636PUBLIC-000046'] });/* 国际化处理： 请选择数据！*/
            //     return;
            // }
            this.props.pushTo("/card", {
                status: "copy",
                id: pks[0],
                pagecode: card.pageCode
            });
            break;
        //头部  修改
        case EDIT_BTN:
            if (selectDatas.length && selectDatas.length != 1) {
                // 修改只能选择一条数据修改
                toast({ color: "warning", content: this.state.json['36340DV-000021'] });/* 国际化处理： 请选择数据！*/
                return;
            }
            // this.props.pushTo("/card", {
            //     status: "edit",
            //     id: pks[0],
            //     pagecode: card.pageCode
            // });
            go2CardCheck({
                props: this.props,
                url: `${baseReqUrl}${javaUrl.check2card}.do`,
                pk: selectDatas[0].data.values.pk_varieties.value,
                ts:selectDatas[0].data.values.ts.value,
                checkTS: selectDatas[0].data.values.ts.value ? true : false,
                checkSaga: false,
                fieldPK: card.primaryId,
                go2CardFunc: () => {
                    this.props.pushTo("/card", {
                        status: "edit",
                        id: pks[0],
                        pagecode: card.pageCode
                    });
                }
            })

            break;

        //头部 删除
        case DELETE_BTN:
            promptBox({
                color: "warning",
                title: this.state.json['36340DV-000005'],/* 国际化处理： 删除*/
                content: pks.length > 1 ? this.state.json['36340DV-000022'] : this.state.json['36340DV-000006'],/* 国际化处理： 确定要删除所选数据吗?,确定要删除吗?*/
                beSureBtnClick:bodyBtnOperation.bind(this, selectDatas, javaUrl.delete, null, true, null, this.state.json['36340DV-000005'])  /* 国际化处理： 删除*/
            });
            break;
        //头部 提交
        case SUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.commit, this.state.json['36340DV-000001'], pks.length > 1, null, this.state.json['36340DV-000023']);/* 国际化处理： 提交成功!,提交,提交*/
            break;
        //头部 收回
        case UNSUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.uncommit, this.state.json['36340DV-000010'], true, null, this.state.json['36340DV-000024']);/* 国际化处理： 收回成功!,收回,收回*/
            break;
        //头部 委托办理
        case ENTRUST_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.entrust, this.state.json['36340DV-000028'], pks.length > 1, null, this.state.json['36340DV-000030']);/* 国际化处理： 提交成功!,提交,提交*/
            break;
        //头部 取消委托
        case UNENTRUST_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.unentrust, this.state.json['36340DV-000029'], true, null, this.state.json['36340DV-000031']);/* 国际化处理： 收回成功!,收回,收回*/
            break;
        //头部 打印
        case PRINT_BTN:
            print(
                'pdf',
                `${baseReqUrl}${javaUrl.print}.do`,
                {
                    ...printData,
                    oids: pks
                }
            );
            break;
        //打印  下拉打印
        case PRINT_GROUP:
            print(
                'pdf',
                `${baseReqUrl}${javaUrl.print}.do`,
                {
                    ...printData,
                    oids: pks
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
        //头部 附件
        case ENCLOSURE_BTN:
            fileMgr.call(this, props, selectDatas);
            break;
        //头部 审批详情
        case APPROVALOPINION_BTN:
            this.billInfo = { billId: pks[0] };
            this.setState({ showApproveDetail: true });
            break;
        //头部 联查--借款合同 /nccloud/resources/icdmc/icdmc/innerdebitcontract/main/index.html#/card
        case DEBITCONTRACT_BTN:
            let pk_debitapply = selectDatas[0] && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
            props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                id: pk_debitapply,
                status: "browse",
                appcode: "36362IDC",
                pagecode: "36362IDC_C01",
                pageType: 'apply',
                scene: "linksce"
            });
            break;
        // case CONTRACT_BTN:
        // let srcpk = selectDatas[0] && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
        // linkContract.call(this, props, pks[0]);
        // linkFinancepay.call(this, props, srcpk);
        // break;
        //头部 联查--贷款利息清单    
        case 'Interestbills':
            interestBill.call(this, pks[0]);
            break;
        //头部 刷新
        case REFRESH_BTN:
            refreshBtnClick.call(this, props);
            break;
        default:
            break;
    }
}
/**
 * 删除数据
 */
const delBill = function (props,record) {
    listMultiOperator(props, list.pageCode, list.tableCode, list.primaryId, `${baseReqUrl}${javaUrl.delete}.do`, this.state.json['36340DV-000005'], list.listCache,null,null,buttonDisabled.bind(this));/* 国际化处理：记账成功*/
}
export function buttonDisabled() {
    let selected = this.props.table.getCheckedRows(this.tableId);
    let btnArray = [
        // BTN_GROUP,
        // ADD_BTN,
        COPY_BTN,
        EDIT_BTN,
        DELETE_BTN,
        SUBMIT_BTN,
        SUBMIT_GROUP,
        UNSUBMIT_BTN,
        ENTRUST_BTN,
        ENTRUST_GROUP,
        UNENTRUST_BTN,
        ENCLOSURE_BTN,
        CURRENT_RATE,
        PERIODIC_RATE,
        PREVIEW_BTN,
        APPROVALOPINION_BTN,
        DEBITCONTRACT_BTN,
        CONTRACT_BTN,
        PRINT_BTN,
        PRINT_GROUP,
        OUTPUT_BTN];
    let btnObj = {};
    for (let item of btnArray) {
        btnObj[item] = !selected.length;
    }
    if (selected.length) {
        if (selected.length > 1) {

            //设置部分按钮不可用
            // btnObj[CURRENT_RATE] = true;
            // btnObj[PERIODIC_RATE] = true;
            //btnObj[PREVIEW_BTN] = true;

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