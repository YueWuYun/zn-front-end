//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import addBtnClick from './addBtnClick';
import editBtnClick from './editBtnClick';
import deleteBtnClick from './deleteBtnClick';
import cancelBtnClick from './cancelBtnClick';
import { BUTTONS } from '../constance';
import commonSearch from './commonSearch';
import searchBtnClick from './searchBtnClick';
import refreshBtnClick from './refreshBtnClick';
import saveBtnClick from './saveBtnClick';
import printBtnClick from './printBtnClick';
import sealBtnClick from './sealBtnClick';
import unSealBtnClick from './unSealBrnClick';
/**
 * 
 * @param {*} props 
 * @param {*} key 
 * @param {*} record 
 * @param {*} index 
 * @param {*} isLine 是否是行操作
 */
function btnClick(props, key, record, index, isLine) {
	switch (key) {
		case BUTTONS.Add:
			addBtnClick.call(this, props);
			break;
		case BUTTONS.Edit:
			editBtnClick.call(this, props); //修改
			break;
		case BUTTONS.Delete:
			deleteBtnClick.call(this, props, record, index, isLine);
			break;
		case BUTTONS.Refresh:
			refreshBtnClick.call(this, props, true); //刷新等于重新查询
			break;
		case BUTTONS.Save:
			saveBtnClick.call(this, props);
			break;
		case BUTTONS.Cancel:
			cancelBtnClick.call(this, props);
			break;
		case BUTTONS.Print:
			printBtnClick.call(this, props);
			break;
		case BUTTONS.Output:
			printBtnClick.call(this, props, true);
			break;
	}
}

export { btnClick, searchBtnClick, commonSearch, sealBtnClick, unSealBtnClick };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65