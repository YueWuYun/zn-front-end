import React, { Component } from 'react';
import { createPage, ajax, base, high ,getMultiLang} from 'nc-lightapp-front';
const { Refer } = high;
const { NCSelect} = base;
const NCOption = NCSelect.NCOption;
//会计平台组件
class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
			taskdata:[],//产量类的数据的集合。
		};
    }
    componentWillMount() {
        let  callback= (json) =>{
			this.setState({json:json},()=>{
                this.getTaskData.call(this);
		       })
	       }
       getMultiLang({moduleId: 'formula', currentLocale: 'simpchn',domainName: 'mapub',callback})
    }

	//查询产量类的方法
	getTaskData = () => {
		var param = {
			oid: null
		};
		ajax({
			loading: true,
			url: '/nccloud/mapub/formula/task.do',
			data: param,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.setState({
						taskdata: data
					})
				}
			}
		});
    };			
		

    //画组件内容的方法
    _createTabPaneContent = () => {
        let TabPaneContent=this.state.taskdata;
		if(TabPaneContent.length==0){
            return;
        }
        return TabPaneContent.map((eve, index) => {
            const { inputSig, displayName, hintMsg } = eve;
            return <li className='tab-content-item'>     
                    <Refer
                    refName={this.state.json['formula-000013']}/* 国际化处理： 作业档案*/
                    refType={'grid'}
                    queryGridUrl={'/nccloud/mapub/refer/bdActivityRef.do'}
                    value={this.state.currency}
                    fieldid={'currency'}
                    isAlwaysEmitOnChange={true}
                    onChange={val => {
                        this.setState({
                            currency: val
                        });
                        let selectData={
                            name: displayName+'['+val.refcode+'~'+val.refname+']',
                            code: inputSig,
                            id:val.refpk
                        }
                        this.props.getSelectData(selectData)
                        this.props.setName('{'+displayName+'['+val.refcode+'~'+val.refname+']'+'}') ;
                    }}
                    clickContainer={<span>{displayName}</span>}
                    queryCondition = {{          
                        pk_org: this.props.pk_org.refpk,
                        // TreeRefActionExt: 'nccloud.web.fip.generate.action.AccountBookTreeRef4Fip'
                    }}
                />
             </li>
        });
    }
    render() {
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-table-area" >  
                    <ul className="tab-content" fieldid='content'
                    >{this.state.taskdata&&this._createTabPaneContent()}</ul>
                </div>
            </div>
        );
    }

}

//会计平台组件   const 不可变常量      let 可变 变量
let TaskDom = createPage({
})(Task);


export { TaskDom};
