//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import {AREA} from "../../../constance";

function btnClicks(props, key) {
    switch (key) {
        case 'Copy'://复制
            let datas = props.editTable.getCheckedRows(AREA.power);
            let rows = [];
            datas.map((item) => {
                rows.push(item.data.values);
            })

            this.setState({copyedRows: rows})
            break;
        case 'Paste'://黏贴
            let length = props.editTable.getNumberOfRows(AREA.power);
            this.state.copyedRows.map((item) => {
                props.editTable.addRow(AREA.power, length, false, item);
                length++;
            })
            this.setState({copyedRows:[]})
            break;
        case 'Delete'://删行
            let selected = props.editTable.getCheckedRows(AREA.power);
            let indexs = [];
            selected.map((item)=>{
                indexs.push(item.index);
            })
            props.editTable.deleteTableRowsByIndex(AREA.power, indexs)
            break;
        default:
            break;
    }
}

export {btnClicks};
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65