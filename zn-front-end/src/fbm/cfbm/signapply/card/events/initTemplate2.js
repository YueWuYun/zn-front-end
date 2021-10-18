/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
//审批中心跳转单据
import { CARD, approve_app_code } from '../../cons/constant';
import {
	orgVersionView
} from "../../../../../tmpub/pub/util/version/index";
export default function (props, templateCallback) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD.page_id_approve,
			appcode: appcode//approve_app_code
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				orgVersionView(props,this.formId,"pk_acceptorg","pk_acceptorg_v");
				orgVersionView(props,this.formId,"pk_applyorg","pk_applyorg_v");
				templateCallback && templateCallback();
			}
		}
	)
}

/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/