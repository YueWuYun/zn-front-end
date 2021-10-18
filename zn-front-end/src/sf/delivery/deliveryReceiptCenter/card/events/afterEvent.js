/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax, toast } from 'nc-lightapp-front';

export default function afterEvent(props, moduleId, key, value, changedrows, i) {

	if (key === 'pk_org_v') {
		// let val = { display: value.refname, value: value.refpk };
		// props.form.setFormItemsValue(moduleId, { pk_org: val });
		let data = {
			nbcrcode: 'HO',
			pk_group: '0001A1100000000005T5',
			pk_org: value.value
		}
		ajax({
			url: '/nccloud/reva/revebill/contractfront.do',
			data: data,
			success: (res) => {
				if (res.success) {
					let pk_org_v_value = res.data[1];
					props.form.setFormItemsValue(moduleId, { vbillcode: pk_org_v_value });
				}
			}
		});

	}
	//点选财务组织，编辑后事件
	if (key === 'pk_org') {
		console.log(value);
		//// 编辑后--->单据日期赋值
		// let date = new Date();
		// let	Y = date.getFullYear() + '-';
		// let	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		// let	D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getMonth())+ ' ';
		// let	h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
		// let	m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
		// let	s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()); 
		// let total = Y+M+D+h+m+s;

		let orgdata = {
			'pk': value.value
		};
		let tableId = 'table_curexchange_01';
		ajax({
			url: '/nccloud/cmp/curexchange/curexchangeaddevent.do',
			data: orgdata,
			success: function (res) {
				let { success, data } = res;
				if (success) {
					let setVale = data[tableId].rows[0].values;

					props.form.setFormItemsValue(moduleId, { 'settlestatus': { display: setVale.settlestatus.display, value: setVale.settlestatus.value } });//结算状态
					props.form.setFormItemsValue(moduleId, { 'pk_chargecurrtype': { display: setVale.pk_chargecurrtype.display, value: setVale.pk_chargecurrtype.value } });//手续费币种
					props.form.setFormItemsValue(moduleId, { 'billdate': { display: setVale.billdate.value, value: setVale.billdate.value } });//单据日期
					props.form.setFormItemsValue(moduleId, { 'vbillstatus': { display: setVale.vbillstatus.display, value: setVale.vbillstatus.value } });//审批状态
					props.form.setFormItemsValue(moduleId, { 'billmakedate': { display: setVale.billmakedate.value, value: setVale.billmakedate.value } });//制单日期
					props.form.setFormItemsValue(moduleId, { 'isauthpass': { display: setVale.isauthpass.value, value: setVale.isauthpass.value } });//自动通过
					props.form.setFormItemsValue(moduleId, { 'chargeolcrate': { display: setVale.chargeolcrate.value, value: setVale.chargeolcrate.value } });//手续费本地汇率

				}
			}
		});

	}
	//单据日期测试编辑后事件
	if (key === 'billdate') {
		let val = value.value;
		//给其他输入栏位赋值
		// props.form.setFormItemsValue(moduleId, { 'summary':{display:val,value:val}});
		//props.form.setFormItemsValue(moduleId, { 'billmakedate': { display: val, value: val } });
	}
	//业务类型编辑后
	if (key === 'busitype') {
		// this.props.form.getFormItemsValue(this.formId, 'ts').value
		let busitype = props.form.getFormItemsValue(moduleId, 'busitype').value;
		if (busitype === 'BUY') {
			//买入外汇
			//卖出信息赋值
//			props.form.setFormItemsValue(moduleId, { 'pk_sellcurrtype': { display: this.state.json['36320FCRF-000000'], value: '1002Z0100000000001K1' } });/* 国际化处理： 人民币*/
			props.form.setFormItemsValue(moduleId, { 'sellolcrate': { display: '1.00', value: '1.00' } });

			//买入信息
			props.form.setFormItemsValue(moduleId, { 'pk_buycurrtype': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'buyolcrate': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'buyolcamount': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'tradeprice': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'buyamount': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'pk_buyacct': { display: '', value: '' } });

			//设置编辑属性
			props.form.setFormItemsDisabled(moduleId, { 'pk_sellcurrtype': true });//卖出币种
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': true });//卖出本币汇率
			props.form.setFormItemsDisabled(moduleId, { 'sellolcamount': true });//卖出本币金额

			props.form.setFormItemsDisabled(moduleId, { 'pk_buycurrtype': false });//买入币种
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': false });//买入本币汇率
			// props.form.setFormItemsDisabled(moduleId, { 'buyolcamount': false });

		}
		if (busitype === 'SELL') {
			//卖出外汇
			//买入信息赋值
//			props.form.setFormItemsValue(moduleId, { 'pk_buycurrtype': { display: this.state.json['36320FCRF-000000'], value: '1002Z0100000000001K1' } });/* 国际化处理： 人民币*/
			props.form.setFormItemsValue(moduleId, { 'buyolcrate': { display: '1.00', value: '1.00' } });

			//卖出信息
			props.form.setFormItemsValue(moduleId, { 'pk_sellcurrtype': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'sellolcrate': { display: '', value: '' } });

			props.form.setFormItemsValue(moduleId, { 'sellamount': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'sellolcamount': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'tradeprice': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'pk_sellacct': { display: '', value: '' } });

			//设置编辑属性
			props.form.setFormItemsDisabled(moduleId, { 'pk_buycurrtype': true });
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': true });
			props.form.setFormItemsDisabled(moduleId, { 'buyolcamount': true });

			props.form.setFormItemsDisabled(moduleId, { 'pk_sellcurrtype': false });
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': false });
			props.form.setFormItemsDisabled(moduleId, { 'sellolcamount': false });

		}
		if (busitype === 'EXCHANGE') {
			//外币兑换

			props.form.setFormItemsValue(moduleId, { 'pk_buycurrtype': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'buyolcrate': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'pk_buyacct': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'buyamount': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'tradeprice': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'buyolcrate': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'buyolcamount': { display: '', value: '' } });


			props.form.setFormItemsValue(moduleId, { 'pk_sellcurrtype': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'sellolcrate': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'pk_sellacct': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'sellamount': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'sellolcamount': { display: '', value: '' } });
			props.form.setFormItemsValue(moduleId, { 'gainorloss': { display: '', value: '' } });


			props.form.setFormItemsDisabled(moduleId, { 'pk_buycurrtype': false });
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_buyacct': false });
			props.form.setFormItemsDisabled(moduleId, { 'buyamount': false });
			props.form.setFormItemsDisabled(moduleId, { 'tradeprice': false });

			props.form.setFormItemsDisabled(moduleId, { 'pk_sellcurrtype': false });
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_sellacct': false });
			props.form.setFormItemsDisabled(moduleId, { 'sellamount': false });

		}


	}

	//编辑后----->卖出金额
	if (key === 'sellamount') {

		let val = value.value;
		let rate = props.form.getFormItemsValue(moduleId, 'sellolcrate').value;
		let sellolcamountvalue = (val * rate).toFixed(2);
		// props.form.setFormItemsValue(moduleId, { 'summary':{display:val,value:val}});
		let buyamount = props.form.getFormItemsValue(moduleId, 'buyamount').value;
		props.form.setFormItemsValue(moduleId, { 'sellolcamount': { display: sellolcamountvalue, value: sellolcamountvalue } });

		if (buyamount && val) {

			let tradeAmount = (val / buyamount).toFixed(5);

			props.form.setFormItemsValue(moduleId, { 'tradeprice': { display: tradeAmount, value: tradeAmount } });

			let buyOlAmount = props.form.getFormItemsValue(moduleId, 'buyolcamount').value;//买入本币

			let gainAmount = (val - buyOlAmount).toFixed(2);

			props.form.setFormItemsValue(moduleId, { 'gainorloss': { display: gainAmount, value: gainAmount } });
		}
		// props.form.setFormItemsValue(moduleId, { 'tradeprice': { display: sellolcamountvalue, value: sellolcamountvalue } });
		// props.form.setFormItemsValue(moduleId, { 'buyamount': { display: sellolcamountvalue, value: sellolcamountvalue } });
		// props.form.setFormItemsValue(moduleId, { 'buyolcamount': { display: sellolcamountvalue, value: sellolcamountvalue } });








	}

	//编辑后----->买入金额本币汇率
	//后期添加根据填写币种查询交易价和汇率信息
	if (key === 'buyolcrate') {

		let val = value.value;//买入汇率
		let buyamount = props.form.getFormItemsValue(moduleId, 'buyamount').value;//买入金额
		let tradeprice = props.form.getFormItemsValue(moduleId, 'tradeprice').value;//交易价
		let buyolcamount = (val * buyamount).toFixed(2);
		let sellAmount = (tradeprice * buyamount).toFixed(2);
		// props.form.setFormItemsValue(moduleId, { 'summary':{display:val,value:val}});
		props.form.setFormItemsValue(moduleId, { 'buyolcamount': { display: buyolcamount, value: buyolcamount } });

		props.form.setFormItemsValue(moduleId, { 'sellamount': { display: sellAmount, value: sellAmount } });
		props.form.setFormItemsValue(moduleId, { 'sellolcamount': { display: sellAmount, value: sellAmount } });

		//汇兑损益
		if (props.form.getFormItemsValue(moduleId, 'sellolcamount').value) {

			props.form.setFormItemsValue(moduleId, { 'gainorloss': { display: '0.00', value: '0.00' } });
		}

	}
	//编辑后----->手续费金额
	if (key === 'chargeamount') {

		let val = value.value;
		let rate = props.form.getFormItemsValue(moduleId, 'chargeolcrate').value;
		let chargeamount = (val * rate).toFixed(2);
		// props.form.setFormItemsValue(moduleId, { 'summary':{display:val,value:val}});
		props.form.setFormItemsValue(moduleId, { 'chargeolcamount': { display: chargeamount, value: chargeamount } });


	}
	//编辑后----->买入币种
	if (key === 'pk_buycurrtype') {

		let sellType = props.form.getFormItemsValue(moduleId, 'pk_sellcurrtype').value;
		let buyType = props.form.getFormItemsValue(moduleId, 'pk_buycurrtype').value;
		if (sellType && buyType && (sellType == buyType)) {
			props.form.setFormItemsValue(moduleId, { 'pk_buycurrtype': { display: '', value: '' } });
//			toast({ color: 'warning', content: this.state.json['36320FCRF-000001'] });/* 国际化处理： 买入卖出币种不能一样*/

		}



	}
	//编辑后----->卖出币种
	if (key === 'pk_buycurrtype') {

		let sellType = props.form.getFormItemsValue(moduleId, 'pk_sellcurrtype').value;
		let buyType = props.form.getFormItemsValue(moduleId, 'pk_buycurrtype').value;
		if (sellType && buyType && (sellType == buyType)) {
			props.form.setFormItemsValue(moduleId, { 'pk_sellcurrtype': { display: '', value: '' } });
//			toast({ color: 'warning', content: this.state.json['36320FCRF-000001'] });/* 国际化处理： 买入卖出币种不能一样*/

		}



	}

	if (key === 'dbilldate') {
		//表头编辑后事件
		let data = props.createHeadAfterEventData('20521030', this.formId, this.tableId, moduleId, key, value);
		ajax({
			url: '/nccloud/reva/revebill/afteredit.do',
			data: data,
			success: (res) => {
				if (res.data && res.data.head && res.data.head.head) {
					let dealmny = res.data.head.head.rows[0].values.ndealtotalmny;
					props.form.setFormItemsValue(moduleId, { ndealtotalmny: dealmny });
				}
			}
		});
	}

	if (key === 'cmaterialvid') {
		let materialsNew = value;
		if (materialsNew && materialsNew.length > 1) {
			props.editTable.setValByKeyAndRowNumber(moduleId, i + 1, key, materialsNew[0].refpk, materialsNew[0].refname);
			for (let i = 1; i < materialsNew.length; i++) {
				props.editTable.addRow(moduleId);
				let ll = props.editTable.getNumberOfRows(moduleId);
				props.editTable.setValByKeyAndRowNumber(moduleId, ll, key, materialsNew[i].refpk, materialsNew[i].refname);
			}
		}
	}


	//表体编辑后事件
	if (key == 'fconfirmpoint') {
		let data = props.createBodyAfterEventData('20521030', this.formId, this.tableId, moduleId, key, changedrows);
		ajax({
			url: '/nccloud/reva/revebill/cardafteredit.do',
			data: data,
			success: (res) => {
				debugger
				if (res.data && res.data.body && res.data.body[this.tableId]) {
					let npobnum = res.data.body[this.tableId].rows[0].values.npobnum;
					props.editTable.setValByKeyAndRowNumber(moduleId, i + 1, 'npobnum', npobnum.value);
				}
			}
		});
	}


}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/