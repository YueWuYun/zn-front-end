//YDxijz8RD+Jt8ml7xl/6ISFo6iq997TBFmeUg55/zHDgZSI+GQosD4jgbybyx7OS
import React, { Component } from 'react';
import './calendar.less'
import classnames from 'classnames';

  // 数据对象中有的属性
  // private java.lang.String pk_workcalendar;
  // private java.lang.String pk_workcalendardate;
  // private nc.vo.pub.lang.UFLiteralDate calendardate;
  // private java.lang.Integer datetype;
  // private java.lang.String ondutytime;
  // private java.lang.String offdutytime;
  // private java.lang.String memo;
  // private java.lang.Integer dataoriginflag;

export default class CalendarCell extends Component {

  /**
   * 构造函数必须传入的参数
   * year  int 年
   * month int 月
   * renderDate function  日期元素渲染函数
   * selected   array(yyyy-mm-dd)     选中的日期
   * selectchange function  选择改变事件
   */
  constructor(props) {
    super(props)
    this.state = {
      dateCfgArray: this.createDateCfg(props),
      altFirst: {
        isselect: true,
        dayNumber: null
      }
    };
  }

  render() {
    var { year, month, selected = [],lang={} } = this.props;
    var { dateCfgArray } = this.state;
  
    var drawCalendarDate = () => {
      let calendarDateArr = dateCfgArray.map( (dateInfo) => {
          if(!dateInfo.dateString) //补空白不做处理
            return <li></li>;
          let baseclassname = classnames({
              'calendar-date-base': true,
              'calendar-date-selected': selected.indexOf(dateInfo.dateString) >= 0
          });
          let basecfg = {
             onClick: (e) => this.onClickDate.bind(this)(e, dateInfo)
          }
          return <li fieldid={dateInfo.dateString} className={`${baseclassname}`} {...basecfg}>{this.props.renderDate ? this.props.renderDate(dateInfo): dateInfo.dayNumber }</li>;
      });
      let continueNum=0;
      while(continueNum < 7-(dateCfgArray.length % 7)){
        calendarDateArr.push(<li fieldid='empty_date'/>)
        continueNum+=1;
      }
      continueNum=0;
      return calendarDateArr;
    };
   
    return (
      <div className="calendar" fieldid="monthselect-area">
        <div className="calendar-header">{this.props.year}{lang['10140WORKCALENDAR-005009']}{this.props.month}{lang['10140WORKCALENDAR-005010']}</div>
        <div className="calendar-wapper">
            <div className="calendar-body lightgrey">
                <ul>
                  <li className="calendar-head">{lang['10140WORKCALENDAR-005017']}</li>
                  <li className="calendar-head">{lang['10140WORKCALENDAR-005011']}</li>
                  <li className="calendar-head">{lang['10140WORKCALENDAR-005012']}</li>
                  <li className="calendar-head">{lang['10140WORKCALENDAR-005013']}</li>
                  <li className="calendar-head">{lang['10140WORKCALENDAR-005014']}</li>
                  <li className="calendar-head">{lang['10140WORKCALENDAR-005015']}</li>
                  <li className="calendar-head">{lang['10140WORKCALENDAR-005016']}</li>
                </ul>
            </div>
            <div className="calendar-body darkgrey">
              <ul style={{overflow: 'hidden'}}>{drawCalendarDate()}</ul>
            </div>
        </div>
      </div>
    )
  }

  onClickDate(e, date){ //此方法里面处理多选，选中问题
    var { dateString } = date,
        { selected = [] } = this.props;
    var selectArray = [], 
        doDates = [],     //操作的日期
        isselect = true; //select unselect
    //设置 alt 快捷键的状态 TODOstart
    let initAltStatue=(isselect=true,dayNumber=null,dateString=null) => {
      this.state.altFirst.isselect = isselect;
      this.state.altFirst.dayNumber = dayNumber;
      this.state.altFirst.dateString = dateString;
    }
    if(e.ctrlKey){
      isselect = selected.indexOf(dateString)  == -1;
      selectArray = isselect ?  [...selected, dateString] : selected.filter( e=> e !=  dateString)
      doDates = [date];
      initAltStatue()  //初始化 alt 键状态 TODO
    }else if(e.altKey){
      if(this.state.altFirst.isselect) {
        initAltStatue(false,date.dayNumber,dateString); // 第一选中状态 TODO
        //将数据加入
        isselect = selected.indexOf(dateString)  == -1;
        selectArray = isselect ?  [...selected, dateString] : selected.filter( e=> e !=  dateString)
        doDates = [date];
      }else{
        selectArray = selected;
        if(this.state.altFirst.dayNumber < date.dayNumber){
          for(let dayNum = this.state.altFirst.dayNumber;dayNum < date.dayNumber;dayNum++){
            let addStr = dayNum+1 < 10 ? '0':'';
            let newDate = this.state.altFirst.dateString.substring(0,8)+addStr+(dayNum+1);
            if(!selectArray.includes(newDate)){
              selectArray.push(newDate)
            }
          }
        }else{
          for(let dayNum = date.dayNumber; dayNum < this.state.altFirst.dayNumber; dayNum++){
            let addStr = dayNum + 1 < 11 ? '0':'';
            let newDate = this.state.altFirst.dateString.substring(0,8)+addStr+(dayNum);
            if(!selectArray.includes(newDate)){
              selectArray.push(newDate)
            }
          }
        }
        initAltStatue()  //初始化 alt 键状态 TODO
      }
    }else{
      isselect = selected.indexOf(dateString)  == -1;
      selectArray = isselect   ? [dateString]: [];
      doDates = [date];
      initAltStatue()  //初始化 alt 键状态 TODO
    }
    this.props.selectchange && this.props.selectchange(isselect,selectArray, doDates, e);
  };

  createDateCfg(props){
    var { year, month, selected = [],renderDate } = props,
        dateCount = new Date( year ,month  , 0).getDate(), //本月天数(取下个月的第一天减一,即上个月天数,屏蔽2月天数取数问题)
        dateCfgArray = [],
        newSelect = [];
        
   
    
    //生成天数配置数组
    for(let i = 1; i <= dateCount; i++){
      let dateString = year + '-'+ (month < 10 ? '0' + month : month ) + '-' + (i < 10 ? '0'+i : i);
      dateCfgArray.push({
        dayNumber: i,
        year: year,
        month: month,
        dateString: dateString
      });
    }

    //补充第一天头尾空白天数的占位
    var headDate = new Date(year, month - 1 , 1),
        emptyCfgArray = [];
    for(let i = 0; i < headDate.getDay(); i++) {
      emptyCfgArray.push({});
    }
    return [...emptyCfgArray, ...dateCfgArray];
  }

  componentWillReceiveProps(nextProps) {
    this.state.dateCfgArray =  this.createDateCfg(nextProps);
		this.setState(this.state);
  }
  
}
//YDxijz8RD+Jt8ml7xl/6ISFo6iq997TBFmeUg55/zHDgZSI+GQosD4jgbybyx7OS