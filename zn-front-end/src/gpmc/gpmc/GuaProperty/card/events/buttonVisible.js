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
  let status = props.getUrlParam("status");
  let scene = props.getUrlParam("scene");
  let id = props.getUrlParam("id");
  let isBrowse = ["browse", "version"].includes(status);
  let buttons = handleBtnData(props.button.getButtons());
  let vbillno =
    props.form.getFormItemsValue(this.formId, "vbillno") &&
    props.form.getFormItemsValue(this.formId, "vbillno").value;
  let vbillstatus =
    props.form.getFormItemsValue(this.formId, "vbillstatus") &&
    props.form.getFormItemsValue(this.formId, "vbillstatus").value;
  let guapropstatus =
    props.form.getFormItemsValue(this.formId, "guapropstatus") &&
    props.form.getFormItemsValue(this.formId, "guapropstatus").value;
  let datasource =
    props.form.getFormItemsValue(this.formId, "datasource") &&
    props.form.getFormItemsValue(this.formId, "datasource").value;
  let version =
    props.form.getFormItemsValue(this.formId, "version") &&
    props.form.getFormItemsValue(this.formId, "version").value;
  let btnObj = {};
  let showBtn = [];
  if (!status) {
    //刷新卡片页到卡片新增空白页的浏览态
    showBtn = ["Add"];
    isBrowse = true;
  } else if (!isBrowse) {
    //编辑态
    showBtn = [...editBtns, "Cancel"];
  } else {
    //浏览态
    if (!id) {
      //新增浏览态
      showBtn = ["Add"];
    } else if (status === "browse") {
      //单据浏览态
      switch (vbillstatus) {
        case "-1": //自由态
          if (+version > 1) {
            // 变更保存过有版本号大于1 不允许修改
            showBtn = [...browseBtns, "Commit"];
          } else {
            showBtn = [...browseBtns, "Delete", "Edit", "Commit"];
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
      //  物权状态: 1未生效、2待押、3在押、4已解、5停用
      //来源为手工且待押物权或者已解物权可停用
      if (datasource === "1" && ["2", "4"].includes(guapropstatus)) {
        showBtn = [...showBtn, "Stop"];
      }
      // 在押物权或者已解物权,且审批通过可变更
      if (
        datasource === "1" &&
        ["3", "4"].includes(guapropstatus) &&
        vbillstatus === "1"
      ) {
        showBtn = [...showBtn, "Change"];
      }
      // 已停用且来源为手工的可启用
      if (datasource === "1" && guapropstatus === "5") {
        showBtn = [...showBtn, "Start"];
      }
      if (+version < 2) {
        // 在押物权或者停用物权不可收回
        if (
          ["1", "3"].includes(vbillstatus) &&
          ["3", "5"].includes(guapropstatus)
        ) {
          let i = showBtn.indexOf("UnCommit");
          if (i > -1) {
            showBtn.splice(i, 1);
          }
        }
      }
      showBtn.push(
        "Liancha",
        "Linkgroup",
        "Guarantee",
        "ApproveDetail",
        "Version",
        "Morebtn",
        "Auxiliary",
        "Attachment",
        "Print_group",
        "Print",
        "Output",
        "Refresh"
      );
    }
  }
  // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
  for (let key of buttons) {
    btnObj[key] = showBtn.includes(key);
    // 报表联查, 审批详情
    if (
      [
        ...browseBtns,
        "Edit",
        "Delete",
        "Commit",
        "UnCommit",
        "Stop",
        "Start",
        "Change",
        "Delversion",
        "Copy",
        "Refresh",
      ].includes(key) &&
      (["approvesce", "report", "linksce"].includes(scene) ||
        datasource !== "1")
    ) {
      // 单据为联查 或 物权来源不为手工时
      btnObj[key] = false;
    }
  }

  props.button.setButtonVisible(btnObj);

  //设置卡片页面错误显示标志
  let saga_status =
    props.form.getFormItemsValue(this.formId, "saga_status") &&
    props.form.getFormItemsValue(this.formId, "saga_status").value;
  if (status === "browse" && saga_status === "1") {
    props.button.toggleErrorStatus(card.btnCode, { isError: true });
  } else {
    props.button.toggleErrorStatus(card.btnCode, { isError: false });
  }

  // 提交按钮是否为应为主要按钮
  let isCommitBtnMain = showBtn.includes("Commit");
  // 设置按钮为主要或次要
  props.button.setMainButton({
    Commit: isCommitBtnMain,
    Add: !isCommitBtnMain,
    Add_copy: !isCommitBtnMain,
  });
  if (status === "browse") {
    props.button.setButtonDisabled({
      Version: version <= 1,
      ApproveDetail: vbillstatus === "-1",
      Guarantee: guapropstatus !== "3",
    });
  }
  //设置翻页按钮可见
  props.cardPagination.setCardPaginationVisible(
    "cardPaginationBtn",
    status === "browse" && !["approvesce", "report", "linksce"].includes(scene)
  );
  //设置卡片头部状态
  props.BillHeadInfo.setBillHeadInfoVisible({
    showBackBtn:
      isBrowse && !["approvesce", "report", "linksce"].includes(scene), //控制显示返回按钮: true为显示,false为隐藏 ---非必传
    showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
    billCode: vbillno, //修改单据号---非必传
  });
  props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/