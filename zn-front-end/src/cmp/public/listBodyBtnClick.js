/*3qjakgBz8U307oLILQl1l5q3VlnNwbP/i+zbbHLzo+ptD+uUcHmoqF/znntfsoAE*/
/**
 * 贷款管理列表表体按钮事件
 * @author：zhangyangz
 */
import { ajax, toast } from "nc-lightapp-front";
import { bodyBtnOperation } from "./listEvent";
/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 * @param {*} index   index
 */
export function bodyButtonClick(key, record, index) {
    let pk = record[this.primaryId] && record[this.primaryId].value;
    switch (key) {
        case "edit_inner": //修改
            this.props.pushTo("/card", {
                status: "edit",
                id: record[this.primaryId].value,
                pagecode: this.pageCode
            });
            break;
        case "del_inner": //删除
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000017'],/* 国际化处理： 删除：*/
                record,
                this.listDelUrl,
                this.state.json['36630PUBLIC-000018'],/* 国际化处理： 删除成功!*/
                index
            );
            break;
        case "commit_inner": //提交
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000011'],/* 国际化处理： 提交：*/
                record,
                this.listCommitUrl,
                this.state.json['36630PUBLIC-000012'],/* 国际化处理： 提交成功!*/
                index
            );
            break;
        case "uncommit_inner": //收回
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000039'],/* 国际化处理： 收回：*/
                record,
                this.listUnCommitUrl,
                this.state.json['36630PUBLIC-000040'],/* 国际化处理： 收回成功!*/
                index
            );
            break;
        case "approvalDetail_inner": //审批详情
            this.setState({
                showApproveDetail: true,
                billInfo: { billId: pk }
            });
            break;
        case "change_inner": //变更
            this.props.pushTo("/card", {
                status: "change",
                id: record[this.primaryId].value,
                pagecode: this.pageCode
            });
            break;
        case "viewVersion_inner": //历史版本
            this.props.pushTo("/card", {
                status: "browse",
                pageType: "version",
                id: record[this.primaryId].value,
                pagecode: this.pageCode
            });
            break;
        case "delete_version": //删除版本
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000041'],/* 国际化处理： 删除版本：*/
                record,
                this.delVersionUrl,
                this.state.json['36630PUBLIC-000042'],/* 国际化处理： 删除版本成功!*/
                index
            );
            break;
        case "accreditation_inner": //制证
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000025'],/* 国际化处理： 制证：*/
                record,
                this.vouchermakeUrl,
                this.state.json['36630PUBLIC-000026'],/* 国际化处理： 制证成功!*/
                index
            );
            break;
        case "unAccreditation_inner": //取消制证
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000027'],/* 国际化处理： 取消制证：*/
                record,
                this.vouchercancelUrl,
                this.state.json['36630PUBLIC-000028'],/* 国际化处理： 取消制证成功!*/
                index
            );
            break;
        case "calcIntst_inner": //计息
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000029'],/* 国际化处理： 计息：*/
                record,
                this.calcIntstUrl,
                this.state.json['36630PUBLIC-000030'],/* 国际化处理： 计息成功!*/
                index
            );
            break;
        case "cancelIntst_inner": //取消计息
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000031'],/* 国际化处理： 取消计息：*/
                record,
                this.cancelIntstUrl,
                this.state.json['36630PUBLIC-000032'],/* 国际化处理： 取消计息成功!*/
                index
            );
            break;
        case "preGetIntst_inner": //预提
            this.setState({
                modalInfo: {
                    record,
                    index
                },
                showWithholdingModal: true
            });
            break;
        case "cancelGetIntst_inner": //取消预提
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000043'],/* 国际化处理： 取消预提：*/
                record,
                this.cancelGetIntstUrl,
                this.state.json['36630PUBLIC-000044'],/* 国际化处理： 取消预提成功!*/
                index
            );
            break;
        case "tryCal_inner": //试算
            this.setState({
                modalInfo: {
                    record,
                    index
                },
                showInterestTrialModal: true
            });
            break;
        case "termination_inner": //终止
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000019'],/* 国际化处理： 终止：*/
                record,
                this.terminationUrl,
                this.state.json['36630PUBLIC-000020'],/* 国际化处理： 终止成功!*/
                index
            );
            break;
        case "unTermination_inner": //取消终止
            bodyBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000021'],/* 国际化处理： 取消终止：*/
                record,
                this.unTerminationUrl,
                this.state.json['36630PUBLIC-000022'],/* 国际化处理： 取消终止成功!*/
                index
            );
            break;
        default:
            break;
    }
}

/*3qjakgBz8U307oLILQl1l5q3VlnNwbP/i+zbbHLzo+ptD+uUcHmoqF/znntfsoAE*/