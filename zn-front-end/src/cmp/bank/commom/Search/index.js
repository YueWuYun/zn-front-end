/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base, high } from 'nc-lightapp-front';
import Num from '../Num';
import RangeNum from '../RangeNum';
import './index.less';
const { NCCheckbox, NCFormControl, NCRadio, NCDatePicker, NCRangePickerClient, NCSelect, NCTooltip } = base;
const { Refer } = high;
const { NCOption } = NCSelect;
const format = 'YYYY-MM-DD';

export default class CheckTable extends Component {
    static defaultProps = {
        lang: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            normal: true,
            isShow: true,
            list1: [],
            list: []
        };
    }

    componentWillMount() {
        let list = this.props.list;
        let { isShow, list1 } = this.state;
        list1 = list.splice(0, 5);
        if (list.length) {
            isShow = true;
        } else {
            isShow = false;
        }
        this.setState({
            isShow,
            list,
            list1
        });
    }

    componentWillReceiveProps(nextProps) {
        let { isShow, list1 } = this.state;
        let list = nextProps.list;
        if (list !== this.props.list) {
            list1 = list.splice(0, 5);
            if (list.length) {
                isShow = true;
            } else {
                isShow = false;
            }
            this.setState({
                isShow,
                list,
                list1
            });
        }
    }

    getContent = (item) => {
        let node = null;
        let { onChange, lang } = this.props;
        let fieldTip = '';
        switch (item.itemtype) {
            case 'refer':
                node = (
                    <Refer
                        fieldid={item.config.name}
                        {...item.config}
                        onChange={val => { onChange(item.code, val) }}
                    />
                );
                if (item.config.value) {
                    if (Array.isArray(item.config.value)) {
                        fieldTip = (item.config.value[0] && item.config.value[0].refname) ? (item.label + ':' + item.config.value.map(item => item.refname).join(', ')) : '';
                    } else {
                        fieldTip = item.config.value.refname ? (item.label + ':' + item.config.value.refname) : '';
                    }
                }
                break;
            case 'input':
                node = (
                    <NCFormControl
                        fieldid={item.config.name}
                        {...item.config}
                        onChange={val => { onChange(item.code, val) }}
                    />
                );
                fieldTip = item.config.value ? (item.label + ':' + item.config.value) : '';
                break;
            case 'num':
                node = (
                    <div fieldid={item.config.name}>
                    <Num
                        {...item.config}
                        style={{ textAlign: 'right' }}
                        onChange={val => { onChange(item.code, val) }}
                    />
                    </div>
                );
                fieldTip = item.config.value ? (item.label + ':' + item.config.value) : '';
                break;
            case 'datepicker':
                node = (
                    <NCDatePicker
                        fieldid={item.config.name}
                        format={format}
                        {...item.config}
                        onChange={val => onChange(item.code, val)}
                    />
                );
                fieldTip = item.config.value ? (item.label + ':' + item.config.value) : '';
                break;
            case 'rangepicker':
                node = (
                    <NCRangePickerClient
                        fieldid={item.config.name}
                        format={format}
                        showClear={true}
                        {...item.config}
                        onChange={val => { onChange(item.code, val || []); }}
                    />
                );
                fieldTip = (item.config.value[0] && item.config.value[1]) ? (item.label + ':' + item.config.value[0].substr(0, 10) + '~' + item.config.value[1].substr(0, 10)) : '';
                break;
            case 'radio':
                node = (
                    <NCRadio.NCRadioGroup
                        {...item.config}
                        onChange={val => { onChange(item.code, val) }}
                    >
                        {item.options.map(obj => {
                            return (
                                <NCRadio value={obj.value} key={obj.value}>{obj.display}</NCRadio>
                            );
                        })}
                    </NCRadio.NCRadioGroup>
                );
                break;
            case 'checkbox':
                node = (
                    <div fieldid={item.config.name}>
                        <span className="checkboxSpan" style={window.top.nccColor === 'black' ? { color: '#bdbdbd', borderColor: '#3d3d47' } : null} >{item.label}</span>
                        <NCCheckbox
                            {...item.config}
                            onChange={val => { onChange(item.code, val) }}
                        />
                    </div>
                );
                fieldTip = item.config.value ? (item.label + ':' + item.config.value) : '';
                break;
            case 'select':
                node = (
                    <NCSelect
                        fieldid={item.config.name} 
                        {...item.config}
                        // allowClear={true}
                        className={item.config.value === null ? 'clear-select' : ''}
                        onChange={val => { onChange(item.code, val) }}
                    >
                        <NCOption value={null} key={null}></NCOption>
                        {item.options.map(obj => {
                            return (
                                <NCOption value={obj.value} key={obj.value}>{obj.display}</NCOption>
                            );
                        })}
                    </NCSelect>
                );
                fieldTip = item.config.selectValue ? (item.label + ':' + item.config.selectValue) : '';
                break;
            case 'rangenum':
                node = (
                    <div fieldid={item.config.name}>
                    <RangeNum
                        {...item.config}
                        lang={lang}
                        onChange={val => { onChange(item.code, val) }}
                    />
                    </div>
                );
                fieldTip = (item.config.values[0] || item.config.values[1]) ? (lang.money + ':' + (item.config.values[0] || '') + ', ' + (item.config.values[1] || '')) : '';
                break;
        }
        let tip = <div style={{ padding: '10px 16px', fontSize: '14px' }}>{fieldTip}</div>;
        return (
            <div>
                <NCTooltip
                    inverse
                    overlay={fieldTip ? tip : null}
                //placement="top"
                //trigger='click'
                //className='search-area-tooltip'
                // style={!fieldTip && { display: 'none' }}
                >
                    <div className="condition-contant">
                        {node}
                    </div>
                </NCTooltip>
            </div>
        );
    }

    render() {
        let { onSearch, onClear, lang } = this.props;
        let { normal, isShow, list1, list } = this.state;
        const changeColor = obj => {
            return window.top.nccColor === 'black' ? obj : {};
        }
        return (
            <div className={`nc-bill-search-area bank-search ${list1.length === 1 ? 'inline' : ''} ${normal && isShow ? 'haha' : ''}`}>
                <div className="search-area-contant">
                    <div id="search" className="u-row NC_CreateSearch">
                        <div className="lightapp-component-search">
                            <div className={`u-col-md-12 u-col-sm-12 u-col-xs-12 ${(!normal || !list.length) ? 'height' : ''}`}>
                                <span>
                                    {list1.map((item, index) => {
                                        return (
                                            <div
                                                className={`u-col-md-2 u-col-sm-3 u-col-xs-6 searchChild   ${item.code} ${item.itemtype === 'checkbox' ? 'checkboxs' : item.itemtype}type`}
                                            // fieldname={item.label}
                                            >
                                                <span style={window.top.nccColor === 'black' ? { borderColor: '#3d3d47' } : null}>
                                                    {item.required && <span className="mustFillIn_search">*</span>}
                                                    {this.getContent(item)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </span>
                                {list1.length !== 1 ?
                                    <div className="u-col-md-2 u-col-sm-3 u-col-xs-6 searchChild search-component-rowArea">
                                        <span  class="search-component-searchBtn" onClick={onSearch}>
                                            <i class="iconfont icon-sousuo"></i>
                                        </span>
                                        <span class="clearBtn"  onClick={onClear}>
                                            <i class="iconfont icon-qingkong1"></i>
                                        </span>
                                        {isShow ? <span
                                            className="arrow searchClearBtn"
                                            onClick={() => {
                                                this.setState({ normal: !normal });
                                            }}
                                        >{normal ? lang.up : lang.more}</span> : null}
                                    </div> : null}
                                <span className={`search-second ${normal ? 'show' : ''}`}>
                                    {list.map((item, index) => {
                                        return (
                                            <div
                                                className={`u-col-md-2 u-col-sm-3 u-col-xs-6 searchChild ${item.code} ${item.itemtype === 'checkbox' ? 'checkboxs' : item.itemtype}type`}
                                            // fieldname={item.label}

                                            >
                                                {item.required && <span className="mustFillIn_search">*</span>}
                                                <span style={window.top.nccColor === 'black' ? { borderColor: '#3d3d47', background: '#303036' } : null}>
                                                    {this.getContent(item)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/