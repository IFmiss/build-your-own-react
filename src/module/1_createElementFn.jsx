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

const element = React.createElement(
  'div',
  {
    id: 'foo'
  },
  React.createElement("a", null,
    React.createElement('span', null, 'this is span')
  ),
  React.createElement("b")
)

const container = document.getElementById("root")
ReactDOM.render(element, container);
