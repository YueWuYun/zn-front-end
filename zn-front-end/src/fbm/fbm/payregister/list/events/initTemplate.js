/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast,excelImportconfig } from 'nc-lightapp-front';
import { bodyButtonClick } from './index';
import { LIST,CARD, app_code, button_limit } from '../../cons/constant.js';
import { initList } from '../../../../public/container/page';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
export default function (props) {
	let excelimportconfig = excelImportconfig(props, "fbm", '36HF',true,"",{"appcode":app_code,"pagecode":CARD.page_id});
	let excelimportconfigq = excelImportconfig(props, "fbm", '36HF1',true,"",{"appcode":app_code,"pagecode":CARD.page_id});
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: LIST.page_id,//页面code
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('delete', this.props.json['36650BRP-000002']);/* 国际化处理： 确认要删除吗?*/
					props.button.setPopContent('terminate', this.props.json['36650BRP-000003']);/* 国际化处理： 确认要终止吗?*/
					props.button.setButtonDisabled(LIST.disabled_btn, true);
					props.button.setUploadConfig("Import", excelimportconfig);
					props.button.setUploadConfig("Quilckimport", excelimportconfigq);
					props.button.setPopContent('DeleteInner', this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000008'));/* 国际化处理： 确认要删除吗?*/
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					//给高级查询区域赋默认业务单元(在setMeta之前使用)
					setDefOrg2AdvanceSrchArea(props, LIST.search_id, data);
					props.meta.setMeta(meta);
					//给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, LIST.search_id, data);
					templateCallback.call(this, meta);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[this.tableId].pagination = true;
	meta[this.searchId].items.map(item => {
		if (item.attrcode === 'pk_org') { //财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		} else if (item.attrcode === 'bondvariety'){ //发债品种
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
                return { variety_category: "BOND" };
            };
		}
	});
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[LIST.primary_id].value,
								pagecode: CARD.page_id
							});
						}}
					>
						{record[this.billNo] && record[this.billNo].value}
					</a>
				);
			};
		}
		return item;
	});
	
	
	//添加操作列
	meta[this.tableId].items.push({
		itemtype: 'customer',
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000004'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
      return (
        <div>
          {// 适配云原生 改造适配
          props.button.createErrorButton({
            record: record,
            //showBack: false,  //不显示回退，默认显示
            sucessCallBack: () => {
			let buttonAry = [];
			let busistatus = record.vbillstatus && record.vbillstatus.value;
			switch (busistatus) {
				case '-1':	//待提交
				    buttonAry = ['CommitInner' ,'EditInner',  'DeleteInner'];
					break;
				case '3':	//待审批
					buttonAry = ['UnCommitInner'];
					break;
				case '2':	//待审批
					buttonAry = ['UnCommitInner'];
					break;	
				case '1':	//审批通过
					buttonAry = ['UnCommitInner'];
				default:
					break;
			}
			
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: button_limit,
				onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
			});
            }
          })}
        </div>
      );
    }
  });
  return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/