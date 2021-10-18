/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { toast } from 'nc-lightapp-front';
import { linkpay, linkrate, linksettle, linkInterestList, linkcontract } from '../../action/link';
import { BusinessOperatorHead } from '../../action/interest';
import * as CONSTANTS from '../../const/constants';
import moment from 'moment';
let { CalInst_URL, CancelCalInst_URL, CancelPreCalInst_URL, tableId } = CONSTANTS;
import  buttonDisable  from './buttonDisable';
export default function (props, id) {

	let {  modal } = props;

	switch (id) {
		//计息
		case 'calcIntst':
			BusinessOperatorHead.call(this, id,
				this.state.json['36360ICI-000004'],
				CalInst_URL,
				this.state.json['36360ICI-000005']
			);
			//buttonDisable.call(this,props);
			break;
		//取消计息
		case 'cancelIntst':
			BusinessOperatorHead.call(this, id,
				this.state.json['36360ICI-000006'],
				CancelCalInst_URL,
				this.state.json['36360ICI-000007']
			);
			break;
		//预提
		case 'preIntst':
			// let selectedData = props.table.getCheckedRows(tableId);
			// if (IsSelectedDate(props, selectedData)) return;
			// props.form.setFormStatus('date', "edit");
			// if (selectedData.length == 1) {
			// 	props.form.setFormItemsDisabled('date', { 'begindate': false });
			// 	props.form.setFormItemsValue('date', { 'begindate': { value: null } });
			// } else {
			// 	props.form.setFormItemsDisabled('date', { 'begindate': true });
			// 	props.form.setFormItemsValue('date', { 'begindate': { value: null } });
			// }
			// this.setState({
			// 	showWithholdingModal: true
			// });
			// break;

			let selectedData = props.table.getCheckedRows(tableId);
			if (IsSelectedDate(props, selectedData)) return;

			 if(selectedData.length==1){
				modal.show('tryinterest',{
					title: this.state.json['36360ICI-000008']/**国际化处理：预提日期录入 */,
					//点击确定按钮事件
					beSureBtnClick: beSureBtnClick.bind(this, props, 'preIntst')
				 });
			}else{
				modal.show('tryinterest2',{
					title: this.state.json['36360ICI-000008']/**国际化处理：预提日期录入 */,
					//点击确定按钮事件
					beSureBtnClick: beSureBtnClick.bind(this, props, 'preIntst')
				 });
			}

			 break;

		//取消预提
		case 'cancelPreIntst':
			BusinessOperatorHead.call(this, id,
				this.state.json['36360ICI-000010'],
				CancelPreCalInst_URL,
				this.state.json['36360ICI-000011']
			);
			break;
		//试算
		case 'tryIntst':
			// let selectedOneData = props.table.getCheckedRows(tableId);
			// if (IsSelectedOneDate(props, selectedOneData)) return;
			// this.setState({
			// 	showInterestTrialModal: true
			// });
			// break;
			let selectedOneData = props.table.getCheckedRows(tableId);
			if (IsSelectedOneDate(props, selectedOneData)) return;
			modal.show('tryinterest',{
				title: this.state.json['36360ICI-000012']/**国际化处理：试算日期录入 */,
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
	}
}

//校验
function validDate(props) {
	let valid = true;
	let beginDate = this.state.startdate;
	let endDate = this.state.enddate;
	if (!endDate) {
		toast({ duration: 3, color: 'warning', content: `${this.state.json["36360ICI-000020"]}` });/* 国际化处理： 请输入*/
		valid = false;
		return;
	} else if (endDate && beginDate && !moment(beginDate).isSame(endDate) && !moment(beginDate).isBefore(endDate)) {
		toast({ duration: 3, color: 'warning', content: `${this.state.json["36360ICI-000019"]}` });/* 国际化处理： 必须晚于*/
		valid = false;
		return;
	}
	return valid;
}

function IsSelectedOneDate(props, selectedData) {
	if (selectedData.length == 0) {
		toast({
			content: props.MutiInit.getIntl("36360ICI") && props.MutiInit.getIntl("36360ICI").get('36360ICI-000001'),
			color: 'warning'
		});
		return true;
	}
	if (selectedData.length > 1) {
		toast({
			content: props.MutiInit.getIntl("36360ICI") && props.MutiInit.getIntl("36360ICI").get('36360ICI-000002'),
			color: 'warning'
		});
		return true;
	}
	return false;
}

function IsSelectedDate(props, selectedData) {
	if (selectedData.length == 0) {
		toast({
			content: props.MutiInit.getIntl("36360ICI") && props.MutiInit.getIntl("36360ICI").get('36360ICI-000001'),
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