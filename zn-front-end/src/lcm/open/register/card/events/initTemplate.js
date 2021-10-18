/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */
import { ajax } from "nc-lightapp-front";
debugger;
export default function (meta) {
  let {
    TableConfig,
    FormConfig,
    form: formUtil,
    cardTable: cardTableUtil
  } = this.props;

  // 主表meta设置
  meta[FormConfig.formId].items.map((item) => {
    if (item.attrcode === "pk_org") {
      //财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
  
       // 业务组织参照过滤
  if (item.attrcode == "pk_entrustorg") {
    item.queryCondition = () => {
      let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org");
      return {
        pkorg: pk_org && pk_org.value,
        TreeRefActionExt:
          "nccloud.web.lcm.receive.ref.action.LcmOrgRelationDataRefFilter"
      };
    };
  }
      return item;
   });

  // 开证信息meta设置
  meta['header_openInfo'].items.map((item) => {
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
              inoutdirect: 1,
              TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
            };
          };
        }
    // 供应商参照过滤
    if(item.attrcode == "pk_supplier"){
        item.queryCondition = () => {
          let pk_org = this.props.form.getFormItemsValue(
            FormConfig.formId,
            "pk_org"
          ).value;
          let pk_group = this.props.form.getFormItemsValue(
            FormConfig.formId,"pk_group").value;
          return { 
            pk_org: pk_org,
            pk_group: pk_group,
            GridRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmSupplierRefFilter"
          };
        };
      }
   return item;
 });


  // 担保信息表meta设置
  meta['header_guaInfo'].items.map((item) => {
   	//担保合同-过滤类
    if (item.attrcode == 'pk_guaprotocol') {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(
            FormConfig.formId,"pk_org").value;
        let pk_group = this.props.form.getFormItemsValue(
            FormConfig.formId,"pk_group").value;
        let guaranteetype = this.props.form.getFormItemsValue(
          FormConfig.formId,"guaranteetype").value;
        let guastartdate = this.props.form.getFormItemsValue(
          FormConfig.formId,"billdate").value;
        let validdate = this.props.form.getFormItemsValue(
            FormConfig.formId,"validdate").value;
        //开证行银行大类
        let pk_banktype = formUtil.getFormItemsValue(
          FormConfig.formId,
          "pk_bank_issuing"
        ).value;
        return {
            isCross: true, //设置跨模块过滤标志
            isOpenRegister:true,
            guaranteetype: guaranteetype,
            //债务人
            pk_debtor: pk_org,
            //债权人
            pk_creditor: pk_banktype,
            pk_group: pk_group,
            begindate: guastartdate,
            validdate:validdate,
            GridRefActionExt: 
                'nccloud.web.lcm.receive.ref.action.LcmGpmcContractRefFilter'
        };
      };
    } 
    return item;
  });
  //授信页签参照过滤
  meta.header_creditInfo.items = meta.header_creditInfo.items.map(
    item => {
      if (item.attrcode === "pk_ccterm") {
        item.queryCondition = () => {
          //组织
          // 表头贷款金融机构银行大类
          let pk_org = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_org"
          );
          pk_org = pk_org && pk_org.value;
          //币种
          let pk_lccurrtype = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_lccurrtype"
          );
          pk_lccurrtype = pk_lccurrtype && pk_lccurrtype.value;
          //开证行
          let pk_bank_issuing = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_bank_issuing"
          );
          pk_bank_issuing = pk_bank_issuing && pk_bank_issuing.value;
          //开证日期
          let billdate = formUtil.getFormItemsValue(
            FormConfig.formId,
            "billdate"
          );
          billdate = billdate && billdate.value;
          return {
            orgunit: pk_org,
            currtype: pk_lccurrtype,
            begindate: billdate,
            bankdoc: pk_bank_issuing,
            protocolstatus: "NOEXECUTE,EXECUTING"
          };
        };
      }
      if (item.attrcode === "cccategory") {
        //授信类别根据授信协议过滤
        item.queryCondition = () => {
          let pk_protocol = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_ccterm"
          );
          let pk_cctype;
          if (pk_protocol) {
            ajax({
              url: "/nccloud/ccc/bankprotocol/CCTypeGridRef.do",
              async: false,
              data: { pk: pk_protocol.value },
              success: res => {
                if (res.data) {
                  pk_cctype = res.data.join();
                }
              }
            });
          }
          return { pk_cctype: pk_cctype || "null" };
        };
      }
      return item;
    }
  );
    //保证金页签参照过滤
    meta.header_securityInfo.items = meta.header_securityInfo.items.map(
      item => {
        // 保证金账户按币种过滤(使用权参照)
      if (item.attrcode == "pk_acc_pledge") {
          item.queryCondition = () => {
            let pk_org = this.props.form.getFormItemsValue(
              FormConfig.formId,
              "pk_org"
            ).value;
            let pk_currtype = this.props.form.getFormItemsValue(
              FormConfig.formId,
              "pk_lccurrtype"
            ).value;
            return {
              pk_org: pk_org,
              pk_currtype: pk_currtype,
              GridRefActionExt:
                "nccloud.web.lcm.receive.ref.action.LcmUnitAcct4MarginRefFilter"
            };
          };
        }
    
        return item;
      }
    );
 // 票据池页签参照过滤
 meta.header_poolInfo.items = meta.header_poolInfo.items.map(
  item => {
    // 费率编码
    if (item.attrcode === "pk_usectmanage") {
      item.showHistory = true;
      item.fieldDisplayed = "refcode";
      item.queryCondition = () => {
        let billdate = this.props.form.getFormItemsValue(
                    FormConfig.formId,"billdate").value;
        let pk_org = this.props.form.getFormItemsValue(
                    FormConfig.formId,"pk_org").value;
        let pk_group = this.props.form.getFormItemsValue(
                    FormConfig.formId,"pk_group").value;
        let pk_usectmanage = this.props.form.getFormItemsValue(
                    FormConfig.formId,"pk_usectmanage").value;
        let pk_lccurrtype = this.props.form.getFormItemsValue(
                    FormConfig.formId,"pk_lccurrtype").value;
        return {
          pk_org: pk_org,
          pk_lccurrtype: pk_lccurrtype,
          billdate: billdate,
          pk_usectmanage: pk_usectmanage,
          pk_group: pk_group,
          GridRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmUsectManageRefModelFilter"
        };
      };
    }
    return item;
  }
  );
       //子表合同信息参照过滤
   meta.contractinfo.items = meta.contractinfo.items.map(
        item => {
          //货品分类
          if (item.attrcode == "pk_marbasclass") {
            item.queryCondition = () => {       
              let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value;
              return {
                  pk_org: pk_org             
              };
            };
          }
          // 货品/劳务
          if (item.attrcode == "pk_material") {
               item.queryCondition = () => {
                // 获取当前点击行数据
                let clickedData = cardTableUtil.getClickRowIndex(TableConfig.tableCode);
                // 根据行号获取货品分类的值
                let pk_marbasclass = cardTableUtil.getValByKeyAndIndex(
                  TableConfig.tableCode,clickedData.index, "pk_marbasclass");
                let pk_org = this.props.form.getFormItemsValue(
                              FormConfig.formId,"pk_org");
                return {
                  pk_org: pk_org &&  pk_org.value,
                  pk_marbasclass: pk_marbasclass && pk_marbasclass.value
                };
            };
          }
            return item;
          }
        );
  // meta 是必须返回的
  return meta;
}
