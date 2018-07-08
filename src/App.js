import React, { Component } from 'react';
import logo                 from './logo.svg';
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
      list: [],
      tags: []
    }
  }

  componentDidMount() {
    window.setTimeout(
      this.fetchTodos.bind(this), 500
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
    const {list, tags} = this.state;
    if(!list) return null;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <section className="main-page ui form container">
          <h1 className="ui header">今天</h1>
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
          {
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
        {tags.map(o => (
            <li>{o.title}</li>
          ))
        }
          </section>
        </div>
    );
  }

  inputChange(e) {
    this.setState({content: e.target.value});
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
    const matchArr = inputValue.match(/#(.*)\s/);
    if(matchArr) {
      const match = matchArr[0];
      const item = match.slice(1, match.length-1);
      const tag = {title: item};
      MyDB.add('tags', tag, (e) => {
        this.fetchTags();
      });
    };
    this.setState({content: ''});

    const todo = {
      title: inputValue,
      joinDateTime: Date.parse(new Date()),
      complateDateTime: Date.parse(new Date()),
      status: 'INIT'
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


