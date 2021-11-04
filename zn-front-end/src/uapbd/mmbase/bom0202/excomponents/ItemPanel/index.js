//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import GrandModal from '../GrandModal';
import { initBody } from './tableEvents';
import './index.less';

let cacheTool = {
    tableData: {},
    currentIndex: 0,
    oldIndex: 0
};

class Grand extends Component {
    constructor(props) {
        super(props);
        debugger;
        this.templetid = '';
        this.state = {};
    }

    componentDidMount() {
        cacheTool = {
            tableData: {},
            currentIndex: 0,
            oldIndex: 0
        };
        this.componentDidMountCallBack();
    }

    /**
     * 为子类提供componentDidMount的回调
     */
    componentDidMountCallBack = () => { };

    /**
     * 保存页面最原始的tableData
     */
    componentWillReceiveProps(next) {
        // if (this.props.refreshFlag != next.refreshFlag) {
        //     // 更新缓存, 把当前孙表表头行下标重置为0
        //     cacheTool.currentIndex = 0;

        this.componentWillReceivePropsCallBack(next);
        // setTimeout(() => {
        //     cacheTool.tableData = deepClone(this.props.tableData);
        // }, 0);
        // }
    }

    /**
     * 为子类提供生命周期的回调
     */
    componentWillReceivePropsCallBack = next => { };

    onOkBtnClick = (props, locStatus, uiInfo, locCode) => {
        initBody({ locStatus, uiInfo, locCode, flag: true }, undefined, props);
        return cacheTool.tableData;
    };

    getCountItem = () => {
        return null;
    };

    getFootLeft = () => {
        return null;
    };
    headRowClickEvent = (id, record, index) => { };
    bodyRowClickEvent = (id, record, index) => { };
    /**
     * props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
     */
    bodyRowAfterEvent = (props, moduleId, key, value, changedrows, record, index) => { };

    /**
     * moduleId(区域id), item(模版当前列的项), index（当前索引）,value（当前值）, record（行数据）
     */
    bodyRowBeforeEvent = (props, moduleId, item, index, value, record) => {
        return true;
    };

    render() {
        const {
            show,
            onHide,
            okBtnClick,
            table,
            editTable,
            button,
            locStatus,
            uiInfo,
            countItem,
            locCode
        } = this.props;
        console.log(this.props.grandtemp && JSON.stringify(this.props.grandtemp) != "{}")
        if (this.props.grandtemp && JSON.stringify(this.props.grandtemp) != "{}") {
            this.props.meta.setMeta(this.props.grandtemp);
        }
        const { createEditTable } = editTable;
        let { createSimpleTable } = table;

        let elements = this.getCountItem();
        return (
            <GrandModal
                show={show}
                onHide={onHide}
                onOkBtnClick={() => {
                    let data = this.onOkBtnClick(this.props, locStatus, uiInfo, locCode);
                    let flag = okBtnClick(this.props, data, cacheTool.currentIndex);
                    if (flag == null || flag === true) {
                        cacheTool = { ...cacheTool, currentIndex: 0, oldIndex: 0 };
                    }
                    return flag;
                }}
                content={
                    <div className="location">
                        <div className="head">
                            {createSimpleTable(uiInfo.headCode, {
                                showIndex: true,
                                height: 160,
                                onRowClick: initBody.bind(
                                    this,
                                    { locStatus, uiInfo, locCode, flag: false },
                                    this.headRowClickEvent
                                )
                            })}
                        </div>
                        {elements && <div className="center">{this.getCountItem()}</div>}
                        <div className="body">
                            {createEditTable(uiInfo.bodyCode, {
                                showIndex: true,
                                height: 180,
                                onRowClick: this.bodyRowClickEvent,
                                onAfterEvent: this.bodyRowAfterEvent,
                                onBeforeEvent: this.bodyRowBeforeEvent
                                // onAfterEvent: saveChange.bind(
                                //     this,
                                //     { uiInfo, locCode },
                                //     this.bodyRowAfterEvent
                                // )
                            })}
                        </div>
                    </div>
                }
                footLeft={this.getFootLeft()}
                {...this.props}
            />
        );
    }
}

export { Grand, cacheTool };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65