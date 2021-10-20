/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
  ajax,
  cardCache,
  output,
  print,
  promptBox,
  toast,
} from "nc-lightapp-front";
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import {
  baseReqUrl,
  javaUrl,
  printData,
  PK_CODE,
  TABLE_CODE,
} from "../../cons/constant.js";
import { resolveOwner } from "./afterEvent";
import { buttonVisible } from "./buttonVisible";
import initTemplate from "./initTemplate";
import {
  getCardData,
  getCopyCardData,
  resolveChange,
  resolveMeasurable,
} from "./page";
import { getSimplaFormData } from "../../../public/cardEvent";
import { sagaApi } from "../../../../public/utils";
let { getCacheById, updateCache, addCache } = cardCache;

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
  // 当前单据的pk
  let pk =
    props.form.getFormItemsValue(this.formId, this.primaryId) &&
    props.form.getFormItemsValue(this.formId, this.primaryId).value;
  switch (id) {
    //头部 新增
    case "Add":
    case "Add_copy":
      add.call(this, props, "add");
      break;
    //头部 变更
    case "Change":
      editOperation.call(this, props, "change");
      break;
    //头部保存
    case "Save":
      saveBill.call(this, props, "save");
      break;
    //头部保存提交
    case "Savecommit":
      saveBill.call(this, props, "commit");
      break;
    //头部保存新增
    case "Saveadd":
      saveBill.call(this, props, "add");
      break;
    //头部修改
    case "Edit":
      editOperation.call(this, props, "edit");
      break;
    //头部复制
    case "Copy":
      copy.call(this, props, "copy");
      break;
    //头部删除
    case "Delete":
      let version =
        props.form.getFormItemsValue(this.formId, "version") &&
        props.form.getFormItemsValue(this.formId, "version").value;
      promptBox({
        color: "warning",
        title:
          version > 1
            ? this.state.json["36620GP-000006"]
            : this.state.json[
                "36620GP-000007"
              ] /* 国际化处理： 删除历史版本,删除*/,
        content:
          version > 1
            ? this.state.json["36620GP-000008"]
            : this.state.json[
                "36620GP-000009"
              ] /* 国际化处理： 确定要删除历史版本吗?,确定要删除吗?*/,
        beSureBtnClick: this.btnOperation.bind(
          this,
          javaUrl[version > 1 ? "delversion" : "delete"],
          version > 1
            ? this.state.json["36620GP-000010"]
            : this.state.json["36620GP-000011"]
        ) /* 国际化处理： 删除历史版本成功,删除成功!*/,
      });
      break;
    // 头部 取消
    case "Cancel":
      promptBox({
        color: "warning",
        title: this.state.json["36620GP-000012"] /* 国际化处理： 取消*/,
        content: this.state.json[
          "36620GP-000013"
        ] /* 国际化处理： 确定要取消吗?*/,
        beSureBtnClick: cancel.bind(this, props),
      });
      break;
    //头部 提交
    case "Commit":
      this.btnOperation(
        javaUrl.commit,
        this.state.json["36620GP-000002"],
        pk
      ); /* 国际化处理： 提交成功!*/
      break;
    //头部 收回
    case "UnCommit":
      this.btnOperation(
        javaUrl.uncommit,
        this.state.json["36620GP-000014"],
        pk
      ); /* 国际化处理： 收回成功!*/
      break;
    //头部 启用
    case "Start":
      this.btnOperation(
        javaUrl.start,
        this.state.json["36620GP-000015"],
        pk
      ); /* 国际化处理： 启用成功!*/
      break;
    //头部 停用
    case "Stop":
      this.btnOperation(
        javaUrl.stop,
        this.state.json["36620GP-000016"],
        pk
      ); /* 国际化处理： 停用成功!*/
      break;
    //头部 查看历史版本
    case "Version":
      props.setUrlParam({ status: "version", signal: "card" });
      this.initVersionTree();
      buttonVisible.call(this, props);
      this.forceUpdate();
      break;
    //头部 删除历史版本
    case "Delversion":
      promptBox({
        color: "warning",
        title: this.state.json["36620GP-000017"] /* 国际化处理： 删除当前版本*/,
        content: this.state.json[
          "36620GP-000018"
        ] /* 国际化处理： 确定要删除当前版本吗?*/,
        beSureBtnClick: this.btnOperation.bind(
          this,
          javaUrl.delversion,
          this.state.json["36620GP-000019"]
        ) /* 国际化处理： 删除当前版本成功!*/,
      });
      break;
    //头部 审批详情
    case "ApproveDetail":
      this.billInfo = { billId: pk };
      this.setState({ showApproveDetail: true });
      break;
    //头部 联查担保合同
    case "Guarantee":
      props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/list", {
        appcode: "36620GC",
        pagecode: "36620GCL_LIST",
        scene: "linksce",
        id: pk,
      });
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
          ...printData,
          outputType: "output",
          oids: [pk],
        },
      });
      break;
    //头部 附件
    case "Attachment":
      fileMgr.call(this);
      break;
    //头部 刷新
    case "Refresh":
      getCardData.call(this, props.getUrlParam("id"), true, true);
      break;
    default:
      break;
  }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add(props, status) {
  props.setUrlParam({ status });
  clearAll.call(this, props);
  initTemplate.call(this, props);
}
/**
 * 修改前判断数据是否冻结
 * @param {*} props  页面内置对象
 */
