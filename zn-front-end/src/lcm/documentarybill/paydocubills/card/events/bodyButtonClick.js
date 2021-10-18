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
        // 获取放款计划所有行数据
        let tableValues = cardTableUtil.getTabData("repayplan").rows;  
        tableValues  = tableValues.map(item =>{
            let codenum =item.values.repaycode.value.replace("R","");
            return parseInt(codenum);
          }
        );
        let minreCode = Math.min(...tableValues);
        let maxreCode = Math.max(...tableValues);
        let recodeorder =parseInt(maxreCode + 1) <= 9
          ? `00${maxreCode + 1}`
          : parseInt(maxreCode + 1) <= 99 && parseInt(maxreCode + 1) >= 10
          ? `0${maxreCode + 1}`
          : `${maxreCode + 1}`;
        // 放款计划
        cardTableUtil.addRow(TableConfig.tableCode, tempIndex, {
          repaycode: { display:"R"+ recodeorder, value: "R"+recodeorder}, // 还款编号 00x
        });
        // 更新放款编号 需要根据显示顺序从小到大更新
        key === "InsertRow" &&
          card.updatePlanOrderCode.call(this, "repaycode", minreCode - 1,"R",repaycode);
        // xx子表
        card.cardTableDeleteRowTriggerAfterEvent.call(this,"preamount");
        card.cardTableDeleteRowTriggerAfterEvent.call(this,"preinterest");
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
      break;          
    // 肩部 删除
    case "DeleteRow":
    // 行内 删行
    case "DelRow":
      if (record) {
        record.index = index;
        checkedRows = [{ data: record }];
      }
      checkedRows = checkedRows.map((item) =>
        record ? item.data.index : item.index
      );

      checkedRows.length > 0 &&
        cardTableUtil.delTabRowsByIndex(curTabKey, checkedRows);
      card.cardTableDeleteRowTriggerAfterEvent.call(this,"preamount");
      card.cardTableDeleteRowTriggerAfterEvent.call(this,"preinterest");
      break;
    // 行内 粘贴至此
    case "CopyAtLine":
      card.copyAtLine.call(this, record, index);
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
