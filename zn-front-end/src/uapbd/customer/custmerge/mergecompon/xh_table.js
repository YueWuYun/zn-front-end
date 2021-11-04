//rDhiqK90xoIeCd4KGfS4KMk12oFxeIhgX6XgJzH9q0hG36yfz14726MjVHxzhBS2
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base,createPage } from 'nc-lightapp-front';
const { NCTable } = base;


const columns1 = [
    ];

const data1 = [
    ];
const columns2 = [
    ];

const data2 = [

];

class XTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.config =Object.assign({
            columns1:columns1,
            data1:data1,
            columns2:columns2,
            data2:data2,

        },props.config);
    }
    render () {
        const{ BillHeadInfo}=this.props;
        const{ createBillHeadInfo}=BillHeadInfo
        const{ NCDiv} =base;
        return (
            <div>
                <NCDiv fieldid="compare" areaCode={NCDiv.config.TABLE}>
                    <NCTable bordered={true}
                        columns={this.config.columns1}
                        data={this.config.data1}
                    />
                </NCDiv>
                <NCDiv fieldid="assign" areaCode={NCDiv.config.TABLE}>
                    <NCTable bordered={true}
                        columns={this.config.columns2}
                        data={this.config.data2}
                    />
                </NCDiv>    
            </div>
        )
    }
}

export default  XTable = createPage({})(XTable);



//rDhiqK90xoIeCd4KGfS4KMk12oFxeIhgX6XgJzH9q0hG36yfz14726MjVHxzhBS2