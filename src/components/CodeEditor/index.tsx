//此组件可以设置initvalue, 但是不能通过props.onChange来传值
import React from 'react';
import MonacoEditor from 'react-monaco-editor';


interface props {
  defaultValue?: string,
  value?: string,
  type: string,
  width: number,
  height: number,
  onChange: (str: string) => void
}

interface state {
  type: string
}

class App extends React.Component<props, state>{
  constructor(props: any) {
    super(props);
    this.state = {
      type: this.props.type || 'editorChange'
    }
  }

  ref = null

  // editorDidMount(editor:any, monaco:any) {
  // }

  onChange = (value: string) => {
    this.props.onChange(value)
  }

  render() {
    const options = {
      fontSize: 18
    }
    return (
      <MonacoEditor
        width={this.props.width || 800}
        height={this.props.height || 600}
        // ref="monaco"
        language="json"
        theme="hc"
        defaultValue={this.props.value}
        options={options}
        onChange={this.onChange}
      // editorDidMount={this.editorDidMount}
      />
    );
  }
}


export default App
