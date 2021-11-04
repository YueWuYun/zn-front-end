//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { PAGECODE, PAGEAREA, FIELDS, BUTTONS, BUTTONAREA, UISTATE } from '../constance';
import { base } from 'nc-lightapp-front';
const { NCSwitch } = base;
import { buttonController } from '../viewController';
import { btnClick, sealBtnClick, unSealBtnClick } from '../btnClicks';
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
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonController.call(this, this.props);
				}
				//如果有主组织的时候设值主组织默认值
				if (data.context.pk_org) {
					let pk_org = {
						display: data.context.org_Name,
						value: data.context.pk_org
					};
					this.setState(
						{
							pk_org
						},
						orgAfterEvent.bind(this)
					);
				}
			}
		}
	);
}

function modifier(props, meta) {
	//启用状态列类型渲染转换
	meta[PAGEAREA.list].items.map((item, index) => {
		if (item.attrcode == FIELDS.enablestate) {
			item.itemtype = 'customer';
			item.options = [
				{ display: getLangByResId(this, '4001MST-000000'), value: '2' },
				{ display: getLangByResId(this, '4001MST-000027'), value: '3' }
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
		label: getLangByResId(this, '4001MST-000028') /* 国际化处理： 操作*/,
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
	//处理查询区的参照过滤
	meta[PAGEAREA.search].items.forEach((item) => {
		//显示离职人员
		item.isShowDimission = true;
		//显示停用
		item.isShowDisabledData = true;
		item.unitPropsExtend = {
			isShowDisabledData: true, // 显示停用
			isHasDisabledData: true // 是否有【显示停用】功能
		};
		//计量器具级别，所属部门，录入部门，供应商，自定义项需要按主组织过滤
		if (
			item.attrcode == FIELDS.cmeasclassid ||
			item.attrcode == FIELDS.cdeptid ||
			item.attrcode == FIELDS.centerdeptid ||
			item.attrcode == FIELDS.cvendorid ||
			item.attrcode.indexOf(FIELDS.vdef) >= 0
		) {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = this.state.pk_org.value || null;
				return {
					pk_org
				};
			};
			//计量器具等级没有显示停用
			if (item.attrcode == FIELDS.cmeasclassid) {
				item.isShowDisabledData = false;
			}
		}
	});
	//处理表格区的参照
	meta[PAGEAREA.list].items.forEach((item) => {
		//计量器具级别，所属部门，录入部门，供应商，自定义项需要按主组织过滤
		if (
			item.attrcode == FIELDS.cmeasclassid ||
			item.attrcode == FIELDS.cdeptvid ||
			item.attrcode == FIELDS.centerdeptvid ||
			item.attrcode == FIELDS.cvendorid ||
			item.attrcode.indexOf(FIELDS.vdef) >= 0
		) {
			item.queryCondition = () => {
				let pk_org = this.state.pk_org.value || null;
				return {
					pk_org
				};
			};
		}
	});
	return meta;
}

/**
 * 启用状态，页面动作监控事件
 */
function onChange(index, value, a, c, v, s) {
	//只有浏览态可以点击开关
	let state = this.props.editTable.getStatus(PAGEAREA.list);
	if (state == UISTATE.browse) {
		let trueValue = value ? '3' : '2';
		this.props.editTable.setValByKeyAndIndex(PAGEAREA.list, index, FIELDS.enablestate, { value: trueValue });
		if (value == false) {
			sealBtnClick.call(this, this.props, index);
		} else {
			unSealBtnClick.call(this, this.props, index);
		}
	}
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX