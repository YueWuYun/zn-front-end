import React, {Component, Fragment} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import Utils from '../../utils'
import "./index.less";
const { NCRow, NCCol, NCProgressBar } = base;

class ProgressToast extends Component{
    constructor(props){
        super(props);
        this.state = {
            dealPro: 0
        }
    }

    componentDidMount() {
        this.begDealingProgress();
    }

    componentWillReceiveProps(nextProps, nextState) {
        // console.log(nextProps.initProNum, this.props.initProNum)
        // if(!!nextProps.initProNum && nextProps.initProNum != this.props.initProNum) {
        //     this.begDealingProgress();
        // }
    }

    begDealingProgress() {//获取保存tree后台处理进度
        const {url, paramObj} = this.props;
        const {dealPro} = this.state;
        let timer = null,
            that = this;
        if(dealPro <= 10) this.setState({dealPro: 10})
        // timer = setTimeout( () => {
            ajax({
                data:paramObj,
                url:url,
                loading: false,
                success:function(res){
                    let{Success,data} = res;
                    that.setState({
                        dealPro: data
                    })
                    if(data < 100) {
                        that.begDealingProgress();
                    }
                },
                error: function(res) {
                    that.setState({
                        dealPro: 100
                    })
                }
            })
        
    }

    handlePro = () => {
        const {initProNum} = this.props;
        let {dealPro} = this.state;
        console.log({initProNum})
        if(dealPro == 100 && initProNum != 0) {//处理后台进度处理与操作不统一问题
            dealPro = 99;
        }
        return dealPro;
    }

    render() {
        let dealPro = this.handlePro();
        return (
            <Fragment>
                {dealPro == '0' || dealPro == '100' ? null : <section className="toast-progress-container">
                    <NCProgressBar active now = {dealPro} label={`${dealPro}%`} />
                </section>}
            </Fragment>
        )
    }
}

//指定默认值:
ProgressToast.defaultProps = {
    frontProgress: false,//进度由前端控制返回
    ajaxProgress: true,//进度由后端控制返回
    url: '',//请求后台ajax接口地址
    paramObj: {}//请求后台接口传递参数
};

ProgressToast = createPage({
    // initTemplate: initTemplate,
})(ProgressToast);

export default ProgressToast;
