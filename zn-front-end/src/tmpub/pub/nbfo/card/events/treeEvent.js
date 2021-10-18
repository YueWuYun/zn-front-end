/*+c4pk3XyB6gV0a56ysNzEikPZnyTK43XqD8faExqwrOsa5bSfpNfT8RVoQN+lQmX*/
import { ajax } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl } from '../../cons/constant';

/** 
* 非银行金融机构同步树相关事件
* @author：dongyue7
*/

// 获取树节点相关事件所需数据
export function getSendData(type, flag = false) {
	let data = {
		querycondition: {
			logic: 'and',
			conditions: []
		},
		custcondition: {},
		pageInfo: {
			pageIndex: 0,
			pageSize: '10'
		},
		pageCode: this.pageId,
		queryAreaCode: 'search',
		oid: '1001Z61000000001235M',
		querytype: 'tree',
		userdefObj: {
			pid: type
		}
	};
	if (flag) {
		// 走列表查询接口时，不要传userdefObj
		delete data.userdefObj;
	}
	return data;
}

// 将ajax返回的数据处理为树所需的数据（目前弃用）
export function getTreeData(resData) {
	let realData = [];
	resData.map((e) => {
		realData.push({
			key: e.pk_nonbanktype.value,
			pid: e.pid.value,
			refcode: e.code.value,
			refname: e.code.value + ' ' + e.name.value,
			refpk: e.pk_nonbanktype.value,
			values: {},
			isleaf: e.leaf_mark.value,
			isLeaf: e.leaf_mark.value,
			iconBox: {
				addIcon: false,
				delIcon: false,
				editIcon: false
			}
		});
	});
	return realData;
}

/** 
* 创建根节点
*/
export function deptRoot(json) {
	return {
		isleaf: false,
		pid: '',
		refname: json['36010NBFO-000028'] /* 国际化处理： 非银行金融机构*/,
		refpk: '-1',
		iconBox: {
			addIcon: false,
			delIcon: false,
			editIcon: false
		}
	};
}

/** 
* 初始化树表并加载根节点
*/
export function onInit(json) {
	this.props.syncTree.setSyncTreeData(this.treeId, [ Object.assign({ ...deptRoot.call(this, json) }) ]); // , {children : realTreeData}
}

/** 
* 初始化树表全部子节点
*/
export function exdInit(json) {
	let sendData = getSendData.call(this, '-1', true);
	treeAjax.call(this, javaUrl.listTreeSearch, sendData).then((data) => {
		initLeafNode.call(this, data, json);
	});
}

//树节点展开回调
export function initLeafNode(data, json) {
	let { openNodeByPk, setNodeSelected, setNodeDisable } = this.props.syncTree;
	let sendData = {
		pk_nonbanktype: this.state.selectedPk
	};
	treeAjax.call(this, javaUrl.queryExpandPid, sendData).then((resData) => {
		this.props.syncTree.setSyncTreeData(this.treeId, [
			Object.assign({ ...deptRoot.call(this, json) }, { children: data })
		]);
		openNodeByPk(this.treeId, '-1');
		setNodeSelected(this.treeId, this.state.selectedPk);
		setNodeDisable(this.treeId, true);
		resData && resData.length !== 0 && resData.map((e) => openNodeByPk(this.treeId, e));
	});
}

// 树相关ajax
function treeAjax(url, data) {
	return new Promise((resolve) => {
		ajax({
			url: `${baseReqUrl}${url}.do`,
			data,
			async: false,
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					resolve(data);
				}
			}
		});
	});
}

/*+c4pk3XyB6gV0a56ysNzEikPZnyTK43XqD8faExqwrOsa5bSfpNfT8RVoQN+lQmX*/