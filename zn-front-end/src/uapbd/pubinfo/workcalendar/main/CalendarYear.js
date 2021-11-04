//S7Hx12bdhRN33WO3p6fBBFHfjzmbm+aSzGiZqSi7GYw9iZvfqUM9gf591Bm5CBq4
import React, { Component } from 'react';
import CalendarMonth from './CalendarMonth.js'

// //日期的处理方法,通过mix方式融合到对象
// var dateMethod = {
//   getYearMonthString : function(){
//     return this.calendardate.substr(0,7);  // yyyy-mm-dd -> yyyy-mm
//   },
//   getYearString: function(){
//     return this.calendardate.substr(0,4);  // yyyy-mm-dd -> yyyy
//   },
//   getMonthString: function(){
//     return this.calendardate.substr(5,2);  // yyyy-mm-dd -> mm
//   },
//   getDateString: function(){
//     return this.calendardate.substr(8,2);  // yyyy-mm-dd -> dd
//   },
//   getYearInt: function(){
//     return parseInt(this.getYearString()); 
//   },
//   getMonthInt: function(){
//     return parseInt(this.getMonthString()); 
//   },
//   getDateInt: function(){
//     return parseInt(this.getDateString()); 
//   },
//   getWeekDayNum:function(){
//     return new Date(this.getYearInt(), this.getMonthInt() - 1 , this.getDateInt()).getDay();
//   }
// }


export default class Calendar extends Component {
  /**
   *  构造参数     类型   必输  描述 
   *  years       array  *    需要显示的年份
   *  year string      当前显示的年份
   *  selected    array  *    选中的日期(yyyy-mm-dd)
   *  renderDate function     日期元素渲染函数
   */
  constructor(props) {
    super(props);
  }

  render() {
    var { selected, renderDate,year,selectchange,lang} = this.props;

    var drawYearOfMonthCalendar = () => {
      var results = []
      for( let i = 1; i <= 12; i++ ) {
        var cfg = {
            year: year,
            month: i,
            renderDate: renderDate,
            selected: selected,
            selectchange:selectchange,
            lang:lang
        };
        results.push(<li fieldid={'month'+ i} className="work-calendar-main-container-cell"><CalendarMonth {...cfg} /></li>);
      }
      return results;
    };

    return (
      <div>
        <ul className="work-calendar-main-container">
          {drawYearOfMonthCalendar()}
        </ul>
      </div>
    )
  }
  componentWillReceiveProps(nextProps) {
   // this.state.year = nextProps.year || nextProps.years[0];
	//	this.setState(this.state);
	}
}
//S7Hx12bdhRN33WO3p6fBBFHfjzmbm+aSzGiZqSi7GYw9iZvfqUM9gf591Bm5CBq4