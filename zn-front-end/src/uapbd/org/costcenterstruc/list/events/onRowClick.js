//UM7fvRi3NUp/fLEfXMaYuhJS5txl//TvxAIfRAFotd5y2rYLZk35703jzTw+71Hg
import { ajax, toast } from 'nc-lightapp-front';
export default function onRowClick(props, moduleId, record, index, e) {
    let _this = this;
    if (this.state.bodyMap && record.pk_barappobject && record.pk_barappobject.value) {
        if (this.state.bodyMap[record.pk_barappobject.value]) {
            props.cardTable.setTableData('body', this.state.bodyMap[record.pk_barappobject.value].body);
        } else {
            _this.findChildbypk(record.pk_barappobject.value);
        }
    }
}

//UM7fvRi3NUp/fLEfXMaYuhJS5txl//TvxAIfRAFotd5y2rYLZk35703jzTw+71Hg