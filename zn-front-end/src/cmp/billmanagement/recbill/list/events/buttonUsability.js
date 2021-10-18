/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息


export default function buttonUsability(props, status) {
	
	let tableId = Templatedata.list_tableid;
	let selectData = props.table.getCheckedRows(tableId);
	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			// 'imagegroup1',	//列表肩部按钮
			// 'imagegroup',	//列表肩部按钮
			'imageviewBtn',	//列表影像查看按钮
			'imagescanBtn',	//列表扫描按钮
			// 'refreshBtn',	//刷新按钮图标
			'annexBtn',	//附件
			'printDetailBtn',	//打印清单
			'deleteBtn',	//按钮中删除按钮
			'copyBtn',	//按钮组中复制按钮
			'submitBtn',	//提交按钮下拉父按钮
			'submitgroup1',	//下拉二级按钮
			// 'addBtn',	//按钮组中新增按钮
			// 'linksettleBtn',	//下拉关联结算信息按钮
			// 'linksettlegroup1',	//关联结算二级按钮
			'unlinksettleBtn',	//取消关联
			'moreoperateBtn',	//更多操作
			'linkquerybillBtn',	//联查单据
			'queryvoucherBtn',	//联查凭证
			'queryconsumeBtn',	//联查计划预算
			'printgroup',	//打印
			'querysynbillBtn',	//联查协同单据
			'excelmangementBtn',	//附件管理
			'listgroup',	//列表中熙增按钮组
			'unsubmitBtn',	//收回按钮
			// 'linkquery',	//联查
			'querymsgBtn',	//查看审批意见
			'printBtn',	//打印
			'outputBtn',	//输出
			'redbillBtn',	//红冲	
		], true);
		//切换页签- 切换状态
		props.button.setButtonDisabled(
			[
				'addBtn'//按钮组中新增按钮
			],
			false
		);
	};
	if (selectData.length > 1) {
		props.button.setButtonDisabled([
			'imagegroup1',	//列表肩部按钮
			'imagegroup',	//列表肩部按钮
			'imageviewBtn',	//列表肩部按钮
			'imagescanBtn',	//列表肩部按钮
			'refreshBtn',	//刷新按钮图标
			'annexBtn',	//附件
			'printDetailBtn',	//打印清单
			'deleteBtn',	//按钮中删除按钮
			'copyBtn',	//按钮组中复制按钮
			'submitBtn',	//提交按钮下拉父按钮
			'submitgroup1',	//下拉二级按钮
			// 'addBtn',	//按钮组中新增按钮
			'linksettleBtn',	//下拉关联结算信息按钮
			'linksettlegroup1',	//关联结算二级按钮
			'unlinksettleBtn',	//取消关联
			'moreoperateBtn',	//更多操作
			'linkquerybillBtn',	//联查单据
			'queryvoucherBtn',	//联查凭证
			'queryconsumeBtn',	//联查计划预算
			'printgroup',	//打印
			'querysynbillBtn',	//联查协同单据
			'excelmangementBtn',	//附件管理
			'listgroup',	//列表中熙增按钮组
			'unsubmitBtn',	//收回按钮
			'linkquery',	//联查
			'querymsgBtn',	//查看审批意见
			'printBtn',	//打印
			'outputBtn',	//输出
			'redbillBtn',	//红冲	
		], false);

		if (status && status.length > 0) {
			//待提交--保存态、暂存态
			if (status == '-10' || status == '-99') {
				props.button.setButtonDisabled(
					[
						'unsubmitBtn',	//收回按钮
						'querymsgBtn',	//查看审批意见
						'queryvoucherBtn'	//联查凭证
					],
					true
				);

			}
			//待审批
			if (status == '-1') {
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitBtn'	//提交按钮下拉父按钮
					],
					true
				);

			}
			//审批失败//审批中
			if (status == '0' || status == '2') {
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitBtn',	//提交按钮下拉父按钮
						'unsubmitBtn'	//收回按钮
					],
					true
				);
			}
			//审批通过
			if(status == '1' ){
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitBtn',	//提交按钮下拉父按钮
					],
					true
				);
			}
			//签字
			if (status == '8') {
				props.button.setButtonDisabled(
					[
						'deleteBtn',	//列表删除按钮
						'submitBtn',	//提交按钮下拉父按钮
						'unsubmitBtn'	//收回按钮
					], true);
			}
			//未确认
			if (status == '9') {
				props.button.setButtonDisabled(
					[
						'submitBtn',	//提交按钮下拉父按钮
						'unsubmitBtn'	//收回按钮
					],
					true
				);

			}
		}
	}
	if (selectData.length == 1) {
		props.button.setButtonDisabled([
			'imagegroup1',	//列表肩部按钮
			'imagegroup',	//列表肩部按钮
			'imageviewBtn',	//列表肩部按钮
			'imagescanBtn',	//列表肩部按钮
			'refreshBtn',	//刷新按钮图标
			'annexBtn',	//附件
			'printDetailBtn',	//打印清单
			'deleteBtn',	//按钮中删除按钮
			'copyBtn',	//按钮组中复制按钮
			'submitBtn',	//提交按钮下拉父按钮
			'submitgroup1',	//下拉二级按钮
			// 'addBtn',	//按钮组中新增按钮
			'linksettleBtn',	//下拉关联结算信息按钮
			'linksettlegroup1',	//关联结算二级按钮
			'unlinksettleBtn',	//取消关联
			'moreoperateBtn',	//更多操作
			'linkquerybillBtn',	//联查单据
			'queryvoucherBtn',	//联查凭证
			'queryconsumeBtn',	//联查计划预算
			'printgroup',	//打印
			'querysynbillBtn',	//联查协同单据
			'excelmangementBtn',	//附件管理
			'listgroup',	//列表中熙增按钮组
			'unsubmitBtn',	//收回按钮
			'linkquery',	//联查
			'querymsgBtn',	//查看审批意见
			'printBtn',	//打印
			'outputBtn',	//输出
			'redbillBtn',	//红冲	
		], false);
		let bill_status = selectData[0].data.values.bill_status.value;
		switch (bill_status) {
			//保存态[待提交]
			case '-10':
				props.button.setButtonDisabled(
					[
						'unsubmitBtn',	//收回按钮
						'querymsgBtn',	//查看审批意见
						'queryvoucherBtn'	//联查凭证
					],
					true
				);
				break;
			//暂存
			case '-99':
				props.button.setButtonDisabled(
					[
						'unsubmitBtn',	//收回按钮
						'querymsgBtn',	//查看审批意见
						'queryvoucherBtn'	//联查凭证
					],
					true
				);
				break;
			//待审批
			case '-1':
			props.button.setButtonDisabled(
				[
					'deleteBtn',	//列表删除按钮
					'submitBtn',	//提交按钮下拉父按钮
					'unlinksettleBtn'	//取消关联
				],
				true
			);
				break;
			//审批失败
			case '0':
			props.button.setButtonDisabled(
				[
					'deleteBtn',	//列表删除按钮
					'submitBtn',	//提交按钮下拉父按钮
					'unsubmitBtn',	//收回按钮
					'unlinksettleBtn'	//取消关联
				],
				true
			);
				break;
			//审批通过
			case '1':
			props.button.setButtonDisabled(
				[
					'deleteBtn',	//列表删除按钮
					'submitBtn',	//提交按钮下拉父按钮
					'unlinksettleBtn',	//取消关联
				],
				true
			);
				break;
			//审批中
			case '2':
			props.button.setButtonDisabled(
				[
					'deleteBtn',	//列表删除按钮
					'submitBtn',	//提交按钮下拉父按钮
					'unlinksettleBtn',	//取消关联
					'unsubmitBtn'	//收回按钮
				],
				true
			);
				break;
			//签字
			case '8':
			props.button.setButtonDisabled(
				[
					'deleteBtn',	//列表删除按钮
					'submitBtn',	//提交按钮下拉父按钮
					'unlinksettleBtn',	//取消关联
					'unsubmitBtn'	//收回按钮
				], true);
				break;
			//未确认
			case '9':
			props.button.setButtonDisabled(
				[
					'deleteBtn',	//列表删除按钮
					'submitBtn',	//提交按钮下拉父按钮
					'unlinksettleBtn',	//取消关联
					'unsubmitBtn'	//收回按钮
				], true);
				break;
		}
	}

};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/