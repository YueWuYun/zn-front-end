/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { allBtns, list } from "../../cons/constant";

/**
 * 渲染页面按钮的显示
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
  props.button.setButtonVisible(
    ["DiscountCalculate", "Refresh", "Print", "Output"],
    true
  );
  let rows = props.editTable.getNumberOfRows(list.tableCode);
  if (!rows || rows.length == 0) {
    props.button.setButtonDisabled(allBtns, true);
  } else {
    props.button.setButtonDisabled(allBtns, false);
  }
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/