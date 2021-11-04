//VHVYiANFDBxYrv86Y8RuC7Vm3yj0a+cCALQBuA64cWYVTiWHR7KTRK2DgOm+3vu5
/**
 * 关账检查
 * @author	xuewenc
 */
import { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, promptBox } from 'nc-lightapp-front';
import { SimpleReport } from 'nc-report';

const { NCMessage, NCDropdown, NCMenu, NCCheckbox, NCPopconfirm, NCTree, NCIcon } = base;

class ReportPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			checkRes: {}, //检查结果
			itemvos: {}, //检查项
			//json : (props.config.checkconfig&&props.config.checkconfig.json['101006-000000']) ? props.config.checkconfig.json : {}
		};
	}

	/**
     * react 生命周期函数 组件渲染完后触发事件
     */
	componentDidMount() {
		
	}

    /**
      * searchId: 查询区需要的searchId参数
      * 'vname': 需要附默认值的字段
      * {value: '111'}: 显示值，区间为[]，具体可以对照平台查询区修改
      * 'like': 为oprtype字段值
    */
    setDefaultVal(searchId, props) {
        //查询区默认显示字段值
        //props.search.setSearchValByField(searchId, 'vname', { value: '111' }, 'like');
    }

    render() {
        
		let ownReportParams = {
			appcode: this.props['appcode'],
			pagecode: this.props['pagecode'],
			LinkReport: this.props['LinkReport'],
            userdefObj: this.props['userdefObj'],
            reportName : this.props['reportName'],
            showSearchArea : '2'
		};

        return (
            <div className="table">
                <SimpleReport
					ownReportParams={ownReportParams}
                    showAdvBtn={true}
                    setDefaultVal={this.setDefaultVal.bind(this)}
                />
            </div>
        );
    }

}

/**
 * 创建页面
 */
export default ReportPage;
//VHVYiANFDBxYrv86Y8RuC7Vm3yj0a+cCALQBuA64cWYVTiWHR7KTRK2DgOm+3vu5