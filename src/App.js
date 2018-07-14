import React, { Component } from 'react';
import db                   from './db';
import cn                   from 'classnames';
import Calendar             from 'rc-calendar';
import zhCN                 from 'rc-calendar/lib/locale/zh_CN';
import moment               from 'moment';
import 'moment/locale/zh-cn';
import 'rc-calendar/assets/index.css';
import './styles/App.css';

const now = moment().locale('zh-cn').utcOffset(8);

const stores = [
  {name:'todos', option: {keyPath: 'title'}},
  {name:'tags', option: {keyPath: 'title'}}
];

const MyDB = new db('upup', 2, stores);

MyDB.open((e) => {
  window.console.log(e);
});


class App extends Component {

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      content: '',
      currentTag: null,
      currentSelectDate: null,
      list: [],
      tags: []
    }
  }

  componentDidMount() {
    window.setTimeout(
      () => {
        this.fetchTodos()
        this.fetchTags()
      }, 500
    );
  }

  fetchTodos() {
    MyDB.getAll('todos', (results) => {
      this.setState({list: results});
    });
  }

  fetchTags() {
    MyDB.getAll('tags', (results) => {
      this.setState({tags: results});
    });
  }

  render() {
    const { list, tags, currentTag, currentSelectDate } = this.state;
    if(!list) return null;
    return (
      <div className="App">
        <div className="ui visible vertical inverted menu sidebar">
          <div className="item">
            <div className="header" onClick={() => this.changeTag()}>所有</div>
          </div>
          <div className="item">
            <div className="header">标签</div>
            <div className="menu">
              {tags.map((o, i) => (
                  <li className="ui item left icon" key={i}
                    onClick={() => this.changeTag(o)}
                  >
                    {o.title}
                  <i className="tag icon"></i>
                </li>
                ))
              }
            </div>
          </div>
          <div className="item calendar">
            <div className="header">日历</div>
            <Calendar
              locale={zhCN}
              formatter='YYYY-MM-DD'
              defaultValue={now}
              showDateInput={false}
              onSelect={this.calendarSelect}
            />
          </div>
        </div>
        <section className="main-page ui form">
          <header>
            <h1 className="ui header">
              {currentTag ? currentTag : (currentSelectDate ? moment(currentSelectDate).format('YYYY年M月D日') : '所有')}
            </h1>
            <form onSubmit={this.submit.bind(this)}>
              <div className="ui left icon input">
                <input type="text"
                  value={this.state.content}
                  onChange={this.inputChange.bind(this)}
                  placeholder="回车 添加新 Todo"
                />
                <i className="plus icon"></i>
              </div>
            </form>
          </header>
          <div className="grouped fields">
            { currentTag ?
              list.map((o, i) => {
                if(o.tag === currentTag) {
                  return(
                    <li key={i} className="field hover-show">
                      <span className="ui checked checkbox">
                        <input type="checkbox" checked={o.status === 'COMPLATE'}
                          onChange={() =>this.checkboxChange(o)}
                        />
                        <label className={cn({'first-three': i < 3, 'complate-status': o.status === 'COMPLATE'})}>
                          <span className="highlight-tag">{'#' + o.tag + ' '}</span>{o.title}
                        </label>
                      </span>
                      {
                        new Date(o.joinDateTime).getFullYear() === moment().year() ?
                        <span className="datetime">{moment.unix(o.joinDateTime/1000).format("M月D日")}</span>
                        :
                        <span className="datetime">{moment.unix(o.joinDateTime/1000).format("YYYY年M月D日")}</span>
                      }
                      <span className="delete-btn" onClick={() => {this.delete(o)}}>
                        <i className="times icon"></i>
                      </span>
                    </li>
                  )
                }
              })
              : (currentSelectDate ?
                list.map((o, i) => {
                  if (moment.unix(o.joinDateTime/1000).format('YYYYMD') === moment(currentSelectDate).format('YYYYMD')) {
                  return (
            <li key={i} className="field hover-show">
              <span className="ui checked checkbox">
                <input type="checkbox" checked={o.status === 'COMPLATE'} onChange={() =>this.checkboxChange(o)} />
                <label className={cn({'first-three': i < 3, 'complate-status': o.status === 'COMPLATE'})}>
                  {o.tag ? <span className="highlight-tag">{'#' + o.tag + ' '}</span> : null}
                  {o.title}
                </label>
              </span>
              {
                new Date(o.joinDateTime).getFullYear() === moment().year() ?
                <span className="datetime">{moment.unix(o.joinDateTime/1000).format("M月D日")}</span>
                :
                <span className="datetime">{moment.unix(o.joinDateTime/1000).format("YYYY年M月D日")}</span>
              }
              <span className="delete-btn" onClick={() => {this.delete(o)}}>
                <i className="times icon"></i>
              </span>
            </li>
            )}
            })
              :
            list.map((o, i) => (
            <li key={i} className="field hover-show">
              <span className="ui checked checkbox">
                <input type="checkbox" checked={o.status === 'COMPLATE'} onChange={() =>this.checkboxChange(o)} />
                <label className={cn({'first-three': i < 3, 'complate-status': o.status === 'COMPLATE'})}>
                  {o.tag ? <span className="highlight-tag">{'#' + o.tag + ' '}</span> : null}
                  {o.title}
                </label>
              </span>
              {
                new Date(o.joinDateTime).getFullYear() === moment().year() ?
                <span className="datetime">{moment.unix(o.joinDateTime/1000).format("M月D日")}</span>
                :
                <span className="datetime">{moment.unix(o.joinDateTime/1000).format("YYYY年M月D日")}</span>
              }
              <span className="delete-btn" onClick={() => {this.delete(o)}}>
                <i className="times icon"></i>
              </span>
            </li>
            )))
            }
          </div>
        </section>
        <section className="right-part">
        </section>
      </div>
    );
  }

  inputChange(e) {
    this.setState({content: e.target.value});
  }

  calendarSelect = (dateTime) => {
    this.setState({
      currentSelectDate: dateTime,
      currentTag: null
});
  }

  changeTag(o) {
    let tag = null;
    if(o) {
      tag = o.title;
    }
    this.setState({
      currentTag: tag,
      currentSelectDate: null
    });
  }

  checkboxChange = (o) => {
    const todo = o;
    if(todo.status !== 'COMPLATE') {
      todo.status = 'COMPLATE';
      todo.complateDateTime = Date.parse(new Date());
    } else {
      todo.status = 'INIT';
      todo.complateDateTime = undefined;
    }

    MyDB.add('todos', todo, (e) => {
      window.console.log(e);
      this.fetchTodos();
    });
  }

  delete(o) {
    MyDB.remove('todos', o.title, () => {
      this.fetchTodos();
    });
  }

  submit(e) {
    e.preventDefault();
    let inputValue = this.state.content;
    const { currentTag } = this.state;
    const matchArr = inputValue.match(/#(.*)\s/);
    let tag;
    if(matchArr) {
      const match = matchArr[0];
      inputValue = inputValue.slice(match.length);
      const item = match.slice(1, match.length-1).trim();
      tag = {title: item};
      MyDB.add('tags', tag, (e) => {
        this.fetchTags();
      });
    };
    this.setState({content: ''});

    const joinDateTime = () => {
      if(this.state.currentSelectDate) {
        return moment(this.state.currentSelectDate).valueOf();
      }
      return Date.parse(new Date());
    }

    const todo = {
      title: inputValue,
      joinDateTime: joinDateTime(),
      complateDateTime: Date.parse(new Date()),
      status: 'INIT',
      tag: (tag && tag.title) || currentTag || ''
    };

    MyDB.add('todos', todo, (e) => {
      window.console.log(e);
      this.fetchTodos();
    });
  }

}

App.propTypes = {
  /* a: PropTypes.object,
  c: PropTypes.object.isRequired,
o: PropTypes.func
   */
};

export default App;


