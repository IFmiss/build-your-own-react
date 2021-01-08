import React from 'react'
import ReactDOM from 'react-dom'

// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <b />
//   </div>
// )

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => 
        typeof child === 'object'
          ? child
          : createTextElement(child)
      )
    }
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

const Dedoo = {
  createElement
};

// const element = Dedoo.createElement(
//   'div',
//   { id: 'foo'},
//   React.createElement('span', null, 'this is span'),
//   Dedoo.createElement("b")
// )

// 相当于执行 Dedoo.createElement
/** @jsx Dedoo.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

const container = document.getElementById("root")
ReactDOM.render(element, container);

// 使用React render会报错
