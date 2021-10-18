/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
//应收票据退票——审批初始化
import { CARD, approve_app_code } from '../../cons/constant';

export default function (props, templateCallback) {
	props.createUIDom(
		{
			pagecode: CARD.page_id_approve,
			appcode: approve_app_code
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
				templateCallback && templateCallback();
			}
		}
	)
}

/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/