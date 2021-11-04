//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { PAGECODE, PAGEAREA, UISTATE, BUTTONS, BUTTONAREA, FIELDS } from '../constance';
import { base } from 'nc-lightapp-front';
const { NCSwitch } = base;
import { buttonController } from '../viewController';
import { commonSearch, btnClick } from '../btnClicks';
import unsealBtnClick from '../btnClicks/unsealBtnClick';
import sealBtnClick from '../btnClicks/sealBtnClick';
import { orgAfterEvent } from '../afterEvents';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifier.call(this, props, meta);
					props.meta.setMeta(meta, initPage.bind(this));
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonController.call(this, this.props);
				}
				//如果有主组织的时候设值主组织默认值
				if (data.context.pk_org) {
					let event = {
						refname: data.context.org_Name,
						refpk: data.context.pk_org
					};
					orgAfterEvent.call(this, event);
				}
			}
		}
	);
}
function initPage() {
	commonSearch.call(this, this.props);
}
function modifier(props, meta) {
	//启用状态列类型渲染转换
	meta[PAGEAREA.list].items.map((item, index) => {
		if (item.attrcode == FIELDS.enablestate) {
			item.itemtype = 'customer';
			item.options = [
				{ display: getLangByResId(this, '4001MSCL-000000'), value: '2' },
				{ display: getLangByResId(this, '4001MSCL-000014'), value: '3' }
			]; /* 国际化处理： 已启用,已停用*/

			item.render = (text, record, index) => {
				//编辑态置灰
				let state = this.props.editTable.getStatus(PAGEAREA.list);
				return (
					<div
						onClick={(e) => {
							//阻止冒泡。要不然行就被勾选上了
							if (e && e.stopPropagation) {
								//非IE
								e.stopPropagation();
							} else {
								//IE
								window.event.cancelBubble = true;
							}
						}}
					>
						<NCSwitch
							checked={record.values.enablestate.value == '2' ? true : false}
							onChange={onChange.bind(this, index)}
							disabled={state == UISTATE.edit} //编辑态不可用
						/>
					</div>
				);
			};
		}
	});

	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001MSCL-000015') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '100px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [ BUTTONS.Delete ];
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREA.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClick.call(this, props, key, record, index, true)
			});
		}
	};
	meta[PAGEAREA.list].items.push(event);
	return meta;
}
/**
 * 启用状态，页面动作监控事件
 */
function onChange(index, value) {
	//只有浏览态可以点击开关
	let state = this.props.editTable.getStatus(PAGEAREA.list);
	if (state == UISTATE.browse) {
		let trueValue = value ? '3' : '2';
		this.props.editTable.setValByKeyAndIndex(PAGEAREA.list, index, 'enablestate', { value: trueValue });
		if (value == false) {
			sealBtnClick.call(this, this.props, index);
		} else {
			unsealBtnClick.call(this, this.props, index);
		}
	}
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX