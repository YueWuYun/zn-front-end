/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, toast, cardCache, print, output, promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, printData } from "../../cons/constant.js";
import { interestBill } from "../../util/util";
import initTemplate from "./initTemplate";
import { buttonVisible } from "./buttonVisible";
import { getCardData } from "./page";
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
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
      case "Add"://头部 新增
          add.call(this, props, "add");
          break;
      case "Add_copy":
          add.call(this, props, "add");
          break;
      case "Add_n":
          add.call(this, props, "add");
          break;
      case "Copy":      //头部 复制
          copy.call(this, props, "copy");
          break;
      case "Copy_n":
          copy.call(this, props, "copy");
          break;
      case "Save"://头部保存
          saveBill.call(this, props, "save");
          break;
      case "Savecommit"://头部保存提交
          saveBill.call(this, props, "commit");
          break;
      case "Saveadd"://头部保存新增
          saveBill.call(this, props, "add");
          break;
      case "Edit"://头部修改
          edit.call(this, props, "edit");
          break;
      case "Delete"://头部删除
          promptBox({ color: "warning", title: this.state.json["36360ICIA-000005"] /* 国际化处理： 删除*/, content: this.state.json["36360ICIA-000006"] /* 国际化处理： 确定要删除吗?*/,
            beSureBtnClick: this.btnOperation.bind( this, javaUrl.delete, this.state.json["36360ICIA-000007"]) /* 国际化处理： 删除成功!*/
          });
          break;
      case "Cancel":// 头部 取消
          promptBox({ color: "warning", title: this.state.json["36360ICIA-000008"] /* 国际化处理： 取消*/, content: this.state.json[ "36360ICIA-000009"] /* 国际化处理： 确定要取消吗?*/,
            beSureBtnClick: cancel.bind(this, props)
          });
          break;
      case "Commit"://头部 提交
          this.btnOperation(javaUrl.commit, this.state.json["36360ICIA-000017"], pk ); /* 国际化处理： 提交成功!*/
          break;
      case "UnCommit"://头部 收回
          this.btnOperation( javaUrl.uncommit, this.state.json["36360ICIA-000010"], pk ); /* 国际化处理： 收回成功!*/
          break;
      case "ApproveDetail": //头部 审批详情
          this.billInfo = { billId: pk };
          this.setState({ showApproveDetail: true });
          break;
      case "Print"://头部 打印
          print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {...printData, oids: [pk] });
          break;
      case "Output"://头部 输出
          output({ url: `${baseReqUrl}${javaUrl.print}.do`,
            data: { ...printData, outputType: "output", oids: [pk] }
          });
          break;
      case "Attachment"://头部 附件
          fileMgr.call(this);
          break;
      case "Refresh"://头部 刷新
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
    props.initMetaByPkorg("pk_fundorg");
    clearAll.call(this, props);
    initTemplate.call(this, props);
}

/**
 * 复制
 * @param {*} props  页面内置对象
 */
function copy(props, status) {
    props.setUrlParam({ status });
    // props.initMetaByPkorg();
    clearAll.call(this, props);
    initTemplate.call(this, props);
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props, type) {
    props.setUrlParam({ status: type });
    buttonVisible.call(this, props);
    setEditStatus.call(this, type);
    orgVersionView(this.props, this.formId); //组织版本视图
    props.resMetaAfterPkorgEdit();
    props.form.setFormItemsDisabled(this.formId, { pk_fundorg: true });
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
    let id = props.getUrlParam("id");
    props.setUrlParam({ status: "browse" });
    if (id) {
        props.form.cancel(this.formId);
        getCardData.call(this, id, false, true);
        setEditStatus.call(this, "browse");
        let billNo = this.props.form.getFormItemsValue(this.formId, "vbillno").value;
        this.billNo = billNo;
        // props.resMetaAfterPkorgEdit();
        buttonVisible.call(this, props);
    } else {
      clearAll.call(this, props);
    }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 * @param {*} type   save保存、add保存新增、commit保存提交
 */
function saveBill(props, type) {
    let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
    if (!flagForm) {
      return;
    }
    let data = this.props.createExtCardData(this.pageId, this.formId);
    // //console.log(data, this.props.meta.getMeta(), "data");
    // props.validateToSave( data, () => saveOperation.call(this, props, data, type), {}, "" );
    // props.validateToSave( data, () => saveOperation.call(this, props, data, type), "cardTable", "" );

    let saveobj = {};
    saveobj[this.formId] = 'form';
    
    let billdata = this.props.form.getAllFormValue(this.formId);
    let validateData = {
        pageid: this.pageId,
        model: {
            areacode: this.formId,
            rows: billdata.rows,
            areaType: 'form'
        }
    }
    
    // 公式验证
    this.props.validateToSave(validateData,  () => saveOperation.call(this, props, data, type), saveobj, '');
}

function saveOperation(props, data, type) {
    let isAdd = this.props.getUrlParam("status") === "add";
    ajax({
        url: `${baseReqUrl}${javaUrl.save}.do`,
        data,
        success: res => {
            if (res.success) {
              if (res.data) {
                let id = res.data.head[this.formId].rows[0].values[this.primaryId].value;
                let ts = res.data.head[this.formId].rows[0].values.ts.value;
                this.idTs = { id, ts };
                toast({color: "success",content: this.state.json["36360ICIA-000011"]}); /* 国际化处理： 保存成功*/
                // 缓存
                if (isAdd) {
                    addCache(id, res.data, this.formId, this.dataSource);
                    addCache(id, res.data, this.formId, this.cache);
                } else {
                    updateCache(this.primaryId,id,res.data,this.formId,this.dataSource);
                    updateCache(this.primaryId, id, res.data, this.formId, this.cache);
                }
                if (type === "add") {
                    props.setUrlParam({id,status: "add"});
                    add.call(this, props, "add");
                } else if (type === "commit") {
                    props.setUrlParam({id,status: "browse"});
                    this.props.form.setAllFormValue({[this.formId]: res.data.head[this.formId]});
                    this.btnOperation(javaUrl.commit,this.state.json["36360ICIA-000017"],res.data.head[this.formId].rows[0].values[this.primaryId].value
                    ); /* 国际化处理： 提交成功!*/
                } else {
                    props.setUrlParam({ id, status: "browse" });
                    this.props.form.setAllFormValue({[this.formId]: res.data.head[this.formId] });
                    buttonVisible.call(this, this.props);
                }
              }
            }
        }
    });
}

/**
 * 清空所有的数据
 * @param {*} props  页面内置对象
 */
export function clearAll(props) {
    props.form.EmptyAllFormValue(this.formId);
    buttonVisible.call(this, props);
    orgVersionView(this.props, this.formId); //组织版本视图
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus(status) {
    this.props.form.setFormStatus(this.formId, status);
}

/**
 * 附件管理
 */
function fileMgr() {
    let billId = this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    let billNo = this.props.form.getFormItemsValue(this.formId, "vbillno").value;
    this.showUploader = !this.showUploader;
    this.billInfo = { billId, billNo };
    this.forceUpdate();
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/