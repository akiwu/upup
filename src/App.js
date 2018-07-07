import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import logo                 from './logo.svg';
import db                   from './db';
import './App.css';

const stores = [
  {name:'todos', option: { autoIncrement: true }}
];

const MyDB = new db('upup', 1, stores);

MyDB.open((e) => {
  window.console.log(e);
  console.log(e);
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
      () => {
        MyDB.getAll('todos', (results) => {
          if(Array.isArray(results)) {
            const list = [];
            results.map((o, i) => {
              o[i+1] && (o[i+1].value !== undefined) && list.push(o[i+1].value);
            });
            this.setState({list});
          }
        });
      }, 100
    );
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
        <h1>今天</h1>
        <h2>最重要的三件事</h2>
        <h2>其他</h2>
        <form onSubmit={this.submit.bind(this)}>
          <input type="text" value={this.state.content} onChange={this.inputChange.bind(this)}/>
        </form>
        {
        list.map((o, i) => (
              <li key={i}>{o}</li>
                ))
        }
        1、press enter add new todo item
        2、click midify
        3、Three things before on important inside
      </div>
    );
  }

  inputChange(e) {
    this.setState({content: e.target.value});
  }

  submit(e) {
    e.preventDefault();
    const inputValue = this.state.content;
    let {list} = this.state;
    list.push(inputValue);

    this.setState({content: '', list});

    MyDB.add('todos', {value: inputValue}, (e) => {
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


