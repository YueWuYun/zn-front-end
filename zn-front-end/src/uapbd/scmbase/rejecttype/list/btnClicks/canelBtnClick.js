//80feFbJ2zfdDk/nMUVsyfxDK9WFnr77bv2ax5ubP1nmF5cYJTh4bp92bo8iel7RF
/*
 * @Author: yinliang 
 * @PageInfo: 质量不合格类型-取消
 * @Date: 2019-03-15 10:55:24 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2020-01-07 18:32:22
 */

import { showCancelDialog } from '../../../pub/tool/messageUtil';
import { AREA, UISTATE } from '../../constance';
import { buttonController } from '../viewController';

export default function(props) {
	showCancelDialog({
		beSureBtnClick: () => {
			props.form.cancel(AREA.head);
			buttonController.setButtonStatus.call(this, props, UISTATE.browse);
			/**
			 * 如果是选中树节点，或者是修改树节点，总之是form表单区渲染过数据的的情况下，取消之后还是展示编辑前的数据
			 * 新增：新增取消之后，如果之前是有数据的，展示新增前的数据，如果没有，空白页面
			 * 修改：修改取消之后，展示修改数据的信息
			 */
			if (this.formDataCache) {
				this.props.form.setFormItemsValue(AREA.head, this.formDataCache);
			}
			let treeVals = this.props.syncTree.getSyncTreeValue(AREA.tree); // 当删除树节点之后，如果没有数据，卡片区域展示初始的新增按钮
			this.setState({ status: UISTATE.browse, cardEmpty: !treeVals[0].children });
		}
	});
}

//80feFbJ2zfdDk/nMUVsyfxDK9WFnr77bv2ax5ubP1nmF5cYJTh4bp92bo8iel7RF