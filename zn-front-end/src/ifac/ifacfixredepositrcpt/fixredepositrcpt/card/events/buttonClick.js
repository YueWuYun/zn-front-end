/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, cardCache, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill'; //制单制证
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; // 联查凭证
import { elecSignCardPrint } from '../../../../../tmpub/pub/util';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { buttonVisible } from './buttonVisible';
let { updateCache } = cardCache;

export default function (props, id) {
	let cpagecode = constant.cpagecode;
	const appcode = constant.appcode;
	const cardpath = constant.cardpath;
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const iweb = 'iweb';

	switch (id) {

		case 'tally':// 记账
			tallyConfirm.call(this,props);
			break;
	
		case 'unTally':// 取消记账
			unTallyConfirm.call(this,props);
			break;

		case 'linkreceiptBtn':// 联查单位内部定期存单
			let depositcode = this.props.form.getFormItemsValue(this.formId, 'depositcode').value;
			if(!depositcode){
				toast({
					color: 'warning',
					content: this.state.json['36340RFDR-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				ajax({
		            url:'/nccloud/ifac/fixredepositrcpt/linkreceipt.do',
		            data: depositcode,
		            success:(res)=>{	
						if (res.data) {
							if (res.data.length == 0) {
								toast({
									color: 'warning',
									content: this.state.json['36340RFDR-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
								});
							} else if (res.data.length == 1) {
								this.props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card', 
								{
									srcFunCode:'36340RFDR',
									appcode: '36341FDLQ',
									pagecode: '36341FDLQ_C01',
									status: 'browse',
									islinkquery: true,
									id:res.data[0],
									scene: "linksce"
								})
							}
						}
		            }
		        });
			}
			break;

		case 'linkregularrateBtn':// 联查定期利率
			let rateid = this.props.form.getFormItemsValue(this.formId, 'pk_depostrate').value;
			if(rateid == null || rateid.length <= 0){
				toast({
					color: 'warning',
					content: this.state.json['36340RFDR-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
				});
				return;
			}
			ajax({
				url: requesturl.linkrate, 
				data: {
					pk: rateid
				},
				success: (res) => {
					let linkpath,appcode,pagecode;
					if(res.data.rateclass=='2'){
						linkpath = '/tmpub/pub/interestrate_global/main/#/card',
						appcode = '36010IRC',
						pagecode = '36010IRC_card'
					}else if(res.data.rateclass=='1'){
						linkpath = '/tmpub/pub/interestrate_group/main/#/card',
						appcode = '36010IRCG',
						pagecode = '36010IRCG_card'
					}else if(res.data.rateclass=='0'){
						linkpath = '/tmpub/pub/interestrate_org/main/#/card',
						appcode = '36010IRCO',
						pagecode = '36010IRCO_card'
					}
					props.openTo(linkpath, {
						appcode: appcode,
						pagecode: pagecode,
						status: 'browse',
						scene: "linksce",
						islinkquery: true,
						id:rateid
					});
				}
			});
			break;

		case 'linkInterestBillBtn':// 联查单位内部利息清单
			let interestpk =  this.props.form.getFormItemsValue(this.formId, 'depositcode').value;
			let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
			interlistLink.call(this, props, interestpk, pk_org);
			break;

		case 'linkvoucherBtn':// 联查凭证
			//处理选择数据
			let pk_fixredepositrcptv = props.form.getFormItemsValue(constant.formcode1, 'pk_fixredepositrcpt').value;
			let billnov = props.form.getFormItemsValue(constant.formcode1, 'vbillcode').value;
			let pk_groupv = props.form.getFormItemsValue(constant.formcode1, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(constant.formcode1, 'pk_org').value;
			linkVoucherApp(
				this.props,
				pk_fixredepositrcptv,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);

			break;

		case 'printBtn':// 打印
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: null, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_fixredepositrcpt').value]
				}
			);
			break;

		case 'outputBtn':// 输出
			this.setState({
					outputData: {
						// funcode: printfuncode, //功能节点编码，即模板编码
						appcode: appcode, //appcode
						nodekey: null, //模板节点标识
						// printTemplateID: printtemplateid, //模板id
						oids: [this.props.form.getFormItemsValue(this.formId, 'pk_fixredepositrcpt').value],
						outputType: 'output'
					} //打印输出使
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

		case 'officialPrint':// 正式打印
			elecSignPrint.call(this , props, true);
			break;

		case 'elecsigninPreview':// 补充打印
			elecSignPrint.call(this,props, false);
			break;

		case 'refreshBtn':// 刷新
			let cashdrawpk = props.form.getFormItemsValue(this.formId, 'pk_fixredepositrcpt').value;
			let data = {
				pk: cashdrawpk,
				pageCode: this.pageId
			};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({[this.formId]: res.data.head[this.formId]});
							let billno = res.data.head[this.formId].rows[0].values.vbillcode.value;
							this.setState({
								billno: billno
							});
							this.buttonAfter(res.data.head);
							toast({
								content: this.state.json['36340RFDR-000048'],/* 国际化处理： 刷新成功！*/
								color: 'success'
							})
						}
					} else {
						this.props.form.setAllFormValue({[this.formId]: {rows: []}});
					}
				}
			});

			break;

		case 'enclosureBtn':// 附件
			let pk_fixredepositrcpte = props.form.getFormItemsValue(this.formId, 'pk_fixredepositrcpt').value;
			let billnoe = props.form.getFormItemsValue(this.formId, 'vbillcode').value;
			this.setState({
				billId: pk_fixredepositrcpte, //单据id
				billno: billnoe, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})

			break;

		default:
			break;
	}
}

