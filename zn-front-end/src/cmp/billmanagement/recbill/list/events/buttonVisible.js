/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { cardCache } from 'nc-lightapp-front';
let { getDefData } = cardCache;
/**
 * [收款]-[凭证联查单据按钮控制]
 * @param {*} props 
 */
export const buttonVisible = function (props) {
	let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据
	let ntb = this.props.getUrlParam('pk_ntbparadimvo');//是否联查预算单据
	let isotherlink = getDefData(this.linkscekey, this.dataSource);//是否来自其他单据联查
	if (isvoucherlink || isotherlink) {
		this.props.button.setButtonVisible(
			[
				// 'imagegroup1',	//列表肩部按钮
				// 'imagegroup',	//列表肩部按钮
				'imageviewBtn',	//列表影像查看按钮
				'imagescanBtn',	//列表扫描按钮
				// 'refreshBtn',	//刷新按钮图标
				// 'annexBtn',	//附件
				// 'printDetailBtn',	//打印清单
				'deleteBtn',	//按钮中删除按钮
				'copyBtn',	//按钮组中复制按钮
				'submitBtn',	//提交按钮下拉父按钮
				'submitgroup1',	//下拉二级按钮
				// 'addBtn',	//按钮组中新增按钮
				// 'linksettleBtn',	//下拉关联结算信息按钮
				// 'linksettlegroup1',	//关联结算二级按钮
				'unlinksettleBtn',	//取消关联
				// 'moreoperateBtn',	//更多操作
				// 'linkquery',	//联查
				// 'linkquerybillBtn',	//联查单据
				// 'queryvoucherBtn',	//联查凭证
				// 'queryconsumeBtn',	//联查计划预算
				// 'querymsgBtn',	//联查审批意见
				// 'printgroup',	//打印
				// 'printBtn',	//打印
				// 'querysynbillBtn',	//联查协同单据
				// 'excelmangementBtn',	//附件管理
				'listgroup',	//列表中熙增按钮组
				'unsubmitBtn',	//收回按钮
				'linksettleBtn',//关联结算信息
				// 'outputBtn',	//输出
				'redbillBtn',	//红冲
				'refreshBtn'
			],
			false
		);
	} else if (ntb) {
		this.props.button.setButtonVisible(
			[
				// 'imagegroup1',	//列表肩部按钮
				// 'imagegroup',	//列表肩部按钮
				'imageviewBtn',	//列表影像查看按钮
				'imagescanBtn',	//列表扫描按钮
				// 'refreshBtn',	//刷新按钮图标
				// 'annexBtn',	//附件
				'printDetailBtn',	//打印清单
				'deleteBtn',	//按钮中删除按钮
				'copyBtn',	//按钮组中复制按钮
				'submitBtn',	//提交按钮下拉父按钮
				'submitgroup1',	//下拉二级按钮
				// 'addBtn',	//按钮组中新增按钮
				// 'linksettleBtn',	//下拉关联结算信息按钮
				// 'linksettlegroup1',	//关联结算二级按钮
				'unlinksettleBtn',	//取消关联
				// 'moreoperateBtn',	//更多操作
				// 'linkquery',	//联查
				// 'linkquerybillBtn',	//联查单据
				// 'queryvoucherBtn',	//联查凭证
				// 'queryconsumeBtn',	//联查计划预算
				// 'querymsgBtn',	//联查审批意见
				// 'printgroup',	//打印
				// 'printBtn',	//打印
				// 'querysynbillBtn',	//联查协同单据
				// 'excelmangementBtn',	//附件管理
				'listgroup',	//列表中熙增按钮组
				'unsubmitBtn',	//收回按钮
				'linksettleBtn',//关联结算信息
				'outputBtn',	//输出
				'redbillBtn',	//红冲
				'refreshBtn',
				//导入导出先关按钮
				'exportFile',
				'ImportData',
				'excelOp',
				'excel'
			],
			false
		);
	}
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/