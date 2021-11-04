import React, { Component } from 'react';
import { createPage, ajax, base, high ,getMultiLang} from 'nc-lightapp-front';
const { Refer } = high;
const { NCSelect} = base;
const NCOption = NCSelect.NCOption;
//会计平台组件
class Partition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            partitiondata:[],//产量类的数据的集合。
		};
    }
    componentWillMount() {
        let  callback= (json) =>{
			this.setState({json:json},()=>{
                this.getPartitionData.call(this);
		       })
	       }
       getMultiLang({moduleId: 'formula', currentLocale: 'simpchn',domainName: 'mapub',callback})
    }
    //查询产量类的方法
	getPartitionData = () => {
		var param = {
			oid: null
		};
		ajax({
			loading: true,
			url: '/nccloud/mapub/formula/partition.do',
			data: param,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.setState({
						partitiondata: data
					})
				}
			}
		});
    };			
    //获取枚举类型的方法
    getIalloctype =(displayName)=>{
        let ialloctype='';
        switch (displayName) {
            case this.state.json['formula-000006'] :  /* 国际化处理： 成本中心分配系数*/
                    ialloctype=1;
                    break;
            case this.state.json['formula-000007']:/* 国际化处理： 产品分配系数*/
                    ialloctype=2;
                    break;
            case this.state.json['formula-000008']:/* 国际化处理： 产品+辅助属性分配系数*/
                    ialloctype=4;
                    break;
            case this.state.json['formula-000009']:/* 国际化处理： 产品成本分类分配系数*/
                    ialloctype=3;
                    break;
            case this.state.json['formula-000010']:/* 国际化处理： 产品基本分类分配系数*/
                    ialloctype=8;
                    break;
            case this.state.json['formula-000011']:/* 国际化处理： 材料分配系数*/
                    ialloctype=7;
                    break;
            default :
                    break;
        }
        return ialloctype;
    }
    ////画组件内容的方法
    _createTabPaneContent = () => {
        let TabPaneContent=this.state.partitiondata;
		if(TabPaneContent.length==0){
            return;
        }	
        return TabPaneContent.map((eve, index) => {
            const { inputSig, displayName, hintMsg } = eve;
            return <li className='tab-content-item'>     
                    <Refer
                        refName={this.state.json['formula-000012']}/* 国际化处理： 分配系数*/
                        refType={'grid'}
                        queryGridUrl={'/nccloud/mapub/refer/cmAllocfacRef.do'}
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
                        queryCondition={{
                            pk_org:this.props.pk_org.refpk,
                            ialloctype :this.getIalloctype(displayName)
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
                    >{this.state.partitiondata&&this._createTabPaneContent()}</ul>
                </div>
            </div>
        );
    }

}

//会计平台组件   const 不可变常量      let 可变 变量
let PartitionDom = createPage({
})(Partition);


export { PartitionDom};
