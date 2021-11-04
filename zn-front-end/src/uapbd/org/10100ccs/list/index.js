//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, createPageIcon, cardCache,high } from 'nc-lightapp-front';
import { initTemplate } from './events/initTemplate';
import { buttonClick } from './events/buttonClick';
import { searchBtnClick } from './events/searchBtnClick';
import { LIST_BUTTON, SEARCHCACHE, LIST, MULTILANG, PRIMARTKEY } from '../constant';
import { pageInfoClick, handleDoubleClick } from './events/listOperator';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {}
        };
    }

    componentWillMount() {
        // json： 多语json格式参数；
        // status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作；
        // inlt： 可用来进行占位符的一些操作
        let callback = (json, status, inlt) => {
            if (status) {
                initTemplate(this.props, json); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中

                // 保存json和inlt到页面state中并刷新页面
                this.setState({ json, inlt })
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: MULTILANG.moduleId, domainName: MULTILANG.domainName, callback });
    }

    componentDidMount() {
        let { getDefData } = cardCache;
        if (getDefData(SEARCHCACHE.key, SEARCHCACHE.dataSource)) {
            this.props.button.setDisabled({
                [LIST_BUTTON.delete]: true,
                [LIST_BUTTON.refresh]: false
            });
        } else {
            this.props.button.setDisabled({
                [LIST_BUTTON.delete]: true,
                [LIST_BUTTON.refresh]: true
            });
        }

    }

    handlePageInfoChange = (props, config, pks) => {
        pageInfoClick({ ...props, json: this.state.json }, config, pks);
    }

    onRowDoubleClick = (record, index, props) => {
        handleDoubleClick(record, index, { ...props, json: this.state.json });
    }

    clickSearchBtn = (props) => {
        searchBtnClick({ ...props, json: this.state.json });
    }

    onButtonClick = (props, id) => {
        buttonClick({ ...props, json: this.state.json }, id);
    }

    render() {
        const { modal ,table, search,editTable } = this.props;
        let { createEditTable } = editTable;
        let { createModal } = modal;
        const { createSimpleTable } = table;
        const { NCCreateSearch } = search;
        const { PrintOutput } = high;
        return (
            <div className="nc-bill-list">
                {createModal('version',{noFooter:true},)}
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {createPageIcon()}
                        <h2 className="title-search-detail">{"成本中心结构"}</h2>
                    </div>

                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: LIST.head_btn_code,
                            onButtonClick: this.onButtonClick
                        })}
                    </div>
                </div>

                <div className="nc-bill-search-area">
                    {NCCreateSearch(LIST.search_id, {
                        dataSource: SEARCHCACHE.dataSource,
                        clickSearchBtn: this.clickSearchBtn
                    })}
                </div>

                <div className="table-area">
                    {createEditTable(LIST.table_id, {
                        showCheck: true,
                        // isAddRow:true,
                        showPagination:true,
                        dataSource: SEARCHCACHE.dataSource,
                        pkname: PRIMARTKEY.head_id,
                        handlePageInfoChange: this.handlePageInfoChange,
                        // onRowDoubleClick: this.onRowDoubleClick

                    })}
                </div>
                {/*<PrintOutput*/}
                {/*    ref="printOutput"*/}
                {/*    url={this.config.urls.printUrl}*/}
                {/*    data={{*/}
                {/*        funcode: '10140Z00', //功能节点编码，即模板编码*/}
                {/*        nodekey: 'termset', //模板节点标识*/}
                {/*        oids: this.state.pks, //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,*/}
                {/*        outputType: 'output'*/}
                {/*    }}*/}
                {/*    //callback={this.onSubmit}*/}
                {/*/>*/}
            </div>
        );
    }
}

List = createPage({
})(List);
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65