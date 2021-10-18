/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

/**
 * [外币兑换]-[列表按钮隐藏]
 * @param {*} props 
 * @param {*} status 
 */
export default function buttonUsability(props, status) {
	let tableId = Templatedata.list_tableid;
	let selectData = props.table.getCheckedRows(tableId);
	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			'buttongroup',	//列表肩部按钮组
			'deleteBtn',	//列表删除按钮
			'copyBtn',	//列表复制按钮
			'settlelistBtn',	//列表结算按钮
			'submitlistBtn2',	//列表提交按钮
			'unsubmitlistBtn',	//列表收回按钮
			'printBtn',	//列表更多打印
			'outputBtn',	//列表中打印中输出
			'submitlistBtn',	//列表提交父下拉按钮
			//'addBtn',	//列表新增按钮
			'buybalanceBtn',	//列表联查买入账户余额
			'chargebalanceBtn',	//列表手续费账户余额
			'approvemsgBtn',	//列表联查中审批意见
			'sellbalanceBtn',	//列表联查卖出账户余额
			// 'linksearchBtn',	//列表更多联查
			'linksearchBtn2',//联查2级
			'voucherBtn',	//列表联查中联查凭证
			'unsettlelistBtn',	//列表取消结算按钮
			'settleSecBtn',	//列表中结算二级按钮
			//'refreshBtn',	//列表中刷新按钮图标
			'accessoryBtn',	//更多种附件管理中附件
			'printBtn2',
			'transfer',
			'canceltransfer'
		], true);
		//切换页签- 切换状态
		props.button.setButtonDisabled(
			[
				'addBtn'//列表新增按钮
			],
			false
		);
	};
	if (selectData.length > 1) {
		props.button.setButtonDisabled([
			'buttongroup',	//列表肩部按钮组
			'deleteBtn',	//列表删除按钮
			'copyBtn',	//列表复制按钮
			'settlelistBtn',	//列表结算按钮
			'linksearchBtn',	//列表更多联查
			'voucherBtn',	//列表联查中联查凭证
			'submitlistBtn2',	//列表提交按钮
			'unsubmitlistBtn',	//列表收回按钮
			'printBtn',	//列表更多打印
			'sellbalanceBtn',	//列表联查卖出账户余额
			'outputBtn',	//列表中打印中输出
			'submitlistBtn',	//列表提交父下拉按钮
			'addBtn',	//列表新增按钮
			'buybalanceBtn',	//列表联查买入账户余额
			'chargebalanceBtn',	//列表手续费账户余额
			'approvemsgBtn',	//列表联查中审批意见
			'unsettlelistBtn',	//列表取消结算按钮
			'settleSecBtn',	//列表中结算二级按钮
			'refreshBtn',	//列表中刷新按钮图标
			'accessoryBtn',	//更多种附件管理中附件
			'linksearchBtn2',
			'printBtn2',
			'transfer',
			'canceltransfer'
		], false);

		if (status && status.length > 0) {
			//待提交--保存态
			if (status == '1') {
				props.button.setButtonDisabled(
					[
						'unsubmitlistBtn',	//列表收回按钮
						'settlelistBtn',	//列表结算按钮
						'unsettlelistBtn'	//列表取消结算按钮
					],
					true
				);

			}
			//待审批
			if (status == '2') {
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'settlelistBtn',	//列表结算按钮
						'unsettlelistBtn'	//列表取消结算按钮
					],
					true
				);

			}
			//代办理
			if (status == '3') {
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'unsettlelistBtn'	//列表取消结算按钮
					],
					true
				);
			}
			//已完毕
			if (status == '4') {
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitlistBtn',	//列表提交父下拉按钮
						'settlelistBtn',	//列表结算按钮
						'unsubmitlistBtn',	//列表收回按钮
					], true);
			}

			//审批中-审批状态：vbillstatus
			if (status == '6') {
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitlistBtn',	//列表提交父下拉按钮
						'unsubmitlistBtn',	//列表收回按钮
						'settlelistBtn',	//列表结算按钮
						'unsettlelistBtn'	//列表取消结算按钮
					],
					true
				);

			}
		}
	}
	if (selectData.length == 1) {
		props.button.setButtonDisabled([
			'buttongroup',	//列表肩部按钮组
			'deleteBtn',	//列表删除按钮
			'copyBtn',	//列表复制按钮
			'settlelistBtn',	//列表结算按钮
			'linksearchBtn',	//列表更多联查
			'voucherBtn',	//列表联查中联查凭证
			'submitlistBtn2',	//列表提交按钮
			'unsubmitlistBtn',	//列表收回按钮
			'printBtn',	//列表更多打印
			'sellbalanceBtn',	//列表联查卖出账户余额
			'outputBtn',	//列表中打印中输出
			'submitlistBtn',	//列表提交父下拉按钮
			'addBtn',	//列表新增按钮
			'buybalanceBtn',	//列表联查买入账户余额
			'chargebalanceBtn',	//列表手续费账户余额
			'approvemsgBtn',	//列表联查中审批意见
			'unsettlelistBtn',	//列表取消结算按钮
			'settleSecBtn',	//列表中结算二级按钮
			'refreshBtn',	//列表中刷新按钮图标
			'accessoryBtn',	//更多种附件管理中附件
			'linksearchBtn2',
			'printBtn2'
		], false);
		debugger
		let bill_status = selectData[0].data.values.busistatus.value;
		let isinneracc =  selectData[0].data.values.isinner.value;
		let settlestatus =  selectData[0].data.values.settlestatus.value;
		switch (bill_status) {
			//保存态[待提交]
			case '1':
				props.button.setButtonDisabled(
					[
						'unsubmitlistBtn',	//列表收回按钮
						'settlelistBtn',	//列表结算按钮
						'unsettlelistBtn'	//列表取消结算按钮
					], true);
				break;
			//待审批[审批中]
			case '2':
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'settlelistBtn',	//列表结算按钮
						'submitlistBtn',	//列表提交父下拉按钮
						'unsettlelistBtn'	//列表取消结算按钮
					], true);
				break;
			//代办理
			case '3':
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitlistBtn',	//列表提交父下拉按钮
						'unsettlelistBtn'	//列表取消结算按钮
					], true);
				//内部账户时委托付款可用，结算不可用
				if(isinneracc){
					props.button.setButtonDisabled(['transfer'], false);
					props.button.setButtonDisabled(['settleSecBtn'], true);
				}
				//如果单据状态待结算 结算状态是结算中 将委托付款设置不可用  取消委托设置可用
				if(settlestatus == 1){
					props.button.setButtonDisabled(['canceltransfer'], false);
					props.button.setButtonDisabled(['transfer'], true);
				}
				break;
			//已完毕
			case '4':
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitlistBtn',	//列表提交父下拉按钮
						'settlelistBtn',	//列表结算按钮
						'unsubmitlistBtn',	//列表收回按钮
					], true);
				//内部账户时取消委托付款可用，取消结算不可用
				if(isinneracc){
					props.button.setButtonDisabled(['canceltransfer'], false);
					props.button.setButtonDisabled(['unsettlelistBtn'], true);
				}
				break;
		}
	}

};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/