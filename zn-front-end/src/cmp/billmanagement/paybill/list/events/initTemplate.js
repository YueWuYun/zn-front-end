/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast,excelImportconfig,viewModel } from 'nc-lightapp-front';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea ,showPagination } from '../../../../../tmpub/pub/util/index';
import {cardCache} from "nc-lightapp-front";
import { PAYBILL_CONST } from '../../cons/constant.js';
let {setDefData, getDefData } = cardCache;

let { NCPopconfirm, NCIcon ,NCTooltip} = base;
import tableButtonClick from './tableButtonClick';
import buttonUsability from './buttonUsability';
import { buttonVisible } from './buttonVisible';

let searchId = 'search_D5';
let tableId = 'table_D5';
let pageId = '36070PBR_D5_list';
import appBase from "../../base";
const { cons, api } = appBase;
import  {go2Card}  from '../../util/goToCard.js';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';
export default function(props) {

	let _this = this;
	let excelimportconfig = excelImportconfig(props, "cmp", 'F5',true,"",{"appcode":PAYBILL_CONST.appcode,"pagecode":PAYBILL_CONST.card_page_id});
	props.createUIDom(
		{
			pagecode: pageId //页面id

		},
		//function (data){
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;	
					meta = modifierMeta.call(this, props, meta);
					//解决联查场景查询区赋值问题
					let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);
				    // if(!ISlINK){
				    // setDefOrg2AdvanceSrchArea(props,searchId,data);
					// }
					//发布小应用默认交易类型赋值
			
					if(data.context&&data.context.paramMap){
						let { transtype, pk_transtype,transtype_name } = data.context.paramMap;
						if(transtype&&pk_transtype){
							//增加发布交易类型的缓存 
							this.setState({
								showTradeBtn:false
							});
							setGlobalStorage('sessionStorage', 'billTypeName',transtype_name);
						   meta[searchId].items.map((item) => {
							if (item&&item.attrcode =='pk_tradetypeid') {
								item.visible=true;
							 item.initialvalue = { 'display': transtype_name, 'value': pk_transtype }
							}
						 });						
						//遍历查询区域字段 发布小应用给交易类型赋值
						if(transtype==='DS'){
							transtype_name='付款结算单';
							pk_transtype='DS'
							}	
						}
				
						let tradeType={refcode: transtype, refname: transtype_name, refpk: pk_transtype}
						
						setGlobalStorage('sessionStorage', 'sessionTP',JSON.stringify(tradeType));
				 }
				 showPagination(props,tableId,data);
					props.meta.setMeta(meta);
                    this.initData.call(this);						
					if(!ISlINK){
						if(props.search.getSearchValByField( searchId, 'pk_tradetypeid')&&props.search.getSearchValByField( searchId, 'pk_tradetypeid').value){
							props.search.setDisabledByField( searchId, 'pk_tradetypeid', 'true' )
						}
						setDefOrg2ListSrchArea(props,searchId,data);
					}					
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					//props.button.setButtons(button);
					buttonUsability.call(this, this.props,null);
					props.button.setPopContent('delline',  loadMultiLang(this.props, '36070PBR-000016'));/* 国际化处理： 确认要删除该信息吗？*/
					props.button.setUploadConfig("ImportData", excelimportconfig);
				}
	 
			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		
		//item.visible = true;
		//item.col = '3';
		return item;
	});

   
	// props.renderItem(
	// 	'search', // 区域类型form/table/search
	// 	searchId, // 模板中的区域id
	// 	'pk_org' // 字段的attrcode
	// 	// getRefer('cont', {
	// 	// 	// refcode以及其他参数
	// 	// 	isMultiSelectedEnabled: false
	// 	// 	//...item
	// 	// })
	// );
	//meta[tableId].showindex = true;
	//修改列渲染样式
	meta[searchId].items.map((ele) => {
		//ele.visible = true;
	});
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//财务组织用户过滤
	meta[searchId].items.map((item) => {
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: '36070PBR',
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
		else if(item.attrcode.startsWith('def')){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}	
		else if(item.attrcode.startsWith('items.def')){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}	
		else if(item.attrcode == 'pk_dept'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'items.pk_dept'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'pk_busiman'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'items.pk_busiman'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'bankroll_projet'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'items.bankroll_projet'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'pk_supplier'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'items.pk_supplier'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'pk_customer'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'items.pk_customer'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'pk_recproject'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
		else if(item.attrcode == 'items.pk_recproject'){
			item.queryCondition = () => {
				return {
					pk_org:(props.search.getSearchValByField(searchId, 'pk_org').value || {}).firstvalue
				};
			};	
		}
	});
		//付款银行账号
		meta[searchId].items.map((item) => {
			if (item.attrcode == 'items.pk_oppaccount') {
				item.queryCondition = () => {
					let pk_org=props.search.getSearchValByField(searchId,'pk_org').value.firstvalue;
					let currtype=props.search.getSearchValByField(searchId,'items.pk_currtype').value.firstvalue;
					return {
						pk_orgs: pk_org,
						pk_currtype: currtype,
						refnodename:loadMultiLang(props, '36070PBR-000017'),/* 国际化处理： 使用权参照*/
						noConditionOrg:'Y',
						GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder' //自定义参照过滤条件
					};
				};
			}
		});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == 'bill_no') {

			item.render = (text, record, index) => {
				return (
					//<NCTooltip placement="top" overlay={record.bill_no ? record.bill_no.value : ''}>
					<a
						style={{cursor: 'pointer' }}
						onClick={() => {
							let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);
							//弹异常提示
							cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);

							if(ISlINK) {

								go2Card(props,{ status: 'browse',	id: record.pk_paybill.value,scene: 'link'} ,{} );

							}else{
							 this.setStateCache();

							go2Card(props,{ status: 'browse',	id: record.pk_paybill.value,bill_status:record.bill_status.value,is_cf:record.is_cf.value} ,{} );
							}
						}}
					>
						{record && record.bill_no && record.bill_no.value}
					</a>
					//</NCTooltip>
				);
			};
		} else if (item.attrcode == 'bill_date') {
			item.render = (text, record, index) => {
				return <span>{record && record.bill_date && seperateDate(record.bill_date.value)}</span>;
			};
		}
		return item;
	});
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: loadMultiLang(props, '36070PBR-000018'),
		width: 200,
		visible: true,
		fixed: 'right',
		itemtype:'customer',
		render: (text, record, index) => {
			let buttonAry = [];
			//保存--自由态
			if (record.bill_status && record.bill_status.value == -10) {
				 if(record.is_cf&& record.is_cf.value){
					buttonAry = ['comline','editline','unprotopay']; 
				  }else{
					buttonAry = [ 'comline', 'editline', 'delline' ];
				  }
				
			}
			//暂存
			if (record.bill_status && record.bill_status.value == -99) {
				
				buttonAry = [ 'editline','delline' ];
				if(record.is_cf&& record.is_cf.value){
					buttonAry=[];
						
				  }
			}
			//待审批
			if (record.bill_status && record.bill_status.value == -1) {
				buttonAry = [ 'uncomline' ];
			}
			//签字
			if (record.bill_status && record.bill_status.value == 8) {
				buttonAry = [ 'makebillline' ];
				if(record.effect_flag&&(record.effect_flag.value=='10'&&(record.isreded&&!record.isreded.value))){
					buttonAry = [ 'reverse','makebillline' ];
				};
			}
			//审批通过
			if (record.bill_status && record.bill_status.value == 1) {
				buttonAry = [ 'uncomline' ];
			}
			let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);
             if(ISlINK){
			 buttonAry = [];
			 }  
			//begin tm zhanghe 20191120 支持分布式事务异常交互
			// return props.button.createOprationButton(buttonAry, {
			// 	area: 'list_inner',
			// 	buttonLimit: 4,
			// 	onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			// });				
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: 'list_inner',
						buttonLimit: 4,
						onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
					});
				}
			}));
			//end
		}
	});
	return meta;
}
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/