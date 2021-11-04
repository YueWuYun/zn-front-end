//I3iYncOSmVPXa7Wq80acNQi7iXThnIkee5ZJ/kVSZpEHH6Ay415+CGY/9bzFJFl0
import {Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,table} from 'nc-lightapp-front';
import { setTimeout } from 'timers';

const urls = {
    queryUrl:"/nccloud/uapbd/accsystem/queryAccFieldCtrl.do"
};
const pageCode = '10140ACCSB_accfieldctrl';
const gridId='accfieldcode';
let ctrlareatypeOptions = {0 : '严格控制', 1 : '部分控制', 2 : '不控制'};

/**
 * 科目属性控制策略
 */
class AccFiledTable extends Component{

    constructor(props){
        super(props);

        this.state = {
            json : props.config.json,  //多语
            inlt : props.config.inlt
        };
    }

    componentDidMount(){
        
        ctrlareatypeOptions = {0 : this.state.json['10140ACCSB-000000'], 1 : this.state.json['10140ACCSB-000001'], 2 : this.state.json['10140ACCSB-000002']};/* 国际化处理： 严格控制,部分控制,不控制*/
        
        this.getdata(this.props);
    }

    getdata = (props) => {
        let param={
            pk : this.props.config.pk,
        }
        ajax({
            url: urls['queryUrl'],
            data:param,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(res.hasOwnProperty('data')){
                        ctrlareatypeOptions = data['ctrlareatypeOptions'];//控制策略options
                        props.editTable.setTableData(gridId,data['grid'][gridId]);
                        props.editTable.setStatus(gridId,'edit');
                    }else{
                        let nulldata = {rows:[]};
                        props.editTable.setAllTableData(gridId,nulldata);
                    }
                }
            }
        })
    }

    //表格编辑前事件  props 内部方法，moduleId(区域id), item(模版当前列的项), index（当前索引）,value（当前值）, record（行数据）
	onBeforeEvent(props,moduleId,item,index,value,record){
		let key = item['attrcode'];
		if(key==='ctrlstrategy'){
            
            let valuelist = record['values']['valuelist']['value'];
            if(!valuelist || valuelist.length===0){
                return false;
            }
            let options = [];
            let keys = valuelist.split(",");
            keys.map((key, index) => {
                options[index] = {
                    'display' : ctrlareatypeOptions[key],
                    'value'   : key
                };
            });

            let meta = props.meta.getMeta();
            /**加载参数名称options的值**/
            meta[gridId].items.find((item) => item.attrcode == 'ctrlstrategy').options = options;
            props.meta.setMeta(meta);

		}
		return true;
	}



    render(){
        const {editTable} = this.props;
        const {createEditTable} = editTable;
        return(
            <div>
                <div className="card-area">
                    {createEditTable(gridId, {
                        showIndex : true,
                        onBeforeEvent : this.onBeforeEvent.bind(this)
                    })}
                </div>
            </div>
        );
    }
}

export default AccFiledTable;

//I3iYncOSmVPXa7Wq80acNQi7iXThnIkee5ZJ/kVSZpEHH6Ay415+CGY/9bzFJFl0