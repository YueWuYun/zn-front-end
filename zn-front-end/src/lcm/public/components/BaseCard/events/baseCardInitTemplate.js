import { cardUtils, utils } from "./../../../container";

export default function (templateCallback) {
  let {
    BillConfig,
    TableConfig,
    ModalConfig,
    TabsConfig,
    createUIDom,
    getSearchParam,
    getUrlParam,
    meta: metaUtil,
    button: buttonUtil,
  } = this.props;
  // 联查场景
  let scene = getUrlParam("scene");
  let appCode = getSearchParam("c") || getUrlParam("c");
  createUIDom(
    {
      appcode: appCode, // 应用编码
      pagecode: BillConfig.pageId, // 页面code
    },
    (data) => {
      if (data) {
        let { button, template } = data;
        
        if (button) {
          buttonUtil.setButtons(button);
          // 默认隐藏卡片头部 和 表体头部 按钮
          let allHeadBtns = {};
          button.map((item) => {
            if (
              (TableConfig &&
                TableConfig.btnArea &&
                item.area === TableConfig.btnArea) ||
              (ModalConfig &&
                ModalConfig.BtnConfig &&
                ModalConfig.BtnConfig.btnArea === item.area)
            ) {
              // 如果是表体操作列按钮 默认显示
              allHeadBtns[item.key] = true;
            } else {
              allHeadBtns[item.key] = false;
            }
          });
          buttonUtil.setButtonVisible(allHeadBtns);
        }
        if (template) {
          template = modifierMeta.call(
            this,
            // 非联查或非审批 应用开发人员处里完之后的模板数据
            !scene && BillConfig.initTemplate
              ? BillConfig.initTemplate.call(this, template)
              : template
          );
          // 设置页面数据模型
          // 如果无子表 需要调用setMeta方法 如果有子表 可直接调用renderTabs
          TableConfig
            ? metaUtil.renderTabs(
                template,
                TabsConfig.tabOrder,
                TabsConfig.tabOrder,
                () => {
                  // 初始化模板后处理函数
                  templateCallback && templateCallback.call(this, data);
                }
              )
            : metaUtil.setMeta(template, () => {
                // 初始化模板后处理函数
                templateCallback && templateCallback.call(this, data);
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
  // 如果不添加操作列或无子表则直接返回
  if (!TableConfig || !TableConfig.showOpr || !TableConfig.tableCode)
    return meta;
  //添加操作列
  for (let item of Object.keys(meta.gridrelation)) {
    meta[item].items.push({
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
        let btns = cardUtils.toggleCardTableInnerBtnVisible.call(
          this,
          item,
          record,
          index
        );
        return buttonUtil.createOprationButton(btns, {
          area: TableConfig.btnArea, // 按钮区域编码
          buttonLimit: 3, // 列表中按钮平铺显示数量
          onButtonClick: (props, key) =>
            this.bodyButtonClick.call(this, props, key, text, record, index),
        });
      },
    });
  }
  return meta;
}
