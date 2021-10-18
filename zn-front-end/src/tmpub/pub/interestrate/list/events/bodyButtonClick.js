/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { getListData } from './searchBtnClick';
import { LIST, API_URL } from '../../cons/constant.js';

export function bodyButtonClick(key, record, index) {
	let pk = record[LIST.primary_id] && record[LIST.primary_id].value;
	let ts = record['ts'] && record['ts'].value;
	let pkMapTs = new Map();
	//主键与tsMap
	if (pk && ts) {
		pkMapTs.set(pk, ts);
	}
	switch (key) {
		case 'edit':
			editBill.call(this, pk);
			break;
		case 'delete':
			bodyBtnOperation.call(
				this,
				{ pks: [ pk ], pkMapTs },
				'delete',
				this.state.json['36010IR-000027'],
				index
			); /* 国际化处理： 删除成功!*/
			break;
		case 'createVersion':
			createVersion.call(this, pk, record);
			break;
		case 'deleteVersion':
			deleteVersion.call(this, pk, pkMapTs, index);
			break;
		//查看版本
        case 'queryVersion':
            listViewVersion.call(this, pk);
            break;
		case 'enable':
			setEnableStatus.call(
				this,
				{ pk, pkMapTs },
				'enable',
				this.state.json['36010IR-000019'],
				index
			); /* 国际化处理： 启用成功*/
			break;
		case 'disable':
			setEnableStatus.call(
				this,
				{ pk, pkMapTs },
				'disable',
				this.state.json['36010IR-000020'],
				index
			); /* 国际化处理： 停用成功*/
			break;
		default:
			break;
	}
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function editBill(pk) {
	ajax({
		url: API_URL['checkRef'],
		data: { pks: [ pk ] },
		success: (res) => {
			if (res.data) {
				if (res.data.successNum === '1') {
					this.props.pushTo('/card', {
						status: 'edit',
						id: pk,
						pagecode: this.pageId
					});
				} else {
					toast({ color: 'danger', content: this.state.json['36010IR-000022'] }); /* 国际化处理： 该利率已被引用，无法修改!*/
				}
			}
		}
	});
}

/**
 * 创建版本
 * @param {*} props  页面内置对象
 */
function createVersion(pk, record) {
	this.props.pushTo('/card', {
		status: 'createVersion',
		id: pk,
		pagecode: this.pageId,
		reviseDate: record.revisedate.value // 起效日期校验用
	});
}

/**
 * 删除版本
 * @param {*} props  页面内置对象
 */
function deleteVersion(pk, pkMapTs, index) {
	promptBox({
		color: 'danger', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
		title: this.state.json['36010IR-000028'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 删除版本*/
		content: this.state.json['36010IR-000029'], // 提示内容,非必输/* 国际化处理： 当前利率设置最新版本将要删除，是否继续？*/
		beSureBtnClick: () => {
			bodyBtnOperation.call(
				this,
				{ pk, pkMapTs },
				'deleteVersion',
				this.state.json['36010IR-000027'],
				index
			); /* 国际化处理： 删除成功!*/
		} // 确定按钮点击调用函数,非必输
	});
}
/**
 * 列表查看版本
 *
 * @param {*} pk - 主键
 */
function listViewVersion(pk) {
    this.props.pushTo('/card', {
        status: 'browse',
        pageType: 'version',
        id: pk,
        pagecode: this.pageId
    });
}
//启用/停用
function setEnableStatus(data, type, content, index) {
	ajax({
		url: API_URL[type],
		data: {
			pk: data.pk,
			pkMapTs: data.pkMapTs,
			pageCode: this.pageId
		},
		success: (res) => {
			if (res.success && res.data && res.data.head) {
				toast({ color: 'success', content });
				this.props.table.updateDataByIndexs(this.tableId, [
					{
						index: index,
						data: {
							values: res.data.head.head.rows[0].values
						}
					}
				]);
			}
		}
	});
}

// 按钮操作
export function bodyBtnOperation(data, path, content, index) {
	const OPR_NAME = {
		delete: this.state.json['36010IR-000025'] /* 国际化处理： 删除*/,
		deleteVersion: this.state.json['36010IR-000028'] /* 国际化处理： 删除版本*/
	};
	ajax({
		url: API_URL[path],
		data: {
			pks: data.pks,
			pkMapTs: data.pkMapTs,
			pageCode: this.pageId
		},
		success: (res) => {
			let { success, data } = res;
			let { successNum, total } = data;
			if (success) {
				if (successNum == total) {
					//成功
					toast({ color: 'success', content });
					if (path === 'delete') {
						let deletePk = [];
						data.data[0] && deletePk.push(data.data[0].pk);
						this.props.table.deleteCacheId(this.tableId, deletePk);
						this.props.table.deleteTableRowsByIndex(this.tableId, index);
					} else {
						getListData.call(this, API_URL.queryList);
					}
				} else {
					//失败
					toast({
						color: 'warning',
						content: `${OPR_NAME[path]}${this.state.json['36010IR-000054']}`
					}); /* 国际化处理： 失败*/
				}
			}
		}
	});
}

/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/