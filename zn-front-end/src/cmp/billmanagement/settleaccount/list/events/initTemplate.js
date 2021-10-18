/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import buttonUsability from './buttonUsability';
import autoRefresh from './autoRefresh';
// import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util/index';
let searchid = Templatedata.list_searchid;
export default function (props) {
	let self = this;
	//请求模板数据
	props.createUIDom(
		{
			pagecode: this.pageId,//页面pageid
			appcode:Templatedata.app_code,//
			appid: Templatedata.list_appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self,props, meta);
					// setDefOrg2AdvanceSrchArea(props, self.searchId, data);//高级查询区赋值
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, self.searchId, data);//普通查询区赋值
					autoRefresh.call(self,data);//如果存在财务组织自动加载数据
				}
				buttonUsability.call(self, props, '');//列表按钮显影性
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[searchid].items = meta[searchid].items.map((item, key) => {
		// item.visible = true;
		return item;
	})
	meta[searchid].items.map((ele) => {
		ele.visible = true;
	});
	//参展过滤
	meta[searchid].items.map((item) => {
		// 发送发组织，接收方组织：根据用户权限过滤
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: Templatedata.fun_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	//财务组织:全加载
	meta[searchid].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	return meta;
}


/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/