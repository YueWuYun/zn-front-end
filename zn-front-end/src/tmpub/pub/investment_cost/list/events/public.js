/*n+qYmwPFDxpVKjjLdxU4fUsQHeaGqyq/gqaHIyJZmZmRwR7r84aJ7VnDSMiQ2rv/*/
import { list_table_id, disabled_btn } from "../../cons/constant";
import { searchButtonClick } from "../../../public/events";

/**
 * 根据table的状态（browse或edit）渲染页面上的组件
 * @param {*} props  页面内置对象
 */
export function listButtonVisible (props) {
    let { getStatus } = props.editTable;
    let { setButtonVisible, setMainButton, setPopContent } = props.button;
    let statusOfTable = getStatus(list_table_id);//获取表格状态（编辑or浏览）
    let isBrowse = statusOfTable === "browse";
    if(isBrowse){
        this.setState({
            showSearchBtn: false,
            showSearch: true
        });
        setButtonVisible({Save:false,Cancel:false,Refresh:true,Edit:true});
        setMainButton('Add', true);
        setPopContent('DelLine', '确定要删除吗?');
    }else{
        this.setState({
            showSearchBtn: true,
            showSearch: false
        });
        setButtonVisible({Save:true,Cancel:true,Refresh:false,Edit:false});
        setMainButton('Add', false);
        setPopContent('DelLine', ''); // content传空，操作列按钮就不会弹出气泡
    }
}

//列表选择事件
export function selectedEvent(props, moduleId, record, index, status) {
    let selectDatas = props.editTable.getCheckedRows(this.tableId);
    let disabledBtn = disabled_btn.filter(item => item !== 'refresh');
    if (selectDatas.length === 0){
        props.button.setButtonDisabled(disabledBtn, true);
    }else{
        props.button.setButtonDisabled(disabledBtn, false);
    }
}

//查询按钮点击事件
export function onSearchClick() {
    let status = this.props.editTable.getStatus(this.tableId);
    if ( status === 'edit' ) {
        toast({ color: 'warning', content: '编辑态不允许查询，置灰功能将在下版提供！' });
    } else {
        this.setState({showToast: true});
        searchButtonClick.call( this, this.props );
    }
}
/*n+qYmwPFDxpVKjjLdxU4fUsQHeaGqyq/gqaHIyJZmZmRwR7r84aJ7VnDSMiQ2rv/*/