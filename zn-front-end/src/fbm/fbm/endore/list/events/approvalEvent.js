/*QnhrPLhk/aKSjW4JIElf6bqBhpMv/t7OBxLcnq22FTuxr7Ow2TDzbenNb3ShmVGC*/
/**
 * 审批组件事件处理
 * @author：gaokung
 */
import { toast, cardCache } from 'nc-lightapp-front';
import { CARD, URI, LIST, DATASOURCE } from './../../cons/constant';
import { doAjax } from '../../utils/commonUtil';
let { updateCache } = cardCache;
export function compositeTurnOff() {
	this.setState({
		compositedata: null,
		compositedisplay: false
	});
}
export function getAssginUserCard(userObj) {
	let selectDatas = this.props.table.getCheckedRows(LIST.tableCode);
	let pks = [];
	let tss = [];
	if (selectDatas && selectDatas.length > 0) {
		selectDatas.forEach((val) => {
			pks.push(val.data.values.pk_endore.value);
			tss.push(val.data.values.ts.value);
		});
	} else if (this.record != null) {
		pks.push(this.record.pk_endore.value);
		tss.push(this.record.ts.value);
	} else {
		toast({
			color: 'waring',
			content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000025')/* 国际化处理： 指派传参，获取pk失败！*/
		});
		return;
	}

	let sendData = {
		pageid: LIST.pageCode,
		pks: pks,
		tss: tss,
		isCardOpt: false,
		userObj: userObj
	};

	let success = function(res) {
		let that = this;
		if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
			toast({ color: 'danger', content: res.data.errMsgs[0] });
		} else {
			if (res.data){
				toast({ color: 'success', content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000026') });/* 国际化处理： 提交成功*/
				that.setState({
					compositedata: res.data,
					compositedisplay: false
				});
				if (res.data.grid) {
					// 表体行发起的操作
					if (this.record != null) {
						let updateDataArr = [
							{
								index: this.index,
								data: { values: res.data.grid[LIST.tableCode].rows[0].values }
							}
						];
						this.props.table.updateDataByIndexs(LIST.tableCode, updateDataArr);
						this.record = null;
						this.index = null;
					} else {
						let returnData = res.data.grid[LIST.tableCode].rows;
						//处理选择数据
						let selectedData = that.props.table.getCheckedRows(LIST.tableCode);
						if (selectedData && !that.index) {
							selectedData.forEach((val) => {
								let pk_endore_check = val.data.values.pk_endore.value;
								returnData.forEach((retrunval) => {
									if (pk_endore_check === retrunval.values.pk_endore.value) {
										let updateDataArr = [
											{
												index: val.index,
												data: { values: retrunval.values }
											}
										];
										that.props.table.updateDataByIndexs(LIST.tableCode, updateDataArr);
									}
								});
							});
						} else {
							that.props.table.updateDataByIndexs(LIST.tableCode, [
								{ index: that.index, data: { values: returnData[0].values } }
							]);
							that.index = null;
						}
					}
				}
			}
		}
	};

	doAjax.call(this, sendData, URI.endoreListCommit, success);
}

/*QnhrPLhk/aKSjW4JIElf6bqBhpMv/t7OBxLcnq22FTuxr7Ow2TDzbenNb3ShmVGC*/