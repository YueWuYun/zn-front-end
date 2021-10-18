/*RLMc2+qzndbOwL2FXHIbDj/S0QK2cG3hGXCAYInpAYa5Er6FnTmdCjX1B5qeglJj*/
/**
 * 基础档案列表卡片 列表页事件ajax
 * @author dongyue7
 */

import { ajax, toast } from 'nc-lightapp-front';
import { multiToast } from '../../components/BaseEditList/event/events';
import { searchBtnOperation } from './search';

/**
 * 按钮交互
 * @param {*} data         数据
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 * @param {*} isBatch      是否是批量操作
 */
export function btnOperation(data, path, content, isBatch = false) {
	ajax({
		url: `${this.baseUrl}${path}.do`,
		data,
		success: (res) => {
			if (res.success) {
				if (!isBatch) {
					if (res.data.errormessages && res.data.errormessages.length != 0) {
						toast({
							color: 'danger',
							content: this.state.json['36010PUBLIC-000003']
						}); /* 国际化处理： 该条数据已被引用，删除失败！*/
					} else {
						toast({ color: 'success', content });
					}
				} else {
					let oprName = {
						commit: this.state.json['36010PUBLIC-000004'] /* 国际化处理： 提交*/,
						uncommit: this.state.json['36010PUBLIC-000005'] /* 国际化处理： 收回*/,
						del: this.state.json['36010PUBLIC-000006'] /* 国际化处理： 删除*/
					};
					multiToast.call(this, 'del', oprName, res.data);
				}
				if (path === this.javaUrl.delete) {
					let { deleteCacheId } = this.props.table;
					deleteCacheId(this.tableId, data.pks[0]);
				}
				this.setState({ showToast: false });
				searchBtnOperation.call(this, this.props);
			}
		}
	});
}

/*RLMc2+qzndbOwL2FXHIbDj/S0QK2cG3hGXCAYInpAYa5Er6FnTmdCjX1B5qeglJj*/