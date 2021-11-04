//sYvGdC4Xck029tNJd5C93qMUPIqv0u77D436/+jvDUg/EbRSxdfybESxp2Mek2jV
import React, { Component } from 'react';
import { high} from 'nc-lightapp-front'
const { Transfer } = high

/**
 * 封装平台弹出框组件
 */
export default class Transform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetKeys: props.targetKeys || []
        };
    }
    onTargetKeysChange = (targetKeys) => {
        this.setState({
            targetKeys
        },this.setAllTargetKeys.bind(this));
    };

    setAllTargetKeys(){
        let AllData=this.props.dataSource;
        let {targetKeys:targetSelectedKeys} =this.state;
        let AllTargetData=[];
        if(targetSelectedKeys){
            for(let i=0;i<targetSelectedKeys.length;i++){
                let selectData=AllData.filter(item=>item.key == targetSelectedKeys[i]);
                if(selectData && selectData.length>0 && selectData.key != ''){
                    AllTargetData.push(selectData[0].data)
                }
            }
        }
        this.props.onSelectChange(AllTargetData);
    }

    render() {
        const { targetKeys } = this.state;
        const transferProps = {
            dataSource:this.props.dataSource,
            targetKeys,
            onTargetKeysChange: this.onTargetKeysChange,
            checkable: true,
            showSearch:true,
            titles:this.props.title?[...this.props.title]:['item1','item2'],
            className: 'my-transfer-demo',
            showMoveBtn: true,
            lazy:{container:"modal"},
            listRender: ({ key, title }) => title
        };
        return <Transfer {...transferProps} />
    }
}

//sYvGdC4Xck029tNJd5C93qMUPIqv0u77D436/+jvDUg/EbRSxdfybESxp2Mek2jV