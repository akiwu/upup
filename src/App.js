import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import logo                 from './logo.svg';
import db                   from './db';
import './App.css';

const stores = [
  {name:'todos', option: {keyPath: 'title'}}
];

const MyDB = new db('upup', 1, stores);

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
      list: []
    }
  }

  componentDidMount() {
    window.setTimeout(
      this.fetchTodos.bind(this), 100
    );
  }

  fetchTodos() {
    MyDB.getAll('todos', (results) => {
      const list = [];
      if(Array.isArray(results)) {
        results.map(o => {
          list.push(Object.keys(o)[0]);
        });
        this.setState({list});
      }
    });
  }

  render() {
    const {list} = this.state;
    if(!list) return null;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <section className="main-page">
          <h1>今天</h1>
          <h2>最重要的三件事</h2>
          <h2>其他</h2>
          <form onSubmit={this.submit.bind(this)}>
            <input type="text" value={this.state.content} onChange={this.inputChange.bind(this)}/>
          </form>
          {
          list.map((o, i) => (
                <li key={i}>
                  {o}<span onClick={() => {this.delete(o)}}>❎</span>
                </li>
                  ))
          }

          </section>
        </div>
    );
  }

  inputChange(e) {
    this.setState({content: e.target.value});
  }

  delete(title) {
    MyDB.remove('todos', title, () => {
      this.fetchTodos();
    });
  }

  submit(e) {
    e.preventDefault();
    const inputValue = this.state.content;
    let {list} = this.state;
    list.push(inputValue);

    this.setState({content: '', list});

    MyDB.add('todos', {title: inputValue}, (e) => {
      window.console.log(e);
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


