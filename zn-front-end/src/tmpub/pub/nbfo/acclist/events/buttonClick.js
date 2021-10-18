/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { print, promptBox } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl, accCard, accList, accPrintData } from '../../cons/constant.js';
import { bodyBtnOperation } from './bodyButtonClick';
import { searchBtnClick } from './search';
import { CARD } from '../../../interestrate/cons/constant.js';

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
	let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
	let checkDelDataLen = props.table.getCheckedRows(accList.tableCode).length; //获取勾选的行
	let pks =
		selectDatas &&
		selectDatas.map(
			(item) => item.data.values && item.data.values[this.primaryId] && item.data.values[this.primaryId].value
		);
	let pkMapTs = new Map();
	selectDatas &&
		selectDatas.map((e) => {
			let pk = e.data.values[this.primaryId].value;
			let ts = e.data.values['ts'] && e.data.values['ts'].value;
			if (pk && ts) {
				pkMapTs.set(pk, ts);
			}
		});
	switch (id) {
		//头部 新增
		case 'add':
			addBill.call(this, props);
			break;
		//头部 删除
		case 'Delete':
			delBill.call(this, checkDelDataLen, pks, pkMapTs);
			break;
		//头部 打印
		case 'Print':
			printBill.call(this, pks, selectDatas);
			break;
		//头部 输出
		case 'Output':
			outPutBill.call(this, pks);
			break;
		//头部 刷新
		case 'Refresh':
			this.setState({ showToast: false });
			searchBtnClick.call(this, props);
			break;
		default:
			break;
	}
}

/**
 * 新增
 * @param {*} props 页面内置对象
 */
function addBill(props) {
	let namePk = this.props.getUrlParam('namePk');
	let name = this.props.getUrlParam('name');
	let nonbankPk = this.props.getUrlParam('nonbankPk');
	props.pushTo('/card', {
		namePk: namePk ? namePk : nonbankPk,
		name: name,
		status: 'add',
		pagecode: CARD.page_id
	});
}

/**
 * 删除
 * @param {*} checkDelDataLen  删除数组长度
 * @param {*} pks              删除pks
 */
function delBill(checkDelDataLen, pks, pkMapTs) {
	promptBox({
		color: 'warning',
		title: this.state.json['36010NBFO-000004'] /* 国际化处理： 删除*/,
		content:
			checkDelDataLen == 1
				? this.state.json['36010NBFO-000005']
				: this.state.json['36010NBFO-000022'] /* 国际化处理： 确定要删除吗?,确定删除所选数据吗?*/,
		beSureBtnClick: () => {
			let batchFlag = checkDelDataLen == 1 ? false : true;
			bodyBtnOperation.call(
				this,
				{ pks, pkMapTs },
				javaUrl.accListDelete,
				this.state.json['36010NBFO-000006'],
				batchFlag
			); /* 国际化处理： 删除成功!*/
		}
	});
}

/**
 * 打印
 * @param {*} pks          打印pks
 * @param {*} selectDatas  选择的数据
 */
function printBill(pks, selectDatas) {
	accPrintData.oids = pks;
	print('pdf', `${baseReqUrl}${javaUrl.accPrint}.do`, {
		...accPrintData,
		userjson: JSON.stringify(selectDatas)
	});
}

/**
 * 输出
 * @param {*} pks    输出的pks
 */
function outPutBill(pks) {
	accPrintData.oids = pks;
	this.setState(
		{
			printOut: {
				appcode: this.appcode,
				nodekey: '', //模板节点标识
				outputType: 'output',
				oids: pks
			}
		},
		() => {
			this.refs.printOutput.open();
		}
	);
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/