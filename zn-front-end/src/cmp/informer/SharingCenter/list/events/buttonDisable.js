/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/
export default function buttonDisable(props, moudleId, values, index, falg) {
	let selectedData = props.table.getCheckedRows(moudleId);
	if (selectedData.length == 1) {
		if (values.generateflag) {
			let generateflag = values.generateflag.value;
			if (generateflag == 'hasgenerate') {//已生成
				let moneyy = values.moneyy.value;
				let usemoney = values.usemoney.value;
				if(moneyy && usemoney && moneyy - usemoney>0){
					props.button.setButtonDisabled([
						'cancelpublish','ungenerate', 'regenerate'
					], true);
					props.button.setButtonDisabled([
						'printbtn','publish'
					], false);
				}else{
					props.button.setButtonDisabled([
						'publish', 'cancelpublish', 'ungenerate', 'regenerate'
					], true);
					props.button.setButtonDisabled([
						'printbtn'
					], false);
				}
			} else if (generateflag == 'hasnogenerate') {//未生成
				props.button.setButtonDisabled([
					'cancelpublish', 'regenerate'
				], true);
				props.button.setButtonDisabled([
					'publish', 'ungenerate', 'printbtn'
				], false);
			} else if (generateflag == 'nogenerate') {//不生成
				props.button.setButtonDisabled([
					'publish', 'cancelpublish', 'ungenerate'
				], true);
				props.button.setButtonDisabled([
					'regenerate', 'printbtn'
				], false);
			} else if (generateflag == 'hasrelease') {//已发布
				props.button.setButtonDisabled([
					'ungenerate', 'regenerate'
				], true);
				props.button.setButtonDisabled([
					'publish', 'cancelpublish', 'printbtn'
				], false);
			} else if (generateflag == 'hasclaim' || generateflag == 'nclaunch') {//已认领,NC发起
				props.button.setButtonDisabled([
					'publish', 'cancelpublish', 'ungenerate', 'regenerate', 'printbtn'
				], false);
			}
		}
	} else if (selectedData.length > 1) {
		props.button.setButtonDisabled([
			'publish', 'cancelpublish', 'ungenerate', 'regenerate', 'printbtn'
		], false);
	} else if (selectedData.length == 0) {
		props.button.setButtonDisabled([
			'publish', 'cancelpublish', 'ungenerate', 'regenerate', 'printbtn'
		], true);
	}
}
/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/