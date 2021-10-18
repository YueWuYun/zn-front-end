/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl, tabs } from '../../config/config';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { buttonVisible } from './buttonVisible';
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
import { initData,getCardData } from "../../../public/cardEvent";
let { getDefData } = cardCache;
const cpagecode = '36362IDC_C01';
const formcode1 = constant.formcode1;

export default function(props, json, inlt) {
	let that = this;
	props.createUIDom(
		{
			pagecode: constant.cpagecode,
			appcode: props.getUrlParam('c')
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta, () => {
					});
					props.meta.renderTabs(
                        meta,
                        tabs.tabOrder,
                        tabs.tabShow,
                        initData.bind(that, props)
					);

					// 不是联查版本，默认显示卡片信息
					if (props.getUrlParam("id") && props.getUrlParam("pageType") != "version" && props.getUrlParam("pageType") != "apply") {
                        getCardData.call(
                            that,
							'/nccloud/icdmc/innerdebitcontract/querysingle',
                            String(props.getUrlParam("id")),
                            true
                        );
					} else if(props.getUrlParam("pageType") == "apply") {// 借款申请联查借款合同
						getCardData.call(
                            that,
							'/nccloud/icdmc/innerdebitcontract/querybyapplypk',
                            String(props.getUrlParam("id")),
                            true
                        );
					} 
					templateCallback.call(that, props, meta);
					orgVersionUtil.call(that, props, formcode1)//多版本视图显隐性
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(that, props);
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta) {

	let multiLang = props.MutiInit.getIntl('3636');
	let porCol = {
		attrcode: 'opr',
		label: multiLang && multiLang.get('36362IDC-0005'),
		visible: true,
		width: 200,
		render(text, record, index) {
			let status = props.cardTable.getStatus(formcode1);
			return status === 'browse' ? (
				<span
					onClick={() => {
						props.cardTable.toggleRowView(formcode1, record);
					}}
				>
					{' '}
					{this.state.json['36362IDC-000006']}{/* 国际化处理： 切换视图*/}
				</span>
			) : (
				<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(formcode1, 'edit', record, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-gengduo" />
					</span>
					&nbsp;&nbsp;
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.deleteRowsByIndex(formcode1, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-shanchu" />
					</span>
				</div>
			);
		}
	};
	meta[formcode1].items.push(porCol);

	

	return meta;
}

// 模板初始化设置编辑性及其他
function templateCallback(props, meta) {
    let status = props.getUrlParam("status");
    if (status == "add") {
        // 初始化编辑性
        // props.initMetaByPkorg();
    } else if (status == "change") {
        // 设置变更可编辑性
        setChangeDisable.call(this, props);
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true //组织
        });
    }
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/