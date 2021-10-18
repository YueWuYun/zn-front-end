/*64AO3iuMHno1LtAvd4KVPz8IC/s67MU6YRkvgfX4CFixSrhM3UWz+HCnAMPjMHmC*/
import { disabledBodyButton } from "../../../../public/container/page";

const disabledBtn = ["deleteRow"];
//单选
export function bodySelectedEvent(props, moduleId, record, index, status) {
  disabledBodyButton.call(this);
}

//全选
export function bodySelectedAllEvent(props, moduleId, status, length) {
  props.button.setButtonDisabled(disabledBtn, !status);
}

/*64AO3iuMHno1LtAvd4KVPz8IC/s67MU6YRkvgfX4CFixSrhM3UWz+HCnAMPjMHmC*/