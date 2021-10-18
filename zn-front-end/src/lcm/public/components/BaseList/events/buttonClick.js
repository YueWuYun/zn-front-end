//列表头部按钮操作
import {
  promptBox,
  toast
} from "nc-lightapp-front";
import {
  list,
  common
} from "../../../container";
import {
  printFn,
  printListAll,
  output
} from "../../../container/listUtils";
import {
  linkCMP
} from "src/tmpub/pub/util/linkCMP";

/**
 * 列表表头按钮点击事件
 * @param {Object} props - 平台传入的props对象 父组件传入参数集合对象
 * @param {String} key -- 按钮编码key
 */
export function buttonClick(props, key) {
  let {
    BillConfig,
    TableConfig,
    table: tableUtil
  } = this.props;
  // 已选择的行数据
  let checkRows = tableUtil.getCheckedRows(TableConfig.tableId);
  // 已选择的第一行数据
  let {
    values
  } = (checkRows && checkRows[0] && checkRows[0].data) || [];
  let pkMapTs = new Map();
  // pk和index的map
  let pkMapRowIndex = new Map();
  let pks =
    checkRows &&
    checkRows.map((item) => {
      let pk = item.data.values[BillConfig.primaryId];
      let ts = item.data.values["ts"];
      ts = ts && ts.value;
      pk = pk && pk.value;
      //主键与tsMap
      pk && ts && pkMapTs.set(pk, ts);
      pk && pkMapRowIndex.set(pk, item.index);
      return pk;
    });
  // // 检查按钮权限
  if (!common.checkBtnPermission.call(this, key, pks)) return;
  switch (key) {
    // 新增 Add
    case "Add":
      list.listAdd.call(this);
      break;
      // 删除
    case "Delete":
      // 删除是提示信息
      let deleteMsg =
        checkRows.length > 1 ?
        this.state.baseMultiLangData[
          "3617PUB-000013"
        ] /* 国际化处理 确定要删除所选数据吗？*/ :
        this.state.baseMultiLangData[
          "3617PUB-000012"
        ]; /* 国际化处理：确定要删除吗？*/
      promptBox({
        color: "warning",
        title: this.state.baseMultiLangData[
          "36650PUB-000000"
        ] /* 国际化处理： 删除*/ ,
        content: deleteMsg,
        beSureBtnClick: () => {
          list.listDelete.call(this, {
            isMulti: true,
            pkMapRowIndex,
            data: {
              pks,
              pkMapTs
            },
          });
        },
      });
      break;
      // 复制
    case "Copy":
      if (list.isSelected.call(this)) {
        props.pushTo("/card", {
          status: "copy",
          id: pks[0],
          pagecode: BillConfig.pageId,
        });
      }
      break;
      // 提交
    case "Commit":
      list.listCommit.call(this, {
        isMulti: true,
        pkMapRowIndex,
        data: {
          pks,
          pkMapTs
        },
      });
      break;
      // 收回
    case "Uncommit":
      list.listUncommit.call(this, {
        isMulti: true,
        pkMapRowIndex,
        data: {
          pks,
          pkMapTs
        },
      });
      break;
      // 打印
    case "Print":
      if (list.isSelected.call(this)) {
        printFn.call(this, pks);
      }
      break;
      // 列表打印
    case "PrintList":
      if (list.isSelected.call(this)) {
        printListAll.call(this, pks);
      }
      break;
      // 输出
    case "Output":
      if (list.isSelected.call(this)) {
        output.call(this, pks);
      }
      break;
      // 附件
    case "Attachment":
      if (list.isSelected.call(this, true)) {
        // 单据id
        let billId = values[BillConfig.primaryId].value;
        // 单据编码
        let billNo = values[BillConfig.billNo].value;
        common.fileMgr.call(this, billId, billNo);
      }
      break;
      // 头部 刷新
    case "Refresh":
      list.listRefresh.call(this);
      break;

      /************************ 拉单 **********************/
    case "Pull":
      // 押汇申请生成押汇合同
    case "ApplyBills":
      // 进口合同到单承付
    case "Arrival":
      // 出口合同交单登记
    case "Submission":
      common.handlePullBill.call(this, key);
      break;

      /************************ 推单 **********************/
    case "OpenModify":
    case "ArrivalBill":
    case "SubmissionRegister":
    case "ReceiveModify":
    case "PushPayRegister": // 付款登记
      // 交单登记 关联操作 begin
    case "PushCollectionNotice": // 通知收款
    case "PushDocumentaryApply": // 押汇申请
    case "PushDocumentaryContract": // 押汇合同
      // 交单登记 关联操作 end
      if (list.isSelected.call(this, true)) {
        common.handlePushBill.call(this, key, checkRows);
      }
      break;

      /************************ 联查 **********************/
      // 联查 利率
    case "Interestrate":
      if (list.isSelected.call(this, true)) {
        common.linkInterestrate.call(this, checkRows[0]);
      }
      break;
      // 联查 审批详情
    case "ApproveDetail":
      if (list.isSelected.call(this, true)) {
        common.linkApproveDetail.call(this, checkRows[0]);
      }
      break;
      // 联查 凭证
    case "Voucher":
      if (list.isSelected.call(this, true)) {
        common.linkVoucher.call(this, checkRows[0]);
      }
      break;
      // 联查 担保合同
    case "GuarantyContract":
      if (list.isSelected.call(this, true)) {
        common.linkGuarantyContract.call(this, checkRows[0]);
      }
      break;
      // 联查 历史版本
    case "HistoryVersion":
      if (list.isSelected.call(this, true)) {
        common.linkHistoryVersion.call(this, checkRows[0]);
      }
      break;
      // 联查 计划预算
    case "FundPlan":
      if (list.isSelected.call(this, true)) {
        common.linkFundPlan.call(this, checkRows[0]);
      }
      break;
      // 联查 授信
    case "Credit":
      if (list.isSelected.call(this, true)) {
        common.linkCredit.call(this, checkRows[0]);
      }
      break;
      //联查 账户余额
    case "Balance":
      //校验是否安装cmp模块
      linkCMP.call(this, {
        data: {
          pk_group: this.props.form.getFormItemsValue(this.formId, "pk_group")
            .value,
        },
        success: (res) => {
          if (list.isSelected.call(this, true)) {
            common.linkBalance.call(this, checkRows[0]);
          }
        },
      });
      break;

      /*********** 根据当前单据中目标单据的pk 联查目标单据 ************/
      // 联查 结息日
    case "Interestday":
      // 联查 开证登记
    case "LinkOpenRegister":
      // 联查 到单承付
    case "LinkOpenArrival":
      // 联查 收证登记
    case "LinkReceiveRegister":
    // 联查 交单登记
    case "LinkSubmitRegister":
    // 联查 付款登记
    case "LinkPayRegister":
      // 联查 押汇申请
    case "LinkApplyDocuBills":
      // 联查 押汇合同
    case "LinkContractDocuBills":
      // 联查通知收款
    case "LinkCollectionNotice":
      // 联查 开证申请
    case "LinkOpenApply":
      if (list.isSelected.call(this, true)) {
        common.linkBillWithTargetPk.call(this, key, checkRows[0]);
      }
      break;

      /*********** 根据当前单据pk 发送请求反联查目标单据 ************/
      // 联查到单承付
    case "RLinkArrivalBill":
      // 联查开证修改
    case "RLinkOpenModify":
      // 联查付款登记
    case "RLinkPayRegister":
      // 联查押汇申请
    case "RLinkApplyDocuBills":
      // 联查押汇合同
    case "RLinkContractDocuBills":
      /*********** 收证登记联查/关联 begin************/
      // 联查收证修改
    case "RLinkReceivemodifyBill":
      // 联查通知收款
    case "RLinkCollectionNotice":
      // 联查交单登记
    case "RLinkSubmissionregisterBill":
      /*********** 收证登记联查/关联 end************/
           //联查押汇放款
    case "RLinkPayDocuBills": 
    //联查押汇还款
    case "RLinkRepayDocuBills": 
      if (list.isSelected.call(this, true)) {
        common.linkBillWithoutTargetPk.call(this, key, checkRows[0]);
      }
      break;
      // =========================存在多个来源单据的联查   押汇申请、押汇合同 ===================
    case "DocuBill":
      // 进口信用证号 融资品种为出口信用证押汇

      let inlcno = values.inlcno.value;
      let srcBill = "Submission";
      if (inlcno) {
        srcBill = "Arrival"
      }
      if (list.isSelected.call(this, true)) {
        common.linkDocuBillWithTargetPk.call(this, key, srcBill, checkRows[0]);
      }
      break;
      // 联查来源单据
    case "LinkApplyDocuBills":
      // 联查手续费
    case "LinkServiceFee":
      break;
      // 联查进口合同
    case "LinkContract":
      break;
      //开证登记 批改
    case "BatchEdit":
      if (list.isSelected.call(this, false)) {
        this.setState({
          batchEditShow: true
        });
      }
      break;
      //开证登记 批改确认
    case "BatchConfirm":
      list.listBatchConfirm.call(this, {
        isMulti: true,
        pkMapRowIndex,
        data: {
          pks,
          pkMapTs
        },
        successAfter: () => {
          this.setState({
            batchEditShow: false
          });
        },
      });
      break;
      // 开证登记/收证登记 注销
    case "LogOut":
      debugger;
      if (list.isSelected.call(this, true)) {
        
        this.setState({
          registerCancleShow: true
        });
      }
      break;
    case "ConfirmModal":
      list.listLogoutConfirm.call(this, {
        isMulti: true,
        pkMapRowIndex,
        data: {
          pks,
          pkMapTs
        },
        successAfter: () => {
          this.setState({
            registerCancleShow: false
          });
        },
      });
      break;
      // 到单承付--发票登记
    case "NoteRegister":
      list.listInvoice.call(this, {
        isMulti: true,
        pkMapRowIndex,
        data: {
          pks,
          pkMapTs
        },
      });
      break;
    default:
      break;
  }
}