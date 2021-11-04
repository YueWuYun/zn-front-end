//5wzWlVrGrPQLjuty+OAw9jxCquQiMpZNfQE9WbkmsD52SrVHdIXy4i8Zh6mcqXPd
import React, { Component } from 'react';
import {base } from 'nc-lightapp-front';
const { NCForm, NCCheckbox,NCSelect  } = base;
const NCFormItem = NCForm.NCFormItem;
const NCOption = NCSelect.NCOption;

var EMPTY_FN = function(){};
const searchid = 'search4assign';
class AssignFilter extends Component {
    constructor(props) {
        super(props);
        this.state={
            assignStatus:undefined,
        }
    }
    getQueryInfo = () => {
        let searchdata = this.props.search.getQueryInfo('search4assign');
        if(!searchdata || !searchdata.querycondition) return false;
        let conditions = [{field:'node_type',value:{firstvalue:this.props.config.node_type}},{field:'searchFrom',value:{firstvalue:'assign'}}];
        if(this.state.assignStatus){
            conditions.push({field:'AssignStatus',value:{firstvalue:this.state.assignStatus}});
        }
        searchdata.custcondition = {conditions:conditions};
        console.log('searchdata',searchdata);
        return searchdata;
    }

    setAssignStatus = (value) => {
        this.setState({assignStatus:value});
    }

    clickSearchBtn=()=>{}
    render() {
        const{search} = this.props;
        const {NCCreateSearch} = search;
        return (
            <div>
                <div className="nc-singleTable-search-area"> {NCCreateSearch(searchid, {
                    clickSearchBtn:this.clickSearchBtn,
                    oid:'1009Z01000000005855D',
                    showAdvBtn:false,
                    onlyShowAdvArea:true,
                })}
                </div>
                
            </div>

        )
    }
}
export default AssignFilter;
//5wzWlVrGrPQLjuty+OAw9jxCquQiMpZNfQE9WbkmsD52SrVHdIXy4i8Zh6mcqXPd