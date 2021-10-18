/*64AO3iuMHno1LtAvd4KVPz8IC/s67MU6YRkvgfX4CFixSrhM3UWz+HCnAMPjMHmC*/
//应收票据退票——表体选择事件
import { disabledBodyButton } from '../../../../public/container/page';

const disabledBtn = ['deleteRow'];
//单选
export function bodySelectedEvent(props, moduleId, record, index, status) {
    let checkedRows = props.cardTable.getCheckedRows(this.tabCode);
    disabledBodyButton.call(this);
}

//全选
export function bodySelectedAllEvent(props, moduleId, status, length) {
    props.button.setButtonDisabled(disabledBtn, !status);
}

/*64AO3iuMHno1LtAvd4KVPz8IC/s67MU6YRkvgfX4CFixSrhM3UWz+HCnAMPjMHmC*/