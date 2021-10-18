/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast } from 'nc-lightapp-front';
/**
 * 期初余额-编辑后
 */
export default function afterEvent(props, moduleId, key, value, changedrows, i, record, g) {

	let tableId = 'table_area';
	let pageId = '360701OB_L01';
	let newvalue = changedrows[0].newvalue;
	let oldvalue = changedrows[0].oldvalue;
	let rowid = changedrows[0].rowid;
	if (key === 'init_primal' && !value) {
		value = '0';
		newvalue.value = '0';
	}
	if (newvalue && oldvalue && newvalue.value == oldvalue.value) {
		return;
	}
	if (JSON.stringify(value) === '{}') {
		return;
	}
	let selectTree = props.syncTree.getSelectNode('tree');
	let fundform = null;
	if (selectTree && selectTree.refcode && selectTree.refcode != "-1") {
		fundform = selectTree.refcode;
	}
	//现金账户
	if (key === 'pk_account') {
		let accountcurrtype = '';
		let bankcurrtype = '';
		let accountname = '';
		// 给账户名称赋值
		let accountcode = value.refcode;
		if (fundform && fundform == '1') {
			// 银行参照
			accountcode = value.values['bd_bankaccsub.code'].value;	// 账户
			//accountname = value.values['bd_bankaccsub.accname'].value;//选择银行存款时给账户名称赋值
			accountname = value.values['bd_bankaccsub.accname'].value;//20181017由于关联项导致调用平台action，导致全列表数据被刷新
			bankcurrtype = value.values["bd_currtype.pk_currtype"].value;
			let currtypename = value.values["bd_currtype.name"].value;
			record.values.pk_currtype = { value: bankcurrtype, display: currtypename };
			// 设置账户类型
			let acctype = value.values["bd_bankaccsub.acctype"].value;
			let acctypeNam = value.values["bd_bankaccsub.acctype as acctype"].value;
			record.values.acctype = { value: acctype, display: acctypeNam };
			//accountcurrtype = bankcurrtype;
		} else {
			// 现金账户参照
			accountname = value.refname;//选择库存现金时给账户名称赋值
			// 名称
			let currtype = value.values.currtype.value;
			// 币种pk
			let pk_currtype = value.values.pk_moneytype.value;
			record.values.pk_currtype = { value: pk_currtype, display: currtype };
			bankcurrtype = pk_currtype;
		}
		// 选择的账户币种pk
		accountcurrtype = bankcurrtype;
		//let accountname = value.refname;
		let accountpk = value.refpk;
		//record.values['pk_account.name'] = {value:accountname,display:accountname};
		// 20181017解决新增时编辑后调用平台action出错，新增账户名称字段，去掉关联项配置
		record.values['accname'] = { value: accountname, display: accountname };
		record.values.pk_account = { value: accountpk, display: accountcode };
		// 此处需要有根据账户去查询币种的action

		// 这是原nc的处理进行的处理是置为null
		// 这里将所有值都置为0，保存的时候就不需要进行处理
		record.values.init_primal.scale = 3;
		let scales = record.values.init_primal.scale;
		let defaultvalue = { value: '0', scale: scales };

		record.values.globalrealtime_local = Object.assign(record.values.globalrealtime_local, defaultvalue);
		record.values.globalcurrent_local = Object.assign(record.values.globalcurrent_local, defaultvalue);
		record.values.groupinit_local = Object.assign(record.values.groupinit_local, defaultvalue);
		record.values.grouprealtime_local = Object.assign(record.values.grouprealtime_local, defaultvalue);
		record.values.groupcurrent_local = Object.assign(record.values.groupcurrent_local, defaultvalue);
		record.values.init_primal = Object.assign(record.values.init_primal, defaultvalue);
		record.values.init_local = Object.assign(record.values.init_local, defaultvalue);
		record.values.realtime_local = Object.assign(record.values.realtime_local, defaultvalue);
		record.values.realtime_primal = Object.assign(record.values.realtime_primal, defaultvalue);
		record.values.current_primal = Object.assign(record.values.current_primal, defaultvalue);
		record.values.current_local = Object.assign(record.values.current_local, defaultvalue);

		// 将期初原币金额赋值为0，否则下次获取到原币金额的旧值不是0！同上方比较，比如原币金额是100，上方下次获取到旧值还是100，应该是0
		props.editTable.setValByKeyAndRowId(tableId, rowid, 'init_primal', defaultvalue);

		// 判断组织本位币和账户币种是否一致
		let pkorg = props.search.getSearchValByField(this.searchId, "pk_org").value.firstvalue;
		let data = {
			pk_org: pkorg
		};

		ajax({
			url: '/nccloud/cmp/base/aftereventinfo.do',
			data: data,
			async: false,//1909新增:编辑后事件改为同步ajax请求
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						let pk_localcurr = data.localcurrtype;
						if (accountcurrtype && accountcurrtype == pk_localcurr) {
							// 相等，设置不可编辑
							props.editTable.setEditableRowKeyByIndex(tableId, i, 'init_local', false);

						} else {
							// 账户币种和组织本位币不等，那么期初本币金额可以编辑修改
							props.editTable.setEditableRowKeyByIndex(tableId, i, 'init_local', true);
						}
					}
				}
			}
		});


		//this.props.editTable.setColEditableByKey(moduleId, 'pk_account', false);//控制账户字段可编辑
		this.props.editTable.setEditableByKey(tableId, rowid, 'pk_account', true);//控制编辑行的账户字段可编辑
		return;
	}
	//期初原币金额
	if (key === 'init_primal') {
		let money = Number(value).toFixed(2);
		//期初原币+本币
		//record.values.init_primal.value = money;
		//record.values.init_primal.display = money;
		//record.values.init_local.value = money;
		//实时原币+本币
		//record.values.realtime_primal.value = money;
		//record.values.realtime_local.value = money;
		//账面原币
		//record.values.current_primal.value = money;
		//账面本币余额
		//record.values.current_local.value = money;
		//期初集团本币
		//record.values.groupinit_local.value = money;
		//期初全局本币
		//record.values.globalinit_local.value = money;
		// 需要后台查询汇率
		//let currtype_table_data = props.createBodyAfterEventData(pageId, form_id, moduleId, moduleId, key, changedrows, i);
		// 账户pk_org
		//let gridtable = createGridAfterEventData(pagecode, gridid, moduleId, key, changedrows);
		let pk_account = record.values.pk_account;
		if (!pk_account || !pk_account.value) {
			record.values.init_primal.scale = 3;
			// 账户不存在，则不往后台发请求，后台需要根据账户去计算汇率和金额
			return;
		}
		// let gridtable = props.createGridAfterEventData(pageId, moduleId, moduleId, key, changedrows);
		// gridtable.index = i;
		// 只获取修改的列
		let changedrowarr = props.editTable.getChangedRows(moduleId);
		let changedrow;
		for (let index = 0; index < changedrowarr.length; index++) {
			let element = changedrowarr[index];
			if (element.rowid == changedrows[0].rowid) {
				changedrow = element;
				break;
			}
		}
		let grid = {
			pageid: pageId,
			table_area: {
				areaType: "table",
				areacode: moduleId,
				templetid: '',
				rows: [changedrow]
			}
		};
		let griddate = {
			attrcode: key,
			changedrows,
			grid,
			index: i
		}
		// 根据组织和选择的币种查询汇率
		ajax({
			url: '/nccloud/cmp/base/queryorgcurrtyperate.do',
			async: false,//1909新增:编辑后事件改为同步ajax请求
			data: griddate,
			success: (res) => {
				if (res.success) {
					let { success, data } = res;

					let vodata = data.table_area.rows[0].values;

					record.values.init_primal.value = vodata.init_primal.value;
					record.values.init_local.value = vodata.init_local.value;
					record.values.groupinit_local.value = vodata.groupinit_local.value;
					record.values.globalinit_local.value = vodata.globalinit_local.value;
					record.values.realtime_primal.value = vodata.realtime_primal.value;
					//record.values.realtime_local.value   = vodata.realtime_local.value;
					let realtimevalue = Object.assign(record.values.realtime_local, { value: vodata.realtime_local.value });
					props.editTable.setValByKeyAndIndex(moduleId, i, 'realtime_local', realtimevalue)

					record.values.grouprealtime_local.value = vodata.grouprealtime_local.value;
					record.values.globalrealtime_local.value = vodata.globalrealtime_local.value;
					record.values.current_primal.value = vodata.current_primal.value;
					//record.values.current_local.value  = vodata.current_local.value;
					let currentlocalvalue = record.values.current_local;
					currentlocalvalue.value = vodata.current_local.value;
					props.editTable.setValByKeyAndIndex(moduleId, i, 'current_local', currentlocalvalue);

					record.values.groupcurrent_local.value = vodata.groupcurrent_local.value;
					record.values.globalcurrent_local.value = vodata.globalcurrent_local.value;
				}
			}
		})

		//this.setState();
		//实时集团本币
		//record.values.grouprealtime_local.value = money;
	}
	// 期初本币修改
	if (key === 'init_local') {

		// 修改后新值
		let newlocal = newvalue.value;
		let oldlocal = oldvalue.value;
		// let changedvalue = Number(newlocal) - Number(oldlocal);
		// let current_localvalue = record.values.current_local.value || '0';
		// let realtime_localvalue = record.values.realtime_local.value || '0';

		// let newcurrent = changedvalue + Number(current_localvalue);
		// let newrealtime = changedvalue + Number(realtime_localvalue);
		// 赋值
		// record.values.current_local.value = newcurrent;
		// record.values.realtime_local.value = newrealtime;

		//begin 修改复制赋值逻辑 期初本币、实时本币、账面本币保持一致 (后续有问题，可以咨询资金开发郑伟)
		if(!(newlocal == oldlocal)){
			record.values.current_local.value = newlocal;
			record.values.realtime_local.value = newlocal;
		}
		//end 	
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/