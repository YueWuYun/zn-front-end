//VkFMy2IZON8y12jdGk3VypicP0rFFqdGrmEchbNkvicxm6gFdrK/UvYkLDf9zLEO
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
const { NCForm, NCCheckbox  } = base;
const NCFormItem = NCForm.NCFormItem;


var EMPTY_FN = function(){};
class BatchEditFilter extends Component {
    constructor(props) {
        super(props);
        this.state={
            showResult:false
        }
    }

    /**
     * 获取查询条件
     */
    getQueryInfo = () => {
        let searchdata = this.props.search.getQueryInfo(this.props.tableConfig.searchid);
        if(!searchdata || !searchdata.querycondition) return false;
        let conditions = [{field:'node_type',value:{firstvalue:this.props.config.node_type}}];
        searchdata.custcondition = {conditions:conditions};
        return searchdata;
    }

    getShowResult = () => {
        return this.state.showResult;
    }

    render() {
        const{search} = this.props;
        const {NCCreateSearch} = search;
        return (
            <div>
                <div className="nc-singleTable-search-area"> {NCCreateSearch(this.props.tableConfig.searchid, {
                    clickSearchBtn:()=>{},
                    showAdvBtn:false,
                    onlyShowAdvArea:true
                })}
                </div>
            </div>

        )
    }
}
export default BatchEditFilter;
//VkFMy2IZON8y12jdGk3VypicP0rFFqdGrmEchbNkvicxm6gFdrK/UvYkLDf9zLEO