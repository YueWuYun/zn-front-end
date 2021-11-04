//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { config } from '../../category/config/index';
import { createPage, base, ajax, toast, print, high, promptBox } from 'nc-lightapp-front';
const { treeId, formId, bodyvosId } = config;

export function initTemplate(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: props.config.pageCodeForm

			/*appid : props.config.appid,
            appcode:props.config.funcode*/
		},
		(data) => {
			let meta = data.template;
			meta = modifierMeta.call(this, props, meta, json, inlt);
			props.meta.setMeta(meta);
			data.button && props.button.setButtons(data.button);
			if (data.button) {
				props.button.setButtons(data.button);
			}
		}
	);
}

function modifierMeta(props, meta, json, inlt) {
	//let status = props.getUrlParam('status');
	meta[formId].status = 'browse';
	meta[bodyvosId].status = 'browse';
	meta[formId].items.map((item) => {
		if (item.attrcode == 'enablestate') {
			item.onPopconfirmCont = json['10141505-000036'] /* 国际化处理： 确定要启用吗？*/;
			item.offPopconfirmCont = json['10141505-000037'] /* 国际化处理： 确定要停用吗？*/;
			item.onSwitchBefore = () => {
				let formData = props.form.getAllFormValue(formId) || {};
				let record = formData.rows[0];
				if (record && record.values) {
					if (record.values[item.attrcode].value === true || record.values[item.attrcode].value === '2') {
						this.enablestateBtnClick.call(this, props, formData, false);
					} else {
						this.enablestateBtnClick.call(this, props, formData, true);
					}
				}
				// 停启用状态不变，后台成功后再处理
				return false;
			};
		}
	});
	meta[bodyvosId].items.forEach((item) => {
		if (item.attrcode === 'classid') {
			//虽然单据模板中有，但这里使用自己定义的参照
			item.refcode = '../../../../uapbd/refer/am/CategoryParamTypeGridRef/index.js';
			item.refName = json['10141505-000035'];
		}
	});

	let porCol = {
		attrcode: 'opr',
		label: json['10141505-000000'] /* 国际化处理： 操作*/,
		visible: true,
		className: 'table-opr',
		width: 100,
		itemtype: 'customer',
		/*fixed:'right',*/
		render(text, record, index) {
			let status = props.cardTable.getStatus(bodyvosId);
			return status === 'browse' || status == undefined ? (
				<div />
			) : (
				<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							let selectNode = props.syncTree.getSelectNode(treeId);
							if (record.operate == 'edit' && !selectNode.isleaf && selectNode.refpk != 'ROOT') {
								toast({
									color: 'warning',
									content: json['10141505-000032']
								}); /* 国际化处理： 该类别已存在下级类别，无法删除技术参数！*/
								return;
							}
							let msg =
								inlt &&
								inlt.get([ '10141505-000001' ], {
									index: record.values.param_index.value
								}); /* 国际化处理： 参数序号为{index}的技术参数从上级继承，不能删除！*/
							if (record.father) {
								toast({ color: 'warning', content: msg });
								return;
							} else {
								props.cardTable.delRowsByIndex(bodyvosId, index);
								let rows = props.cardTable.getCheckedRows(bodyvosId);
								props.button.setDisabled({ delline: !(rows && rows.length > 0) });
							}
							e.stopPropagation();
						}}
					>
						{json['10141505-000003'] /* 国际化处理： 删除*/}
					</span>
				</div>
			);
		}
	};
	meta[bodyvosId].items.push(porCol);

	return meta;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65