/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
import { ajax, toast } from 'nc-lightapp-front';
import { searchBtnClick } from './search';
import { card, baseReqUrl, javaUrl } from '../../cons/constant.js';
import { multiToast } from '../../../public/events';

/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 */
export function bodyButtonClick(key, record) {
	let pk = record[this.primaryId] && record[this.primaryId].value;
	switch (key) {
		case 'edit': //修改
			ajax({
				url: `${baseReqUrl}${javaUrl.checkRef}.do`,
				data: { pks: [ pk ] },
				success: (res) => {
					if (res.data[0]) {
						this.setState({ checkPk: record[this.primaryId].value }, () => {
							this.props.modal.show('checkRefModal');
						});
					} else {
						this.props.pushTo('/card', {
							status: 'edit',
							id: record[this.primaryId].value,
							pagecode: card.pageCode,
							editStatus: 'edit'
						});
					}
				}
			});
			break;
		case 'delete': //删除
			this.setState({ showToast: false });
			bodyBtnOperation.call(this, { pks: [ pk ] }, javaUrl.delete, '删除成功!');
			break;
		case 'start': //启用
			this.setState({ showToast: false });
			bodyBtnOperation.call(this, { pks: [ pk ] }, javaUrl.start, '启用成功!');
			break;
		case 'stop': //停用
			this.setState({ showToast: false });
			bodyBtnOperation.call(this, { pks: [ pk ] }, javaUrl.stop, '停用成功!');
			break;
		default:
			break;
	}
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
			content: '请选择至少一条数据!'
		});
		return;
	}
	ajax({
		url: `${baseReqUrl}${path}.do`,
		data,
		async: false,
		success: (res) => {
			if (res.success) {
				if (!isBatch) {
					if (res.data.errormessages && res.data.errormessages.length != 0) {
						toast({ color: 'danger', content: '该条数据已被引用，删除失败！' });
					} else {
						toast({ color: 'success', content });
					}
				} else {
					let oprName = {
						commit: '提交',
						uncommit: '收回',
						del: '删除'
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