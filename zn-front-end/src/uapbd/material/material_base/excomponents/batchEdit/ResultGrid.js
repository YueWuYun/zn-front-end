//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
import React, { Component } from 'react';
import {base } from 'nc-lightapp-front';
let { NCButton} = base;

var EMPTY_FN = function(){};
class ResultGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonstatus: false
        };
        this.handlePageInfoChange = props.handlePageInfoChange;
        this.updateSelectId = props.updateSelectId;
        this.selectAll = props.selectAll;
    }
    pageInfoChange = () => {
        let pageInfo =this.props.table.getTablePageInfo('material4assign');
        this.handlePageInfoChange(pageInfo);
    }

    /**
     * 本页全选
     */
    thisPageSelectAll =() => {
        this.setState({buttonstatus:true},()=>{
            this.props.table.selectAllRows('material4assign',true);
            setTimeout(() => {
                this.updateSelectId();
            }, 0);
        });
    }

    updateButtonStatus = (status) =>{
        this.setState({buttonstatus:status});
    }

    /**
     * 本页取消
     */
    thisPageUnSelectAll = () => {
        this.setState({buttonstatus:true},()=>{
            this.props.table.selectAllRows('material4assign',false);
            setTimeout(() => {
                this.updateSelectId();
            }, 0);
        });
    }

    /**
     * 全部全选
     */
    SelectAll = () =>{
        this.setState({buttonstatus:true},()=>{
            this.props.table.selectAllRows('material4assign',true);
            setTimeout(() => {
                this.selectAll(true);
            }, 0);
        });
    }

    /**
     * 全部取消
     */
    UnSelectAll = () => {
        this.setState({buttonstatus:true},()=>{
            this.props.table.selectAllRows('material4assign',false);
            this.selectAll(false);
        });
    }
    render() {
        let {table} = this.props;
        let {createSimpleTable } = table;
        return (
            <div>
                <NCButton fieldid={'thisPageSelectAll'} onClick={this.thisPageSelectAll} disabled={this.state.buttonstatus}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000121')/* 国际化处理： 本页全选*/}</NCButton>
                <NCButton fieldid={'thisPageUnSelectAll'} onClick={this.thisPageUnSelectAll} disabled={this.state.buttonstatus}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000122')/* 国际化处理： 本页取消*/}</NCButton>
                <NCButton fieldid={'SelectAll'} onClick={this.SelectAll} disabled={this.state.buttonstatus}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000123')/* 国际化处理： 全部全选*/}</NCButton>
                <NCButton fieldid={'UnSelectAll'} onClick={this.UnSelectAll} disabled={this.state.buttonstatus}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000124')/* 国际化处理： 全部取消*/}</NCButton>
                {createSimpleTable('material4assign', {
                        showIndex : true,
                        showCheck : true,
                        handlePageInfoChange: this.pageInfoChange,
                        onSelectedAll:this.updateSelectId,
                        onSelected:this.updateSelectId
                        }
                    )}
            </div>
        )
    }
}
export default ResultGrid;
//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb