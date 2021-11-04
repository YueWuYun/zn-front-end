//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
/*
 * @Author: yinliang 
 * @PageInfo: 质量不合格类型-初始化页面
 * @Date: 2019-03-15 10:54:10 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-07-11 09:27:52
 */

import { PAGECODE, BUTTONID, OTHER } from '../../constance';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.list
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta, initData.bind(this));
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);

					// 页面初始时，打印按钮不可用
					props.button.setButtonDisabled([ BUTTONID.Print, BUTTONID.Relation ], true);
				}
			}
		}
	);
}

/**
 * 树的数据结构返回时，组装树结构
 */
function initData() {
	// 这个需要放在这里，否则多语加载不回来，导致树上的根节点名称显示不出来
	this.root = {
		children: [],
		pid: OTHER.rootId, // 这个属性本来可以没有，同步树组件会自动给树节点添加根节点的PID，但是这个是个虚根，如果不加这个，搜索的时候，和收起整个树
		isleaf: false,
		refcode: 'zlbhglx',
		refname: getLangByResId(this, 'C010REJECTTYPE-000019') /* 国际化处理： 质量不合格类型 */,
		refpk: OTHER.rootId
	}; // 初始根节点
	/**
	 * 查询数据，并将返回的数据组装成树结构
	 */
	this.getTreeDatas.call(this);
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX