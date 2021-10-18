/**
 * 处理 meta 数据, 比如添加参照过滤等操作
 */
import { ajax } from "nc-lightapp-front";
export default function (meta) {
  let {
    TableConfig,
    FormConfig,
    form: formUtil,
    cardTable: cardTableUtil
  } = this.props;

  // 主表meta设置
  meta[FormConfig.formId].items.map((item, key) => {
    if (item.attrcode === "pk_org") {
      // 财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
    //业务组织
   if (item.attrcode === 'pk_entrustorg') {
      item.queryCondition = () => {
        let pk_org = formUtil.getFormItemsValue(
          FormConfig.formId,
          "pk_org"
        );
        return {
          pkorg: pk_org.value,
          TreeRefActionExt:'nccloud.web.lcm.receive.ref.action.LcmOrgRelationDataRefFilter'
        };
      };
    }

     if (item.attrcode == "pk_material") {
      //物品分类
      item.queryCondition = () => {
        let pk_marbasclass = this.props.form.getFormItemsValue(
          FormConfig.formId,
          "pk_marbasclass"
        ).value;
        return {
          pk_marbasclass: pk_marbasclass
        };
      };
    }

    return item;
  });


// 主表meta设置
meta["applyinfo"].items.map((item, key) => {
//       // 外汇还款账户账户按币种过滤
//       if (item.attrcode == "pk_planitem") {
//          item.queryCondition = () => {
//                let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, 'pk_org').value;
//                  return {
//                       pk_org: pk_org, // 组织
//                        inoutdirect: 1
//                  };
//             }
//       }

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
              inoutdirect: 1,
              TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
            };
          };
        }

       if (item.attrcode === "pk_dept") {
            //部门过滤
            item.showHistory = true;
            item.queryCondition = () => {
              let pk_entrustorg = this.props.form.getFormItemsValue(
                FormConfig.formId,"pk_entrustorg").value;
              let pk_org = this.props.form.getFormItemsValue(
                FormConfig.formId,"pk_org").value;
              return {
                pk_org:(pk_entrustorg == ""? pk_org: pk_entrustorg)
              };
            };
          }
          //业务员参照
          if (item.attrcode == "pk_busipersion") {
            item.showHistory = true;
            item.queryCondition = () => {
              let pk_dept =
                this.props.form.getFormItemsValue(FormConfig.formId, "pk_dept") &&
                this.props.form.getFormItemsValue(FormConfig.formId,"pk_dept").value;
              let pk_org =
                this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
                  .value == ""
                  ? this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value
                  : this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
                      .value;
              return {
                pk_dept: pk_dept,
                pk_org: pk_org
              };
            };
          }

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
          //修改日期
          let billdate = formUtil.getFormItemsValue(
            FormConfig.formId,
            "billdate"
          );
          billdate = billdate && billdate.value;
          //授信种类
          let cccategory = formUtil.getFormItemsValue(
            FormConfig.formId,
            "pk_cctype"
          );
          cccategory = cccategory && cccategory.value;
          return {
            orgunit: pk_org,
            credittype: cccategory,
            currtype: pk_lccurrtype,
            begindate: billdate,
            bankdoc: pk_bank_issuing,
            protocolstatus: "NOEXECUTE,EXECUTING"
          };
        };
      }
      if (item.attrcode === "pk_cctype") {
        //授信类别
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
              data: {
                pk: pk_protocol.value
              },
              success: res => {
                if (res.data) {
                  pk_cctype = res.data.join();
                }
              }
            });
          }
          return {
            pk_cctype: pk_cctype || "null"
          };
        };
      }
  return item;
});
  // 子表meta设置
  // 主表meta设置
meta["contractinfo"].items.map((item, key) => {
  // 外汇还款账户账户按币种过滤
//   if (item.attrcode == "pk_planitem") {
//          item.queryCondition = () => {
//              let pk_org = this.props.form.getFormItemsValue(FormConfig.formId, 'pk_org').value;
//                return {
//                     pk_org: pk_org, // 组织
//                      inoutdirect: 1
//                };
//           }
//   }

      // // 开证计划项目
      // if(item.attrcode == "pk_planitem"){
      //   //资金计划项目
      //     item.queryCondition = () => {
      //       let pk_org = this.props.form.getFormItemsValue(
      //         FormConfig.formId,
      //         "pk_org"
      //       ).value;
      //       return { 
      //         pk_org: pk_org,
      //         TreeRefActionExt: "nccloud.web.lcm.receive.ref.action.LcmPlanItemRefFilter"
      //       };
      //     };
      //   }

   if (item.attrcode === "pk_dept") {
        //部门过滤
        item.showHistory = true;
        item.queryCondition = () => {
          let pk_entrustorg = this.props.form.getFormItemsValue(
            FormConfig.formId,"pk_entrustorg").value;
          let pk_org = this.props.form.getFormItemsValue(
            FormConfig.formId,"pk_org").value;
          return {
            pk_org:(pk_entrustorg == ""? pk_org: pk_entrustorg)
          };
        };
      }

  // 货品/劳务
        if (item.attrcode == "pk_material") {
             item.queryCondition = () => {
              // 获取当前点击行数据
              let clickedData = cardTableUtil.getClickRowIndex(TableConfig.tableCode);
              // 根据行号获取货品分类的值
              let pk_marbasclass = cardTableUtil.getValByKeyAndIndex(
                TableConfig.tableCode,clickedData.index, "pk_marbasclass");
              return {
                 pk_marbasclass: pk_marbasclass && pk_marbasclass.value
              };
          };
        }


      //业务员参照
      if (item.attrcode == "pk_busipersion") {
        item.showHistory = true;
        item.queryCondition = () => {
          let pk_dept =
            this.props.form.getFormItemsValue(FormConfig.formId, "pk_dept") &&
            this.props.form.getFormItemsValue(FormConfig.formId,"pk_dept").value;
          let pk_org =
            this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
              .value == ""
              ? this.props.form.getFormItemsValue(FormConfig.formId, "pk_org").value
              : this.props.form.getFormItemsValue(FormConfig.formId, "pk_entrustorg")
                  .value;
          return {
            pk_dept: pk_dept,
            pk_org: pk_org
          };
        };
      }

return item;
});

//        //子表合同信息参照过滤
//    meta.contractinfo.items = meta.contractinfo.items.map(
//         item => {
//         // 货品/劳务
//         if (item.attrcode == "pk_material") {
//              item.queryCondition = () => {
//               // 获取当前点击行数据
//               let clickedData = cardTableUtil.getClickRowIndex(TableConfig.tableCode);
//               // 根据行号获取货品分类的值
//               let pk_marbasclass = cardTableUtil.getValByKeyAndIndex(
//                 TableConfig.tableCode,clickedData.index, "pk_marbasclass");
//               return {
//                  pk_marbasclass: pk_marbasclass && pk_marbasclass.value
//               };
//           };
//         }
//           return item;
//         }
//       );

  // meta 是必须返回的
  return meta;
}