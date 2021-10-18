/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base, ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { buttonVisible } from './buttonVisible';
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
let { getDefData } = cardCache;
const formcode1 = constant.formcode1;

export default function(props, json, inlt) {
	let that = this;
	props.createUIDom(
		{
			pagecode: constant.cpagecode,
			appcode: props.getUrlParam('c')
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta, () => {
					});

					if (props.getUrlParam('status') == 'edit') {
						props.form.setFormItemsDisabled(formcode1 ,{'pk_org':true});
						that.toggleShow();
					}
					
					
					// if (props.getUrlParam('status') == 'browse') {
					// 	props.form.setFormItemsDisabled(formId,{'isgroupaccount':true});
					// }

					orgVersionUtil.call(this, props, formcode1)//多版本视图显隐性
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta) {

	let multiLang = props.MutiInit.getIntl('2052');
	let porCol = {
		attrcode: 'opr',
		label: multiLang && multiLang.get('20521030-0005'),
		visible: true,
		width: 200,
		render(text, record, index) {
			let status = props.cardTable.getStatus(formcode1);
			return status === 'browse' ? (
				<span
					onClick={() => {
						props.cardTable.toggleRowView(formcode1, record);
					}}
				>
					{' '}
					{this.state.json['36140RFD-000006']}{/* 国际化处理： 切换视图*/}
				</span>
			) : (
				<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(formcode1, 'edit', record, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-gengduo" />
					</span>
					&nbsp;&nbsp;
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.deleteRowsByIndex(formcode1, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-shanchu" />
					</span>
				</div>
			);
		}
	};
	meta[formcode1].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/