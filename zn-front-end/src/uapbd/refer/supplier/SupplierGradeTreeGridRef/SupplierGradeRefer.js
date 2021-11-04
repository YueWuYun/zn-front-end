//F4+sQ8DJGohi6wie/XHb8jty1t+C6wgH1PAFxcANlvjOlipzQE1PLHgSBKpfZoja
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { base, high } from 'nc-lightapp-front';
const { PopRefer } = high.Refer; // 引入PopRefer类
const {NCCheckbox:Checkbox,NCFormControl:FormControl,NCPopover:Popover,NCLoading:Loading} = base;
export default class SupplierGradeRefer extends PopRefer{
    constructor(props){
        super(props);
        this.state = {
            ...this.state,

        }
    }
    // 复写原型方法：渲染弹出层
    renderPopover = () => {
        let { isFirstShow, isShow, loading } = this.state;
        const { container, refType, popWindowClassName } = this.props;
        return ReactDOM.createPortal(
            <div
                className={`refer-pop-window ${popWindowClassName}`}
                style={{ display: isShow ? 'flex' : 'none' }}
                onClick={this.cancel}
                onMouseOver={(e) => {
                    e.stopPropagation();
                }}
            >
                <div
                    className="refer-popover clearfix"
                    ref={(dom) => {
                        this.popover = dom;
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="refer-header">{isFirstShow || this.renderPopoverHeader()}</div>
                    <div
                        className="loading-container"
                        ref={(dom) => {
                            this.loadingContainer = dom;
                        }}
                    >
                        <Loading container={this.loadingContainer} show={loading} />
                        <div className="refer-search">{isFirstShow || this.renderPopoverSearchArea()}</div>
                        {isFirstShow || this.renderPopoverContain()}
                        {/*{refType !== 'tree' && <div className="refer-page">{this.renderPopoverPageArea()}</div>}*/}
                        <div className="refer-buttom">{isFirstShow || this.renderPopoverBottom()}</div>
                    </div>
                </div>
            </div>,
            container
        );
    };
    // 复写原型方法：渲染弹出层搜索区域
    renderPopoverSearchArea = () => {
        let { searchVal, searchSetting, columnConfig, treeData } = this.state;
        let { name: names, code: codes, checked = {} } = columnConfig[0];
        const {
            refType,
            allowSearchConfig,
            allowColumnConfig,
            isMultiSelectedEnabled,
            rootNode,
            isTreelazyLoad,
            isShowDisabledData
        } = this.props;
        return [
            // 全部 or 常用页签
            <div className="refer-search-left-area" key="1">
                {refType === 'gridTree' && (
                    <div className="refer-left-tab">
                    </div>
                )}
            </div>,
            // 搜索框
            <div className="refer-search-table-input" key="2">
                <FormControl
                    className="search-input"
                    placeholder="搜索"
                    value={searchVal}
                    onChange={(val) => {
                        this.setState({
                            searchVal: val
                        });
                    }}
                    onKeyPress={(e) => {
                        let keyCode = e.which || e.keyCode || e.charCode,
                            val = e.target.value;
                        let { refType } = this.props;
                        if (keyCode === 13) {
                            if (refType === 'tree') {
                                this.popSearchTree(searchVal);
                            } else {
                                this.popSearchTable();
                            }
                        }
                    }}
                />
                <i className="refer-search-i iconfont icon-sousuo" onClick={this.popSearchTable.bind(this, 0)} />
                {/* 搜索设置 */}
                {allowSearchConfig && (
                    <Popover
                        className="popover-in-refer"
                        trigger={'click'}
                        placement={'bottom'}
                        content={
                            <div className="refer-popover-container">
                                {columnConfig[0].name.map((e, i) => {
                                    let code = codes[i];
                                    return (
                                        <Checkbox
                                            checked={!!searchSetting[code]}
                                            value={code}
                                            onClick={(e) => {
                                                this.pushToSearchSetting(code);
                                            }}
                                        >
                                            {e}
                                        </Checkbox>
                                    );
                                })}
                            </div>
                        }
                    >
                        <i className="search-setting iconfont icon-shezhi" />
                    </Popover>
                )}
            </div>,

            // 树形参照的更多按钮
            refType === 'tree' && !isTreelazyLoad && this.getMoreButtonDOM(),
            // 搜索区域扩展区
            <div className="refer-search-area-extend" key="4">
                {this.renderPopoverSearchExtendArea()}
            </div>,

            // 列设置
            allowColumnConfig && refType !== 'tree' && this.getColumnConfigDOM()
        ];
    };
    renderPopoverPageArea = () => {return[]}
}





//F4+sQ8DJGohi6wie/XHb8jty1t+C6wgH1PAFxcANlvjOlipzQE1PLHgSBKpfZoja