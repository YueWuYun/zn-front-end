/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, toast, print, output, promptBox } from 'nc-lightapp-front';
import { card, printData, baseReqUrl, javaUrl } from '../../cons/constant.js';
import { bodyBtnOperation } from './bodyButtonClick';
import { searchBtnClick } from './search';
import { interestBill } from '../../util/util';
import { COMMON_BTN,BTN_AREA } from '../../../../public/cons/constant';
import { linkContract } from '../../../public/listHeadBtnClick';
import { refreshBtnClick } from './refresh';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
const {
    BTN_GROUP,
    ADD_BTN,
    COPY_BTN,
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
    if ([APPROVALOPINION_BTN,DEBITCONTRACT_BTN,CONTRACT_BTN, 'Loan', ENCLOSURE_BTN].includes(id) && selectDatas.length>1) {
        toast({ color: 'warning', content: this.state.json['36362IDA-000021'] });/* 国际化处理： 请选中单条数据进行操作!*/
        return;
    }
    let pks= selectDatas && selectDatas.map(item => item.data.values && item.data.values[this.primaryId] && item.data.values[this.primaryId].value);
    switch (id) {
        //头部 新增
        case ADD_BTN:
                let adddata = {pk: null};
                ajax({
                    url: `${baseReqUrl}${javaUrl.addpermission}.do`,
                    data: adddata,
                    success: (res) => {
                        if (res.success) {
                            props.pushTo('/card', {
                                status: 'add',
                                pagecode: card.pageCode
                            });
                        }
                    }
                });
           
            break;
        case COPY_BTN:
            if(selectDatas.length && selectDatas.length != 1){
                // 复制只能选择一条数据复制
                toast({ color: "warning", content: this.state.json['3636PUBLIC-000046'] });/* 国际化处理： 请选择数据！*/
                return;
            }
            this.props.pushTo("/card", {
                status: "copy",
                id: pks[0],
                pagecode: card.pageCode
            });
            break;
        //头部 删除
        case DELETE_BTN:
            promptBox({
                color: "warning",
                title: this.state.json['36362IDA-000005'],/* 国际化处理： 删除*/
                content: pks.length>1 ? this.state.json['36362IDA-000022'] : this.state.json['36362IDA-000006'],/* 国际化处理： 确定要删除所选数据吗?,确定要删除吗?*/
                beSureBtnClick: bodyBtnOperation.bind(this, selectDatas, javaUrl.delete, null, true, null, this.state.json['36362IDA-000005'])  /* 国际化处理： 删除*/
            });
            break;
        //头部 提交
        case SUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.commit, null, pks.length>1, null, this.state.json['36362IDA-000023']);/* 国际化处理： 提交成功!,提交,提交*/
            break;
        //头部 收回
        case UNSUBMIT_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.uncommit, null, true, null, this.state.json['36362IDA-000024']);/* 国际化处理： 收回成功!,收回,收回*/
            break;
             //头部 委托办理
        case ENTRUST_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.entrust, null, pks.length>1, null, this.state.json['36362IDA-000030']);/* 国际化处理： 提交成功!,提交,提交*/
        break;
        //头部 取消委托
        case UNENTRUST_BTN:
            bodyBtnOperation.call(this, selectDatas, javaUrl.unentrust, null, true, null, this.state.json['36362IDA-000031']);/* 国际化处理： 收回成功!,收回,收回*/
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
            this.billInfo= {billId: pks[0]};
            this.setState({showApproveDetail: true});
            break;
        //头部 联查--借款合同 /nccloud/resources/icdmc/icdmc/innerdebitcontract/main/index.html#/card
        case DEBITCONTRACT_BTN: 
            let pk_debitapply = selectDatas[0] && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
            props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                id: pk_debitapply,
                status: "browse",
                appcode: "36362IDC",
                pagecode: "36362IDC_C01",
                pageType: 'apply',
                scene: "linksce"
            });
            break;
        case CONTRACT_BTN:
            // let srcpk = selectDatas[0] && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
            linkContract.call(this, props, pks[0]);
            // linkFinancepay.call(this, props, srcpk);
            break;
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

export function buttonDisabled () {
    let selected= this.props.table.getCheckedRows(this.tableId);
    let btnArray= [
        // BTN_GROUP,
        // ADD_BTN,
        COPY_BTN,
        DELETE_BTN,
        SUBMIT_BTN,
        SUBMIT_GROUP,
        UNSUBMIT_BTN,
        ENTRUST_BTN,
        ENTRUST_GROUP,
        UNENTRUST_BTN,
        ENCLOSURE_BTN,
        // LINK,
        // LINK_GROUP,
        APPROVALOPINION_BTN,
        DEBITCONTRACT_BTN,
        CONTRACT_BTN,
        PRINT_BTN,
        PRINT_GROUP,
        OUTPUT_BTN];
    let btnObj= {};
    for (let item of btnArray) {
        btnObj[item]= !selected.length;
    }
    if (selected.length) {
        let vbillstatus= selected[0] && selected[0].data && selected[0].data.values.vbillstatus.value; 
        let busistatus= selected[0] && selected[0].data && selected[0].data.values.busistatus.value; 
        if (selected.length === 1) {
            btnObj[DELETE_BTN]= vbillstatus !== '-1';
            btnObj[SUBMIT_BTN]= !['-1', '0'].includes(vbillstatus);
            btnObj[UNSUBMIT_BTN]= !['1','3'].includes(busistatus);
            btnObj[ENTRUST_BTN]= !(vbillstatus == '1' && busistatus == '1');
            btnObj[UNENTRUST_BTN]=  !(vbillstatus == '1' && busistatus == '2');
        }
        // btnObj.Interestbills= busistatus!== '3';
        // btnObj.Loan= selected.length>1;
        btnObj[APPROVALOPINION_BTN]= vbillstatus === '-1';
        btnObj[CONTRACT_BTN]= (vbillstatus !== '1' && !busistatus !== '1' );
        btnObj[DEBITCONTRACT_BTN]= (vbillstatus !== '1' && !busistatus !== '0' );
    }
    this.props.button.setButtonDisabled(btnObj);
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
function fileMgr (props, selectDatas) {
    let billNo = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['applycode'] && selectDatas[0].data.values['applycode'].value;
    let billId = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value;
    this.showUploader= !this.showUploader;
    this.billInfo= {billId, billNo};
    this.forceUpdate();
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/