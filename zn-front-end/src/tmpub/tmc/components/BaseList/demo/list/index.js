/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import { initTemplate, buttonClick } from './events';
import BaseList from 'src/tmpub/tmc/components/BaseList';
import NCCCCBalance from 'src/ccc/public/Balance/list/index';
import { APP_CONFIG } from '../cons/constant';

class List extends Component {
	//页签切换需要传的条件
	tabChangeServal = (status, callback) => {
		let serval = {
			field: 'busistatus',
			value: {
				firstvalue: status != 'all' ? status : undefined,
				secondvalue: null
			},
			oprtype: '='
		};
		callback && callback(serval);
		return serval;
	}

	render(){
		const { APP_INFO, LIST, API_URL } = APP_CONFIG;
		const config = { ...APP_INFO, ...LIST, API_URL };
		const tabs = {
			defaultKey: '0', //默认选中页签key
			allKey: 'all', //全部页签的key
			groupName: 'numvalues', //查询接口返回的页签分组名称
			items: [
				//这里的name需要与查询接口返回的页签数字字段名一致，不然页签数字显示不出来
				{ key: '0', name: 'toCommit', title: '待提交' },
				{ key: '1', name: 'approving', title: '审批中' },
				{ key: 'all', title: '全部' }
			],
			onTabChange: this.tabChangeServal
		};
		const cusState = {
			showCCC: false, //显示联查授信额度
			showCCCBalance: null, //授信pk
		}
		return <BaseList
				config={config}
				initTemplate={initTemplate}
				buttonClick={buttonClick}
				searchBtnClick={searchBtnClick}
				headBtnArea={LIST.headBtnCode}
				listTabs={tabs}
				pageTitle={APP_INFO.pageTitle}
				customState={cusState}
				{...this.props}
			>
			{/* 
				这里必须写成回调函数的形式，返回参数是BaseList组件的this，
				这么写的目的是将这里写的内容通过函数传给子组件进行渲染,
				这里访问的state需要在父组件中定义然后通过customState传给子组件，这样就能访问在父组件中定义但是在子组件使用的state了。
			*/}
			{
				/*联查授信*/ 
				(_this) => {
					return <div>
						<NCCCCBalance
							showmodal={_this.state.showCCC}
							showCCCBalance={_this.state.showCCCBalance}
							// 点击确定按钮的回调函数
							onSureClick={() => {
								//关闭对话框
								_this.setState({
									showCCC: false
								})
							}}
							onCloseClick={() => {
								//关闭对话框
								_this.setState({
									showCCC: false
								})
							}}
						/>
					</div>
				}
			}
			</BaseList>
	}
}

List = createPage({
	// mutiLangCode: module_id
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/