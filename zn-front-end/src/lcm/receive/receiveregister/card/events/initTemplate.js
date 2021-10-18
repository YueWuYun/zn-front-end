/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */
export default function (meta) {
  let { FormConfig, form: formUtil ,TableConfig,cardTable: cardTableUtil} = this.props;

  // 主表meta设置
  meta[FormConfig.formId].items.map((item, key) => {
    if (item.attrcode === "pk_org") {
      // 财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
    // 业务组织参照过滤
    if (item.attrcode == "pk_entrustorg") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org");
        return {
          pkorg: pk_org && pk_org.value,
          TreeRefActionExt:
            "nccloud.web.lcm.receive.ref.action.LcmOrgRelationDataRefFilter"
        };
      };
    }
    //货品分类
    if (item.attrcode == "itemtype") {
      item.queryCondition = () => {       
        let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
        return {
            pk_org: pk_org             
        };
      };
    }
    //货品劳务
    if (item.attrcode == "goodsorlabor") {
      item.queryCondition = () => {
        let pk_marbasclass = this.props.form.getFormItemsValue(
        FormConfig.formId,"itemtype").value;
        let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
        return {
            pk_org: pk_org ,
            pk_marbasclass: pk_marbasclass
        };
      };
    }
    return item;
  });
  // 收证信息meta设置
  meta['header_creditinfo'].items.map((item) => {
   // 客户参照过滤
   if (item.attrcode == "customer") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
        return {
          pk_org: pk_org 
        };
      };
    }
    // 收证行
    if (item.attrcode == "pk_receivebank") {
        item.queryCondition = () => {      
          return {         
            TreeRefActionExt:
              "nccloud.web.lcm.receive.ref.action.LcmBankRefFilter"
          };
        };
    }
    // 通知行
    if (item.attrcode == "pk_advisingbank") {
        item.queryCondition = () => {
          return {
            TreeRefActionExt:
              "nccloud.web.lcm.receive.ref.action.LcmBankRefFilter"
          };
        };
     }
    // 议付行
     if (item.attrcode == "pk_negotiatedbank") {
        item.queryCondition = () => {
          return {
            TreeRefActionExt:
              "nccloud.web.lcm.receive.ref.action.LcmBankRefFilter"
          };
        };
      }
    if (item.attrcode === "pk_dept") {
      //部门过滤
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_entrustorg = this.props.form.getFormItemsValue(
          FormConfig.formId,"pk_entrustorg").value;
        let pk_org = this.props.form.getFormItemsValue(
          FormConfig.formId,"pk_org").value;
        return {
          pk_org:(pk_entrustorg == ""? pk_org: pk_entrustorg)
        };
      };
    }
    //业务员参照
    if (item.attrcode == "pk_busipersion") {
      item.showHistory = true;
      item.queryCondition = () => {
        let pk_dept =
          this.props.form.getFormItemsValue(FormConfig.formId, "pk_dept") &&
          this.props.form.getFormItemsValue(FormConfig.formId,"pk_dept").value;
        let pk_org =
          this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
            .value == ""
            ? this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value
            : this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
                .value;
        return {
          pk_dept: pk_dept,
          pk_org: pk_org
        };
      };
    }
    // 开证计划项目
    if(item.attrcode == "pk_planitem"){
        //资金计划项目
          item.queryCondition = () => {
            let pk_org = this.props.form.getFormItemsValue(
              FormConfig.formId,
              "pk_org"
            ).value;
            return { 
              pk_org: pk_org,
              inoutdirect: 0,
              TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
            };
          };
    }
    return item;
 });
  // 子表meta设置
  meta.contractinfo.items = meta.contractinfo.items.map((item) => {
    //货品分类
    if (item.attrcode == "pk_marbasclass") {
      item.queryCondition = () => {       
        let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
        return {
            pk_org: pk_org             
        };
      };
    }
    //货品劳务
    if (item.attrcode == "pk_material") {     
        item.queryCondition = () => {
          // 获取当前点击行数据
          let clickedData = cardTableUtil.getClickRowIndex(TableConfig.tableCode);
           // 根据行号获取货品分类的值
          let pk_marbasclass = cardTableUtil.getValByKeyAndIndex(
                TableConfig.tableCode,clickedData.index, "pk_marbasclass");
          let pk_org = this.props.form.getFormItemsValue(
                FormConfig.formId,"pk_org").value;
              return {
                  pk_org: pk_org ,
                  pk_marbasclass: pk_marbasclass && pk_marbasclass.value
              };
          };      
    }
    return item;
  });
  // meta 是必须返回的
  return meta;
}
