/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output, promptBox } from 'nc-lightapp-front';
import { card, printData, baseReqUrl, javaUrl, list } from '../../cons/constant.js';
import { bodyBtnOperation } from './bodyButtonClick';
import { searchBtnClick } from './search';
import { interestBill } from '../../util/util';
import { COMMON_BTN } from '../../cons/constant';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { listMultiOperator } from '../../../../ifactimedepositmanage/fixeddatewithdraw/busbutton/listOperation';

// import { linkContract } from '../../../public/listHeadBtnClick';
import { refreshBtnClick } from './refresh';
const {
    BTN_GROUP,
    ADD_BTN,
    COPY_BTN,
    DELETE_BTN,
    EDIT_BTN,
    SUBMIT_BTN,
    SUBMIT_GROUP,
    UNSUBMIT_BTN,
    BACK_BTN,
    ENTRUST_BTN,
    ENTRUST_GROUP,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    LINK,
    LINK_GROUP,
    CURRENT_RATE,
    PERIODIC_RATE,
    PREVIEW_BTN,
    APPROVALOPINION_BTN,//审批详情
    SETTLEINACCBALACTION_BTN, // 结算账户余额
    QUERYAPPLY_BTN,// 存入申请
    QUERYVOUCHER_BTN, // 联查凭证
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
    // if ([APPROVALOPINION_BTN, DEBITCONTRACT_BTN, CONTRACT_BTN, 'Loan', ENCLOSURE_BTN].includes(id) && selectDatas.length > 1) {
    //     toast({ color: 'warning', content: this.state.json['36340FDR-000021'] });/* 国际化处理： 请选中单条数据进行操作!*/
    //     return;
    // }
    let pks = selectDatas && selectDatas.map(item => item.data.values && item.data.values[this.primaryId] && item.data.values[this.primaryId].value);
    switch (id) {
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
                toast({ color: "warning", content: this.state.json['36340FDR-000021'] });/* 国际化处理： 请选择数据！*/
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
                pk: selectDatas[0].data.values.pk_deposit.value,
                ts: selectDatas[0].data.values.ts.value,
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
                title: this.state.json['36340FDR-000005'],/* 国际化处理： 删除*/
                content: pks.length > 1 ? this.state.json['36340FDR-000022'] : this.state.json['36340FDR-000006'],/* 国际化处理： 确定要删除所选数据吗?,确定要删除吗?*/
                beSureBtnClick: delBill.bind(this, props)//bodyBtnOperation.bind(this, selectDatas, javaUrl.delete, null, true, null, this.state.json['36340FDR-000005'])  /* 国际化处理： 删除*/
            });
            break;
        //头部 提交
        case SUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.commit, this.state.json['36340FDR-000001'], pks.length > 1, null, this.state.json['36340FDR-000023']);/* 国际化处理： 提交成功!,提交,提交*/
            break;
        //头部 收回
        case UNSUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.uncommit, this.state.json['36340FDR-000010'], true, null, this.state.json['36340FDR-000024']);/* 国际化处理： 收回成功!,收回,收回*/
            break;
        //头部 退回
        case BACK_BTN:
            this.setState({ showModal: true });
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
        //头部 联查存入申请 
        case QUERYAPPLY_BTN:
            let pk_srcbill = selectDatas[0].data.values.pk_srcbill.value;
            props.openTo('/ifac/ifacmemberbusdeal/fixdepositapply/main/index.html#/card', {
                srcFunCode: '36340FDR',
                appcode: '36340FDSA',
                pagecode: '36340FDSA_C01',
                status: 'browse',
                islinkquery: true,
                id: pk_srcbill,
                scene: "linksce"
            });
            break;
        //联查凭证
        case QUERYVOUCHER_BTN:
            //interestBill.call(this, pks[0]);
            let pkVoucher = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
            let pk_group = selectDatas[0].data.values['pk_group'].value;
            let pk_org = selectDatas[0].data.values['pk_org'].value;
            let billno = selectDatas[0].data.values['vbillcode'].value;
            let pk_billtype = '36L1';
            linkVoucherApp(props, pkVoucher, pk_group, pk_org, pk_billtype, billno);
            break;

        //头部 联查--结算账户余额    
        case SETTLEINACCBALACTION_BTN:
            // if (selectDatas.length != 1) {
            //     toast({ color: 'warning', content: loadMultiLang(props, '36340FDR-000021') });/* 国际化处理： 请选中单条数据进行操作!*/
            //     return;
            // }
            let pk_settleacc;
            pk_settleacc = selectDatas[0].data.values.pk_settleacc.value;
            this.setState({
                currentpk: pk_settleacc,
                accModalShow: true,
            });
            break;

        //头部 刷新
        case REFRESH_BTN:
            refreshBtnClick.call(this, props);
            break;
        default:
            break;
    }
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
        BACK_BTN,
        ENTRUST_BTN,
        ENTRUST_GROUP,
        UNENTRUST_BTN,
        ENCLOSURE_BTN,
        //LINK,
        LINK_GROUP,
        CURRENT_RATE,
        PERIODIC_RATE,
        PREVIEW_BTN,
        APPROVALOPINION_BTN,//审批详情
        SETTLEINACCBALACTION_BTN, // 结算账户余额
        QUERYAPPLY_BTN,// 存入申请
        QUERYVOUCHER_BTN, // 联查凭证
        DEBITCONTRACT_BTN,
        CONTRACT_BTN,
        PRINT_BTN,
        PRINT_GROUP,
        OUTPUT_BTN];
    let btnObj = {};

    let type = this.props.getUrlParam('type');
    let scene = this.props.getUrlParam('scene');
    if ((type && type == 'interlist') || (scene && (scene == 'linksce' || scene == 'fip'))) {
        this.props.button.setButtonVisible(['Refresh'], false);
        this.props.button.setButtonVisible(['Add'], false);
        this.props.button.setButtonVisible([COPY_BTN], false);
        this.props.button.setButtonVisible([DELETE_BTN], false);
        this.props.button.setButtonVisible([SUBMIT_BTN], false);
        this.props.button.setButtonVisible([UNSUBMIT_BTN], false);
        this.props.button.setButtonVisible([BACK_BTN], false);
    }

    for (let item of btnArray) {
        btnObj[item] = !selected.length;
    }
    if (selected.length) {

        let vbillstate;
        let srcbillcode;
        let num = 0;
        let sum = 0;
        //处理选择数据
        selected.forEach((val) => {
            vbillstate = val.data.values.vbillstate.value;
            srcbillcode = val.data.values.srcbillcode.value;
            if (vbillstate == '1' && srcbillcode == null) {
                num++;
            }
            if (vbillstate == '1' && srcbillcode) {
                sum++;
            }
        });
        //判断是否是待提交状态，如果是则设置收回按钮不可用
        if (vbillstate == '1') {
            btnObj[UNSUBMIT_BTN] = true;
        } else if (vbillstate == '2' || vbillstate == '3') {
            btnObj[SUBMIT_BTN] = true;
            btnObj[BACK_BTN] = true;
        } else {
            //btnObj[BACK_BTN] = true;
            btnObj[UNSUBMIT_BTN] = true;
            btnObj[SUBMIT_BTN] = true;
        }
        if (srcbillcode == null) {
            btnObj[QUERYAPPLY_BTN] = true;
            btnObj[BACK_BTN] = true;
        }
        if (selected.length > 1) {
            if (num > 0 && sum > 0) {
                btnObj[BACK_BTN] = false;
            }
            //设置部分按钮不可用
            // btnObj[CURRENT_RATE] = true;
            // btnObj[PERIODIC_RATE] = true;
            // btnObj[SETTLEINACCBALACTION_BTN] = true;
            // btnObj[QUERYAPPLY_BTN] = true;
            // btnObj[QUERYVOUCHER_BTN] = true;
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
    let billNo = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillcode'] && selectDatas[0].data.values['vbillcode'].value;
    let billId = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
    this.showUploader = !this.showUploader;
    this.billInfo = { billId, billNo };
    this.forceUpdate();
}
/**
 * 删除数据
 */
const delBill = function (props, record) {
    listMultiOperator(
        props,
        list.pageCode,
        list.tableCode,
        list.primaryId,
        `${baseReqUrl}${javaUrl.delete}.do`,
        this.state.json['36340FDR-000005'],
        list.listCache);/* 国际化处理： 删除*/
    buttonDisabled.call(this, this.props);
}
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/