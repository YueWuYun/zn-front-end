/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { searchBtnClick } from './search';
import { card, baseReqUrl, javaUrl } from '../../cons/constant.js';
import { multiToast } from '../../../public/components/BaseEditList/event/events';

/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 */
export function bodyButtonClick(key, record) {
	let pk = record[this.primaryId] && record[this.primaryId].value;
	switch (key) {
		case 'Revise_i': //修改
			editBill.call(this, pk, record);
			break;
		case 'Delete_i': //删除
			this.setState({ showToast: false });
			bodyBtnOperation.call(
				this,
				{ pks: [ pk ] },
				javaUrl.delete,
				this.state.json['36010NBFO-000006']
			); /* 国际化处理： 删除成功!*/
			break;
		case 'Enable_i': //启用
			this.setState({ showToast: false });
			bodyBtnOperation.call(
				this,
				{ pks: [ pk ] },
				javaUrl.enable,
				this.state.json['36010NBFO-000002']
			); /* 国际化处理： 启用成功!*/
			break;
		case 'Disenable_i': //停用
			this.setState({ showToast: false });
			bodyBtnOperation.call(
				this,
				{ pks: [ pk ] },
				javaUrl.disEnable,
				this.state.json['36010NBFO-000003']
			); /* 国际化处理： 停用成功!*/
			break;
		default:
			break;
	}
}

function editBill(pk, record) {
	ajax({
		url: `${baseReqUrl}${javaUrl.checkRef}.do`,
		data: { pks: [ pk ] },
		success: (res) => {
			if (res.success) {
				if (res.data[0]) {
					promptBox({
						color: 'warning',
						title: this.state.json['36010NBFO-000031'] /* 国际化处理： 修改*/,
						content: this.state.json['36010NBFO-000032'] /* 国际化处理： 该条数据已被引用，是否继续修改?*/,
						beSureBtnClick: () => {
							this.props.pushTo('/card', {
								status: 'edit',
								id: record[this.primaryId].value,
								pagecode: card.pageCode,
								typePk: record.type.value,
								editStatus: 'edit',
								name: record.name.value
							});
						}
					});
				} else {
					this.props.pushTo('/card', {
						status: 'edit',
						id: record[this.primaryId].value,
						pagecode: card.pageCode,
						typePk: record.type.value,
						editStatus: 'edit',
						name: record.name.value
					});
				}
			}
		}
	});
}

/**
 * 按钮交互
 * @param {*} data         数据
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 * @param {*} isBatch      是否是批量操作
 */
export function bodyBtnOperation(data, path, content, isBatch = false) {
	if (isBatch && !data.pks.length) {
		toast({
			color: 'warning',
			content: this.state.json['36010NBFO-000018'] /* 国际化处理： 请选择至少一条数据!*/
		});
		return;
	}
	data.pageCode = this.pageId;
	ajax({
		url: `${baseReqUrl}${path}.do`,
		data,
		success: (res) => {
			if (res.success) {
				if (!isBatch) {
					if (res.data.errormessages && res.data.errormessages.length != 0) {
						toast({
							color: 'danger',
							content: this.state.json['36010NBFO-000019']
						}); /* 国际化处理： 该条数据已被引用，删除失败！*/
					} else {
						toast({ color: 'success', content });
					}
				} else {
					let oprName = {
						commit: this.state.json['36010NBFO-000020'] /* 国际化处理： 提交*/,
						uncommit: this.state.json['36010NBFO-000021'] /* 国际化处理： 收回*/,
						del: this.state.json['36010NBFO-000004'] /* 国际化处理： 删除*/
					};
					multiToast.call(this, 'del', oprName, res.data);
				}
				if (path === javaUrl.delete) {
					let { deleteCacheId } = this.props.table;
					deleteCacheId(this.tableId, data.pks[0]);
				}
				searchBtnClick.call(this, this.props);
			}
		}
	});
}

/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/