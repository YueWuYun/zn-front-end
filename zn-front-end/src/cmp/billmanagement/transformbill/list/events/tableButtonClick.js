/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import {
	createPage,
	ajax,
	base,
	toast,
	cacheTools
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config';
import {
	commondata,
	getappurl,
	SHOWMODEL_BULU,
	SHOWMODEL_LIULAN,
	SHOWMODEL_ZHIFU
} from '../../../../public/utils/constant';
import {
	BatchToast
} from '../../../../public/CMPMessage';
import {
	submit,
	unsubmit,
	settle,
	unsettle,
	entrust,
	unentrust
} from '../btnclick/btnclick';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill'; //制单制证
import Sign from '../../../../../tmpub/pub/util/ca';
//加载小应用基础部件
import appBase from "../../base/index"
const { cons } = appBase;
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
export default async function tableButtonClick(props, key, text, record, index) {
	//缓存相关
	let {
		deleteCacheId,
		addCacheId
	} = props.table;
	let that = this;
	const appcode = constant.appcode;
	// 公共请求数据
	function getrequestdata() {
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		let pk = record.pk_transformbill.value;
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
		that.pk = pk;
		that.index = index;
		that.ts = record.ts.value;
		return data;
	}

	function updateData(props, updata, operation) {
		let {
			status,
			totalNum,
			successNum,
			failNum,
			failMsg,
			listmap
		} = updata;
		BatchToast.call(this, operation, status, totalNum, successNum, failNum, failMsg, null);
		//加载更新缓存数据
		if (listmap != null && listmap.length > 0) {
			listmap.forEach((val) => {
				let updatedataArr = [{
					index: val.index,
					data: {
						values: val.rows.values
					} //自定义封装数据
				}];
				props.table.updateDataByIndexs(ltablecode, updatedataArr);
			});
		}
	}

	// 对数据进行签名加密
	async function signdata(signdata) {
		let ressigndata = await Sign({
			isSign: true,
			isKey: false,
			data: signdata,
			encryptVOClassName: constant.encryptVOClassName,
			head: 'form'
		});
		if (ressigndata.isStop) {
			return;
		}
		return ressigndata.data;
	}

	// 输入密钥
	async function ca_iskey() {
		let ressigndata = await Sign({
			isSign: false,
			isKey: true,
			data: null,
			encryptVOClassName: null
			// head: 'form'
		});
		if (ressigndata.isStop) {
			return;
		}
	}

	switch (key) {
		// 提交
		case 'submitinBtn':
			submit.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			//  收回
		case 'unsubmitinBtn':
			unsubmit.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			// 修改
		case 'editinBtn':
			edit.call(this,props,record);
			break;
			// 删除
		case 'deleteinBtn':
			let pk = record.pk_transformbill.value;
			ajax({
				url: requesturl.delete,
				data: getrequestdata(),
				success: (res) => {
					if (res.success) {
						if (res.data) {
							let {
								status,
								totalNum,
								successNum,
								failNum,
								failMsg,
								listmap,
								successIndex
							} = res.data;
							deleteCacheId(that.tableId, pk); //删除成功后, 删除allpk中pk
							props.table.deleteTableRowsByIndex(that.tableId, successIndex) //直接删除table中的行列
							BatchToast.call(this, commondata.DELETE, status, totalNum, successNum, failNum, failMsg, null);
						}
					}
				}
			});
			break;
			// 结算
		case 'settleinBtn':
			settle.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			// 取消结算
		case 'unsettleinBtn':
			unsettle.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;

			// 制单
		case 'makebillBtn':
			//处理选择数据
			let pk_transformbill = record.pk_transformbill.value;
			MakeBillApp(this.props, appcode, pk_transformbill, constant.billtype);
			break;

			// 委托办理
		case 'entrustinBtn':
			// ca签名
			let ressigndata = await Sign({
				isSign: false,
				isKey: true,
				data: null,
				encryptVOClassName: null
				// head: 'form'
			});
			if (ressigndata.isStop) {
				return;
			}
			// entrustin.form.userjson = entrustin.userjson;
			entrust.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			// 取消委托
		case 'unentrustinBtn':
			unentrust.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;

			// 网上付款
		case 'onlinepaymentinBtn':
			this.setState({
				modelType: SHOWMODEL_ZHIFU
			});
			ajax({
				url: requesturl.onlinepayquery,
				data: getrequestdata(),
				success: (res) => {
					let {
						success,
						data
					} = res;
					if (success) {
						if (data) {
							if (data.eabnksvos.length != 0) {
								that.setState({
									onLineData: data.eabnksvos || [],
									SHOWMODEL_ZHIFU
								}, () => {
									that.setState({
										showBuLu: true
									})
								});
							} else {
								updateData.call(this, props, data, commondata.NETPAY);
							}
						}
					}
				}
			});
			break;
	}
}
/**
 * 表体修改
 * @param {*} props 
 */
const edit = function (props,record) {
	let id = record.pk_transformbill.value;
	let ts = record.ts.value;
	go2CardCheck({
		props,url:cons.url.list.LIST2CARD_CHECK,pk:id,ts:ts,fieldPK:cons.field.pk,actionCode:null,permissionCode:null,checkSaga:true,checkTS:true,go2CardFunc:()=>{	
			let querydata = {
				pk: id
			};
			ajax({
				url: requesturl.editpermission,
				data: querydata,
				success: (res) => {
					if (res.success) {
						// props.table.selectAllRows(this.tableId, false);
						props.pushTo(constant.cardpath, {
							pagecode: constant.cpagecode,
							status: 'edit',
							id: id
						});
					}
				}
			});
		}
	});	
	

}
/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/