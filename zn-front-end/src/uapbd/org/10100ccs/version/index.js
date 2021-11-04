//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, createPageIcon, cardCache ,ajax} from 'nc-lightapp-front';
import { initTemplate } from './events/initTemplate';
import { buttonClick } from './events/buttonClick';
import { searchBtnClick } from './events/searchBtnClick';
import { LIST_BUTTON, SEARCHCACHE, LIST, MULTILANG, PRIMARTKEY, VERSION,CARD} from '../constant';
import { pageInfoClick, handleDoubleClick } from './events/listOperator';
import {buttonVisibilityControl} from "./events/buttonVisibilityControl";

class Version extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {}
        };
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                initTemplate(this.props, json); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中

                // 保存json和inlt到页面state中并刷新页面
                this.setState({ json, inlt });
                //================测试
                this.props.editTable.setTableData(CARD.version_table,  this.props.config[LIST.table_id]);
                this.props.setUrlParam({
                    status: 'browse'
                });
                buttonVisibilityControl(this.props);
                //================测试
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

    onButtonClick = (props, id) => {
        buttonClick({ ...props, json: this.state.json }, id);
    }
    render() {
        const { editTable } = this.props;
        let { createEditTable } = editTable;
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {createPageIcon()}
                        <h2 className="title-search-detail">{"版本化"}</h2>
                    </div>

                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: CARD.bodys_btn_code,
                            onButtonClick: this.onButtonClick
                        })}
                    </div>
                </div>

                <div className="table-area">
                    {createEditTable(CARD.version_table, {
                        showCheck: true,
                        pkname: PRIMARTKEY.head_id
                    })}
                </div>
            </div>
        );
    }
}

Version = createPage({
    billinfo:{
        billtype:'version',
        pagecode:CARD.page_code,
        headcode:CARD.version_table
    },
})(Version);
export default Version;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65