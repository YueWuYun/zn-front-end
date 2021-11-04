//Ul4F8fkq5E+3GAjBdCwg7KzsNK6Sj/Q6D/AmBNfp4diHe4XKYtuhrscLyWt66ovh
/*
 * @Author: 刘奇 
 * @PageInfo: 保存实现  
 * @Date: 2018-06-04 19:45:27 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2020-04-24 15:26:07
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, STATUS, URL } from '../../constance';
import { onRow_BtnClick } from './index.js';
import { showErrorInfo, showSaveInfo } from '../../../pub/tool/messageUtil.js';
import { updateEditTableRows } from '../../../pub/tool/editTableTools';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { buttonControl } from '../viewController/buttonController';
export default function save_BtnClick(props) {
	setTimeout(() => {
		let this_ = this;
		props.editTable.filterEmptyRows(this.bodyTableid, [ 'bqualified' ], 'except');
		if (props.editTable.getChangedRows(this.bodyTableid).length != 0) {
			if (!props.editTable.checkRequired(AREA.headTableArea, props.editTable.getAllRows(AREA.headTableArea))) {
				return;
			}
		}
		props.editTable.filterEmptyRows(this.headTableid, [ 'pk_group' ]);
		if (
			props.editTable.getChangedRows(this.headTableid).length == 0 &&
			props.editTable.getChangedRows(this.bodyTableid).length == 0
		) {
			props.editTable.cancelEdit(this.headTableid);
			props.editTable.cancelEdit(this.bodyTableid);
			//设为浏览态
			props.editTable.setStatus(this.headTableid, STATUS.browse);
			props.editTable.setStatus(this.bodyTableid, STATUS.browse);
			buttonControl.call(this, props);
			let olddata = props.editTable.getAllRows(this.headTableid);
			let newdata = olddata.filter((item) => {
				return item.status != 3;
			});
			if (newdata.length > 0) {
				onRow_BtnClick.call(this, props, null, null, 0);
			}
			return;
		}
		let bodyData = props.editTable.getAllRows(AREA.bodyTableArea);
		//表体为空给出提示
		let isfull = true;
		bodyData.forEach((val) => {
			if (val.status != 3) {
				isfull = false;
			}
		});
		if (isfull) {
			showErrorInfo(null, getLangByResId(this, '1014QUALITYLEVEL-000006')); /* 国际化处理： 质量等级组的状态不能为空！*/
			return;
		}
		// 获取改变的行
		// 表头数据，选中的行
		// let olddata = props.editTable.getAllRows(this.headTableid);
		// let newdata = olddata.filter((item) => {
		// 	return item.status != 3;
		// });
		let newdata = this.props.editTable.getVisibleRows(this.headTableid, false, true);
		let headData = [ newdata[this.selectIndex] ];
		headData.forEach((item) => {
			item.values.pseudocolumn = undefined;
		});
		let headJson = {
			pageid: this.pageid,
			model: {
				areaType: 'table',
				areacode: this.headTableid,
				PageInfo: {},
				rows: headData
			}
		};
		let bodyJson = {
			pageid: this.pageid,
			model: {
				areaType: 'table',
				areacode: this.bodyTableid,
				PageInfo: {},
				rows: bodyData
			}
		};
		let data = {
			head: headJson,
			body: bodyJson
		};
		ajax({
			url: URL.save,
			data: data,
			success: (res) => {
				if (res.success) {
					let updateIndex = this_.props.editTable.getVisibleRows(this_.headTableid, false, true)[
						this_.selectIndex
					].flterIndex;
					if (updateIndex != 0 && !updateIndex) {
						updateIndex = this_.props.editTable.getAllRows(this.headTableid).length - 1;
					}
					res.data.head[this_.headTableid].rows[0].values.pseudocolumn.value = updateIndex;
					updateEditTableRows(props, this_.headTableid, res.data.head[this_.headTableid].rows);
					let olddata = props.editTable.getAllRows(this_.headTableid);
					let newdata = olddata.filter((item) => {
						return item.status != 3;
					});
					newdata.forEach((item) => {
						if (item.status != 3) {
							item.status = 0;
						}
					});
					let newdatas = { rows: newdata };
					props.editTable.setTableData(this_.headTableid, newdatas);
					this_.keyWordChange(this_.state.value);
					//设为浏览态
					props.editTable.setStatus(this_.headTableid, STATUS.browse);
					props.editTable.setStatus(this_.bodyTableid, STATUS.browse);
					buttonControl.call(this_, props);
					showSaveInfo();
				}
			}
		});
	}, 10);
}

//Ul4F8fkq5E+3GAjBdCwg7KzsNK6Sj/Q6D/AmBNfp4diHe4XKYtuhrscLyWt66ovh