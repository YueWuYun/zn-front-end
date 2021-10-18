/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/** 
* 投融费用项目
* @update：dongyue7 
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import initTemplate from '../../public/components/BaseEditList/event/editListInitTemplate';
import BaseEditList from '../../public/components/BaseEditList/index';
import { 
	search_oid, 
	list_page_id, 
	list_search_id, 
	list_table_id, 
	table_oid, 
	query, 
	del, 
	primaryId, 
	disabled_btn, 
	name, 
	checkRef, 
	save, 
	sysmark, 
	enable,
	disEnable,
	enableflag, 
	app_code, 
	oprName, 
	btnCode,
	page_title,
	moduleId
} from '../cons/constant.js';

class List extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt})
			} else {
				//console.log('未加载到多语资源')
			}
		}
		this.props.MultiInit.getMultiLang({moduleId: [moduleId, '36010PUBLIC'], domainName: 'tmpub', callback})
	}

	render() {
		return <BaseEditList 
				constant = {{
					appId: app_code,			//小应用id
					searchId: list_search_id,   //查询区code
					tableId: list_table_id,	   	//表格code
					pageId: list_page_id,		//页面code
					primaryId: primaryId,		//主键id
					queryInterface: query,	    //查询接口
					searchOid: search_oid,	    //查询区oid
					disableBtn: disabled_btn,   //禁用按钮
					tableOid: table_oid,		//列表oid
					name: name,				    //单据名称
					sysMark: sysmark,			//系统预置标识
					enableFlag: enableflag,	    //启用停用标识
					delUrl: del,				//删除接口
					checkUrl: checkRef,		    //检查是否引用接口
					saveUrl: save,			    //保存接口
					enableUrl: enable,	        //启用接口
					disEnableUrl: disEnable,	//停用接口
					btnCode: btnCode,			//肩部按钮区域
					pageTitle: page_title,	    //页面title
					showIndex: true,			//是否显示序号
					moduleId: moduleId,			//多语ID
				}}
				_initTemplate = {initTemplate}
				{...this.props}
			/>
	}
}

List = createPage({
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));
 

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/