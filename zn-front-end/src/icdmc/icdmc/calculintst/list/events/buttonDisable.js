/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import * as CONSTANTS from '../../const/constants';
let { tableId } = CONSTANTS;
export default function buttonDisable(props) {
	let selectedData = props.table.getCheckedRows(tableId);
	if (selectedData.length > 0) {
		props.button.setButtonDisabled([
			'calcIntst', 'cancelIntst', 'preIntst', 'cancelPreIntst', 
			//'link',
			'linkbtn', 'linkpay', 'linkrate', 'linksettle','linkintererst','tryIntst','linkcontract'
		], false);
	} else if (selectedData.length == 0) {
		props.button.setButtonDisabled([
			'calcIntst', 'cancelIntst', 'preIntst', 'cancelPreIntst', 
			//'link',
			'linkbtn', 'linkpay', 'linkrate', 'linksettle','linkintererst','tryIntst','linkcontract'
		], true);
	}
}
/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/