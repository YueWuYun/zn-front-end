import {
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
  createUIDom(
    {
      appcode: appCode, // 应用编码
      pagecode: BillConfig.pageId, //页面code
    },
    (data) => {
      if (data) {
        let { button, template, context } = data;
        if (button) {
          buttonUtil.setButtons(button);
        }
        if (template) {
          template = BillConfig.initTemplate
            ? BillConfig.initTemplate.call(this, template) // 应用开发人员处里完之后的模板数据;
            : template;
          // 非联查场景 给高级查询区域赋默认业务单元(在setMeta之前使用)
          setDefOrg2AdvanceSrchArea.call(this, data);
          // 右下角列表页角标组件隐藏
          template[TableConfig.tableId].pagination = false;
          // 设置页面数据模型
          metaUtil.setMeta(template, () => {
            // 给列表查询区域赋默认业务单元(在setMeta之后使用)
            setDefOrg2ListSrchArea.call(this, context);
            // 非联查场景 设置完页面模型之后执行的回调函数 设置了按钮的可用状态
            templateCallback && templateCallback.call(this);
          });
        }
      }
    }
  );
}
