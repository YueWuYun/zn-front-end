//64AO3iuMHno1LtAvd4KVPy8jci/sJmrvyg7Sjb4K9pj+SLFc39GxOX9XR9DroFRW
import { CARD_BUTTON, CARD } from "../../constant";

const disabledBtn = [CARD_BUTTON.deleteRow];
//单选
export function bodySelectedEvent(props, moduleId, record, index, status) {
    let checkedRows = props.cardTable.getCheckedRows(CARD.table_code);
    if (checkedRows.length > 0) {
        props.button.setButtonDisabled(disabledBtn, false);
    } else {
        props.button.setButtonDisabled(disabledBtn, true);
    }
}

//全选
export function bodySelectedAllEvent(props, moduleId, status, length) {
    props.button.setButtonDisabled(disabledBtn, !status);
}

//64AO3iuMHno1LtAvd4KVPy8jci/sJmrvyg7Sjb4K9pj+SLFc39GxOX9XR9DroFRW