function editOperation(props, type) {
  let pk =
    props.form.getFormItemsValue(this.formId, this.primaryId) &&
    props.form.getFormItemsValue(this.formId, this.primaryId).value;
  let data = { pk: pk, fieldPK: PK_CODE, tableName: TABLE_CODE };
  sagaApi.call(this, {
    data: data,
    success: (res) => {
      //修改后将页面的saga冻结字段和saga状态置为0
      if (props.form.getFormItemsValue(this.formId, "saga_frozen")) {
        props.form.setFormItemsValue(this.formId, {
          saga_frozen: { value: "0" },
        });
      }
      if (props.form.getFormItemsValue(this.formId, "saga_status")) {
        props.form.setFormItemsValue(this.formId, {
          saga_status: { value: "0" },
        });
      }
      edit.call(this, props, type);
    },
  });
}
/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props, type) {
  props.setUrlParam({ status: type });
  buttonVisible.call(this, props);
  setEditStatus.call(this, type);
  orgVersionView(props, this.formId); //组织版本视图
  let measurable = props.form.getFormItemsValue(this.formId, "measurable")
    .value;
  let owner = props.form.getFormItemsValue(this.formId, "owner");
  let guagptype = props.form.getFormItemsValue(this.formId, "guagptype");
  guagptype = guagptype && guagptype.value;
  if (type === "edit") {
    props.form.setFormItemsDisabled(this.formId, {
      pk_org: true,
    });
    props.resMetaAfterPkorgEdit();
    props.form.setFormItemsDisabled(
      this.formId,
      Object.assign(
        {},
        resolveMeasurable.call(this, !measurable, null, null),
        resolveOwner.call(this, props, owner)
      )
    );
    // 物权担保分类 为抵押时, 资产编号 字段可以编辑
    this.props.form.setFormItemsDisabled(this.formId, {
      assetno: guagptype === "2",
    });
  } else if (type === "change") {
    resolveChange.call(this, !measurable);
  }
}
/**
 * 复制
 * @param {*} props  页面内置对象
 */
function copy(props, type) {
  props.setUrlParam({ status: type });
  buttonVisible.call(this, props);
  setEditStatus.call(this, type);
  let id = props.getUrlParam("id");
  getCopyCardData.call(this, id, false, false);
  orgVersionView(props, this.formId); //组织版本视图
  let measurable = props.form.getFormItemsValue(this.formId, "measurable")
    .value;
  let owner = props.form.getFormItemsValue(this.formId, "owner");
  props.form.setFormItemsDisabled(this.formId, {
    pk_org: true,
  });
  props.resMetaAfterPkorgEdit();
  props.form.setFormItemsDisabled(
    this.formId,
    Object.assign(
      {},
      resolveMeasurable.call(this, !measurable, null, null),
      resolveOwner.call(this, props, owner)
    )
  );
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
 * @param {*} props  页面内置对象
 */
export function clearAll(props) {
  props.form.EmptyAllFormValue(this.formId);
  buttonVisible.call(this, props);
  orgVersionView(props, this.formId); //组织版本视图
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
  if (!flagForm) {
    return;
  }
  let data = props.createExtCardData(this.pageId, this.formId);
  // 获取组装的单表单据数据
  let validataData = getSimplaFormData.call(
    this,
    this.props,
    this.pageId,
    this.formId
  );
  props.validateToSave(
    validataData,
    () => saveOperation.call(this, props, data, type),
    {}
  );
}

function saveOperation(props, data, type) {
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
          toast({
            color: "success",
            content: this.state.json["36620GP-000020"],
          }); /* 国际化处理： 保存成功*/
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
              this.state.json["36620GP-000002"],
              res.data.head[this.formId].rows[0].values[this.primaryId].value
            ); /* 国际化处理： 提交成功!*/
            orgVersionView(props, this.formId);
          } else {
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
  this.showUploader = !this.showUploader;
  this.billInfo = { billId, billNo };
  this.forceUpdate();
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/