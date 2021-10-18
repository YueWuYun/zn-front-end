/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
import API_URL from './api';
export const APP_CONFIG = {
	APP_INFO: {
		//小应用编码
		appcode: '36650BC',
		//打印输出编码
		nodekey: '36650BC_CARD',
		//单据类型
		billtype: '3621',
		//页面标题
		pageTitle: '债券契约',
		//主键
		primaryId: 'pk_bondcontract',
		//单据编号
		billNo: 'bondcontractno',
		//缓存标示 命名规范：领域名.模块名.节点名.自定义名
		dataSource: 'tm.bond.contract.datasource'
	},
	//卡片页常量
	CARD: {
		//表头主键
		primaryId: 'pk_bondcontract',
		//单据编号
		billno: 'bondcontractno',
		//页面编码
		pageId: '36650BC_CARD',
		//联查页面编码
		pageIdLink: '36650BCL_CARD',
		//审批页面编码
		pageIdApprove: '36650BCA_CARD',
		//表头表单编码
		formId: 'head',
		//表头按钮区域
		headBtnCode: 'form_head',
		//tab区域肩部区域按钮code
		shoulderBtnCode: 'tabs_head',
		//tab区域表格区域按钮code
		bodyBtnCode: 'tabs_body'
	},
	//卡片页tab
	TABS: {
		tabCode: 'underwriter', //tab区域code编码
		tabOrder: [ 'underwriter', 'guarantee' ], //tab区域排序
		//表体主键
		tabId: {
			underwriter: 'pk_bondunderwriter_b',
			guarantee: 'pk_bondguarantee_b'
		}
	},
	API_URL
};

/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/