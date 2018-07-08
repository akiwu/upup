import React, { Component } from 'react';
import db                   from './db';
import cn                   from 'classnames';
import './App.css';

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
    const { list, tags, currentTag } = this.state;
    if(!list) return null;
    return (
      <div className="App">
        <div className="ui visible vertical inverted menu sidebar">
          <div className="item">
            <div className="header">今天</div>
          </div>
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
        </div>
        <section className="main-page ui form">
          <h1 className="ui header">{currentTag ? currentTag : '所有'}</h1>
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
                          {o.title}
                        </label>
                      </span>
                      <span className="delete-btn" onClick={() => {this.delete(o)}}>
                        <i className="times icon"></i>
                      </span>
                    </li>
                  )
                }
              })
            :
            list.map((o, i) => (
            <li key={i} className="field hover-show">
              <span className="ui checked checkbox">
                <input type="checkbox" checked={o.status === 'COMPLATE'} onChange={() =>this.checkboxChange(o)} />
                <label className={cn({'first-three': i < 3, 'complate-status': o.status === 'COMPLATE'})}>
                  {o.title}
                </label>
              </span>
              <span className="delete-btn" onClick={() => {this.delete(o)}}>
                <i className="times icon"></i>
              </span>
            </li>
          ))
          }
        </div>
      </section>
        </div>
    );
  }

  inputChange(e) {
    this.setState({content: e.target.value});
  }

  changeTag(o) {
    let tag = null;
    if(o) {
      tag = o.title;
    }
    this.setState({currentTag: tag});
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
    const inputValue = this.state.content;
    const { currentTag } = this.state;
    const matchArr = inputValue.match(/#(.*)\s/);
    let tag;
    if(matchArr) {
      const match = matchArr[0];
      const item = match.slice(1, match.length-1).trim();
      tag = {title: item};
      MyDB.add('tags', tag, (e) => {
        this.fetchTags();
      });
    };
    this.setState({content: ''});

    const todo = {
      title: currentTag ? ('#' + currentTag + ' ' + inputValue) : inputValue,
      joinDateTime: Date.parse(new Date()),
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


