import * as React from 'react';

export interface HelloProps {
  compiler: string;
  framework: string;
}

export class Hello extends React.Component<HelloProps, undefined> {
  render() {
    return (
      <h1>
        Hellzo from {this.props.compiler} and {this.props.framework}!
      </h1>
    );
  }
}
