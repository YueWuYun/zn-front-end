//txBx9FIYfUQl2UukqRyP7xDM3EpTp05Yn7tiTa+FAPNtHxYsOIn0FnQjFudRJbIB
/*
 * @Author: yinliang 
 * @PageInfo: 质量不合格类型-保存
 * @Date: 2019-03-15 10:55:57 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-07-11 09:27:38
 */
import { ajax } from 'nc-lightapp-front';
import { creatMasterFormData } from '../../../pub/tool/creatMasterFormData';
import { URL, AREA, UISTATE, FIELD, OTHER } from '../../constance';
import { buttonController } from '../viewController';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props) {
	// 表头必输校验
	let formCheck = props.form.isCheckNow(AREA.head);
	if (!formCheck) {
		return;
	}
	let data = creatMasterFormData(props, AREA.head);
	// 自定义参数：isCommit是否保存提交操作
	data.userjson = `{changePIDFlag:${this.changePIDFlag}}`;
	ajax({
		url: URL.save,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				/**
				 * 如果有刷新树的信息，则刷新页面的树
				 * 并默认展开需要展开的节点
				 */
				if (res.data.refreshTree && res.data.refreshTree.length > 0) {
					this.root.children = res.data.refreshTree;
					this.props.syncTree.setSyncTreeData(AREA.tree, [ this.root ]);
					let openID = res.data.vo.head.rows[0].values[FIELD.pid].value;
					this.props.syncTree.openNodeByPk(
						AREA.tree,
						openID ? openID : this.selectTreePID ? this.selectTreePID : OTHER.rootId
					);
					// 将所有的树的主键放在一个数组里，用于删除后自动检索下一条使用
					this.allTreePKs = res.data.allpks;
				}
				/**
				 * 选中变化的树节点，给一个高亮的样式，方便用户直接找到操作节点的位置
				 */
				this.props.syncTree.setNodeSelected(AREA.tree, res.data.vo.head.rows[0].values[FIELD.id].value);
				/**
				 * 更新Form数据
				 */
				this.props.form.setFormItemsValue(AREA.head, res.data.vo.head.rows[0].values);
				/**
				 * 更新上级检验项目修改标志
				 */
				this.selectTreePID = '';
				if (this.changePIDFlag) {
					this.changePIDFlag = false;
				}
				// 提示
				showSuccessInfo(getLangByResId(this, 'C010REJECTTYPE-000000')); /* 国际化处理： 保存成功！*/ /* 国际化处理： 保存成功！*/
				/**
				 * 设置按钮、页面等状态
				 */
				buttonController.setButtonStatus.call(this, props, UISTATE.browse);
				this.setState({ status: UISTATE.browse });
			}
		}
	});
}

//txBx9FIYfUQl2UukqRyP7xDM3EpTp05Yn7tiTa+FAPNtHxYsOIn0FnQjFudRJbIB