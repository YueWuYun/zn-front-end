/*kiLjo3g777m1xtsVXDEoczKJHriLgPuPeunVca5MtkobVmjbv3wAcMPN6Fe7XEPk*/
/*
 * @Author: yinliang 
 * @PageInfo: 创建表头数据信息，用于发送ajax请求
 * @Date: 2019-03-11 15:42:03 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-03-11 16:32:57
 */

/**
  * 组装form表单请求数据
  * @param {*} props 
  * @param {*} areaID 
  */
function creatMasterFormData(props, areaID) {
	let data = props.form.getAllFormValue(areaID);
	let requestData = {};
	requestData.model = data;

	let metaTemp = props.meta.getMeta();
	requestData.pageid = metaTemp.code;
	requestData.templetid = metaTemp.pageid;

	return requestData;
}

export { creatMasterFormData };

/*kiLjo3g777m1xtsVXDEoczKJHriLgPuPeunVca5MtkobVmjbv3wAcMPN6Fe7XEPk*/