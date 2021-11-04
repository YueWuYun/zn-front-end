import React, { Component } from 'react';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
const { NCSelect} = base;
const NCOption = NCSelect.NCOption;
//会计平台组件
class Output extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        //    this.getFormulaData.call(this);
    }
    _createTabPaneContent = (TabPaneContent) => {
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
            >
                {displayName}
            </li>
        });
    }
    render() {
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-table-area" >
                    <ul className="tab-content" fieldid ='content'
                    >{this._createTabPaneContent(this.props.dataact)}</ul>
                </div>
            </div>
        );
    }

}

//会计平台组件   const 不可变常量      let 可变 变量
let OutputDom = createPage({
})(Output);


export { OutputDom};
