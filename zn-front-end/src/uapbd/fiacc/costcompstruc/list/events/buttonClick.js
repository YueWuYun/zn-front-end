//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, cacheTools, cardCache, toast, promptBox } from 'nc-lightapp-front';
import { headButton } from '../../../../public/excomponents/pubUtils/buttonName.js';
import { batchDelRow, refreshFun, onPrint, onOutput,exportlFun,openBillTrack} from './costCompStruc.js';
/**
 * 列表肩部按钮事件
 */
export default function buttonClick(props, id) {
	let that = this;
	switch (id) {
		//新增
		case headButton.Add:
			props.pushTo('/card', {
				status: 'add'
			});
			break;
		//删除
		case headButton.Delete:
			batchDelRow(that, props);
			break;
		//刷新
		case headButton.Refresh:
			refreshFun(that, props);
			break;
		//打印
		case headButton.Print:
			onPrint(that, props);
			break;
		// 输出
		case headButton.Output:
			onOutput(that, props);
			break;
		//导入
		case headButton.ImportData: 
		    break;
		//导出
		case headButton.ExportData:
		    exportlFun(that, props);
			break;
		//联查单据
		case headButton.BillLinkQuery:
			openBillTrack(that,props);
			break;
		case headButton.Distribution:
			this.isModalShow();
			break;
		case headButton.CancelDistri:
			this.cancelModalShow();
			break;
		default:
			;
			break;
	}
}
//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS