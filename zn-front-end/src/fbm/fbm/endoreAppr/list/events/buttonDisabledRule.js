/*afoINjMpKKfReN3KEYgXo57MfxcO6EZSMF5j+AqaY3/9zndgwPdeYDWX1anr4Pd8*/
import { LIST_BTN } from "../../cons/constant";

export default function buttonDisabledRule() {
    let selectedRowsLength = this.props.table.getCheckedRows(this.tableId).length;
    let checkRows =  this.props.table.getCheckedRows(this.tableId);

	// 获取表格头部按钮
    let btns = this.props.button.getButtons().filter((item) => item.area === this.listHeadButtonArea);
    // 获取需要进行规则控制的按钮
    btns = btnStatusControl(btns);
    // 先将要控制的按钮都置为不可用
    this.props.button.setButtonDisabled(btns, true);
	// 根据列表选中行数 判断当前列表可用按钮
	if (selectedRowsLength === 0) {//未选择数据
        // 都不可用
		this.props.button.setButtonDisabled(btns, true);
	} else if (selectedRowsLength === 1){//选择一条数据
        // 根据单据数据判断可用的按钮,并设置其可用
        let enableBtn = selectEnableBtn(btns, checkRows[0]);
		this.props.button.setButtonDisabled(enableBtn, false);
	} else if (selectedRowsLength > 1) {//选择多条数据
        // 都可用
        this.props.button.setButtonDisabled(btns, false);
    }
}
/**
 * 按钮整理 Add,refresh,import,export 按钮不需要进行规则限制
 * @param {*} buttons 列表头部全部按钮对象的集合
 */
const btnStatusControl = (buttons) => {
	let btnsArray = [];
	const handleFunc = (btns) => {
		btns.map((item) => {
            if (item.key !== LIST_BTN.add 
                && item.key !== LIST_BTN.refresh 
                && item.key !== LIST_BTN.import
                && item.key !== LIST_BTN.export
                && item.key !== LIST_BTN.more) {
				btnsArray.push(item.key);
			}
			if (item.children && item.children.length > 0) {
				handleFunc(item.children);
			}
		});
	};
	handleFunc(buttons);
	return btnsArray;
};

/**
 *  只选择一条数据，按钮整理， 根据单据数据选择出可用的按钮
 * 
 * @param {*} buttons 
 * @param {*} checkedRow 
 */
const selectEnableBtn = (buttons,checkedRow) => {
    let billstatus = checkedRow.data.values.vbillstatus.value;
    // let isBillReceive = e.data.values.sfflag.value;  
    // let isnetBank = e.data.values.onlinebankflag.value;
    let removeDelBtn;
	if (billstatus !== '-1'){// 单据非自由态，去除删除按钮
        removeDelBtn = true;
    }
    let btns = [];
    buttons.map((item) => {
        if (item === LIST_BTN.delete){
            if (!removeDelBtn){
                btns.push(item);
            }
        }else {
            btns.push(item);
        }
    });
	return btns;
};

/*afoINjMpKKfReN3KEYgXo57MfxcO6EZSMF5j+AqaY3/9zndgwPdeYDWX1anr4Pd8*/