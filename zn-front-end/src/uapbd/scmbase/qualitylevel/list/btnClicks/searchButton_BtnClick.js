//eEcHBoOEic6fd6IEEmDcmKjvlwtPYB2XEHpoFPpATlr1Iuwo4PtG3Eqf3uzO1+fSfMMRjut2w5P8
//9uiP3ACL8g==
/*
 * @Author: 刘奇 
 * @PageInfo: 根据编码和名称进行查询（暂时没用）  
 * @Date: 2018-06-05 20:42:32 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-10 13:59:15
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL } from '../../constance';
export default function searchButton_BtnClick(props) {
	ajax({
		url: URL.search,
		data: this.state.value,
		success: (res) => {
			if (res.data == undefined) {
				props.editTable.setTableData(AREA.headTableArea, { rows: [] });
				props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
			} else {
				if (res.data.head == undefined) {
					props.editTable.setTableData(AREA.headTableArea, { rows: [] });
				} else {
					props.editTable.setTableData(AREA.headTableArea, res.data.head[AREA.headTableArea]);
				}
				if (res.data.body == undefined) {
					props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
				} else {
					props.editTable.setTableData(AREA.bodyTableArea, res.data.body[AREA.bodyTableArea]);
				}
			}
		}
	});
}

//eEcHBoOEic6fd6IEEmDcmKjvlwtPYB2XEHpoFPpATlr1Iuwo4PtG3Eqf3uzO1+fSfMMRjut2w5P8
//9uiP3ACL8g==