import { toast } from "nc-lightapp-front";
import { card } from "../../../../public/container/index";

/**
 * @param {Object} props - 页面内置对象
 * @param {String} key - 点击按钮的编码
 * @param {String} text - 按钮行内文本
 * @param {Object} record - 点击按钮所在行数据
 * @param {Number} index - 点击按钮所在行数据的索引
 */
export function bodyButtonClick(props, key, text, record, index) {
  let { TableConfig, cardTable: cardTableUtil } = this.props;
  // 当前页签
  let curTabKey = cardTableUtil.getCurTabKey();
  // 业务状态
  let status = this.props.getUrlParam("status");
  let checkedRows = cardTableUtil.getCheckedRows(TableConfig.tableCode);
  // 当前子表数据行数
  let rowsNum = cardTableUtil.getNumberOfRows(TableConfig.tableCode, false);
  // 新数据编号
  let orderCode =
    parseInt(rowsNum + 1) <= 9
      ? `00${rowsNum + 1}`
      : parseInt(rowsNum + 1) <= 99 && parseInt(rowsNum + 1) >= 10
      ? `0${rowsNum + 1}`
      : `${rowsNum + 1}`;
  let tempIndex = key === "InsertRow" ? index : rowsNum;
  switch (key) {
    // 肩部 新增
    case "AddRow":
    // 行内 插行
    case "InsertRow":
      if (curTabKey === "repayplan") {
        // xx子表
        cardTableUtil.addRow(TableConfig.tableCode, tempIndex);
      }
      break;
    //肩部 复制行
    case "CopyRow":
    card.copyRow.call(this);
    break;
    //肩部 取消复制
    case "CancelRow":
    card.cancelRow.call(this);
    break;
    //肩部 粘贴至末行
    case "CopyLastLine":
    card.copyLastLine.call(this);
    card.cardTableDeleteRowTriggerAfterEvent.call(this,"amount");
    break;          
    // 肩部 删除
    case "DeleteRow":
    // 行内 删行
    case "DelRow":
      if (record) {
        record.index = index;
        checkedRows = [{ data: record }];
      }
      checkedRows =
        checkedRows &&
        checkedRows.filter((item, index) => {
          if (item.data.status === "2") {
            return true;
          } else {
            toast({
              color: "warning",
              content: "",
            }); /* 国际化处理 ！ */
          }
        });
      checkedRows = checkedRows.map((item) =>
        record ? item.data.index : item.index
      );

      checkedRows.length > 0 &&
        cardTableUtil.delTabRowsByIndex(curTabKey, checkedRows);

      break;
    // 行内 粘贴至此
    case "CopyAtLine":
      card.copyAtLine.call(this, record, index);
      card.cardTableDeleteRowTriggerAfterEvent.call(this,"amount");
    break;
    // 行内 展开 - 编辑态
    case "Expand":
      card.openTabModal.call(this, record, index);
      break;
    // 行内 展开 - 浏览态
    case "Unfold":
    // 行内 收起 - 浏览态
    case "Fold":
      card.toggleRowView.call(this, record);
      break;
  }
}
