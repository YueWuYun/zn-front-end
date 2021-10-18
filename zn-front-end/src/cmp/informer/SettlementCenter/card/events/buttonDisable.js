/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/
export default function buttonDisable(props, moudleId, values, index, falg) {
	let selectedData = props.table.getCheckedRows(moudleId);
	if (selectedData.length == 1) {
		if (values.generateflag) {
			let generateflag = values.generateflag.value;
			if (generateflag == 'hasgenerate') {//已生成
				props.button.setButtonDisabled([
					'Cancelclaim', 'Generate', 'Cancelpublish'
				], true);
				props.button.setButtonDisabled([
					'Cancelgenerate', 'querybills'
				], false);
			} else if (generateflag == 'hasnogenerate') {//未生成
				props.button.setButtonDisabled([
					'Cancelclaim', 'Cancelgenerate', 'Generate', 'querybills', 'Cancelpublish'
				], true);
			} else if (generateflag == 'nogenerate') {//不生成
				props.button.setButtonDisabled([
					'Cancelclaim', 'Cancelgenerate', 'Generate', 'querybills', 'Cancelpublish'
				], true);
			} else if (generateflag == 'hasrelease') {//已发布
				props.button.setButtonDisabled([
					'Cancelpublish', 'Generate'
				], false);
				props.button.setButtonDisabled([
					'Cancelclaim', 'Cancelgenerate', 'querybills'
				], true);
			} else if (generateflag == 'hasclaim') {//已认领
				props.button.setButtonDisabled([
					'Cancelgenerate', 'querybills', 'Cancelpublish'
				], true);
				props.button.setButtonDisabled([
					'Cancelclaim', 'Generate'
				], false);
			} else if (generateflag == 'nclaunch') {//NC发起
				props.button.setButtonDisabled([
					'Cancelclaim', 'Cancelgenerate', 'Generate', 'querybills', 'Cancelpublish'
				], false);
			}
		}
	} else if (selectedData.length > 1 ) {
		props.button.setButtonDisabled([
			'Cancelclaim', 'Cancelgenerate', 'Generate', 'querybills', 'Cancelpublish'
		], false);
	}else if(selectedData.length == 0){
		props.button.setButtonDisabled([
			'Cancelclaim', 'Cancelgenerate', 'Generate', 'querybills', 'Cancelpublish'
		], true);
	}
}
/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/