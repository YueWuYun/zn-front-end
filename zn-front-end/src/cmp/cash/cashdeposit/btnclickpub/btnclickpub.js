/*wY+uZipoHzQEF5d/Eaav+abhcZ99YrCrfyzXV3NmjfSY4m1UT6d+hHgtDbV7kUXe*/
import {
	ajax
} from 'nc-lightapp-front';
import { constant, requesturl } from '../config/config';
import { commondata } from '../../../public/utils/constant';
import { BatchToast } from '../../../public/CMPMessage';
// import { imageScan, imageView } from '../../../../sscrp/public/common/components/sscImageMng';

const ltablecode = constant.ltablecode
	// 更新列数据
	function updateData(props, updata, operation){
		let { status, totalNum, successNum, failNum, failMsg, listmap } = updata;
		BatchToast(operation, status, totalNum, successNum, failNum, failMsg, null);
		//加载更新缓存数据
		if (listmap != null && listmap.length > 0) {
			listmap.forEach((val) => {
				let updatedataArr = [{
					index: val.index,
					data: {
						values: val.rows.values
					} //自定义封装数据
				}];
				props.table.updateDataByIndexs(ltablecode, updatedataArr);
			});
		}
	}

	// 提交
export const submit = function (props, requestdata){
	ajax({
		url: requesturl.commit,
		data: requestdata,
		success: (res) => {
			let { data } = res;
			if (res.success) {
				if (data) {
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
						updateData(props, res.data, commondata.COMMIT);
					}
				}
			}
		}
	});
}

	// 收回
export const unsubmit = function (props, requestdata){
	ajax({
		url: requesturl.uncommit,
		data: requestdata,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					updateData(props, res.data, commondata.UNCOMMIT);
				}
			}
		}
	});
}

	// 结算
export const settle = function (props, requestdata){
	ajax({
		url: requesturl.settle,
		data: requestdata,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					updateData(props, res.data, commondata.SETTLE);
				}
			}
		}
	});
}
	// 取消结算
export const unsettle = function (props, requestdata){
	ajax({
		url: requesturl.unsettle,
		data: requestdata,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					updateData(props, res.data, commondata.UNSETTLE);
				}
			}
		}
	});
}

/*wY+uZipoHzQEF5d/Eaav+abhcZ99YrCrfyzXV3NmjfSY4m1UT6d+hHgtDbV7kUXe*/