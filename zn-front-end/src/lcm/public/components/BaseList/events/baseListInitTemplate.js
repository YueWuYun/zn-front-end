import {
  bodyButtonClick,
  toggleListInnerBtnVisible,
  setDefOrg2AdvanceSrchArea,
  setDefOrg2ListSrchArea,
} from "./index";
export default function (templateCallback) {
  let {
    BillConfig,
    TableConfig,
    createUIDom,
    getSearchParam,
    getUrlParam,
    meta: metaUtil,
    button: buttonUtil,
  } = this.props;
  let appCode = getSearchParam("c") || getUrlParam("c");
  let scene = getUrlParam("scene"); // 联差
  let pk_ntbparadimvo = getUrlParam("pk_ntbparadimvo"); // 预算反联查
  let linkpagecode = getUrlParam("pagecode"); //普通联查
  let linkscene = scene || pk_ntbparadimvo || linkpagecode; 
  createUIDom(
    {
      appcode: appCode, // 应用编码
      pagecode: BillConfig.pageId, // 页面code, //页面code
    },
    (data) => {
      if (data) {
        let { button, template, context } = data;
        if (button) {
          buttonUtil.setButtons(button);
          buttonUtil.setPopContent(
            "DelInner",
            this.state.baseMultiLangData["3617PUB-000012"]
          ); /* 国际化处理： 确定要删除吗？*/
          buttonUtil.setPopContent(
            "CloseApplyInner",
            this.state.baseMultiLangData["3617PUB-000027"]
          ); /* 国际化处理： 确定要关闭申请吗？*/
          buttonUtil.setPopContent(
            "DeleteVersionInner",
            this.state.baseMultiLangData["3617PUB-000068"]
          ); /* 国际化处理： 确定要删除版本吗？*/
        }
        if (template) {
          template = BillConfig.initTemplate
            ? modifierMeta.call(
                this,
                // 应用开发人员处里完之后的模板数据;
                BillConfig.initTemplate.call(this, template)
              )
            : template;
          // 非联查场景 给高级查询区域赋默认业务单元(在setMeta之前使用)
          !scene &&
            !pk_ntbparadimvo &&
            setDefOrg2AdvanceSrchArea.call(this, data);
          // 设置页面数据模型
          metaUtil.setMeta(template, () => {
            // 给列表查询区域赋默认业务单元(在setMeta之后使用)
            !scene &&
              !pk_ntbparadimvo &&
              setDefOrg2ListSrchArea.call(this, context);
            // 非联查场景 设置完页面模型之后执行的回调函数 设置了按钮的可用状态
            templateCallback && templateCallback.call(this);
          });
        }
      }
    }
  );
}
/**
 * meta数据处理函数
 */
function modifierMeta(meta) {
  return listOpr.call(this, meta);
}

/**
 * 表格操作列处理函数
 */
function listOpr(meta) {
  let { TableConfig, button: buttonUtil } = this.props;
  // 如果不添加操作列则直接返回
  if (!TableConfig || !TableConfig.showOpr) return meta;
  //添加操作列
  meta[TableConfig.tableId].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: this.state.baseMultiLangData[
      "3617PUB-000024"
    ] /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      // 表格行内按钮显示规则处理
      let btns = toggleListInnerBtnVisible.call(this, record, index);
      return buttonUtil.createOprationButton(btns, {
        area: TableConfig.btnArea, // 按钮区域编码
        buttonLimit: 3, // 列表中按钮平铺显示数量
        onButtonClick: (props, key) =>
          bodyButtonClick.call(this, key, record, index),
      });
    },
  });
  return meta;
}
