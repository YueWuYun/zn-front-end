/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax, toast } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import tableButtonClick from './tableButtonClick';
import buttonDisable from './buttonDisable';
import * as CONSTANTS from '../constants';
import PsndocTreeGridRef from '../../../../../uapbd/refer/psninfo/PsndocTreeGridRef';
let { formId, tableId, pagecode, appid, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06 } = CONSTANTS;
let refpk = "";
let refname = "";
let pk_org = "";
export default function (props) {
	let that = this;
	that.pk_informerrelease = "";
	props.createUIDom(
		{
			pagecode,//页面id
			appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonDisable.call(that, props, 'table_detail_01');
				}
			}
		}
	)
}

//指派选中人员信息后的回调函数
function appointButtonClick(value) {
	refpk = value.refpk;//人员信息名字pk
	refname = value.refname;//人员信息名称
	let pk_psndoc = value.values.pk_psndoc;//人员信息主键（需要用来关联用户表）
	if (pk_psndoc == null) {
		return;
	}
	if (refname != null) {//选择了参照才进行指派
		ajax({
			url: '/nccloud/cmp/informer/appoint.do',
			data: {
				pk_informerrelease: this.pk_informerrelease,
				pk_psndoc: pk_psndoc.value
			},
			success: (res) => {//内部函数尽量不要用function的写法，而用 => 的形式
				let { success, data } = res;
				if (success) {
					toast({ content: this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000016'), color: 'success' });/* 国际化处理： 指派成功*/
				} else {
					this.props.pushTo("/list", {
						status: 'browse'
					});
				}
			}
		});
	}
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		// label: multiLang && multiLang.get('36300TP-0005'),
		label: props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000003'),/* 国际化处理： 操作*/
		className: "table-opr",
		itemtype: 'customer',
		visible: true,
		render: (text, record, index) => {
			let buttonAry =
				record.generateflag.value == 'hasrelease'//已发布
					? ["Lcancelpublish"]
					: [];

			let appointFlag = false;//控制'指派'按钮显隐性（false不显示，true显示）
			let LcancelpublishFlag = false;//控制'取消发布'按钮显隐性
			if (record.generateflag.value == 'hasrelease') {
				LcancelpublishFlag = true;
			}
			if (record.generateflag.value == 'hasnogenerate' || record.generateflag.value == 'hasclaim' || record.generateflag.value == 'hasrelease') {//已认领、已发布、未生成
				appointFlag = true;
			}
			that.pk_informerrelease = record.pk_informerrelease.value;
			// return props.button.createOprationButton(buttonAry, {
			// 	area: "card_inner",
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			// });
			//由于操作列中添加了指派按钮，点击触发参照弹框，与上面注释的不通用，所以注释了！2018.12.24
			return <div className="clearfix">
				{LcancelpublishFlag && <span style={{ float: 'left', marginRight: 10 }} onClick={() => tableButtonClick.call(that, props, "Lcancelpublish", text, record, index)}>{props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000001')}</span>
				}
				<span style={{ float: 'left' }}>
					{appointFlag && PsndocTreeGridRef({
						isTreelazyLoad: false,//是否懒加载
						queryCondition: () => {
							pk_org = record.pk_org.value;
							return {
								pk_org: pk_org,
							};
						},//return一个对象作为参数，传给后台，用来查询参照
						onChange: appointButtonClick.bind(that),//选中参照之后回调
						value: { refpk: refpk, refname: refname },//选中参照之后回写显示值(此处由于是按钮，不是字段，所以没什么用)
						disabled: false,//是否禁用
						isAlwaysEmitOnChange: true,//控制上面的onChange方法是否一直触发							
						clickContainer: <span onClick={e => e.stopPropagation()}>{props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AIPSSC--000025')}</span>
					})}
				</span>
			</div>

		}
	});
	return meta;

}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/