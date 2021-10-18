/*Y6Wi9IWEk3vTqHzubjboNLNXw6C6ebnLe0Tzt3sSmAuih0E+GMTSv2jIEOFUizH9*/
import { toggleListHeadBtnDisabled } from '../../../container/page';

//单选
export function selectedEvent(props, moduleId, record, index, status) {
    toggleListHeadBtnDisabled.call(this);
    this.props.onTableSelect && this.props.onTableSelect(props, moduleId, record, index, status);
}

export function selectedAllEvent(props, moduleId, status, length) {
    toggleListHeadBtnDisabled.call(this);
    this.props.onTableSelectAll && this.props.onTableSelectAll(props, moduleId, status, length);
}
/*Y6Wi9IWEk3vTqHzubjboNLNXw6C6ebnLe0Tzt3sSmAuih0E+GMTSv2jIEOFUizH9*/