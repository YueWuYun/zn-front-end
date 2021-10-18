/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/** 
* 整表编辑列表组件
* @author dongyue7
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base } from 'nc-lightapp-front';
import { onSearchClick } from './event/editListSearch';
import { buttonClick } from './event/editListButtonClick';
import { selectedEvent } from './event/events';
let { NCAffix } = base;

class BaseEditList extends Component {
	constructor(props) {
		super(props);
		for(let k in props.constant) {
            this[k] = props.constant[k];
        }
		this.state = {
			showToast: true,                    //查询是否提示
			showSearch: true,                   //查询区显示
			editDelData: {                      //编辑态删除暂存数据结构
                pageid: this.pageId,
                templetid: this.tableOid,
                model: {
                    areaType: 'table',
                    areacode: this.tableId,
                    rows: []
                }
			}
		};
		props._initTemplate.call(this, props);
	}

	render() {
		let { button, search, editTable, _afterEvent, _searchAfterEvent } = this.props;
		let { showSearch } = this.state;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp} = button;
		return (
			<div className="nc-bill-list" >
				{/* 标题及肩部按钮区域 */}
				<NCAffix>
					<div className="nc-bill-header-area">
						<div className="header-title-search-area">
							<h2 className="title-search-detail">{this.pageTitle}</h2>
						</div>
						<div className="header-button-area">
							{createButtonApp({ area: this.btnCode, onButtonClick:buttonClick.bind(this) })}
						</div>
					</div>
				</NCAffix>
				{/* 查询区域 */}
				{
					showSearch &&
					<div className="nc-bill-search-area">
						{NCCreateSearch(this.searchId,{
							oid: this.searchOid,
							showAdvBtn: false, 
							showClearBtn:false,
							clickSearchBtn: onSearchClick.bind(this),
							onAfterEvent: _searchAfterEvent && _searchAfterEvent.bind(this)
						})}
					</div>
				}
				{/* 表体区域 */}
				<div className="nc-bill-table-area">
					{createEditTable(this.tableId, {
						showCheck: true,   								
						showIndex: true,      
						onSelected: selectedEvent.call(this, this.props),
						onSelectedAll: selectedEvent.call(this, this.props),
						onAfterEvent: _afterEvent && _afterEvent.bind(this)
					})}
				</div>
			</div>
		);
	}
}

export default BaseEditList
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/