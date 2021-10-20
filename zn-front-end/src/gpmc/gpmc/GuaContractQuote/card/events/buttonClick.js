/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
  ajax,
  toast,
  cardCache,
  print,
  output,
  promptBox,
} from "nc-lightapp-front";
import { baseReqUrl, javaUrl, printData } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { getCardData, getCopyCardData } from "./page";
import { getSimplaFormData } from "../../../public/cardEvent";
import initTemplate from "./initTemplate";
import { afterEventEdit } from "./afterEvent";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
let { getCacheById, updateCache, addCache, getCurrentLastId } = cardCache;

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
  // 当前单据的全部数据
  let cardData = props.createExtCardData(this.pageId, this.formId);
  let pk =
    props.form.getFormItemsValue(this.formId, this.primaryId) &&
    props.form.getFormItemsValue(this.formId, this.primaryId).value;
  switch (id) {
    //头部 新增
    case "Add":
    case "Add_copy":
      add.call(this, props);
      break;
    //头变更
    case "Change":
      edit.call(this, props);
      break;
    //头部保存
    case "Save":
      // 获取组装的单表单据数据
      let validataData = getSimplaFormData.call(
        this,
        this.props,
        this.pageId,
        this.formId
      );
      props.validateToSave(
        validataData,
        saveBill.bind(this, props, "save"),
        "",
        ""
      );
      break;
    //头部保存提交
    case "Savecommit":
      props.validateToSave(
        cardData,
        saveBill.bind(this, props, "commit"),
        "",
        ""
      );
      break;
    //头部保存新增
    case "Saveadd":
      props.validateToSave(cardData, saveBill.bind(this, props, "add"), "", "");
      break;
    case "Edit":
      edit.call(this, props);
      break;
    case "Copy":
      copy.call(this, props);
      break;
    //删除
    case "Delete":
      promptBox({
        color: "warning",
        title: this.state.json["36620GBM-000006"] /* 国际化处理： 删除*/,
        content: this.state.json[
          "36620GBM-000007"
        ] /* 国际化处理： 确定要删除吗?*/,
        beSureBtnClick: this.btnOperation.bind(
          null,
          javaUrl.delete,
          this.state.json["36620GBM-000008"]
        ) /* 国际化处理： 删除成功!*/,
      });
      break;
    //删除版本
    case "Delversion":
      promptBox({
        color: "warning",
        title: this.state.json[
          "36620GBM-000009"
        ] /* 国际化处理： 删除当前版本*/,
        content: this.state.json[
          "36620GBM-000010"
        ] /* 国际化处理： 确定要删除当前版本吗?*/,
        beSureBtnClick: this.btnOperation.bind(
          null,
          javaUrl.delversion,
          this.state.json["36620GBM-000011"]
        ) /* 国际化处理： 删除当前版本成功!*/,
      });
      break;
    // 头部 取消
    case "Cancel":
      promptBox({
        color: "warning",
        title: this.state.json["36620GBM-000012"] /* 国际化处理： 取消*/,
        content: this.state.json[
          "36620GBM-000013"
        ] /* 国际化处理： 确定要取消吗?*/,
        beSureBtnClick: cancel.bind(this, props),
      });
      break;
    //头部 提交
    case "Commit_group":
      this.btnOperation(
        javaUrl.commit,
        this.state.json["36620GBM-000002"]
      ); /* 国际化处理： 提交成功!*/
      break;
    //头部卡片 提交
    case "Commit":
      this.btnOperation(
        javaUrl.commit,
        this.state.json["36620GBM-000002"]
      ); /* 国际化处理： 提交成功!*/
      break;
    //头部 收回
    case "UnCommit":
      this.btnOperation(
        javaUrl.uncommit,
        this.state.json["36620GBM-000014"]
      ); /* 国际化处理： 收回成功!*/
      break;
    //头部 附件
    case "File":
      fileMgr.call(this);
      break;
    //头部 打印
    case "Print":
      print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
        ...printData,
        oids: [pk],
      });
      break;
    //头部 输出
    case "Output":
      output({
        url: `${baseReqUrl}${javaUrl.print}.do`,
        data: {
          oids: [pk],
          ...printData,
          outputType: "output",
        },
      });
      break;
    //联查担保合同
    case "Linkdbht":
    //联查外贷合同
    case "Linkwdht":
    //联查发债契约
    case "Linkfzqy":
    //联查授信协议
    case "Linksxxy":
      linkcommon.call(this, props, id);
      break;
    //头部 刷新
    case "Refresh":
      getCardData.call(this, props.getUrlParam("id"), true, true, () => {
        toast({
          color: "success",
          content: this.state.json["36620GBM-000052"],
        }); /* 国际化处理： 刷新成功 */
      });
      break;
    case "linkaprv": //联查审批详情
      linkApproveMessage.call(this, props);
      break;
    default:
      break;
  }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add(props) {
  props.setUrlParam({ status: "add" });
  clearAll.call(this, props);
  initTemplate.call(this, props);
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props) {
  props.setUrlParam({ status: "edit" });
  buttonVisible.call(this, props);
  setEditStatus.call(this, "edit");
  orgVersionView(props, this.formId);
  let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
  props.form.setFormItemsDisabled(this.formId, {
    pk_org: true,
  });
  afterEventEdit.call(this, props, this.formId, "pk_org", pk_org, true);
}
/**
 * 修改
 * @param {*} props  页面内置对象
 */
