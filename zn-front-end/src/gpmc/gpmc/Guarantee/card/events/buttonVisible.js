/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { handleBtnData } from "../../../public/cardEvent";
import { card } from "../../cons/constant.js";
// 编辑态
const editBtns = ["Save", "Saveadd", "Savecommit"];
// 浏览态
const browseBtns = ["Add", "Copy"];

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
  let { isPaste } = this.state;
  let status = props.getUrlParam("status");
  let scene = props.getUrlParam("scene");
  let signal = props.getUrlParam("signal");
  let id = props.getUrlParam("id");
  let isBrowse = ["browse", "version"].includes(status);
  let buttons = handleBtnData(props.button.getButtons());
  let contractno =
    props.form.getFormItemsValue(this.formId, "contractno") &&
    props.form.getFormItemsValue(this.formId, "contractno").value;
  let vbillstatus =
    props.form.getFormItemsValue(this.formId, "vbillstatus") &&
    props.form.getFormItemsValue(this.formId, "vbillstatus").value;
  let busistatus =
    props.form.getFormItemsValue(this.formId, "busistatus") &&
    props.form.getFormItemsValue(this.formId, "busistatus").value;
  let version =
    props.form.getFormItemsValue(this.formId, "versionno") &&
    props.form.getFormItemsValue(this.formId, "versionno").value;
  let pk_org =
    props.form.getFormItemsValue(this.formId, "pk_org") &&
    props.form.getFormItemsValue(this.formId, "pk_org").value;
  let btnObj = {};
  let showBtn = [];
  if (!status) {
    //刷新卡片页到卡片新增空白页的浏览态
    showBtn = ["Add"];
    isBrowse = true;
  } else if (!isBrowse) {
    //编辑态
    showBtn = [...editBtns, "Cancel"];
    if (!isPaste) {
      showBtn.push(
        "addRow",
        "deleteRow",
        "copyRow",
        "copy",
        "insert",
        "delete",
        "cela"
      );
    } else {
      showBtn.push("cancel", "copyLastRow", "copyThisRow");
    }
  } else {
    //浏览态
    if (!id) {
      //新增浏览态
      showBtn = ["Add"];
    } else if (status === "browse") {
      //单据浏览态
      switch (vbillstatus) {
        case "-1": //自由态
          showBtn = [...browseBtns, "Edit", "Commit"];
          if (busistatus === "-1") {
            // 待提交单据显示删除按钮
            showBtn = [...showBtn, "Delete"];
          }
          break;
        case "0": //审批未通过
          showBtn = [...browseBtns, "Commit"];
          break;
        case "1": //审批通过
          showBtn = [...browseBtns, "UnCommit"];
          if (+version > 1) {
            showBtn = [...showBtn, "Delversion"];
          }
          break;
        case "2": //审批进行中
          showBtn = [...browseBtns];
          break;
        case "3": //提交
          showBtn = [...browseBtns, "UnCommit"];
          break;
      }
      // 单据状态busistatus : 待提交=-1,待审批=0,未执行=1,在执行=2,已结束=3,已终止=4
      if (busistatus === "1") {
        showBtn = [...showBtn];
      } else if (busistatus === "2" && vbillstatus === "1") {
        showBtn = [...showBtn, "Change", "Terminal"];
      } else if (busistatus === "4") {
        showBtn = [...showBtn, "UnCommit", "UnTerminal"];
      }

      // 在执行不可收回
      if (["1", "3"].includes(vbillstatus) && ["2"].includes(busistatus)) {
        let i = showBtn.indexOf("UnCommit");
        if (i > -1) {
          showBtn.splice(i, 1);
        }
      }
      showBtn.push(
        "Liancha",
        "Linkgroup",
        "ApproveDetail",
        "Version",
        "Morebtn",
        "Auxiliary",
        "Attachment",
        "Print_group",
        "Print",
        "Output",
        "Refresh",
        "fold",
        "unfold"
      );
    }
  }
  // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
  for (let key of buttons) {
    btnObj[key] = showBtn.includes(key);
    // 报表联查，联查，审批详情
    if (
      key === "Add" &&
      ["approvesce", "report", "linksce_card", "linksce"].includes(scene)
    ) {
      btnObj[key] = false;
    }
  }
  //设置卡片页面错误显示标志
  let saga_status =
    props.form.getFormItemsValue(this.formId, "saga_status") &&
    props.form.getFormItemsValue(this.formId, "saga_status").value;
  if (status === "browse" && saga_status === "1") {
    props.button.toggleErrorStatus(card.btnCode, { isError: true });
  } else {
    props.button.toggleErrorStatus(card.btnCode, { isError: false });
  }
  props.button.setButtonVisible(btnObj);
  if (status === "browse") {
    props.button.setButtonDisabled({
      Version: version <= 1,
      ApproveDetail: vbillstatus === "-1"
    });
  } else if (["add", "edit", "change"].includes(status)) {
    props.button.setButtonDisabled({
      addRow: !pk_org
    });
  }
  // 提交按钮是否为应为主要按钮
  let isCommitBtnMain = showBtn.includes("Commit");
  // 设置按钮为主要或次要
  props.button.setMainButton({
    Commit: isCommitBtnMain,
    Add: !isCommitBtnMain,
    Add_copy: !isCommitBtnMain
  });

  //设置翻页按钮可见
  props.cardPagination.setCardPaginationVisible(
    "cardPaginationBtn",
    status === "browse" &&
      !["approvesce", "report", "linksce_card", "linksce"].includes(scene)
  );
  //设置卡片头部状态
  props.BillHeadInfo.setBillHeadInfoVisible({
    showBackBtn:
      isBrowse &&
      !["approvesce", "report", "linksce_card", "linksce"].includes(scene) &&
      signal !== "GuaContractQuote", //控制显示返回按钮: true为显示,false为隐藏 ---非必传
    showBillCode: contractno, //控制显示单据号：true为显示,false为隐藏 ---非必传
    billCode: contractno //修改单据号---非必传
  });
  props.cardTable.setStatus(this.tabCode, isBrowse ? "browse" : "edit");
  props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/