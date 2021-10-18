/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax, base, toast, print, cardCache, promptBox } from 'nc-lightapp-front';
import { appcode, card_from_id, card_table_id, dataSourceName, agentacc_pk, printnodekey, card_page_id, list_page_id } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl';
import { versionControl } from '../../util/util.js';
import initTemplate from './initTemplate';
import { BatchCopy } from '../../util/ButtonUtil.js';//表体按钮切换粘贴类

let { updateCache } = cardCache;
export default function(props, btnId) {
	//财务组织
	let org_val = props.form.getFormItemsValue(this.formId, 'pk_org').value;
	let org_display = props.form.getFormItemsValue(this.formId, 'pk_org').display;
	let pk_agentacccfg = props.form.getFormItemsValue(this.formId, agentacc_pk).value;
	let ts = this.props.form.getFormItemsValue(this.formId, 'ts');
	let enableAction = '';
	let currRows = [];
	let currSelect = [];
	let bodyRows = [];
	let that = this;
	let data;
	switch (btnId) {
		//head
		//新增
		case 'Add':
			props.pushTo('/card', {
				status: 'add',
				id: pk_agentacccfg,
				pagecode: card_page_id
			});
			initTemplate.call(this,props);
			break;
		//刷新
		case 'Reflesh':
			this.refreshPage();
			break;
		//保存
		case 'Save':
			//检查是否为空行（要求cfgdetail不为空）
			if (this.props.cardTable.checkTableRequired(card_table_id) && props.form.isCheckNow(card_from_id)) {
				this.saveBill();
			}
			break;
		//修改
		case 'Edit':
			props.pushTo('/card', {
				status: 'edit',
				id: pk_agentacccfg,
				pagecode: card_page_id
			});
			this.toggleShow();
			versionControl(props);
			break;
		//确认
		case 'Confirm':
			data = {
				pk: pk_agentacccfg,
				ts: ts.value,
				actionname: 'Confirm'
			};
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000035'),
				content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000011'),/* 国际化处理： 是否确认？*/
				beSureBtnClick: () => {			// 确定按钮点击调用函数,非必输
					beSureBtnClickConfirm.call(that, props, data, this);
				}
			});
			break;
		//取消确认
		case 'UnConfirm':
			data = {
				pk: pk_agentacccfg,
				ts: ts.value,
				actionname: 'UnConfirm'
			};
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000036'),
				content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000029'),/* 国际化处理： 是否取消确认？*/
				beSureBtnClick: () => {			// 确定按钮点击调用函数,非必输
					beSureBtnClickConfirm.call(that, props, data, this);
				}
			});
			break;
		//停用
		case 'UnEnable':
			enableAction = 'DISABLE';
			bodyRows = getBodyRows.call(that, props);
			//判断是否选择了表体行
			if (bodyRows && bodyRows.length > 0) {
				this.setState({
					showModal_enable: true,
					action: enableAction,
					content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000030')/* 国际化处理： 您选择了表体行的单位，是否对选择的单位进行停用，选择“是”停用单位，选择“否”停用整个代理结算账户*/
				});
			}
			else {
				data = {
					pk: pk_agentacccfg,
					ts: ts.value,
					actionname: enableAction
				};
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000037'),
					content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000013'),/* 国际化处理： 将对您当前选择的代理结算账户进行停用，请确认*/
					beSureBtnClick: () => {			// 确定按钮点击调用函数,非必输
						enableCard.call(that, props, data);
					}
				});
			}
			break;
		//启用
		case 'Enable':
			enableAction = 'ENABLE';
			bodyRows = getBodyRows.call(that, props);
			//判断是否选择了表体行
			if (bodyRows && bodyRows.length > 0) {
				this.setState({
					showModal_enable: true,
					action: enableAction,
					content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000031')/* 国际化处理： 您选择了表体行的单位，是否对选择的单位进行启用，选择“是”启用单位，选择“否”启用整个代理结算账户*/
				});
			}
			else {
				data = {
					pk: pk_agentacccfg,
					ts: ts.value,
					actionname: enableAction
				};
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000038'),
					content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000014'),/* 国际化处理： 将对您当前选择的代理结算账户进行启用，请确认*/
					beSureBtnClick: () => {			// 确定按钮点击调用函数,非必输
						enableCard.call(that, props, data);
					}
				});
			}
			break;
		//是（启用停用）
		case 'YesEnable':
			data = {
				pk: pk_agentacccfg,
				ts: ts.value,
				actionname: this.state.action,
				bodyPks: getBodyRows.call(that, props, this)
			};
			this.setState({
				showModal_enable: false
			});
			enableCard.call(that, props, data, this);
			break;
		//否（启用停用）
		case 'NoEnable':
			data = {
				pk: pk_agentacccfg,
				ts: ts.value,
				actionname: this.state.action
			};
			this.setState({
				showModal_enable: false,
				actionname: ''
			});
			enableCard.call(that, props, data, this);
			break;
		//取消（启用停用）
		case 'CancleEnable':
			this.setState({
				showModal_enable: false
			});
			break;
		//变更
		case 'Modify':
			props.pushTo('/card', {
				status: 'edit',
				id: pk_agentacccfg,
				modify: 'modify',
				pagecode: card_page_id
			});
			this.toggleShow();
			versionControl(props);
			break;
		//删除
		case 'Delete':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000017'),
				content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000018'),/* 国际化处理： 是否确认删除？*/
				beSureBtnClick: this.delConfirm
			});
			break;
		//返回
		case 'Back':
			props.pushTo('/list', {
				pagecode: list_page_id
			});
			break;
		//取消
		case 'Cancel':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000039'),
				content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000023'),/* 国际化处理： 确定要取消吗?*/
				beSureBtnClick: this.cancelConfirm
			});
			break;
		//打印
		case 'Print':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print,
				{
					appcode: appcode,	//应用编码
					nodekey: printnodekey, // 模板节点标识
					oids: [pk_agentacccfg]
				}
				// false
			);
			break;
		// 输出
		case 'Output':
			let pk_output = this.props.form.getFormItemsValue(this.formId, agentacc_pk);
			this.setState(
				{
					outputData: {
						appcode: appcode,	//应用编码
						nodekey: printnodekey, // 模板节点标识
						oids: [pk_output && pk_output.value],
						outputType: 'output'
					}
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

		//列表肩部按钮
		//增行
		case 'AddbodyBtn':
			if (org_val && org_display) {
				props.cardTable.addRow(this.tableId);
			} else {
				toast({ color: 'warning', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000032') });/* 国际化处理： 请先填写财务组织！*/
				return;
			}
			break;
		//删行
		case 'DeletebodyBtn':
			if (org_val && org_display) {
				currRows = props.cardTable.getCheckedRows(this.tableId);
				currSelect = [];
				if (currRows && currRows.length > 0) {
					promptBox({
						color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000017'),
						content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000018'),/* 国际化处理： 是否确认删除？*/
						beSureBtnClick: () => {			// 确定按钮点击调用函数,非必输
							deleteBodyRows(currRows, props, currSelect)
						}
					});
				} else if (currSelect.length == 0) {
					toast({ color: 'warning', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000001') });/* 国际化处理： 请选择数据，进行删除!*/
					return;
				}
			} else {
				toast({ color: 'warning', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000032') });/* 国际化处理： 请先填写财务组织！*/
				return;
			}
			break;
		//复制行
		case 'CopybodyBtn':
			if (org_val && org_display) {
				let checkedRows = props.cardTable.getCheckedRows(this.tableId);
				if (checkedRows && checkedRows.length > 0) {
					this.setState({ pasteflag: true }, () => {
						this.toggleCopy();
					});
				} else {
					toast({
						'color': 'warning',
						'content': props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000033')/* 国际化处理： 请选择复制数据！*/
					});
					return;
				}
			} else {
				toast({ color: 'warning', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000032') });/* 国际化处理： 请先填写财务组织！*/
				return;
			}
			break;
		//取消粘贴
		case 'CancelPasteBtn':
			this.setState({ pasteflag: false }, () => { this.toggleCopy() });
		break;
		//粘贴至末行
		case 'PastebodyLastBtn':
			let checkedRows = props.cardTable.getCheckedRows(this.tableId);
			if (checkedRows == null || checkedRows.length == 0) {
				toast({
					'color': 'warning',
					'content': props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000034')/* 国际化处理： 未选中要复制的行*/
				});
				return false;
			}
			let copyindex = props.cardTable.getNumberOfRows(this.tableId, false);
			BatchCopy(props, this.tableId, copyindex);//调用组件使用粘贴
			this.setState({ pasteflag: false }, () => { this.toggleCopy() });
			break;

	}
}

//确认按钮
function beSureBtnClickConfirm(props, data) {
	ajax({
		url: requesturl.confirm,
		data: data,
		success: (res) => {
			var pk = data.pk;
			updateCache(agentacc_pk, pk,  res.data, card_from_id, dataSourceName, res.data.head[card_from_id].rows[0].values);
			toast({ color: 'success', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000009') });/* 国际化处理： 操作成功*/
			props.pushTo('/card', {
				status: 'browse',
				id: pk,
				pagecode: card_page_id
			});
			this.toggleShow();
		}
	});
}

//启用/停用按钮
function enableCard(props, data) {
	ajax({
		url: requesturl.enable,
		data: data,
		success: (res) => {
			var pk = data.pk;
			updateCache(agentacc_pk, pk, res.data, card_from_id, dataSourceName, res.data.head[card_from_id].rows[0].values);
			toast({ color: 'success', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000009') });/* 国际化处理： 操作成功*/
			props.pushTo('/card', {
				status: 'browse',
				id: pk,
				pagecode: card_page_id
			});
			this.toggleShow();
		}
	});
}

function getBodyRows(props) {
	let currRows = [];
	let bodyRows = [];
	if(props.cardTable.getVisibleRows(card_table_id).length > 0){
		currRows = props.cardTable.getCheckedRows(this.tableId);
		if (currRows && currRows.length > 0) {
			for (let i = 0; i < currRows.length; ++i) {
				bodyRows.push(currRows[i].data.values.pk_agentacccfg_b.value);
			}
		}
	}
	return bodyRows;
}

function deleteBodyRows(bodyRows, props, body2Del) {
	
	let isConfirm = false;
	for (let item of bodyRows) {
		let status = item.data.values.linestatus.value;
		//未确认的单位
		if (status === '1') {
			isConfirm = true;
			break;
		} else {
			body2Del.push(item.index);
		}
	}
	if (isConfirm) {
		toast({ color: 'warning', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000028') });/* 国际化处理： 仅允许删除未确认的成员单位!*/
		return;
	} else {
		props.cardTable.delRowsByIndex(card_table_id, body2Del);
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/