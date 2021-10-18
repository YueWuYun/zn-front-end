import {base} from 'nc-lightapp-front';
import React, { Component } from 'react';
let { NCTable:BaseNCTable ,NCDiv,NCTooltip} = base;
var EMPTY_FN = function(){};

class NCTable  extends Component {
    constructor(props) {
        super(props);
        this.tooltipcfg = {
            className:'tooltip-word-color',
            placement:'top',
            delay:1
        };
        this.state = {
            newcols:[]
        };
        
    }

    // NCCLOUD-167511 监听props发生改变后重新渲染表格
    componentWillReceiveProps(newProps){
        this.setState({newcols:[]});
    }

    initColumns =function() {
        let {newcols} = this.state;
        var { columns,title } = this.props; //<props替换标记> 
        var newcolumns = [...columns];  
        if(newcols && newcols.length>0){
            return;
        }
        //单非要求第一列的序号必须是固定列（单独一个表格。。。。。。）
        let fixedFieldNames = ['index','numberindex','id'];
        let firstCol = newcolumns[0].dataIndex || newcolumns[0].attrcode;
        fixedFieldNames.includes(firstCol) && Object.assign(newcolumns[0],{fixed:'left'});

        var cols = newcolumns.map((col)=>{
            let origRender = col.render;
            
            let render = function(text,record,index){
                
                return (
                    <NCTooltip {...this.tooltipcfg} overlay={text}>
                        <span fieldid={col.dataIndex} title={''}>{origRender?origRender(text,record,index):text}</span>
                    </NCTooltip>
                )
            }
            col.render = render.bind(this);
            col.title = col.title && col.title.type === 'span' ? col.title:<span fieldid={col.dataIndex}>{col.label || col.title}</span>;
            return col;
        });
        this.setState({newcols:cols});
        return cols;
    }
    
    render(){
        let {columns} = this.props;
        let cols = columns && columns.length>0 && this.initColumns();
        let {newcols} = this.state;
        let resultcols = cols || newcols;
        let newProps = {
            ...this.props,
            columns:resultcols
        }
        return (
                <NCDiv fieldid={this.props.fieldid || this.props.tableId || "basetable_comp"} areaCode={NCDiv.config.TableCom}>
                    {resultcols && resultcols.length>0 && <BaseNCTable {...newProps}/>}
                </NCDiv>
        );
    }
}

export default NCTable