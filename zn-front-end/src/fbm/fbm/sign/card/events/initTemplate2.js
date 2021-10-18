/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
//审批中心跳转单据
import { CARD, approve_app_code } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import {
	orgVersionView
} from "../../../../../tmpub/pub/util/version/index";
export default function (props, templateCallback) {
	let app_code = props.getSearchParam('c');
	props.createUIDom(
		{
			pagecode: CARD.page_id_approve,
			appcode: app_code
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
					buttonVisible.call(this, props, button);
				}
				orgVersionView(props,this.formId,"pk_signorg","pk_signorg_v");
				orgVersionView(props,this.formId,"pk_payfundorg","pk_payfundorg_v");
				orgVersionView(props,this.formId,"pk_usebillorg","pk_usebillorg_v");
				templateCallback && templateCallback();
			}
		}
	)
}

/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/