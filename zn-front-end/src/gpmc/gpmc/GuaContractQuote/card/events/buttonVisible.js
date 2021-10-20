/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { handleBtnData } from "../../../public/cardEvent";
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
  let datasource =
    props.form.getFormItemsValue(this.formId, "datasource") &&
    props.form.getFormItemsValue(this.formId, "datasource").value;
  let guacontractid =
    props.form.getFormItemsValue(this.formId, "guacontractid") &&
    props.form.getFormItemsValue(this.formId, "guacontractid").value;
  let sourcesystypecode =
    props.form.getFormItemsValue(this.formId, "sourcesystypecode") &&
    props.form.getFormItemsValue(this.formId, "sourcesystypecode").value;
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
      if (datasource === "2") {
        //融资生成的不可以操作
        showBtn = ["Add"];
      } else {
        //非融资生成的可以操作
        switch (vbillstatus) {
          case "-1": //自由态
            showBtn = [...browseBtns, "Delete", "Edit", "Commit"];
            break;
          case "0": //审批未通过
            showBtn = [...browseBtns, "Commit"];
            break;
          case "1": //审批通过
            showBtn = [...browseBtns, "UnCommit"];
            break;
          case "2": //审批进行中
            showBtn = [...browseBtns];
            break;
          case "3": //提交
            showBtn = [...browseBtns, "UnCommit"];
            break;
        }
      }

      showBtn.push(
        "Link_query",
        "Link_group",
        "Linkdbht",
        "Linkwdht",
        "Linkfzqy",
        "Linksxxy",
        "linkaprv",
        "Morebtn",
        "Auxiliary",
        "File",
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
        "Refresh"
      ].includes(key) &&
      ["approvesce", "report"].includes(scene)
    ) {
      btnObj[key] = false;
    }
  }

  props.button.setButtonVisible(btnObj);
  if (status === "browse") {
    props.button.setButtonDisabled({
      linkaprv: vbillstatus === "-1",
      Linkdbht: !guacontractid, //联查担保合同
      Linkwdht: sourcesystypecode !== "3663", //联查外贷合同
      Linkfzqy: sourcesystypecode !== "3665", //联查发债契约
      Linksxxy: sourcesystypecode !== "3661" //联查授信协议
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
    status === "browse" && !["approvesce", "report"].includes(scene)
  ); //设置看片翻页的显隐性
  //设置卡片头部状态
  props.BillHeadInfo.setBillHeadInfoVisible({
    showBackBtn: isBrowse && !["approvesce", "report"].includes(scene), //控制显示返回按钮: true为显示,false为隐藏 ---非必传
    showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
    billCode: vbillno //修改单据号---非必传
  });
  props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/