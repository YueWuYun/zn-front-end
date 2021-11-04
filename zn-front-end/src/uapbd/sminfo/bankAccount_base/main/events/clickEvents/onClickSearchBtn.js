//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9
import {cardCache,toast} from 'nc-lightapp-front';
import Utils from '../../../../../public/utils/index';
const {queryToastFunc} = Utils;
const {setDefData}  =cardCache
/**
 * 银行账户列表查询区按钮点击事件
 * @param props
 * @param data
 */
export default  function onClickSearchBtn(props,data){
    const _this = this;
    let searchData = _this.props.search.getAllSearchData(_this.config.searchId);
    if( typeof (searchData) !=='undefined'&&searchData&&searchData.conditions) {
        setDefData('searchVal',_this.config.datasource,searchData);
        _this.loadGridData(_this.getLoadDataParam(_this.props),(param)=>{
            queryToastFunc.call(this)(param);
            this.initializeButtons();
        });
    }else{
        return;
    }
    //缓存查询区数据
}

//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9