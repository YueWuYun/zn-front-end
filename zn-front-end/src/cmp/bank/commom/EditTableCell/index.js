/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base, high } from 'nc-lightapp-front';
import Num from '../Num';
import RangeNum from '../RangeNum';
import Accountbook from '../../../../../src/uapbd/refer/org/AccountBookTreeRef/index';
// import AccountRefer from '../../../../../src/uapbd/refer/fiacc/AccountDefaultGridTreeRef/index';
import AccountRefer from '../AccountDefaultGridTreeRef/index';
import './index.less';
const { NCDatePicker, NCRangePickerClient, NCFormControl, NCCheckbox, NCSelect,NCNumber } = base;
const { Refer } = high;
const { NCOption }= NCSelect;
const format= 'YYYY-MM-DD';

export default class EditTableCell extends Component {
    static defaultProps={
        isEdit: false
    };

    constructor(props) {
        super(props);
        this.state = {
            editable: false,
            isVisible: false
        };
    } 

    componentWillReceiveProps (nextProps) {
        if (!nextProps.isEdit) {
            this.setState({
                editable: false,
                isVisible: false
            });
        }
    }

    edit = () => {
        if (!this.props.isEdit) {
            return;
        }
        this.setState({ editable: true });
    };

    getNodeContent = () => {
        let { type, config, options, onChange, onClick }= this.props;
        let node= null;
        switch (type) {
            case 'accountbook': 
                node= <Accountbook 
                    {...config}
                    fieldid={config.name}
                    onChange={e => {onChange(e, config.name)}}
                />;
                break;
            case 'accountrefer': 
                node= <AccountRefer 
                    {...config}
                    fieldid={config.name}
                    onChange={e => {onChange(e, config.name)}}
                />;
                // node= AccountRefer({
                //     ...config,
                //     onChange: e => onChange(e, config.name),
                //     onReferSureClick: e => {
                //         console.log(e, 'eee');
                //     }
                // });
                break;
            case 'refer': 
                node= <Refer 
                    {...config}
                    fieldid={config.name}
                    onChange={e => {onChange(e, config.name)}}
                />;
                break;
            case 'datepicker': 
                node= <NCDatePicker 
                    format={format}
                    {...config}
                    fieldid={config.name}
                    onChange={e => onChange(e, config.name)}
                />;
                break;
            case 'rangepicker': 
                node= <NCRangePickerClient 
                    format={format}
                    showClear={true}
                    {...config}
                    fieldid={config.name}
                    onChange={e => {onChange(e, config.name)}}
                />;
                break;
            case 'input': 
                node= 
                <NCFormControl 
                    fieldid={config.name}
                    {...config} 
                    className="bank-input"
                    onChange={e => {onChange(e, config.name)}}
                    onClick={e => {onClick && onClick()}}
                />;
                break;
            case 'num': 
                node= 
                <NCNumber
                {...config}
                onChange={e => {onChange(e, config.name)}} 
                >
                </NCNumber>;
                // <Num 
                //     {...config} 
                //     style={{textAlign: 'right'}}
                //     onChange={e => {onChange(e, config.name)}}
                // />;
                break;
            case 'rangenum': 
                node= <div fieldid={config.name}>
                <RangeNum 
                    {...config} 
                    onChange={e => {onChange(e, config.name)}}
                />;
                </div>
                break;
            case 'select': 
                node= <NCSelect
                    {...config}
                    fieldid={config.name}
                    // allowClear={true}
                    onChange={e => {onChange(e, config.name)}}
                >
                    <NCOption value={null} key={null}></NCOption>    
                    {options && options.map(obj => {
                        return (
                            <NCOption fieldid={obj.value+"_select"} value={obj.value} key={obj.value}>{obj.display}</NCOption>
                        );
                    })}
                </NCSelect>;
                break;
            case 'checkbox': 
                node= <div fieldid={config.name}>
                <NCCheckbox
                    {...config}
                    onChange={e => {onChange(e, config.name)}}
                />;
                </div>
                break;
            default:
                node= null;
        }
        return node;
    }

    render() {
        let { isEdit, config, type }= this.props;
        let { editable, isVisible }= this.state;
        let { value }= config;
        
        return (
            <span 
                className="editable-cell"
            >
                {editable ? this.getNodeContent() : (
                    <div 
                        fieldid={config.name}
                        className="editable-cell-text-wrapper"
                        onMouseOver={() => {
                            if (isVisible) {
                                return;
                            }
                            this.setState({isVisible: true});
                        }}
                        onMouseOut={() => {
                            if (!isVisible) {
                                return;
                            }
                            this.setState({isVisible: false});
                        }}
                        onClick={this.edit}
                    >
                        {(type=== 'refer' || type.indexOf('account')> -1) ? (value.refname || '') : (type=== 'num' ? (value ? Number(value).formatMoney() : '') : value || '')}<span>&nbsp;</span>
                        {isEdit ? <span  className="iconfont icon-zhengbiaobianji" style={{color: isVisible ? '#058ae5' : 'transparent'}}/> : null}
                    </div>
                )}
            </span>
        );
    }
  }
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/