//ubGfL6rd8aBf6VnrExtfzQR2pE9iEhNB43GQU17mbXlbWvlp/gfOOJM1PDuqJ1ex
import React, { Component } from 'react';
import { base,createPage } from 'nc-lightapp-front';
const { NCTable } = base;

class SuppliersumeTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        const columns1 = [
            { title: ' ', dataIndex: 'a', key: 'a', width: '20%'},
            { title: this.props.config.title.columns1[1],  dataIndex: 'b', key: 'b', width: '40%'  },
            { title: this.props.config.title.columns1[2], dataIndex: 'c', key: 'c', width: '40%'  },
        ];

        const data1 = [
            { a: '',b: '', c: '', key: '1' },
            { a: '',b: '', c: '', key: '2' },
            { a: '',b: '', c: '', key: '3' },
            { a: '',  b: '', c: '', key: '4' },
        ];
        const columns2 = [
            { title: ' ', dataIndex: 'a', key: 'a', width: 80 },
            { title: this.props.config.title.columns2[1],  dataIndex: 'b', key: 'b', width: '30%' },
            { title: this.props.config.title.columns2[2], dataIndex: 'c', key: 'c', width: '30%'  },
            { title: this.props.config.title.columns2[3], dataIndex: 'd', key: 'd', width: '30%'  },
        ];

        const data2 = [

        ];
        this.config =Object.assign({
            columns1:columns1,
            data1:data1,
            columns2:columns2,
            data2:data2,

        },props.config);

    }
    render () {
        return (
            <div>
                <NCTable bordered={true}
                         columns={this.config.columns1}
                         data={this.config.data1}
                />
                <NCTable bordered={true}
                         columns={this.config.columns2}
                         data={this.config.data2}
                />
            </div>
        )
    }
}

export default  SuppliersumeTable = createPage({})(SuppliersumeTable);



//ubGfL6rd8aBf6VnrExtfzQR2pE9iEhNB43GQU17mbXlbWvlp/gfOOJM1PDuqJ1ex