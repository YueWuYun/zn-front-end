/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import './index.less';
let { NCTable: Table, NCCheckbox: CheckBox } = base;

export default class CheckTable extends Component {
    static defaultProps = {
        isClearChecked: true,
        param: '',
        fixed: true,
        isDisabled: false,
        isAdd: true
    };
    
    constructor(props) {
        super(props);
        this.state = {
			checkedAll:false,
			checkedArray: [],
			checkedList: [],
			checkedBool: false
		};
    }

    componentWillMount () {
        let { selectedBool }= this.props;
        if (selectedBool) {
            this.setState({checkedArray: selectedBool});
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.data!== this.props.data && this.props.isClearChecked) {
            this.setState({
                checkedAll:false,
                checkedArray: [],
                checkedList: [],
                checkedBool: false
            });
        }

        if (nextProps.selectedBool!== this.props.selectedBool) {
            let bool= nextProps.selectedBool.filter(item => item);
            let checkedAll= false, checkedBool= true;
            if (!bool.length) {
                checkedAll= false;
                checkedBool= false;
            } else if (bool.length=== nextProps.data.length) {
                checkedAll= true;
                checkedBool= false;
            }
            this.setState({
                checkedAll,
                checkedBool,
                checkedArray: nextProps.selectedBool
            });
        }
    }
    
    onCheckAll = bool => {
        let checkedArray= [];
        let checkedList= [];
        let { data, selectedList, param }= this.props;
		for (let key in data) {
			checkedArray[key] = bool;
		}
        if (bool) {
            checkedList= JSON.parse(JSON.stringify(data));
            if (param) {
                checkedList= checkedList.map(item => item[param]);
            }
        }
        this.setState({
			checkedAll: bool,
			checkedArray,
			checkedList: bool ? data : [],
			checkedBool: false
        });
        
        selectedList(checkedList, checkedArray, null, checkedList[checkedList.length-1]);
	};

	onCheckBox = (bool, index, record) => {
        let {checkedArray, checkedBool, checkedAll} = this.state;
        let {data}= this.props;
		let length= 0;
		checkedArray[index] = bool;
		for (let i=0; i< data.length; i++) {
			if (checkedArray[i]) {
				length++;
			}
		}
		if (length=== data.length) {
			checkedAll= true;
			checkedBool= false;
		} else if (length=== 0) {
			checkedAll= false;
			checkedBool= false;
		} else {
			checkedAll= false;
			checkedBool= true;
		}
		this.checkedHanding(checkedArray, checkedAll, checkedBool, record, index);
    };
    
    checkedHanding = (checkedArray, checkedAll, checkedBool, record, index) => {
		let { data, selectedList, param }= this.props;
		let checkedList= [];
		for (let i=0; i< data.length; i++) {
			if (checkedArray[i]) {
				checkedList.push(param ? data[i][param] : data[i]);
			}
        }
        
        this.setState({
            checkedAll,
            checkedArray,
            checkedBool,
            checkedList
		});
        selectedList(checkedList, checkedArray, index, record);
    };
    
    multiSelect= columns => {
        let { checkedArray, checkedAll } = this.state;
        let { data, isAdd }= this.props;
        let checkedBool= false;
        let len= data.length;
        while (len--) {
            if (checkedArray[len]) {
                checkedBool = true;
                break;
            }
        }
        let defaultColumns = [
            {
                title: (
                    <span fieldid="firstcol">
                    <CheckBox
                        className="table-checkbox"
                        checked={checkedAll}
                        indeterminate={checkedBool && !checkedAll}
                        isMarginRight={false}
                        onChange={this.onCheckAll}
                        disabled={this.props.isDisabled}
                    />
                    </span>
                ),
                key: "checkbox",
                dataIndex: "checkbox",
                className: isAdd ? 'table-checkbox-class' : '',
                width: "50px",
                fixed: this.props.fixed,
                render: (text, record, index) => {
                    return (
                        <div onClick={e => e.stopPropagation()}  fieldid="firstcol">
                            <CheckBox
                                className="table-checkbox"
                                checked={checkedArray[index]}
                                isMarginRight={false}
                                disabled={this.props.isDisabled}
                                onChange={bool => this.onCheckBox(bool, index, record)}
                            />
                        </div>
                    );
                }
            }
        ];
        columns = defaultColumns.concat(columns);
        return columns;
    };
	
	render() {
        let { className, columns, data, param, ...others }= this.props;
        let newColumns= this.multiSelect(columns);
        
        return <Table 
            className={`${className || ''} check-table`} 
            columns={newColumns} 
            data={data} 
            {...others}
         
        />
	}
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/