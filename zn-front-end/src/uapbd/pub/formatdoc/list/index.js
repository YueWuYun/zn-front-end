//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,createPageIcon } from 'nc-lightapp-front';
// import 'nc-lightapp-front/build/index.css';
import { buttonClick, initTemplate, searchBtnClick, clickRow } from './events';
let { NCButton, NCMessage } = base;
import './index.less';
class List extends Component {

    constructor(props) {
        super(props);
        this.tableId = 'formatdocdata';
        // this.searchId = 'searchArea';
        this.state = {
            json: {},
			inlt: null
        }
    }
    componentDidMount() {
        this.getData();
    }

    componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
			}
		}
        this.props.MultiInit.getMultiLang({ 'moduleId': 'xi-exsystem', 'domainName': 'uap', callback });
	}

    getData = () => {
        let pageInfo = this.props.table.getTablePageInfo(this.tableId);
        ajax({
            url: '/nccloud/uapbd/formatdoc/queryall.do',
            success: (res) => {
                let { success, data } = res;
                if (success) {debugger;
                    if (data != null) {
                        this.props.table.setAllTableData(this.tableId, data.formatdocdata);
                    }
                }
            }

        });

    }


    render() {
        let { editTable, button, search, modal, table } = this.props;
        let { createEditTable } = editTable;
        let { createSimpleTable } = table;
        let { createButtonApp } = button;
        let { NCCreateSearch } = search;
        let { createModal } = modal;
        return (
            <div className="nc-single-table">
                <div className="nc-singleTable-header-area">
                    <div className='header-title-search-area'>
                    {createPageIcon()}
                        <h2 className='title-search-detail'>数据格式</h2>
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area', buttonLimit: 6, onButtonClick: buttonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </div>
                {/* <div className="nc-singleTable-search-area">
                    {NCCreateSearch(this.searchId, {
                        showAdvBtn: false,
                        clickSearchBtn: searchBtnClick.bind(this)
                    })}
                </div> */}
                <div style={{ height: '10px' }}></div>
                <div className="nc-singleTable-table-area">
                    {createSimpleTable(this.tableId, {
                        dataSource: "uapbd.pub.formatdocdata.cache",
                        pkname: "pk_formatdoc",
                        height:465,
                        //showCheck: true,
                        //showIndex: true,
                        onRowClick: clickRow.bind(this),
                    })}
                </div>
                {/* <div className="nc-singleTable-table-area">
                    {createSimpleTable('childtable',
                        {
                            showCheck: false,
                            showIndex: true
                        })}
                </div> */}
            </div>
        );
    }
}

List = createPage({
    initTemplate: initTemplate,
})(List);
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65