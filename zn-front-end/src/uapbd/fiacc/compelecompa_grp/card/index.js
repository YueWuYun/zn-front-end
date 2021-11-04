//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import { createPage, base, getMultiLang, high } from 'nc-lightapp-front';
import { multiLangCode, dataSource, formId, tableId, pagecode, cardBodyShouler, module } from './constants';
import CardPage from '../../compelecompa_com/card';

/**
 * 页面入口
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			json: {},//页面多语
		};
	}
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.getUrlParam('status');
			if (status != 'browse') {
				return '';
			}
		}
		let callback = (json) => {
			this.setState({ json: json }, () => {
			})
		}
		getMultiLang({ moduleId: [multiLangCode], currentLocale: 'simpchn', domainName: module, callback });
		// 拦截判断是否离开当前页面《开始》
		window.$this=this;
		window.addEventListener('beforeunload', this.beforeunload);
		// 拦截判断是否离开当前页面《结束》
	}
	render() {
		return(
            <CardPage
                title={this.state.json['10140CECA-000032']}
                dataSource={dataSource}
                type={'grp'}
            />
        )
	}
}
Card = createPage({
	//initTemplate: initTemplate,
	billinfo: {
		billtype: 'card',
		pagecode: pagecode,
		headcode: formId,
		bodycode: tableId
	},
	orderOfHotKey: [formId, tableId]
})(Card);

//ReactDOM.render(<Card />, document.querySelector('#app'));

export default Card;


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65