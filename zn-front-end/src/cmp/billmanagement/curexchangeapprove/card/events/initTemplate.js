/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./buttonVisable";//按钮显隐性
import { cache } from '../../../../../tmpub/pub/cons/constant';

import { cardCache} from 'nc-lightapp-front';


const formId = Templatedata.card_formid;
const tableId = Templatedata.card_tableid;
const pageId = Templatedata.card_pageid;
export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId//页面id
		},
		data => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					if (props.getUrlParam('status') === 'browse') {
						props.form.setFormStatus(formId, 'browse');
					} else {
						props.form.setFormStatus(formId, 'edit');
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				this.refresh();//加载数据
				togglePageShow(props);//修改页面状态

				//begin lidyu 双击进入卡片 异常交互 
				cardCache.setDefData(cache.iserrtoast, Templatedata.dataSource, true);
				//end
			}
		}
	)
}

//根据页面状态，修改编辑态表格
function togglePageShow(props) {
	buttonVisable(props);//控制按钮显隐性	
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/