/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/** 
* 非银行金融机构银行账户列表
* @author：dongyue7
*/

import React, { Component } from 'react';
import { createPage, base, high, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, pageInfoClick } from './events';
import { list, baseReqUrl, javaUrl, accList, acc_data_source, moduleId, appCode } from '../cons/constant.js';
import { selectedEvent, onDblClick, onSearchClick } from './events/page';
let { NCAffix } = base;
let { PrintOutput } = high;

class List extends Component {
	constructor(props) {
		super(props);
		this.tableId = accList.tableCode; //table区域
		this.searchId = accList.searchCode; //查询区域
		this.appcode = props.appcode||appCode;
		this.disabled_btn = list.disabled_btn; //列表禁用按钮
		this.primaryId = accList.primaryId; //主键ID
		this.dataSource = acc_data_source; //缓存
		this.moduleId = moduleId;
		if (this.appcode === '36010NBFOO') {
			this.pageId='36010NBFOO_bankacc_list',
			this.accListTitle='36010NBFOO-000001';
		} else if (this.appcode === '36010NBFOG') {
			this.pageId='36010NBFOG_bankacc_list';
			this.accListTitle='36010NBFOG-000001';
		} else {
			this.pageId='36010NBFO_bankacc_list';
			this.accListTitle='36010NBFO-000045';
		}
		this.state = {
			pks: [], //后台返回的所有pks
			printOut: {
				//打印输出使用
			},
			showSearch: false //隐藏查询区
		};
		// initTemplate.call(this, props);
	}

	componentWillMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({ json, inlt }, () => {
					initTemplate.call(this, this.props, json);
				});
			} else {
				//console.log('未加载到多语资源');
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: [this.moduleId,this.appcode], domainName: 'tmpub', callback });
	}

	render() {
		let { table, button, search } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { printOut } = this.state;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<div className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createPageIcon()}
							<h2 className="title-search-detail">
								{this.state.json && this.state.json[this.accListTitle]}
							</h2>
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: accList.btnCode,
								onButtonClick: buttonClick.bind(this)
							})}
						</div>
					</div>
				</NCAffix>
				{this.state.showSearch && ( // 查询区不显示
					<div className="nc-bill-search-area">
						{NCCreateSearch(this.searchId, {
							clickSearchBtn: onSearchClick.bind(this),
							showAdvBtn: false, //  显示高级按钮
							oid: accList.searchOid //查询模板的oid，用于查询查询方案
						})}
					</div>
				)}
				<div className="nc-bill-table-area nc-table nc-single-table">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						showCheck: true,
						showIndex: true,
						onSelected: selectedEvent.bind(this, this.props),
						onSelectedAll: selectedEvent.bind(this, this.props),
						onRowDoubleClick: onDblClick.bind(this),
						dataSource: this.dataSource,
						pkname: this.primaryId,
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
						}
					})}
				</div>
				<PrintOutput ref="printOutput" url={`${baseReqUrl}${javaUrl.print}.do`} data={printOut} />
			</div>
		);
	}
}

// List = createPage(
// 	{
// 		// mutiLangCode: moduleId
// 	}
// )(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/