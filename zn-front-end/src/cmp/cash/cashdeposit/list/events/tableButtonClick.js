/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { BatchToast } from '../../../../public/CMPMessage';
import { submit, unsubmit, settle, unsettle } from '../btnclick/btnclick';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill'; //制单制证
//引入公共api
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/CMPPubButtonUtil';
//引入常量定义
import { URL_INFO, LIST_PAGE_INFO, SHOW_MODE,  ITEM_INFO ,CARD_PAGE_INFO,APP_INFO} from '../../cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util";

export default function tableButtonClick(props, key, text, record, index) {

	let that = this;
	//缓存相关
	let { deleteCacheId } = props.table;

	// 公共设置请求数据(删除、提交、收回、结算、取消结算)
	function getrequestdata() {
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		let pk = record.pk_cashdeposit.value;
		pksArr.push(pk); //主键数组
		pktsmap[pk] = record.ts.value;
		indexmap[pk] = index;
		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr
		};
		that.pk = record.pk_cashdeposit.value;
		that.index = index;
		that.ts = record.ts.value;
		return data;
	}

	switch (key) {
		// 提交
		case 'submitinBtn':
			submit.call(this, props, getrequestdata());
			break;

			// 收回
		case 'unsubmitinBtn':
			unsubmit.call(this, props, getrequestdata());
			break;

			// 修改
		case 'editinBtn':
			
			let eidtid = record.pk_cashdeposit.value;
			let ts =  record.ts.value;
			let querydata = {pk: eidtid};
			ajax({
				url: requesturl.editpermission,
				data: querydata,
				success: (res) => {
					if (res.success) {
						props.table.selectAllRows(this.tableId,false);
						go2CardCheck({
							props,
							url: requesturl.gotocardcheck,
							pk: eidtid,
							ts: ts,
							checkTS: ts ? true : false,
							fieldPK: constant.pkname,
							actionCode : null ,
							permissionCode: null ,
							go2CardFunc: () => {
								props.table.selectAllRows(this.tableId,false);
								props.pushTo(constant.cardpath, {
									pagecode: constant.cpagecode,
									status: 'edit',
									id: eidtid
								});
							}
						})
					}
				}
			});
			
			break;

			// 删除
		case 'deleteinBtn':
			let pk = record.pk_cashdeposit.value;
			ajax({
				url: requesturl.delete,
				data: getrequestdata(),
				success: (res) => {
					let { success,data } = res;
					if (success) {
						if(res.data){
							let { status, totalNum, successNum, failNum, failMsg, listmap,successIndex } = res.data;
							deleteCacheId(that.tableId, pk);//删除成功后, 删除allpk中pk
							props.table.deleteTableRowsByIndex(that.tableId, successIndex)//直接删除table中的行列
							BatchToast.call(this,commondata.DELETE,status,totalNum,successNum,failNum,failMsg,null);
						}
					}
				}
			});
			break;
		case 'transferBtn':
			listSingleOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.COMMIT, record, ITEM_INFO.PK, index, this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000049'), APP_INFO.DATA_SOURCE);/* 国际化处理：委托付款*/
			break;
		case 'canceltransferBtn':
			listSingleOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.UNCOMMIT, record, ITEM_INFO.PK, index, this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000050'), APP_INFO.DATA_SOURCE);/* 国际化处理：取消付款！*/
			break;
			// 结算
		case 'settleinBtn':
			settle.call(this, props, getrequestdata());
			break;

			// 取消结算
		case 'unsettleinBtn':
			unsettle.call(this, props, getrequestdata());
			break;

			// 制单
		case 'makebillBtn':
			//处理选择数据
			let pk_cashdeposit = record.pk_cashdeposit.value;
			let pkfieldName = ITEM_INFO.PK;
			let tableName = ITEM_INFO.tableName;
			MakeBillApp(this.props, constant.appcode, pk_cashdeposit, constant.billtype,tableName,pkfieldName);
			break;
	}

}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/