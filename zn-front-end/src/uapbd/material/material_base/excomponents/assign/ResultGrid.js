//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl,NCPagination  } = base;

var EMPTY_FN = function(){};
class ResultGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.props.table.selectAllRows('material4assign',true);
        this.updateSelectId();
    }

    /**
     * 本页取消
     */
    thisPageUnSelectAll = () => {
        this.props.table.selectAllRows('material4assign',false);
        this.updateSelectId();
    }

    /**
     * 全部全选
     */
    SelectAll = () =>{
        this.props.table.selectAllRows('material4assign',true);
        this.selectAll(true);
    }

    /**
     * 全部取消
     */
    UnSelectAll = () => {
        this.props.table.selectAllRows('material4assign',false);
        this.selectAll(false);
    }
    render() {
        let {table} = this.props;
        let {createSimpleTable } = table;
        return (
            <div>
                <NCButton onClick={this.thisPageSelectAll}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000121')/* 国际化处理： 本页全选*/}</NCButton>
                <NCButton onClick={this.thisPageUnSelectAll}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000122')/* 国际化处理： 本页取消*/}</NCButton>
                <NCButton onClick={this.SelectAll}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000123')/* 国际化处理： 全部全选*/}</NCButton>
                <NCButton onClick={this.UnSelectAll}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000124')/* 国际化处理： 全部取消*/}</NCButton>
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