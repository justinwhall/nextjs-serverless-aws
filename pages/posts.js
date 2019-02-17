import React, { Component } from 'react'

export default class extends Component {
  static async getInitialProps (context) {
    console.log(context.query);
    return { postId: context.query.id }
  }

  render () {
    return (
      <div>
        <h1>My blog post #{this.props.postId}</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    )
  }
}
