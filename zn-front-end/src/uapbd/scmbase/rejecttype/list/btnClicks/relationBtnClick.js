//ntcerT0s9FFIB0gywU4FhOL0cmPYXpXDRMQ5vaxzUxa1zBscSFEwV/xoGKsCPe/7
/*
 * @Author: yinliang 
 * @PageInfo: 关联按钮
 * @Date: 2019-03-19 18:20:53 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-03-28 13:21:11
 */
import { ajax } from 'nc-lightapp-front';
import { OTHER, URL, AREA } from '../../constance';

export default function(props) {
	let id = props.syncTree.getSelectNode(AREA.tree);
	let data = { id: id.refpk, [OTHER.type]: '0' };
	ajax({
		url: URL.relation,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				this.treeData.left = res.data.left;
				if (res.data.right && res.data.right.length > 0) {
					this.treeData.right = res.data.right;
				} else {
					this.treeData.right = [];
				}
				props.modal.show(OTHER.relationModel);
			}
		}
	});
}

//ntcerT0s9FFIB0gywU4FhOL0cmPYXpXDRMQ5vaxzUxa1zBscSFEwV/xoGKsCPe/7