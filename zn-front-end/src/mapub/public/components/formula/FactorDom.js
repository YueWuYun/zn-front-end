import React, { Component } from 'react';
import { createPage, ajax, base, toast ,getMultiLang} from 'nc-lightapp-front';
import ReferLoader from '../../../public/components/ReferLoader/index.js';
import financeOrgID from '../../../public/components/pubUtils/financeOrgID.js';

//会计平台组件
class Factor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            factordata:[],//产量类的数据的集合。
            currency4: { refpk: '', refname: '', refcode: '' },//财务核算账簿
            currency5: { refpk: '', refname: '', refcode: '' },//责任核算账簿
            currency6: { refpk: '', refname: '', refcode: '' },//（财务组织）核算要素
            currency7: { refpk: '', refname: '', refcode: '' },//（利润中心）核算要素
		};
    }
    componentWillMount() {
        let  callback= (json) =>{
			this.setState({json:json},()=>{
                this.getFactorData.call(this);
                this.loadAccountingbookInfo.call(this)
		       })
	       }
       getMultiLang({moduleId: 'formula', currentLocale: 'simpchn',domainName: 'mapub',callback})

    }


    //查询产量类的方法
	getFactorData = () => {
		var param = {
			oid: null
		};
		ajax({
			loading: true,
			url: '/nccloud/mapub/formula/factor.do',
			data: param,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.setState({
						factordata: data
					})
				}
			}
		});
    };	
    //财务核算账簿
    loadAccountingbookInfo= ()=>{
        let data={
              org:this.props.pk_org.refpk
        }   
            ajax({
                loading: true,
                url: '/nccloud/mapub/formula/accountingbookbyorg.do',
                data: data,
                success: (res) => {
                    let { success, data } = res;
                        if(data&&data[0]){
                            this.setState({
                                currency4: { refpk: data[0].pk_org, refname: data[0].name, refcode: data[0].code }
                            })
                    }

                }
            })
    } 

    //画业签内容
    _createTabPaneContent = () => {
        let TabPaneContent=this.state.factordata;
            if(TabPaneContent.length==0){
                return;
            }
        return TabPaneContent.map((eve, index) => {
            const { inputSig, displayName, hintMsg } = eve;
            return <li
                className='tab-content-item'
                onDoubleClick={//双击事件
                    () => { 
                        this.displayName=displayName;
                        this.inputSig=inputSig;
                        this.props.modal.show('factor'); 
                     }   
                }
            >
                {displayName}
            </li>
        });
    }

    	// 新增节点弹出框内容
	modalContent() {
        return (

            <div className="" id='' >
                {this.inputSig == 'FACTOR' ? <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px' }}>{this.state.json['formula-000001']}</span>&nbsp;{/* 国际化处理： 财务核算账簿*/}
                        <div id=''   >
                            <ReferLoader
                                tag='123'
                                refcode='uapbd/refer/org/AccountBookTreeRef/index.js'
                                value={this.state.currency4}
                                refType="tree"
                                fieldid ={'currency4'}
                                onChange={(value) => {
                                    this.setState({
                                        currency4: value,
                                    });
                                }}
                                placeholder={this.state.json['formula-000002']}/* 国际化处理： 请输入账簿类型*/
                                isMultiSelectedEnabled={false}
                                queryCondition={{
                                    pkrelorg: this.props.pk_org.refpk,
                                    TreeRefActionExt: 'nccloud.web.mapub.driver.action.AccountBookTreeRefMapub',
                                    // type:'fincal'
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center',marginTop: '3%',marginLeft: '7%'  }}>
                        <span style={{ fontSize: '13px' }}>{this.state.json['formula-000003']}</span>&nbsp;{/* 国际化处理： 核算要素*/}
                        <div>
                            <ReferLoader
                                tag='456'
                                // refcode='uapbd/refer/fiacc/FactorRefModel4LiacenterTreeRef/index.js'
                                refcode='uapbd/refer/fiacc/Factor4FinancialTreeRef/index.js'
                                value={this.state.currency6}
                                refType="tree"
                                fieldid ={'currency6'}
                                onChange={(value) => {
                                    this.setState({
                                        currency6: value,
                                    });
                                    // let selectData={
                                    //     id:value.refpk
                                    // }
                                    // this.props.getSelectData(selectData)
                                }}
                                placeholder={this.state.json['formula-000004']}/* 国际化处理： 请输入核算要素*/
                                isMultiSelectedEnabled={false}
                                queryCondition={{
                                    // DataPowerOperationCode: 'fi',//使用权组
                                    // isDataPowerEnable: 'Y',
                                    pk_accbook: this.state.currency4.refpk,
                                    // pk_factorchart:this.state.currency4.refpk
                                }}
                            />
                        </div>
                    </div> </div> :
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }} >
                            <span style={{ fontSize: '13px' }}>{this.state.json['formula-000005']}</span>&nbsp;{/* 国际化处理： 责任核算账簿*/}
                            <div id=''   >
                                <ReferLoader
                                    tag='789'
                                    refcode='uapbd/refer/org/LiabilityBookGridTreeRef/index.js'
                                    value={this.state.currency5}
                                    fieldid={'currency5'}
                                    refType="tree"
                                    onChange={(value) => {
                                        this.setState({
                                            currency5: value,
                                        });
                                    }}
                                    placeholder={this.state.json['formula-000002']}/* 国际化处理： 请输入账簿类型*/
                                    isMultiSelectedEnabled={false}
                                    queryCondition={{
                                            pk_Liaorg: this.props.pk_org.refpk,
                                            pkrelorg: this.props.pk_org.refpk,
                                            //desBillType: val.refcode, 
                                            isDataPowerEnable:false,//是否启用数据权限
    //                                         DataPowerOperationCode: 'fi',//使用权组
                                            AppCode: this.props.getSearchParam('c'),
                                            TreeRefActionExt: 'nccloud.web.mapub.driver.action.LiabilityBookTreeRefMapub',
                                            //TreeRefActionExt: 'nccloud.web.fip.generate.action.AccountBookTreeRef4Fip'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center',marginTop: '3%',marginLeft: '7%'  }} >
                            <span style={{ fontSize: '13px' }}>{this.state.json['formula-000003']}</span>&nbsp;{/* 国际化处理： 核算要素*/}
                            <div>
                                <ReferLoader
                                    tag='1011'
                                    // refcode='uapbd/refer/fiacc/FactorRefModel4LiacenterTreeRef/index.js'
                                    refcode='uapbd/refer/fiacc/FactorRefModel4LiacenterTreeRef/index.js'
                                    value={this.state.currency7}
                                    fieldid={'currency7'}
                                    refType="tree"
                                    onChange={(value) => {
                                        this.setState({
                                            currency7: value,
                                        });
                                        // let selectData={
                                        //     id: value.refpk,
                                        // }
                                        // this.props.getSelectData(selectData)
                                    }}
                                    placeholder={this.state.json['formula-000004']}/* 国际化处理： 请输入核算要素*/
                                    isMultiSelectedEnabled={false}
                                    queryCondition={{
                                        // DataPowerOperationCode: 'fi',//使用权组
                                        // isDataPowerEnable: 'Y',
                                        pk_liabook: this.state.currency5.refpk,
                                        // pk_factorchart:this.state.currency4.refpk
                                    }}
                                />
                            </div>
                        </div>
                    </div>}
            </div>
        )
	};
//复制确定按钮
beSureBtnClick() {
    let  refcode=null;
    let  refname=null;
    let  refpk=null;
    if(this.inputSig=='FACTOR'){//产成本
        if(this.state.currency6.refcode){
            refcode=this.state.currency6.refcode;
            refname=this.state.currency6.refname;
            refpk  =this.state.currency6.refpk;
        }
    }else{//利润中心
        if(this.state.currency7.refcode){
            refcode=this.state.currency7.refcode;
            refname=this.state.currency7.refname;
            refpk  =this.state.currency7.refpk;
        }
    }
    let selectData={
        name: this.displayName+'['+refcode+'~'+refname+']',
        code: this.inputSig,
        id:refpk
    }
    this.props.getSelectData(selectData)
    this.props.setName('{'+this.displayName+'['+refcode+'~'+refname+']'+'}');
}
    render() {
        const { modal } = this.props;
        let { createModal } = modal;
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-table-area">
                    <ul className="tab-content" 
                    >{this.state.factordata&&this._createTabPaneContent()}</ul>
                </div>
                <div>
					{createModal('factor', {
						title: '',// 弹框表头信息
						content: this.modalContent.call(this),//弹框内容，可以是字符串或dom
						className:'junior', //简单型--junior  中型--senior  复杂型--combine
						beSureBtnClick: this.beSureBtnClick.bind(this)  //点击确定按钮事件
					})}

				</div>
            </div>
        );
    }

}

//会计平台组件   const 不可变常量      let 可变 变量
let FactorDom = createPage({
})(Factor);


export { FactorDom};
