/*yrJb1LOfoOHhNP+PrTGyMtSdCSPIx6SlbYuugmXZRJcE9eGaEmwhg+T+mbyVdKu6*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { buildLightBodyAfterEditData } from "../../../../../tmpub/pub/util/index";
/**
 * [结算]-b表体编辑后事件
 * 主要：编辑表体后字段进行字段modifyflag字段赋值
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} s 
 * @param {*} g 
 */
export const afterTableEvent = function (props, moduleId, key, value, changedrows, i, s, g) {
	debugger
	// console.log(props, moduleId, key, value, changedrows, i, s, g)
	// 表体字段编码
	let tablie_id = Templatedata.card_tableid;
	let table_edit = Templatedata.card_tableid_edit;
	const eventKey = [
		// "pk_notetype",//票据类型 
		// "notenumber",//票据号 
		// "pk_account",//本方账户 
		// "pk_bank",//本方银行主键
		// "pk_cashaccount",//现金账户
		// "pk_balatype",//结算方式
		// "pk_oppaccount",//对方账号PK 
		// "pk_plansubj",//资金计划项目 
		// "memo",//摘要
		// "pk_oppbank",//对方银行 
		// "commpayer",//承付人
		// "commpaystatus",//承付状态
		// "commpaytype",//承付类型 
		// "commpaybegindate",//
		// "commpayenddate",//
		// "commpaytime",//承付时间 
		// "refusereason",//退回原因 
		// "isrefused",//是否被拒付 
		// "pk_notenumber",//票据号主键 
		// "pk_notetype",//票据类型
		"pk_currtype_last",//实付币种 20
		// "bankrelated_code",//对账标识码 
		// "pk_busiorg",//业务组织
		// "pk_busiorg_v",//业务组织版
		// "direct_ecds",//直联电票
	];
	if (eventKey.includes(key)) {
		//table中编辑后事件[操作表格字段是否有过修改]
		if (moduleId === tablie_id || moduleId === table_edit) {
			let table_data = buildLightBodyAfterEditData(
				props,
				this.pageId,
				this.formId,
				this.tableId,
				key,
				changedrows,
				i,
				true
			);
			let table_newvalue = table_data.changedrows[0].newvalue.value;
			let table_oldvalue = table_data.changedrows[0].oldvalue.value;
			//手工修改标志
			let MODIFY_FLAG = "n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n";
			let MODIFY_FLAG_Y = "y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y";
			let modifyflag = props.cardTable.getValByKeyAndIndex(moduleId, i, 'modifyflag');
			if (modifyflag && modifyflag.value && table_newvalue != table_oldvalue && table_newvalue) {

				MODIFY_FLAG = modifyflag.value;

				//实付币种
				if (key == 'pk_currtype_last') {
					let modifyflagArray = MODIFY_FLAG.split(',');
					modifyflagArray[20] = 'y';
					MODIFY_FLAG = modifyflagArray.toString();
					console.log('=====', MODIFY_FLAG);
				}
			}
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'modifyflag', { value: MODIFY_FLAG, display: MODIFY_FLAG });//给表体字段赋值
		}
	}

}

/*yrJb1LOfoOHhNP+PrTGyMtSdCSPIx6SlbYuugmXZRJcE9eGaEmwhg+T+mbyVdKu6*/