import { toggleListHeadBtnDisabled } from "../../../container/listUtils";
//单选
export function selectedEvent(props, moduleId, record, index, status) {
  toggleListHeadBtnDisabled.call(this);
}
