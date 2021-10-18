/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
//审批中心跳转单据
import { CARD, approve_app_code } from '../../cons/constant';

export default function (props, templateCallback) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD.page_id_approve,
			appcode: appcode //approve_app_code
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, meta);
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
function modifierMeta(meta) {
	for (let item of Object.keys(meta.gridrelation)) {
		meta[item].items.push({
			attrcode: 'opr',
			label: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000004'),/* 国际化处理： 操作*/
			itemtype: 'customer',
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			width: 200,
			render: (text, record, index) => {
				let buttonAry = [];
				if (this.props.getUrlParam('status') === 'browse') { //浏览态
					buttonAry = [record.expandRowStatus ? 'fold' : 'unfold'];
				}else{
					buttonAry = ['expand','insertRow', 'delRow'];
				}
				return this.props.button.createOprationButton(buttonAry, {
					area: CARD.body_btn_code,
					onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
				});
			}
		})
	}

	return meta;
}
/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/