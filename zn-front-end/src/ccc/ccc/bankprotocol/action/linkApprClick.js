/*Y7lnAVsOJUrFiEwlEuz9hoGAxa3aRSAlWzydYKjjE+PdRIWMcGw2Z8OltNWVuHdf*/
import { toast } from 'nc-lightapp-front';
import { TEMPLATE } from '../constant/constant';
/**
 * 联查审批详情
 * @param {*} props 
 */
export default function linkApprClick(props, key) {
	if (key == 'list') {
		let approvemsgData = this.props.table.getCheckedRows(this.tableId);
		//数据校验
		if (approvemsgData.length != 1) {
			toast({
				color: 'warning',
				content: this.state.json['36610CC-000000'] /* 国际化处理： 请选择单条数据，查看审批意见!*/
			});
			return;
		}
		//处理选择数据
		let billversionpk;
		let approve_billtype;
		approvemsgData.forEach((val) => {
			if (val.data.values.pk_protocol && val.data.values.pk_protocol.value) {
				billversionpk = val.data.values.pk_protocol.value;
			}
			if (val.data.values.pk_billtypecode && val.data.values.pk_billtypecode.value) {
				approve_billtype = val.data.values.pk_billtypecode.value;
			}
		});
		if (billversionpk) {
			this.setState({
				showApprove: true,
				billType: approve_billtype, //单据类型
				billID: billversionpk //单据pk
			});
		}
	} else if (key == 'card') {
		let pk_link = props.form.getFormItemsValue(TEMPLATE.FORM_ID, 'pk_protocol').value; //单据pk
		this.setState(
			{
				billid: pk_link, //单据pk
				billtype: '36X1'
			},
			() => {
				this.setState({
					showAppr: true
				});
			}
		);
	}
}

/*Y7lnAVsOJUrFiEwlEuz9hoGAxa3aRSAlWzydYKjjE+PdRIWMcGw2Z8OltNWVuHdf*/