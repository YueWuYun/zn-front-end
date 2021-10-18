/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast,cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;

/**
 * [外币兑换]-[凭证联查单据按钮控制]
 * @param {*} props 
 */
export const buttonVisible = function(props) {
	let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据
    if(isvoucherlink){
		this.props.button.setButtonVisible(
			[
				'buttongroup',	//列表肩部按钮组
				'deleteBtn',	//列表删除按钮
				'copyBtn',	//列表复制按钮
				'settlelistBtn',	//列表结算按钮
				'submitlistBtn2',	//列表提交按钮
				'unsubmitlistBtn',	//列表收回按钮
				// 'printBtn',	//列表更多打印
				// 'outputBtn',	//列表中打印中输出
				'submitlistBtn',	//列表提交父下拉按钮
				//'addBtn',	//列表新增按钮
				// 'buybalanceBtn',	//列表联查买入账户余额
				// 'chargebalanceBtn',	//列表手续费账户余额
				// 'approvemsgBtn',	//列表联查中审批意见
				// 'sellbalanceBtn',	//列表联查卖出账户余额
				// 'linksearchBtn',	//列表更多联查
				// 'linksearchBtn2',//联查2级
				// 'voucherBtn',	//列表联查中联查凭证
				'unsettlelistBtn',	//列表取消结算按钮
				'settleSecBtn',	//列表中结算二级按钮
				'refreshBtn',	//列表中刷新按钮图标
				// 'accessoryBtn',	//更多种附件管理中附件
				//begin tm lidyu 20200327 凭证联查列表态 打印按钮下拉显示 委托办理不显示
				// 'printBtn2',
				'transfer'
				//end 20200327
			],
			false
		);
	}		
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/