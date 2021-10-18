/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import {
	ajax
} from 'nc-lightapp-front';
import { constant,requesturl } from '../../config/config.js';
import {commondata,SHOWMODEL_BULU } from '../../../../public/utils/constant';
import { BatchToast } from '../../../../public/CMPMessage';

export default function tableButtonClick(props, key, text, record, index) {
	
	let that = this;
	//缓存相关
	let { deleteCacheId } = props.table;

	// 公共设置请求数据(删除、提交、收回、结算、取消结算)
	function getrequestdata() {
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		let pk = record.pk_settlechange.value;
		let ts = record.ts.value;
		pksArr.push(pk); //主键数组
		pktsmap[pk] = ts;
		indexmap[pk] = index;
		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr
		};
		that.pk = record.pk_settlechange.value;
		that.index = index;
		that.ts = record.ts.value;
		
		return data;
	}

	// 更新列数据
	function updateData(updata,operation){
		let { status, totalNum, successNum, failNum, failMsg, listmap } = updata;
		BatchToast.call(this, operation, status, totalNum, successNum, failNum, failMsg, null);
		//加载更新缓存数据
		if (listmap != null && listmap.length > 0) {
			listmap.forEach((val) => {
				let updatedataArr = [{
					index: val.index,
					data: {
						values: val.rows.values
					} //自定义封装数据
				}];
				props.table.updateDataByIndexs(that.tableId, updatedataArr);
			});
		}
	}

	switch (key) {
		// 提交
		case 'submitinBtn':
		 //tm begin 原来的ajax请求重写 lidyu 20200320
			ajax({
				url: requesturl.commit,
				data: getrequestdata(),
				success: (res) => {
					let { success,data } = res;
					if (success) {
						if(data){

							let { appointmap } = data;
							if (appointmap) {
								if (appointmap.workflow &&
									(appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')) {
									this.setState({
										compositedata: appointmap,
										compositedisplay: true,
									});
								}
							} else {
								updateData.call(this, res.data,commondata.COMMIT);
							}
						}
					}
				}
			});
		
			break;
		case 'unsubmitinBtn':
			ajax({
				url: requesturl.uncommit, 
				data: getrequestdata(),
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (res.data) {
							updateData.call(this, res.data,commondata.UNCOMMIT);
						}
					}
					
				}
			});
			break;
		
		case 'editinBtn':
			let eidtid = record.pk_settlechange.value
			let querydata = {pk: eidtid};
			ajax({
				url: requesturl.editpermission,
				data: querydata,
				success: (res) => {
					if (res.success) {
						props.table.selectAllRows(this.tableId,false);
						props.pushTo(constant.cardpath, {
							pagecode: constant.cpagecode,
							status: 'edit',
							id: eidtid
						});
					}
				}
			});
			
			break;

		case 'deleteinBtn':
			let pk = record.pk_settlechange.value;
			ajax({
				url: requesturl.delete, 
				data: getrequestdata(),
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if(res.data){
							let { status, totalNum, successNum, failNum, failMsg, listmap,successIndex } = res.data;
							deleteCacheId(that.tableId, pk);//删除成功后, 删除allpk中pk
							props.table.deleteTableRowsByIndex(that.tableId, successIndex)//直接删除table中的行列
							BatchToast.call(this, commondata.DELETE,status,totalNum,successNum,failNum,failMsg,null);
						}
					}
				}
			});
			break;
			
			case 'preparenetinBtn':
				this.setState({
					modelType: SHOWMODEL_BULU
				});
				ajax({
					url: requesturl.netbankquery,
					data: getrequestdata(),
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if(data){
								that.setState({
									onLineData: data || [],
									SHOWMODEL_BULU
								},() => {
									that.setState({
										showBuLu: true
									})
								});
							}
						}
					}
				});
			break;
	}

}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/