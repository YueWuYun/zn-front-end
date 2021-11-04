import React, { Component } from 'react';
import { createPage, ajax, base, toast ,getMultiLang} from 'nc-lightapp-front';
const { NCSelect} = base;
import TransferInTableCell from '../../../public/components/TransferInTableCell';
const NCOption = NCSelect.NCOption;
//会计平台组件
class Values extends Component {
    constructor(props) {
        super(props);
        this.Info = {
			allButtonsKey :[],//保存所有的按钮
			targetKeys:'',//材料价格来源穿梭框右边的值
			dataSource:[],//材料价格来源穿梭框左边的值
			index : null,//当前选中行号
		}
        this.state = {
            json: {},
            valuesdata:[],//产量类的数据的集合。
            showTransModal: false,
            curdisplayName:''//当前选择中的价值类的值
		};	
    }
    componentWillMount() {
        let  callback= (json) =>{
			this.setState({json:json},()=>{
                this.getValuesData.call(this);
		       })
	       }
       getMultiLang({moduleId: 'formula', currentLocale: 'simpchn',domainName: 'mapub',callback})
    }

    	//查询产量类的方法
    getValuesData = () => {
		var param = {
			oid: null
		};
		ajax({
			loading: true,
			url: '/nccloud/mapub/formula/values.do',
			data: param,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.setState({
						valuesdata: data
					})
				}
			}
		});
    };
    
    //查询穿梭框的值
    getTransferData =(url) =>{
                //首先获取模态框中的值
                let dataSource = [];
                ajax({
                    url, //'/nccloud/mapub/formula/getTransferData.do',
                    data: {pk_org: this.props.pk_org.refpk},//获取form表单中的pk_org,集团节点为空,
                    async:false,
                    success: (res) => {
                        if (res.data) {
                            dataSource = res.data;
                        }
                    }
                });
                //display: "手工录入,下层卷积"  value: "1,8"                
                this.Info.targetKeys = '';//公式之前的值
                this.Info.dataSource = dataSource;
    }

    //画组件内容的方法
    _createTabPaneContent = () => {
        let TabPaneContent=this.state.valuesdata;
		if(TabPaneContent.length==0){
            return;
        }	
        return TabPaneContent.map((eve, index) => {
            const { inputSig, displayName, hintMsg } = eve;
                         //如果是穿梭框
                         if(inputSig=='REFERENCE_SALE_PRICE'||inputSig=='PRICE_LIBRARY'){
                        return <li className='tab-content-item'
                                    onDoubleClick={//双击事件
                                        () => { 
                                            this.inputSig=inputSig;
                                            if(inputSig=='REFERENCE_SALE_PRICE'){
                                                this.getTransferData('/nccloud/mapub/formula/getTransferData.do');
                                                this.setState({
                                                    modalTitle: this.state.json['formula-000014'], /* 国际化处理： 销售组织*/
                                        
                                                })
                                            }
                                            if(inputSig=='PRICE_LIBRARY'){
                                                this.getTransferData('/nccloud/mapub/formula/getTransferDataExt.do');
                                                this.setState({
                                                    modalTitle: this.state.json['formula-000015'],/* 国际化处理： 价格库*/
                                                })
                                            }
                                            this.displayName=displayName;
                                            this.closeTransferModal('showTransModal', true); 
                                     }}
                                >
                                <span>{displayName}</span>
                             </li>
                     
                     }else{//如果是普通
                         return<li 
                             className='tab-content-item' onDoubleClick={//双击事件
                              () => { 
                                    let selectData={
                                        name: hintMsg ,
                                        code:inputSig,
                                        id:undefined
                                    }
                                this.props.getSelectData(selectData)
                                  this.props.setName('{'+hintMsg+'}') 
                                  } }>
                             <span>{displayName}</span>
                         </li>
                     } 
        });
    }
//组件内部 关闭组件的方法
    closeTransferModal = (key, value) => {
        this.setState({
            [key]: value
        })
    }
//组装穿梭框的数据
AssembleData =  (codearr,namearr)=>{
    let result='';
    if(codearr&&codearr.length>0){
        codearr.map((eve, index) => {
            result+=eve+'~'+namearr[index].trim()
            if(index<codearr.length-1){
                result+=','
            }
        })
    }
    console.log('result>>>>>>>>>>>>>>>>>>>>',result)
return result;
}

//画画
    render() {
        const { modal } = this.props;
        let { createModal } = modal;
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-table-area"  >
                    <ul className="tab-content"  fieldid ='content'
                    >{this.state.valuesdata&&this._createTabPaneContent()}</ul>
                </div>
                <div>
                    {
                        this.state.showTransModal && <TransferInTableCell
                        closeTransferModal={this.closeTransferModal}
                        keysStr={this.Info.targetKeys || ''}
                        dataSource={this.Info.dataSource}
                        // notFoundContent={'暂无数据'}
                        modalTitle={this.state.modalTitle}//"材料价格来源"
                        onTargetKeysChange={(str) => {
                            let codearr=str.value.split(',');
                            let namearr=str.display.split(',');
                            this.Info.targetKeys=codearr;
                            let  result=this.AssembleData(codearr,namearr)
                            if(str.value){
                                this.props.setName('{'+this.displayName+'['+result+']'+'}') ;
                            }else{
                                this.props.setName('') ;
                            }
                            let selectData={
                                name:this.displayName+'['+result+']',
                                code: this.inputSig,
                                id:str.pkvalue
                            }
                            this.props.getSelectData(selectData)
                        }}
                        checkout ={(valObj) =>{
                            let newValue = valObj.value;
                            let values = newValue.split(",");
                            if(values.indexOf("1") !=-1 && values.length >1){
                                // toast({ color: 'warning', content: '手工录入与其他价格来源互斥，请重新选择！'});/* 国际化处理： 手工录入与其他价格来源互斥，请重新选择！*/
                                return false;
                            }
                            return true;
                        }}
                        disabled={false}
                        titles={[ this.state.json['formula-000016'], this.state.json['formula-000017'] ]}/* 国际化处理： 可选*/  /* 国际化处理： 已选*/
                    />
                    }
				</div>
            </div>
        );
    }

}

//会计平台组件   const 不可变常量      let 可变 变量
let ValuesDom = createPage({
})(Values);


export { ValuesDom};
