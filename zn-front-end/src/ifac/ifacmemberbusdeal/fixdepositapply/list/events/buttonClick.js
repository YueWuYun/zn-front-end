/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output, promptBox } from 'nc-lightapp-front';
import { card, printData, baseReqUrl, javaUrl, list } from '../../cons/constant.js';
import { bodyBtnOperation } from './bodyButtonClick';
import { searchBtnClick } from './search';
import { interestBill } from '../../util/util';
import { COMMON_BTN } from '../../cons/constant';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
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
    PRINT,
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
        // toast({ color: 'warning', content: this.state.json['36340FDSA-000021'] });/* 国际化处理： 请选中单条数据进行操作!*/
        // return;
    }
    let pks = selectDatas && selectDatas.map(item => item.data.values && item.data.values[this.primaryId] && item.data.values[this.primaryId].value);
    let tss = selectDatas && selectDatas.map(item => item.data.values && item.data.values.ts && item.data.values.ts.value);
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
            go2CardCheck({
                url:`${baseReqUrl}`+'listtocardcheck.do',
                pk: pks[0],
                ts: tss[0],
                checkTS: tss[0] ? true : false,
                checkSaga:false,
                fieldPK: list.primaryId,
                go2CardFunc: () =>{
                    this.props.pushTo("/card", {
                        status: "copy",
                        id: pks[0],
                        pagecode: card.pageCode
                    });
                }
            })  
            
            break;
        //头部  修改
        case EDIT_BTN:
            // if (selectDatas.length && selectDatas.length != 1) {
            //     // 修改只能选择一条数据修改
            //     toast({ color: "warning", content: this.state.json['36340FDSA-000021'] });/* 国际化处理： 请选择数据！*/
            //     return;
            // }
            go2CardCheck({
                url:`${baseReqUrl}`+'listtocardcheck.do',
                pk: pks[0],
                ts: tss[0],
                checkTS: tss[0] ? true : false,
                checkSaga:false,
                fieldPK: list.primaryId,
                go2CardFunc: () =>{
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
                title: this.state.json['36340FDSA-000005'],/* 国际化处理： 删除*/
                content: pks.length > 1 ? this.state.json['36340FDSA-000022'] : this.state.json['36340FDSA-000006'],/* 国际化处理： 确定要删除所选数据吗?,确定要删除吗?*/
                beSureBtnClick: bodyBtnOperation.bind(this, selectDatas, javaUrl.delete, null, true, null, this.state.json['36340FDSA-000005'])  /* 国际化处理： 删除*/
            });
            break;
        //头部 提交
        case SUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.commit, this.state.json['36340FDSA-000001'], pks.length > 1, null, this.state.json['36340FDSA-000023']);/* 国际化处理： 提交成功!,提交,提交*/
            // listMultiOperator(props, list.pageCode, list.tableCode, list.primaryId, `${baseReqUrl}${javaUrl.commit}.do`, loadMultiLang(this.props, '36340FDSR-000017'), list.listCache, true, null, (props, data) => {
            //     if (!data) {
            //         return;
            //     }   
            //     if (Array.isArray(data)) {
            //         data = data[0];
            //     }
            //     let { workflow } = data;
            //     //有指派信息，则指派，没有则重绘界面
            //     if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
            //         this.setState({
            //             assignData: data,
            //             assignShow: data,
            //             index: selectDatas[0].index,
            //             ts:  selectDatas[0].data.values['ts'].value,
            //             billID:  selectDatas[0].data.values['pk_fixdepositapply'].value
            //         });
            //     }else{
            //         buttonDisabled.call(this, this.props);
            //     }
            // });
            break;
        //头部 收回
        case UNSUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.uncommit, this.state.json['36340FDSA-000010'], true, null, this.state.json['36340FDSA-000024']);/* 国际化处理： 收回成功!,收回,收回*/
            break;
        //头部 委托办理
        case ENTRUST_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.entrust, this.state.json['36340FDSA-000028'], pks.length > 1, null, this.state.json['36340FDSA-000030']);/* 国际化处理： 提交成功!,提交,提交*/
            break;
        //头部 取消委托
        case UNENTRUST_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.unentrust, this.state.json['36340FDSA-000029'], true, null, this.state.json['36340FDSA-000031']);/* 国际化处理： 收回成功!,收回,收回*/
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
            
        //头部 附件
        case ENCLOSURE_BTN:
            fileMgr.call(this, props, selectDatas);
            break;
        //头部 审批详情
        case APPROVALOPINION_BTN:
            this.billInfo = { billId: pks[0] };
            this.setState({ showApproveDetail: true });
            break;
        //联查存入申请
        case QUERYAPPLY_BTN:
            interestBill.call(this, pks[0]);
            break;
        //联查凭证
        case QUERYVOUCHER_BTN:
            //interestBill.call(this, pks[0]);
            let pkVoucher = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
            let pk_group = selectDatas[0].data.values['pk_group'].value;
            let pk_org = selectDatas[0].data.values['pk_org'].value;
            let billno = selectDatas[0].data.values['vbillcode'].value;
            let pk_billtype = selectDatas[0].data.values['pk_billtypeid'].value;
            linkVoucherApp(props, pkVoucher, pk_group, pk_org, pk_billtype, billno);
            break;

        //头部 联查--结算账户余额    
        case SETTLEINACCBALACTION_BTN:
            if (selectDatas.length != 1) {
                toast({ color: 'warning', content: loadMultiLang(props, '36340FDSA-000021') });/* 国际化处理： 请选中单条数据进行操作!*/
                return;
            }
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

        //头部 生成资金上收单
        case 'toDelivery':
            
            let sourceid = pks[0];//来源主键
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
        PRINT,
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
        //判断是否是待提交状态，如果是则设置收回按钮不可用
        if (billstate == '1') {
            btnObj[UNSUBMIT_BTN] = true;
            btnObj[ENTRUST_BTN] = true;
            btnObj[UNENTRUST_BTN] = true;
        }else if(billstate == '2'){
            btnObj[SUBMIT_BTN] = true;
            btnObj[ENTRUST_BTN] = true;
            btnObj[UNENTRUST_BTN] = true;
            btnObj[DELETE_BTN] = true;
        }else if(billstate == '3'){
            btnObj[UNENTRUST_BTN] = true;
            //btnObj[UNSUBMIT_BTN] = true;
            btnObj[SUBMIT_BTN] = true;
            btnObj[DELETE_BTN] = true;
        }else if(billstate == '4'){
            btnObj[ENTRUST_BTN] = true;
            btnObj[UNSUBMIT_BTN] = true;
            btnObj[SUBMIT_BTN] = true;
            btnObj[DELETE_BTN] = true;
        }

        if (selected.length > 1) {
            //设置部分按钮不可用
            // btnObj[CURRENT_RATE] = true;
            // btnObj[PERIODIC_RATE] = true;
            btnObj[SETTLEINACCBALACTION_BTN] = true;
            btnObj[QUERYAPPLY_BTN] = true;
            btnObj[QUERYVOUCHER_BTN] = true;
            //btnObj[PREVIEW_BTN] = true;
        }
    }
    if(this.props.getUrlParam("scene") == 'fip' || this.props.getUrlParam("scene") == 'linksce'){
		this.props.button.setButtonVisible([
			ADD_BTN,
            COPY_BTN,
            DELETE_BTN,
            EDIT_BTN,
            SUBMIT_BTN,
            SUBMIT_GROUP,
            UNSUBMIT_BTN,
            ENTRUST_BTN,
            ENTRUST_GROUP,
            UNENTRUST_BTN],false);
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

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/