//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WorkCalendar from '../../workcalendar/main/WorkCalendar';
import {ajax,createPage } from 'nc-lightapp-front';

var Page = createPage({})(WorkCalendar);
var config = {
  title: "10140WORKCALENDAR-000012",//'工作日历-组织',
  nodetype: 'org',
  pagecode: '10140WCO_main',
  appcode: '10140WCO'
};
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65