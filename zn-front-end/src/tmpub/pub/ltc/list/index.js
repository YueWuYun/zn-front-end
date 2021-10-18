/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/** 
* 授信类别
* @author：dongyue7
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import initTemplate from '../../public/components/BaseEditList/event/editListInitTemplate';
import BaseEditList from '../../public/components/BaseEditList/index';
import {
	 list,
	 del,
	 name, 
	 checkRef, 
	 save, 
	 listQuery, 
	 sysmark, 
	 start, 
	 stop, 
	 enableflag, 
	 appCode, 
	 oprName, 
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
					appId: appCode,					//小应用id
					searchId: list.searchCode,  	//查询区code
					tableId: list.tableCode,	   	//表格code
					pageId: list.pageCode,			//页面code
					primaryId: list.primaryId,		//主键id
					queryInterface: listQuery,	    //查询接口
					searchOid: list.searchOid,	    //查询区oid
					disableBtn: list.disabled_btn,  //禁用按钮
					tableOid: list.listOid,			//列表oid
					name: name,				   		//单据名称
					sysMark: sysmark,				//系统预置标识
					enableFlag: enableflag,	   		//启用停用标识
					delUrl: del,					//删除接口
					checkUrl: checkRef,		   		//检查是否引用接口
					saveUrl: save,			   		//保存接口
					enableUrl: start,	       		//启用接口
					disEnableUrl: stop,				//停用接口
					btnCode: list.btnCode,			//肩部按钮区域
					pageTitle: page_title,	   		//页面title
					showIndex: true,				//是否显示序号（默认显示）
					moduleId: moduleId,				//多语ID
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