/*Hm9gUKDDwtNjV7Mk8onAzsLWQH/l1DmcaFGbXclJ8OkE5QDZUmL3ka2qQ7SuEIgS*/
import { ajax, toast, print, output, promptBox } from 'nc-lightapp-front';
import { base_url, list_table_id, list_page_id, billtype, print_nodekey, print_templateid, funcode, viewmod_deal, sourceModel, card_page_url, list_page_url, pkName, dataSource } from '../../cons/constant.js';
import { listMultiOperator, listSingleOperator, linkSucessPro } from '../../../../pub/utils/FTSButtonUtil';
import { linkVoucherApp, linkApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { SCENE, LINKTYPE, URL_PARAM } from "../../../../../tmpub/pub/cons/constant";
import { goTocard } from '../../util/spegatherUtil';


export default function buttonClick(props, key, text, record, index) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	let selectData = selectDatas[0];
	switch (key) {
		//头部 刷新
		case 'Refresh':
			this.refresh();
			break;
		//头部 新增
		case 'Add':
			goTocard(props, { status: 'add' }, this.getState.bind(this));
			break;
		//头部 删除
		case 'BatchDelete':
			promptBox({
				color: "warning",
				title: this.state.json['36300STG-000005'],/* 国际化处理： 删除*/
				content: this.state.json['36300STG-000006'],/* 国际化处理： 确定要删除所选数据吗？*/
				beSureBtnClick: delConfirm.bind(this, props)
			});
			break;
		//头部 复制
		case 'Copy':
			let selectDatas = props.table.getCheckedRows(list_table_id);
			//判断是否有选中行
			if (selectDatas == null || selectDatas.length == 0) {
				toast({ color: 'warning', content: this.state.json['36300STG-000040'] });/* 国际化处理： 未选中行！*/
				return;
			}
			if (selectDatas.length > 1) {
				toast({ color: 'warning', content: this.state.json['36300STG-000041'] });/* 国际化处理： 只支持单笔数据复制！*/
				return;
			}
			let id = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_spegather_h'] && selectDatas[0].data.values['pk_spegather_h'].value;
			goTocard(props, { status: 'add', id: id, isCopy: true, from: 'list' }, this.getState.bind(this));
			break;
		//头部 提交
		case 'BatchCommit':
			listMultiOperator(props, list_page_id, list_table_id, pkName, base_url + 'spegathercommit.do', this.state.json['36300STG-000054'], dataSource, false, null, (props, data) => {/* 国际化处理： 批量提交成功！*/
				let { workflow } = data;
				//有指派信息，则指派，没有则重绘界面
				if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
					this.setState({
						assignData: data,
						assignShow: data,
						index: selectData.index,
						billID: selectData && selectData.data && selectData.data.values && selectData.data.values.pk_spegather_h && selectData.data.values.pk_spegather_h.value,
						ts: selectData && selectData.data && selectData.data.values && selectData.data.values.ts && selectData.data.values.ts.value
					});
				}
			});
			break;
		//头部 收回
		case 'BatchUncommit':
			listMultiOperator(props, list_page_id, list_table_id, pkName, base_url + 'spegatheruncommit.do', this.state.json['36300STG-000055'], dataSource);/* 国际化处理： 批量收回成功！*/
			break;
		//头部 打印
		case 'Print':
			printAll.call(this, props);
			break;
		//头部 输出
		case 'OutPut':
			outputAll.call(this, props);
			break;
		//头部 附件
		case 'File':
			fileMgr.call(this, props);
			break;
		//头部 联查审批意见
		case 'LinkViewApprove':
			approveView.call(this, props);
			break;
		//头部 联查来源单据
		case 'LinkSourceBill':
			qrySourceBill.call(this, props);
			break;
		//头部 联查下游单据
		case 'LinkSendBill':
			qrySendBill.call(this, props);
			break;
		//头部 联查凭证
		case 'LinkQueryVoucher':
			linkQueryVoucher.call(this, props);
			break;
		//头部 联查预算
		case 'LinkNtbPlan':
			linkNtb.call(this, props);
			break;
		//表体 修改
		case 'Edit':
			this.editData(record, index);
			break;
		//表体 删除
		case 'Delete':
			this.delConfirm(record, index);
			break;
		//表体 提交
		case 'Commit':
			listSingleOperator(props, list_page_id, list_table_id, base_url + 'spegathercommit.do', record, pkName, index, this.state.json['36300STG-000025'], dataSource, true, null, (props, data) => {/* 国际化处理： 提交成功！*/
				let { workflow } = data;
				//有指派信息，则指派，没有则重绘界面
				if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
					this.setState({
						assignData: data,
						assignShow: data,
						index: index,
						ts: record.ts.value,
						billID: record.pk_spegather_h.value
					});
				}
			});
			break;
		//表体 收回
		case 'Uncommit':
			listSingleOperator(props, list_page_id, list_table_id, base_url + 'spegatheruncommit.do', record, pkName, index, this.state.json['36300STG-000056'], dataSource);/* 国际化处理： 收回成功！*/
			break;
		//表体 制证
		case 'Premit':
			listSingleOperator(props, list_page_id, list_table_id, base_url + 'spegathervoucher.do', record, pkName, index, this.state.json['36300STG-000057'], dataSource);/* 国际化处理： 制证成功！*/
			break;
		//表体 取消制证
		case 'UnPremit':
			listSingleOperator(props, list_page_id, list_table_id, base_url + 'spegathercancelvoucher.do', record, pkName, index, this.state.json['36300STG-000058'], dataSource);/* 国际化处理： 取消制证成功！*/
			break;
		//表体 经办
		case 'Decide':
			props.pushTo("/card", {
				status: viewmod_deal,
				id: record.pk_spegather_h.value,
				from: 'list',
				ts: record.ts.value
			});
			break;
		//表体 退回
		case 'Back':
			this.setState({ showBackModal: true, record: record, index: index });
			break;
		default:
			break;
	}
}

