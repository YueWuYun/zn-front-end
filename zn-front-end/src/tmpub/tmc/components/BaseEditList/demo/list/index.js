/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/** 
* BaseEditList整表编辑列表页组件Demo
* @author dongyue7
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import initTemplate from '../../public/components/BaseEditList/event/editListInitTemplate';
import BaseEditList from '../../public/components/BaseEditList/index';
import { afterEvent, afterSearch, beforeSave, beforeOpr, afterSetTable } from './events/afterEvent';
import { 
	list, 
	del, 
	appCode, 
	listQuery, 
	name, 
	oprName, 
	sysMark, 
	enableFlag, 
	checkRef, 
	save, 
	start, 
	stop, 
	page_title 
} from '../cons/constant.js';

class List extends Component {
	constructor(props) {
		super(props);
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
				oprName: oprName,				//操作名称
				sysMark: sysMark,				//系统预置标识
				enableFlag: enableFlag,	   		//启用停用标识
				delUrl: del,					//删除接口
				checkUrl: checkRef,		   		//检查是否引用接口
				saveUrl: save,			   		//保存接口
				enableUrl: start,	       		//启用接口
				disEnableUrl: stop,				//停用接口
				btnCode: list.btnCode,			//肩部按钮区域
				pageTitle: page_title,	   		//页面title
			}}
			_initTemplate = {initTemplate}		//初始化模板方法
			_afterEvent = {afterEvent}			//编辑后事件
			_afterSearch = {afterSearch}		//查询后事件
			_beforeSave = {beforeSave}			//保存前事件
			_beforeOpr = {beforeOpr}			//操作列操作前事件
			_afterSetTable = {afterSetTable}	//渲染列表数据后事件
			_searchAfterEvent = {searchAfterEvent}//查询区编辑后事件
			{...this.props}
		/>
	}
}

List = createPage({
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/