function copy(props) {
  props.setUrlParam({ status: "copy" });
  buttonVisible.call(this, props);
  setEditStatus.call(this, "edit");
  let id = props.getUrlParam("id");
  getCopyCardData.call(this, id, false, false);
  orgVersionView(props, this.formId);
  let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
  // props.form.setFormItemsDisabled(this.formId, {
  //     pk_org: true
  // });
  afterEventEdit.call(this, props, this.formId, "pk_org", pk_org, true);
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
  let id = props.getUrlParam("id");
  props.setUrlParam({ status: "browse" });
  if (id) {
    getCardData.call(this, id, false, true);
  } else {
    clearAll.call(this, props);
  }
}

/**
 * 清空所有的数据
 * @param {*} props     页面内置对象
 * @param {*} callback  回调函数
 */
export function clearAll(props, callback) {
  props.form.EmptyAllFormValue(this.formId);
  buttonVisible.call(this, props);
  orgVersionView(props, this.formId); //组织版本视图
  callback && callback();
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus(status) {
  this.props.form.setFormStatus(this.formId, status);
}

/**
 * 保存
 * @param {*} props  页面内置对象
 * @param {*} type   save保存、add保存新增、commit保存提交
 */
function saveBill(props, type) {
  let flagForm = props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
  let data = props.createExtCardData(this.pageId, this.formId);
  console.log(data, "data");
  if (!flagForm) {
    return;
  }
  let isAdd = props.getUrlParam("status") === "add";
  ajax({
    url: `${baseReqUrl}${javaUrl.save}.do`,
    data,
    success: (res) => {
      if (res.success) {
        if (res.data) {
          let id =
            res.data.head[this.formId].rows[0].values[this.primaryId].value;
          let ts = res.data.head[this.formId].rows[0].values.ts.value;
          this.idTs = { id, ts };
          // 缓存
          if (isAdd) {
            addCache(id, res.data, this.formId, this.dataSource);
            addCache(id, res.data, this.formId, this.cache);
          } else {
            updateCache(
              this.primaryId,
              id,
              res.data,
              this.formId,
              this.dataSource
            );
            updateCache(this.primaryId, id, res.data, this.formId, this.cache);
          }
          if (type === "add") {
            toast({
              color: "success",
              content: this.state.json["36620GBM-000015"],
            }); /* 国际化处理： 保存成功*/
            props.setUrlParam({
              id: "",
              status: "add",
            });
            props.form.EmptyAllFormValue(this.formId);
            initTemplate.call(this, props);
          } else if (type === "commit") {
            props.setUrlParam({
              id,
              status: "browse",
            });
            props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId],
            });
            this.btnOperation(
              javaUrl.commit,
              this.state.json["36620GBM-000002"],
              res.data.head[this.formId].rows[0].values[this.primaryId].value
            ); /* 国际化处理： 提交成功!*/
            orgVersionView(props, this.formId);
          } else {
            toast({
              color: "success",
              content: this.state.json["36620GBM-000015"],
            }); /* 国际化处理： 保存成功*/
            props.setUrlParam({
              id,
              status: "browse",
            });
            props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId],
            });
            buttonVisible.call(this, props);
            orgVersionView(props, this.formId);
          }
        }
      }
    },
  });
}

/**
 * 附件管理
 */
function fileMgr() {
  let billId = this.props.form.getFormItemsValue(this.formId, this.primaryId)
    .value;
  let billNo = this.props.form.getFormItemsValue(this.formId, "vbillno").value;
  this.setState({
    showUploader: !this.state.showUploader,
    billInfo: { billId, billNo },
  });
}

/**
 * 联查担保合同
 * @param {*} props
 */
function linkcommon(props, linktype) {
  let guacontractid = props.form.getFormItemsValue(
    this.formId,
    "guacontractid"
  );
  guacontractid = guacontractid && guacontractid.value;
  let variety_category = props.form.getFormItemsValue(
    this.formId,
    "variety_category"
  );
  variety_category = variety_category && variety_category.value;
  let pk_srcbill = props.form.getFormItemsValue(this.formId, "pk_srcbill");
  pk_srcbill = pk_srcbill && pk_srcbill.value;
  switch (linktype) {
    case "Linkdbht": //联查担保合同
      props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/card", {
        appcode: "36620GC",
        pagecode: "36620GCL_CARD",
        scene: "linksce_card",
        status: "browse",
        id: guacontractid,
        signal: "GuaContractQuote",
      });
      break;
    case "Linkwdht": //联查外贷合同
      if (variety_category == "DELEGATION_LOAN") {
        props.openTo("/cdmc/ccm/debitcontract/main/index.html#/card", {
          status: "browse",
          appcode: "366305CDC",
          pagecode: "366305CDCL_CARD",
          scene: "linksce",
          id: pk_srcbill,
        });
      } else {
        props.openTo("/cdmc/cdm/contract/main/index.html#/card", {
          status: "browse",
          appcode: "36630BLC",
          pagecode: "36630BLCL_CARD",
          scene: "linksce",
          id: pk_srcbill,
        });
      }
      break;
    case "Linkfzqy": //联查发债契约
      props.openTo("/bond/bond/contract/main/index.html#/card", {
        status: "browse",
        appcode: "36650BC",
        pagecode: "36650BCL_CARD",
        scene: "linksce",
        id: pk_srcbill,
      });
      break;
    case "Linksxxy": //联查授信协议
      props.openTo("/ccc/ccc/bankprotocol/main/index.html#/list", {
        status: "browse",
        appcode: "36610CC",
        pagecode: "36610CC_Link",
        scene: "linksce",
        id: pk_srcbill,
      });
      break;
  }
  return;
}
/**
 * 联查审批详情
 * @param {*} props
 */
function linkApproveMessage(props) {
  let billId = props.form.getFormItemsValue(this.formId, this.primaryId).value;
  this.setState({
    billId: billId, //单据pk
    showAppr: true,
  });
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/