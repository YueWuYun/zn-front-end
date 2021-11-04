//WC7zMkBIJUnqT34xppgOFV65qIOgIdDfze1B99cjDrrvvQTG9/vKqqbh5Xsz9w9FUtJ7Xwi3dLwr
//qEtCAObs8g==
/*
 * @Author: qiaobb 
 * @PageInfo: 导入功能  
 * @Date: 2018-07-04 10:11:06 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-07-09 10:06:58
 */

import { BUTTONID, AREA, FIELD, UISTATE, URL } from '../../constance';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
export default function(props) {
	const config = {
		action: URL.import,
		headers: {
			authorization: 'authorization-text'
		},
		data: {
			billType: 'barcodeparse',
			moduleName: 'uapbd'
		},
		onChange: (info) => {
			const status = info.file.status;
			let response = info.file.response;
			if (status === UISTATE.done) {
				if (response.success) {
					props.editTable.setTableData(AREA.tableArea, response.data[AREA.tableArea]);
				} else {
					showWarningInfo(null, response.error.message);
				}
			} else if (status === 'error') {
				console.log(`${info.file.name} file upload failed.`);
			}
		}
	};
	props.button.setUploadConfig(BUTTONID.import, config);
}

//WC7zMkBIJUnqT34xppgOFV65qIOgIdDfze1B99cjDrrvvQTG9/vKqqbh5Xsz9w9FUtJ7Xwi3dLwr
//qEtCAObs8g==