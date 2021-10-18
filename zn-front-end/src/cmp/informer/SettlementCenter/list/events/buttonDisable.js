/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/
export default function buttonDisable(props, moudleId, values, index, falg) {
	let selectedData = props.table.getCheckedRows(moudleId);
	if (selectedData.length == 1) {
		let generateflag = selectedData[0].data.values.generateflag.value;
		if (generateflag == 'hasgenerate') {//已生成
			props.button.setButtonDisabled([
				'Nopublish', 'Subpublish', 'Cancelpublish', 'Recgenerate',
				'Compublish', 'Generate','refund'
			], true);
			props.button.setButtonDisabled([
				'Cancelgenerate', 'querybills', 'printbtn'
			], false);
		} else if (generateflag == 'hasnogenerate') {//未生成
			props.button.setButtonDisabled([
				'Cancelgenerate', 'Cancelpublish', 'Recgenerate', 'querybills'
			], true);
			props.button.setButtonDisabled([
				'Nopublish', 'Subpublish', 'Compublish', 'Generate', 'printbtn','refund'
			], false);
		} else if (generateflag == 'nogenerate') {//不生成
			props.button.setButtonDisabled([
				'Nopublish', 'Subpublish', 'Cancelpublish', 'Cancelgenerate',
				'Compublish', 'Generate', 'querybills','refund'
			], true);
			props.button.setButtonDisabled([
				'Recgenerate', 'printbtn'
			], false);
		} else if (generateflag == 'hasrelease') {//已发布
			props.button.setButtonDisabled(['Cancelgenerate', 'Recgenerate', 'querybills', 'Nopublish'
			], true);
			props.button.setButtonDisabled([
				'Subpublish', 'Cancelpublish', 'Compublish', 'Generate', 'printbtn','refund'
			], false);
		} else if (generateflag == 'hasclaim' || generateflag == 'nclaunch') {//已认领,NC发起
			props.button.setButtonDisabled([
				'Nopublish', 'Subpublish', 'Cancelgenerate', 'Cancelpublish', 'Recgenerate',
				'Compublish', 'Generate', 'querybills', 'printbtn','refund'
			], false);
		}
	} else if (selectedData.length > 1) {
		props.button.setButtonDisabled([
			'Nopublish', 'Subpublish', 'Cancelgenerate', 'Cancelpublish', 'Recgenerate',
			'Compublish', 'Generate', 'querybills', 'printbtn'
		], false);
		props.button.setButtonDisabled([
			'refund'
		], true);
	} else if (selectedData.length == 0) {
		props.button.setButtonDisabled([
			'Nopublish', 'Subpublish', 'Cancelgenerate', 'Cancelpublish', 'Recgenerate',
			'Compublish', 'Generate', 'querybills', 'printbtn','refund'
		], true);
	}
}
/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/