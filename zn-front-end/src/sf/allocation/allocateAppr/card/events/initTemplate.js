/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax ,getBusinessInfo} from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import BankaccSubDefaultGridTreeRef from '../../../../../uapbd/refer/pub/BankaccSubDefaultGridTreeRef';
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import BankAccidGridRef from '../../../../../tmpub/refer/accid/AccidGridRef';
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
//引入组织版本试图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import FinanceOrgAllGroupAllDataTreeRef from '../../../../../uapbd/refer/org/FinanceOrgByAllGroupTreeRef';
import FundManaSystemMemberByFinancePKTreeRef from '../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';
import { app_id, card_from_id, card_table_formId,  card_page_id,funcode, card_table_id } from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";


export default function(props) {
	let that =this;
	props.createUIDom(
		{
			pagecode: card_page_id,//页面id
		}, 
		function (data){
			if(data){
				if(data.template){
					let meta = data.template;
					modifierMeta(that,props, meta)
					props.meta.setMeta(meta);
					
				}
				if(data.button){
					let button = data.button;
					
					props.button.setButtons(button);
					buttonVisible.call(that, props);
				}
			}   
		}
	)
}

function modifierMeta(that,props, meta) {
	let status = props.getUrlParam('status');
	
	if(status=='decide') {
		meta[card_from_id].status = 'edit';
		meta[card_table_id].status = 'edit';
	}else {
		meta[card_from_id].status = status;
		meta[card_table_id].status = status;
	}
	
	
	let multiLang = props.MutiInit.getIntl('36320FASP_C01');
	let porCol = {
		attrcode: 'opr',
		label: loadMultiLang(props,'1880000025-000040'),/* 国际化处理： 操作*/
		visible: true,
		fixed: 'right',
		width: 200,
		className: "table-opr",
		itemtype: 'customer',
		render(text, record, index) {
			let status = props.cardTable.getStatus(card_table_id);
			let copyflag=that.state.copyflag;
			let showWord=that.state.showWord;
			
			return status === 'browse' ? (
				showWord?
				<span
					onClick={() => {
						that.setState({
							showWord:false
						})
						props.cardTable.toggleRowView(card_table_id, record)
					}}
					> {loadMultiLang(props,'1880000025-000041')}{/* 国际化处理： 收起*/}
					</span>:
				<span
					onClick={() => {
						that.setState({
							showWord:true
						})
						props.cardTable.toggleRowView(card_table_id, record)
					}}
					> {loadMultiLang(props,'1880000025-000042')}{/* 国际化处理： 展开*/}
					</span>
				
			):(<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(card_table_id, 'edit', record, index);
							e.stopPropagation();
						}}
					>{loadMultiLang(props,'1880000025-000042')}</span>{/* 国际化处理： 展开*/}
					{/* &nbsp;&nbsp; */}
					{/* <span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.delRowsByIndex(tableId, index);
							e.stopPropagation();
						}}
					><i className="icon iconfont icon-shanchu" /></span> */}
				</div>
			);
			
		}
	};
	meta[card_table_id].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/