/**
 * 打印
 * @param {*} props 页面内置对象
 */
const printAll = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let index = 0;
	let oids = [];
	let id;
	while (index < selectDatas.length) {
		id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values['pk_spegather_h'] && selectDatas[index].data.values['pk_spegather_h'].value;
		if (!id) {
			continue;
		}
		oids.push(id);
		index++;
	}
	if (oids.length == 0) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	print(
		'pdf',
		base_url + 'spegatherprint.do',
		{
			billtype: billtype,//单据类型
			funcode: funcode,//功能节点编码
			nodekey: print_nodekey,//模板节点标志
			oids: oids//单据主键
		}
	);
}

/**
 * 输出
 * @param {} props 
 */
const outputAll = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let index = 0;
	let oids = [];
	let id;
	while (index < selectDatas.length) {
		id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values['pk_spegather_h'] && selectDatas[index].data.values['pk_spegather_h'].value;
		if (!id) {
			continue;
		}
		oids.push(id);
		index++;
	}
	if (oids.length == 0) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	output({
		url: base_url + 'spegatherprint.do',
		data: {
			oids,
			outputType: 'output'
		}
	});
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_spegather_h'] && selectDatas[0].data.values['pk_spegather_h'].value;
	let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillno'] && selectDatas[0].data.values['vbillno'].value;
	this.setState({
		showUploader: !this.state.showUploader,
		billID,
		billNO
	});
}

/**
 * 联查审批意见
 */
const approveView = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_spegather_h'] && selectDatas[0].data.values['pk_spegather_h'].value;
	this.setState({
		approveshow: !this.state.approveshow,
		billID
	});
}

/**
 * 联查来源单据
 */
const qrySourceBill = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	//来源模块
	let bill_recmodul = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['recmodul'] && selectDatas[0].data.values['recmodul'].value;
	//来源单据类型
	let srccmpbilltype = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['srccmpbilltype'] && selectDatas[0].data.values['srccmpbilltype'].value;
	//来源单据id
	let pk_srccmpbill = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_srccmpbill'] && selectDatas[0].data.values['pk_srccmpbill'].value;
	if (bill_recmodul == sourceModel.ModuleCode_FTS) {
		toast({ color: 'warning', content: this.state.json['36300STG-000015'] });/* 国际化处理： 中心填写的单据，没有来源*/
		return;
	}
	let sbExtParam = {
		status: 'browse',
		LinkBillType: billtype,
		id: pk_srccmpbill
	};
	linkApp(props, srccmpbilltype, sbExtParam);
}

/**
 * 联查下游单据
 */
const qrySendBill = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let pk = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_spegather_h'] && selectDatas[0].data.values['pk_spegather_h'].value;
	ajax({
		url: base_url + 'spegatherlinkqrysendbill.do',
		data: { pk },
		success: (res) => {
			let { data } = res;
			if (!data) {
				return;
			}
			let { url, pks, appCode, linkPageCode } =data[0];
			let urlExtParam = {
				status: 'browse',
				scene: SCENE.LINK,
				appcode: appCode,
				pagecode: linkPageCode,
				srcbilltype: billtype,
				[URL_PARAM.PK_SRC]: pk
			};
			props.openTo(null, urlExtParam);
			// linkSucessPro(props, res, urlExtParam);
		}
	});
}

/**
* 联查凭证
*/
const linkQueryVoucher = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let pk = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_spegather_h'] && selectDatas[0].data.values['pk_spegather_h'].value;
	let pk_group = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_group'] && selectDatas[0].data.values['pk_group'].value;
	let pk_org = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_org'] && selectDatas[0].data.values['pk_org'].value;
	let pk_billtype = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_billtype'] && selectDatas[0].data.values['pk_billtype'].value;
	let billno = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillno'] && selectDatas[0].data.values['vbillno'].value;
	linkVoucherApp(props, pk,pk_group,pk_org,pk_billtype,billno);
}

/**
 * 联查预算
 * @param {*} props 
 */
const linkNtb = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length != 1) {
		toast({ color: 'warning', content: this.state.json['36300STG-000042'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let pk = selectDatas[0].data.values[pkName].value;
	if (!pk) {
		return;
	}
	ajax({
		url: base_url + 'spegatherlinkqryntb.do',
		data: { pk },
		success: (res) => {
			let { data } = res;
			this.setState({
				showNtbDetail: true,
				ntbdata: data
			})
		}
	});
}

/**
 * 删除确认
 * @param {*} props 
 */
const delConfirm = function (props) {
	listMultiOperator(props, list_page_id, list_table_id, pkName, base_url + 'spegatherdelete.do', this.state.json['36300STG-000059'], dataSource, true);/* 国际化处理： 批量删除成功！*/
}


/*Hm9gUKDDwtNjV7Mk8onAzsLWQH/l1DmcaFGbXclJ8OkE5QDZUmL3ka2qQ7SuEIgS*/