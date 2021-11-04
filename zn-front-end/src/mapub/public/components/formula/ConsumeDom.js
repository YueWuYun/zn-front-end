import React, { Component } from 'react';
import { createPage, ajax, base ,high,getMultiLang} from 'nc-lightapp-front';
const { Refer } = high;
const { NCSelect} = base;
const NCOption = NCSelect.NCOption;
//会计平台组件
class Consume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consumedata:[],//产量类的数据的集合。
            currency:'',//当前参照的值
            json: {}
		};
    }
    componentWillMount() {
        let  callback= (json) =>{
			this.setState({json:json},()=>{
                this.getConsumeData.call(this);
		       })
	       }
       getMultiLang({moduleId: 'formula', currentLocale: 'simpchn',domainName: 'mapub',callback})
    }


    //查询产量类的方法
	getConsumeData = () => {
		var param = {
			oid: null
		};
		ajax({
			loading: true,
			url: '/nccloud/mapub/formula/consume.do',
			data: param,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.setState({
						consumedata: data
					})
				}
			}
		});
    };
    //画组件里面的内容
    _createTabPaneContent = () => {
        let TabPaneContent=this.state.consumedata;
        if(TabPaneContent.length==0){
            return;
        }
        return TabPaneContent.map((eve, index) => {
            const { displayName,inputSig, hintMsg } = eve;
                //如果是参照了类型
                if(inputSig=='ASSIN_STUFF_BOM_QUOTA'||inputSig=='ASSIGN_STUFF_ACTUAL_NUMBER'
                    ||inputSig=='ASSIGN_STUFF_ACTUAL_MONEY'){
                   return <li className='tab-content-item'>
                        <Refer
                            refName={this.state.json['formula-000000']}/* 国际化处理： 材料子项*/
                            fieldid ={'materialgrid'}
                            refType={'gridTree'}
                            queryTreeUrl={'/nccloud/uapbd/ref/MaterialClassTreeRef.do'}
                            queryGridUrl={'/nccloud/uapbd/ref/MaterialMultiVersionGridRef.do'}
                            value={this.state.currency}
                            onChange={val => {
                                this.setState({
                                    currency: val
                                });
                                let selectData={
                                    name: hintMsg+'['+val.refcode+'~'+val.refname+']',
                                    code: inputSig,
                                    id:val.refpk
                                }
                                this.props.getSelectData(selectData)
                                this.props.setName('{'+hintMsg+'['+val.refcode+'~'+val.refname+']'+'}') 

                            }}
                            treeConfig={{ name: [this.state.json['formula-000018'], this.state.json['formula-000019']], code: ['refcode', 'refname'] }}
                            rootNode={ { refname: this.state.json['formula-000020'], refpk: 'root' } }
                            type={'dropDown'}
                            queryCondition={{
                                pk_org: this.props.pk_org.refpk
                            }}
                            clickContainer={<span>{displayName}</span>}
                        />
		            </li>
                
                }else{//如果是普通
                    return<li 
                        className='tab-content-item' onDoubleClick={//双击事件
                         () => { 
                                let selectData={
                                    name: hintMsg,
                                    code: inputSig,
                                    id:undefined
                                }
                                this.props.getSelectData(selectData)
                                 this.props.setName('{'+hintMsg+'}') 
                             } }>
                        <span fieldid ='displayname'>{displayName}</span>
                    </li>
                } 
        });
    }
    render() {
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-table-area" >
                    <ul className="tab-content"  fieldid='content'
                    >{this.state.consumedata&&this._createTabPaneContent()}</ul>
                </div>
            </div>
        );
    }

}

//消耗类   const 不可变常量      let 可变 变量
let ConsumeDom = createPage({
})(Consume);


export { ConsumeDom};
