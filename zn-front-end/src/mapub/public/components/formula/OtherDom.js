import React, { Component } from 'react';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
const { NCSelect} = base;
const NCOption = NCSelect.NCOption;
//会计平台组件
class Other extends Component {
    constructor(props) {
        super(props);
        this.state = {
			otherdata:[],//产量类的数据的集合。
		};	
    }
    componentWillMount() {
          this.getOtherData.call(this);
    }
//查询产量类的方法
getOtherData = () => {
    var param = {
        oid: null
    };
    ajax({
        loading: true,
        url: '/nccloud/mapub/formula/other.do',
        data: param,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                this.setState({
                    otherdata: data
                })
            }
        }
    });
};			
    //画组件内容的方法
    _createTabPaneContent = () => {
        let TabPaneContent=this.state.otherdata;
		if(TabPaneContent.length==0){
            return;
        }	
        return TabPaneContent.map((eve, index) => {
            const { inputSig, displayName, hintMsg } = eve;
            return <li
                className='tab-content-item'
                onDoubleClick={//双击事件
                    () => { 
                        let selectData={
                            name: hintMsg,
                            code: inputSig
                        }
                        this.props.getSelectData(selectData)
                        this.props.setName('{'+hintMsg+'}') 
                    }   
                }
                fieldid ='displayname'>
                {displayName}
            </li>
        });
    }
    render() {
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-table-area">
                    <ul className="tab-content"  fieldid ='content'
                    >{this.state.otherdata&&this._createTabPaneContent()}</ul>
                </div>
            </div>
        );
    }

}

//会计平台组件   const 不可变常量      let 可变 变量
let OtherDom = createPage({
})(Other);


export { OtherDom};
