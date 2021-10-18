/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/
export default function buttonDisable(props, moudleId, values, index, falg) {
	let selectedData = props.table.getCheckedRows(moudleId);
	if (selectedData.length == 1) {
		if (values.generateflag) {
			let generateflag = values.generateflag.value;
			let moneyy = values.moneyy.value;
			let ly_money = values.ly_money.value;
			//如果发布金额大于已经认领金额 则发布和取消发布是亮的
			
			if(parseFloat(moneyy.replace(/[^\d\.-]/g, "")) - parseFloat(ly_money.replace(/[^\d\.-]/g, ""))>0){
				props.button.setButtonDisabled([
					'publish', 'unpublish', 'printbtn'
				], false);
			}else{
				props.button.setButtonDisabled([
					'publish', 'unpublish'
				], true);
				props.button.setButtonDisabled([
					'printbtn'
				], false);
			}
			// if (generateflag == 'hasgenerate') {//已生成
			// 	props.button.setButtonDisabled([
			// 		'publish', 'unpublish'
			// 	], true);
			// 	props.button.setButtonDisabled([
			// 		'printbtn'
			// 	], false);
			// } else if (generateflag == 'nogenerate') {//不生成
			// 	props.button.setButtonDisabled([
			// 		'publish', 'unpublish'
			// 	], true);
			// 	props.button.setButtonDisabled([
			// 		'printbtn'
			// 	], false);
			// } else if (generateflag == 'hasrelease' || generateflag == 'hasclaim' || generateflag == 'nclaunch' || generateflag == 'hasnogenerate') {//已认领,NC发起
			// 	props.button.setButtonDisabled([
			// 		'publish', 'unpublish', 'printbtn'
			// 	], false);
			// }
		}
	} else if (selectedData.length > 1) {
		props.button.setButtonDisabled([
			'publish', 'unpublish', 'printbtn'
		], false);
	} else if (selectedData.length == 0) {
		props.button.setButtonDisabled([
			'publish', 'unpublish'
		], true);
	}
}
/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/