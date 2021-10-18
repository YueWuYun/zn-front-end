/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base, high } from 'nc-lightapp-front';
import Num from '../Num';
import RangeNum from '../RangeNum';
import './index.less';
const { NCDatePicker, NCRangePickerClient, NCFormControl, NCRadio, NCCheckbox, NCSelect } = base;
const { Refer } = high;
const { NCOption }= NCSelect;
const format= 'YYYY-MM-DD';

export default class HeaderList extends Component {
    static defaultProps={
        status: 'browse',
        showType: 'two-column',
        type: 'card',
        borderTop: false
    };

    constructor(props) {
        super(props);
    } 
    
    getContent = item => {
        let { onChange, onClick, lang }= this.props;
        let node= null;
        switch (item.type) {
            case 'refer': 
                node= <Refer 
                    // popWindowClassName={"fieldid_"+item.config.name+"_refer-window"}
                    fieldid={item.config.name}
                    isShow={false}
                    {...item.config}
                    onChange={e => {onChange(e, item.config.name)}}
                />;
                break;
            case 'datepicker': 
                node= <NCDatePicker 
                    fieldid={item.config.name}
                    format={format}
                    {...item.config}
                    onChange={e => onChange(e, item.config.name)}
                />;
                break;
            case 'rangepicker': 
                node= <NCRangePickerClient 
                    fieldid={item.config.name}
                    format={format}
                    showClear={true}
                    {...item.config}
                    onChange={e => {onChange(e || [], item.config.name)}}
                />;
                break;
            case 'input': 
                node= <NCFormControl 
                    {...item.config} 
                    fieldid={item.config.name}
                    className="bank-input"
                    onChange={e => {onChange(e, item.config.name)}}
                    onClick={e => {onClick && onClick()}}
                />;
                break;
            case 'num': 
                node= <Num 
                    {...item.config}
                    style={{textAlign: 'right'}} 
                    onChange={e => {onChange(e, item.config.name)}}
                />;
                break;
            case 'rangenum': 
                node= <RangeNum 
                    {...item.config} 
                    lang={lang}
                    onChange={e => {onChange(e, item.config.name)}}
                />;
                break;
            case 'radio': 
                node= <NCRadio.NCRadioGroup
                    name={item.config.name}
                    selectedValue={item.config.value}
                    onChange={e => {onChange(e, item.config.name)}}>
                    {
                        item.list.map((obj, index) => {
                            return (
                                <NCRadio 
                                    value={obj.value} 
                                    disabled={item.config.disabled}
                                >{obj.name}</NCRadio>  
                            );
                        })
                    }
                </NCRadio.NCRadioGroup>;
                break;
            case 'select': 
                node= <NCSelect
                    {...item.config}
                    fieldid={item.config.name}
                    // allowClear={true}
                    onChange={e => {onChange(e, item.config.name)}}
                >   
                    <NCOption value={null} key={null}></NCOption>
                    {item.options.map(obj => {
                        return (
                            <NCOption value={obj.value} key={obj.value}>{obj.display}</NCOption>
                        );
                    })}
                </NCSelect>;
                break;
            case 'checkbox': 
                node= <NCCheckbox
                    {...item.config}
                    onChange={e => {onChange(e, item.config.name)}}
                />;
                break;
            case 'span': 
                node= <span className="bank-header-list-value">
                    {item.config.value}
                </span>;
                break;
        }
        return node;
    }
	
	render() {
        let { configList, status, showType, type, borderTop, className }= this.props;
        const changeColor = obj => {
            return window.top.nccColor==='black' ? obj : {};
        }
        return (
            <ul className={`bank-header-list ${type=== 'card' ? 'card-type' : ''} ${borderTop ? 'border-top' : ''} ${className}`} style={changeColor({backgroundColor: '#27272a'})}>
                {configList.map((item, index) => {
                    if (status=== 'browse') {
                        return (
                            <div key={index} fieldid={item.config.name} className={`bank-header-item  ${showType}`} >
                                <span className="bank-header-list-label" style={changeColor({color: '#bdbdbd'})}>{item.label ? item.label + ':' : ''}</span>
                                <span className="bank-header-list-value" style={changeColor({color: '#bdbdbd'})}>{item.value}</span>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} fieldid={item.config.name} className={`bank-header-item ${showType}`} >
                                <span className={`bank-header-list-label ${item.required && 'required'}`} style={changeColor({color: '#bdbdbd'})}>{item.label ? item.label : ''}</span>
                                {this.getContent(item)}
                            </div>
                        );
                    }
                })
                }
            </ul>
        );
	}
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/