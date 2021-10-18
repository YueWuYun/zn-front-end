/*
  卡片/列表公共业务函数
*/
import { ajax } from "nc-lightapp-front";
import { setPageStatus } from "./card";

// 卡片页面所有数据
export function clearAllData() {
  let {
    FormConfig,
    TabsConfig,
    TableConfig,
    form: formUtil,
    cardTable: cardTableUtil,
  } = this.props;
  // 清空主表所有数据
  formUtil.EmptyAllFormValue(FormConfig.formId);
  // 清空子表所有数据
  if (TabsConfig && TabsConfig.tabOrder) {
    let allTableData = {};
    TabsConfig.tabOrder.map((item) => {
      // 对子表页签每一项都重置为空数组
      allTableData[item] = {};
      allTableData[item].rows = [];
    });
    // 重置所有页签数据
    cardTableUtil.setAllTabsData(
      allTableData,
      TabsConfig.tabOrder,
      () => {
        this.props.cardTable.setCurrTabKey(TabsConfig.tabOrder[0]);
      },
      TabsConfig.tabOrder
    );
  }
}

/**
 * 初始化新增页面 清除数据及设置编辑性
 * @param {Object} templateData - 模板初始化的数据
 */
export function initAddCard(templateData) {
  return new Promise(async (resolve) => {
    let { FormConfig, TableConfig, form: formUtil } = this.props;
    await function () {
      // 清除所有数据
      clearAllData.call(this);
      // 设置主子表为可编辑
      setPageStatus.call(this, "edit");
      // 选择主组织以后，恢复其他字段的编辑性
      this.props.resMetaAfterPkorgEdit();
    }.call(this);
    await function () {
      // 获取上下文
      let { context } = templateData;
      if (context) {
        // 设置默认组织
        let { pk_org, org_Name } = context;
        if (pk_org) {
          // 设置组织对应版本的默认值
          this.afterEvent.call(
            this,
            this.props,
            FormConfig.formId,
            "pk_org",
            { display: org_Name, value: pk_org },
            { value: null }
          );
        } else {
          // 设置主表编辑性为不可编辑
          this.props.initMetaByPkorg();
        }
      }
    }.call(this);
    resolve && resolve();
  });
}

/**
 * 初始化复制页面 初始化编辑性
 */
export function initCopyCard() {
  return new Promise((resolve) => {
    let { TableConfig, cardTable: cardTableUtil } = this.props;
    let id = this.props.getUrlParam("id");
    // 暂存当前卡片id
    this.preId = id ? id : "";
    this.props.setUrlParam({ id: "" });
    // 切换到第一个页签
    TableConfig && cardTableUtil.setCurrTabKey(TableConfig.tableCode);
    // 设置用户自定义复制编辑性
    this.setCopyEditable && this.setCopyEditable.call(this);
    resolve && resolve.call(this);
  });
}

/**
 * 同步树节点点击事件
 * @param {*} key - 叶子节点key
 * @param {*} data - 树数据
 */
export function onTreeNodeClick(key, data) {
  let {
    BillConfig,
    FormConfig,
    TabsConfig,
    TableConfig,
    form: formUtil,
    cardTable: cardTableUtil,
  } = this.props;
  ajax({
    url: BillConfig.API_URL.queryVersion,
    data: {
      pk: key,
      pageCode: BillConfig.pageId,
    },
    success: (res) => {
      let { success, data } = res;
      if (success) {
        if (data && data.head) {
          formUtil.setAllFormValue({
            [FormConfig.formId]: data.head[FormConfig.formId],
          });
        }
        if (data && data.bodys) {
          TabsConfig.tabOrder &&
            cardTableUtil.setAllTabsData(
              data.bodys,
              TabsConfig.tabOrder,
              null,
              TabsConfig.tabOrder
            );
        }
      }
    },
  });
}

/**
 * 同步树鼠标滑过事件
 * @param {*} key - 叶子节点key
 */
export function onTreeMouseEnter(key) {
  let { TreeConfig, syncTree: TreeUtil } = this.props;
  TreeUtil.hideIcon(TreeConfig.treeId, key, {
    delIcon: false,
    editIcon: false,
    addIcon: false,
  });
}

/**
 * transfer组件左侧点击事件
 */
export function onTransferItemSelected(record, status) {}