/**
 * 联查单位内部利息清单
 * @param {*} props 
 * @param {*} pk 
 * @param {*} pk_org 
 */
export const interlistLink = function(props,pk,pk_org){
    let linkpath;
    ajax({
        url: requesturl.checklist, 
        data: {
            "pks": [pk],
            "extParam":{
                'org':pk_org
            }
        },
        success: (res) => {
            if(res.data=='0'){
                toast({
                    color: 'warning',
                    content: this.state.json['36340ERD-000047']/**未查询出符合条件的数据！ */
                });
            }else if(res.data=='1'){
                linkpath = '/ifac/ifacmemberbusquery/memberinterestbill/main/index.html#/card'
                props.openTo(linkpath, {
                    appcode: '36341FNIBS',
                    pagecode: '36341FNIBS_C01',
                    islinkquery: true,
                    pks:pk,
					type:'intercard',
					scene: "linksce"
                });
            }else{
                linkpath = '/ifac/ifacmemberbusquery/memberinterestbill/main/index.html#/list'
                props.openTo(linkpath, {
                    appcode: '36341FNIBS',
                    pagecode: '36341FNIBS_L01',
                    islinkquery: true,
                    pks:pk,
                    type:'interlist',
					org:pk_org,
					scene: "linksce"
                });
            }
        }
    })  
}

/**
 * 记账
 * @param {*} props 
 */
const tallyConfirm = function (props) {
	let that = this;
	let pkMapTs = {};
	let pk = props.form.getFormItemsValue(constant.formcode1, constant.pkname).value;
	let ts = props.form.getFormItemsValue(constant.formcode1,'ts').value;
	pkMapTs[pk] = ts;
	  ajax({
		  url: requesturl.tally,
		  data: {
			  pkMapTs,
			  pageCode: constant.cpagecode,
			  extParam: { btncode: 'tally', pagecode: constant.cpagecode }
		  },
		  success: (res) => {
			  	let pk_fixredepositrcpt  = null;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg,  //参数一：返回的公式对象
						{                //参数二：界面使用的表格类型
						card_table_id:"cardTable"
						}
					);
				}
				if (res.success) {
					toast({ color: 'success', content: that.state.json['36340RFDR-000064'] });
					if (res.data) {
						if (res.data.head && res.data.head[this.formId]) {
							props.form.setAllFormValue({ [that.formId]: res.data.head[that.formId] });
							pk_fixredepositrcpt  = res.data.head[that.formId].rows[0].values.pk_fixredepositrcpt.value;
						}
						if (res.data.body && res.data.body[that.tableId]) {
							props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
						}
						updateCache(constant.pkname,pk_fixredepositrcpt,res.data,that.formId,constant.cacheDataSource,res.data.head[constant.formcode1].rows[0].values);
					}
					orgVersionUtil(that.props,constant.formcode1);
					buttonVisible(this.props);
				}
		  }
	  });
  };

/**
 * 取消记账
 * @param {*} props 
 */
const unTallyConfirm = function (props) {
	let that = this;
	let pkMapTs = {};
	let pk = props.form.getFormItemsValue(constant.formcode1,constant.pkname).value;
	let ts = props.form.getFormItemsValue(constant.formcode1,'ts').value;
	pkMapTs[pk] = ts;
	  ajax({
		  url: requesturl.untally,
		  data: {
			  pkMapTs,
			  pageCode: constant.cpagecode,
			  extParam: { btncode: 'unTally', pagecode: constant.cpagecode }
		  },
		  success: (res) => {
				let pk_fixredepositrcpt  = null;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg,  //参数一：返回的公式对象
					{                //参数二：界面使用的表格类型
					card_table_id:"cardTable"
					}
				);
				}
				if (res.success) {
					toast({ color: 'success', content: this.state.json['36340RFDR-000065']});/* 国际化处理： 保存成功*/
					if (res.data) {
						if (res.data.head && res.data.head[this.formId]) {
							props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_fixredepositrcpt  = res.data.head[this.formId].rows[0].values.pk_fixredepositrcpt.value;
						}
						if (res.data.body && res.data.body[this.tableId]) {
							props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						updateCache(constant.pkname,pk_fixredepositrcpt,res.data,this.formId,constant.cacheDataSource,res.data.head[constant.formcode1].rows[0].values);

					}
					orgVersionUtil(this.props,constant.formcode1);
					buttonVisible(this.props);
				}
			}
	  });
  };

  /**
 * 正式打印和补充打印
 * @param {*} props 
 * @param {*} offical 
 */
const elecSignPrint = function (props, offical) {
    let nodekey;
    if(offical){
        nodekey = 'OFFICIAL';
    }else{
        nodekey = 'INOFFICIAL';
    }
    elecSignCardPrint(props, {
        url: requesturl.elecsignprint,
        offical,
        appCode: constant.appcode,
        nodeKey: nodekey,
        headCode: constant.formcode1,
        field_id: constant.pkname,
        field_billno: 'vbillcode',
        validateFunc: (selectData) => {
			return null;
        }
    })
}
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/