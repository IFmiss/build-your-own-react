import React from 'react'
import ReactDOM from 'react-dom'
// import '@styles/reset.css'

// import App from './app'

// ReactDOM.render(
//   <App/>,
//   document.getElementById('root')
// )

// const ele = <h1 title="foo">Hello</h1>;

// const ele = React.createElement('h1', {
//   title: 'foo',
//   children: 'Hello1'
// })

const ele = {
  type: 'h1',
  props: {
    title: "foo",
    children: "Hello",
  }
}

const root = document.getElementById('root');
// ReactDOM.render(ele, root);
const node = document.createElement(ele.type);
node['title'] = ele.props.title;
const text = document.createTextNode('');
text.nodeValue = ele.props.children;
node.appendChild(text);
root.appendChild(node);
