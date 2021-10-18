/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { toast } from 'nc-lightapp-front';
import { linkpay, linkrate, linksettle, linkInterestList, linkcontract } from '../../action/link';
import { BusinessOperatorHead } from '../../action/interest';
import * as CONSTANTS from '../../const/constants';
import moment from 'moment';
let { CancelRedPreIntst_URL, redPreIntst_URL, CancelPreCalInst_URL, tableId } = CONSTANTS;
export default function (props, id) {

	let {  modal } = props;

	switch (id) {
		//预提
		case 'preIntst':
			let selectedData = props.table.getCheckedRows(tableId);
			if (IsSelectedDate(props, selectedData)) return;

			modal.show('tryinterest',{
				title: this.state.json['36362IWI-000008']/**国际化处理：预提日期录入 */,
				//点击确定按钮事件
				beSureBtnClick: beSureBtnClick.bind(this, props, 'preIntst')
			 });
			 break;

		//取消预提
		case 'cancelPreIntst':
			BusinessOperatorHead.call(this, id,
				this.state.json['36362IWI-000010'],
				CancelPreCalInst_URL,
				this.state.json['36362IWI-000011']
			);
			break;
		//试算
		case 'tryIntst':
			let selectedOneData = props.table.getCheckedRows(tableId);
			if (IsSelectedOneDate(props, selectedOneData)) return;
			modal.show('tryinterest',{
				title: this.state.json['36362IWI-000012']/**国际化处理：试算日期录入 */,
				//点击确定按钮事件
				beSureBtnClick: beSureBtnClick.bind(this, props, 'tryIntst')
			 });
			 break;

		// 刷新
		case 'refresh':
			this.refresh();
			break;
		// 联查-贷款合同
		case 'linkcontract':
			linkcontract.call(this, props);
			break;
		// 联查-放款单
		case 'linkpay':
			linkpay.call(this, props);
			break;
		// 联查-利率
		case 'linkrate':
			linkrate.call(this, props);
			break;
		// 联查-结息日
		case 'linksettle':
			linksettle.call(this, props);
			break;
		//联查-利息清单
		case 'linkintererst':
			linkInterestList.call(this, props);
			break;
		case 'close_preIntst':
			this.setState({
				showWithholdingModal: false
			});
			break;
		// 预提利息-确认
		case 'confirm_preIntst':
			let begdate = props.form.getFormItemsValue('date', 'begindate').value;
			let enddate = props.form.getFormItemsValue('date', 'enddate').value;
			let value = {
				beginDate: begdate,
				endDate: enddate
			};
			if (validDate.call(this, props)) {
				this.handleDateModalConfirm('preIntst', value);
			}
			break;
		// 冲补预提
		case 'redPreIntst':
			BusinessOperatorHead.call(this, id,
				this.state.json['36362IWI-000021'],
				redPreIntst_URL,
				this.state.json['36362IWI-000022']
			);
			break;
		// 取消冲补预提
		case 'cancelRedPreIntst':
			BusinessOperatorHead.call(this, id,
				this.state.json['36362IWI-000023'],
				CancelRedPreIntst_URL,
				this.state.json['36362IWI-000024']
			);
			break;
	}
}

//校验
function validDate(props) {
	let valid = true;
	let beginDate = this.state.startdate;
	let endDate = this.state.enddate;
	if (!endDate) {
		toast({ duration: 3, color: 'warning', content: `${this.state.json["36362IWI-000020"]}` });/* 国际化处理： 请输入*/
		valid = false;
		return;
	} else if (endDate && beginDate && !moment(beginDate).isSame(endDate) && !moment(beginDate).isBefore(endDate)) {
		toast({ duration: 3, color: 'warning', content: `${this.state.json["36362IWI-000019"]}` });/* 国际化处理： 必须晚于*/
		valid = false;
		return;
	}
	return valid;
}

function IsSelectedOneDate(props, selectedData) {
	if (selectedData.length == 0) {
		toast({
			content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000001'),
			color: 'warning'
		});
		return true;
	}
	if (selectedData.length > 1) {
		toast({
			content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000002'),
			color: 'warning'
		});
		return true;
	}
	return false;
}

function IsSelectedDate(props, selectedData) {
	if (selectedData.length == 0) {
		toast({
			content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000001'),
			color: 'warning'
		});
		return true;
	}
	return false;
}

function beSureBtnClick(props,type){
	let begdate = this.state.startdate;
	let enddate = this.state.enddate;
	let value = {
		beginDate: begdate,
		endDate: enddate
	};
	if (validDate.call(this, props)) {
		this.handleDateModalConfirm(type, value);
	}
}
/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/