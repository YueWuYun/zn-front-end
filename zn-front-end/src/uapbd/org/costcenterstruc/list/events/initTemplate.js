//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { ajax, toast } from 'nc-lightapp-front';
import modifierMetaEve from './modifierMetaEve';
// const { NCTable, NCPopconfirm, NCIcon, NCButton } = base;
export default function (props) {
	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		if (status) {

			let data = {
				button: [{

					children: [],
					area: "head",
					btncolor: "button_main",
					children: [],
					id: "1001Z0100000000072Q8",
					isenable: true,
					iskeyfunc: false,
					key: "add",
					keyboard: "ctrl+/",
					order: "1",
					parentCode: "page_group",
					title: "新增",
					type: "general_btn",
				},
				{
					area: "head",
					btncolor: "button_secondary",
					children: [],
					id: "1001Z010000000000HXN",
					isenable: true,
					iskeyfunc: false,
					key: "copy",
					keyboard: "ctrl+del",
					order: "2",
					parentCode: "page_group",
					title: "复制",
					type: "general_btn",
				},
				{
					area: "head",
					btncolor: "button_main",
					children: [],
					id: "1001Z010000000000HXN",
					isenable: true,
					iskeyfunc: false,
					key: "btnsave",
					keyboard: "ctrl+del",
					order: "2",
					parentCode: "page_group",
					title: "保存",
					type: "general_btn",
				},
				{
					area: "head",
					btncolor: "button_secondary",
					children: [],
					id: "1001Z010000000000HXX",
					isenable: true,
					iskeyfunc: false,
					key: "version",
					keyboard: "ctrl+del",
					order: "3",
					parentCode: "page_group",
					title: "版本化",
					type: "general_btn",
				},
				{
					area: "head",
					btncolor: "button_secondary",
					children: [{
						area: "head",
						btncolor: "button_secondary",
						children: [{
							area: "head",
							btncolor: "button_secondary",
							children: [],
							id: "1001Z010000000008M6Y",
							isenable: true,
							iskeyfunc: false,
							key: "output",
							order: "7",
							parentCode: "print_c",
							title: "输出",
							type: "general_btn"
						}],
						id: "1001Z010000000008M78",
						isenable: true,
						iskeyfunc: false,
						key: "print_c",
						order: "8",
						parentCode: "print",
						type: "general_btn"
					}],
					id: "1001Z010000000008J3Q",
					isenable: true,
					iskeyfunc: false,
					key: "print",
					order: "6",
					title: "打印",
					type: "divider"
				},{
					id: "1001Z0100000000072Q9",
					type: "general_btn",
					key: "edit",
					title: "修改 ||",
					area: "row",
					iskeyfunc: false,
					btncolor: "black",
					isenable: true,
					order: "9",
					children: []
				},
				// {
				// 	id: "1001Z0100000000073Q9",
				// 	type: "general_btn",
				// 	key: "edit",
				// 	title: "删除 ||",
				// 	area: "row",
				// 	iskeyfunc: false,
				// 	btncolor: "button_secondary",
				// 	isenable: true,
				// 	order: "11",
				// 	children: [],
				// 	color:"black"
				// },

				{
					area: "row",
					btncolor: "button_secondary",
					children: [],
					id: "1001Z0100000000072QA",
					isenable: true,
					iskeyfunc: false,
					key: "delete",
					order: "10",
					title: "删除 ||",
					type: "general_btn",
				},
			
				{
					id: "1001Z0100000000072Q2",
					type: "general_btn",
					key: "center",
					title: "成本中心组",
					area: "row",
					iskeyfunc: false,
					btncolor: "button_secondary",
					isenable: true,
					order: "13",
					children: []
				}
			],

				"context": {
					currentLangSeq: "1",
					dataSource: "ncc2004",
					org_Name: "全局",
					pk_org: "GLOBLE00000000000000",
					pk_org_v: "GLOBLE00000000000000"
				},
				"template": {

					code: "1057010101",
					containerrelation: { head: {} },
					gridrelation: { head: {}, body: {} },
					head: { items: [{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "110px",
						attrcode: "code",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "编码",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "110px",
						attrcode: "name",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "名称",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "110px",
						attrcode: "default",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "默认",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "120px",
						attrcode: "versionNumber",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "版本号",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "120px",
						attrcode: "versionName",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "版本名称",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "120px",
						attrcode: "effectiveDate",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "生效日期",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "120px",
						attrcode: "expirationDate",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "失效日期",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "100px",
						attrcode: "enable",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "启用",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "110px",
						attrcode: "creatPerson",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "创建人",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "120px",
						attrcode: "creatData",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "创建日期",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					},{
						hyperlinkflag: false,
						islock: false,
						istotal: false,
						width: "90px",
						attrcode: "Lastmodifiedby",
						color: "#111111",
						containlower: false,
						datatype: "1",
						disabled: false,
						editAfterFlag: false,
						fieldDisplayed: "refname",
						fieldValued: "refpk",
						isDataPowerEnable: true,
						isnotmeta: false,
						isResLabel: false,
						isrevise: false,
						isShowUnit: false,
						itemtype: "input",
						label: "最后修改人",
						maxlength: "50",
						onlyLeafCanSelect: false,
						position: "1",
						required: false,
						scale: "0",
						visible: true
					}
				
				], moduletype: "table", pagination: false, code: "head", name: "成本中心结构" },
					name: "成本中心结构",
					pageid: "1001Z0100000000072QF",
					query: {
						areaVisible: true,
						code: "query",
						isnotmeta: false,
						isunfold: true,
						items: [{
							attrcode: "mdclassid",
							checkStrictly: false,
							col: "3",
							colnum: "1",
							containlower: false,
							datatype: "204",
							disabled: false,
							editAfterFlag: false,
							fieldDisplayed: "refname",
							fieldValued: "refpk",
							hyperlinkflag: false,
							isDataPowerEnable: false,
							isMultiSelectedEnabled: false,
							isResLabel: false,
							isShowUnit: false,
							isdrag: true,
							isfixedcondition: false,
							isnextrow: false,
							isnotmeta: false,
							itemtype: "refer",
							label: "成本中心编码、名称",
							leftspace: "0",
							maxlength: "36",
							onlyLeafCanSelect: false,
							position: "1",
							queryOperateType: "=",
							refcode: "uap/refer/riart/mdMainEntityRef/index",
							required: false,
							rightspace: "0",
							rows: "0",
							scale: "0",
							usefunc: false,
							visible: true,
							visibleposition: "0"
						}],
						// moduletype: "search",
						// name: "条码对象注册-查询",
						// oid: "1001Z0100000000072QH"
					},
					ts: "2020-06-28 20:37:07",
					validateFlag: false,
					
				},

				
			}
			

			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setPopContent('delete', json['barappobject-000009']);/* 国际化处理： 确认删除?*/
					props.button.setButtonVisible(['btnsave'], false);
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					modifierMetaEve(props, meta, json);
					props.meta.setMeta(meta);

                    // let event = {
					// 	label: json['1880000025-000005'],//"操作",
					// 	attrcode: "opr",
					// 	itemtype: 'customer',
					// 	visible: true,
					// 	fixed: 'right',
					// 	render(text, record, index) {
					// 		return <div>
					// 			<span style={{marginRight: '15px', color: '#007ace',cursor: 'pointer'}}
					// 				onClick={() => {buttonClick(props, text, record, index, 'download',{succ: json['1880000025-000000'], err: json['1880000025-000001']})}}>
					// 					{json['1880000025-000007']}
					// 				</span>
					// 				<NCPopconfirm trigger="click" placement="top" content=" 确定要删除吗？"
					// 					onClose={() => {buttonClick(props, text, record, index, 'del', {succ: json['1880000025-000000'], err: json['1880000025-000001']})}}>
					// 					<span style={{color: '#007ace',cursor: 'pointer'}}
					// 					>
					// 						{json['1880000025-000006']}
					// 					</span>
					// 				</NCPopconfirm>
								
							   
					// 		</div>
					// 	},
					// };
					// template.items.push(event);
					// meta.template = template;

				}
			}


		} else {
			console.log("未加载到多语资源");   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源*/
		} 

		
	}
	props.MultiInit.getMultiLang({ 'moduleId': '1057-1057baor', 'domainName': 'uap', callback });
}

function modifierMeta(props, meta) {
	// meta['head'].items.map((item, key) => {
	// 	meta['head'].items.find((item) => item.attrcode == 'code').render = (text, record, index) => {
	// 		return (
	// 			<a style={{ textDecoration: 'underline', cursor: 'pointer' }}
	// 				onClick={() => {
	// 					props.pushTo('/card', {
	// 						status: 'browse',
	// 						pk_barappobject: record.pk_barappobject.value,
	// 						pagecode: "1057BAOR_card"
	// 					});
	// 				}}>
	// 				{record.code.value}
	// 			</a>
	// 		);
	// 	}
	// });
	meta['query'].items.map((item, key) => {
		meta['query'].items.find((item) => item.attrcode == 'mdclassid').queryCondition = () => {
			return {
				"needwherePart": "true",
				"hasChild": "false"
			}
		};
	});
	props.meta.setMeta(meta);
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX