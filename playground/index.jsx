import React from 'react';
import ReactDOM from 'react-dom';
// import ColorPicker from 'braft-extensions/dist/color-picker';
// import Table from 'braft-extensions/dist/table';
// import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
// import Emoticon, { defaultEmoticons } from 'braft-extensions/dist/emoticon';
// import { convertHTMLToRaw } from '../src/convert'
// import BraftEditor from '../src_old';
import BraftEditor from '../src/index';
// import '../dist/index.css';

// import 'braft-extensions/dist/emoticon.css';
// import 'braft-extensions/dist/color-picker.css';
// import 'braft-extensions/dist/table.css';
// import 'braft-extensions/dist/code-highlighter.css';

/*
const emoticons = defaultEmoticons.map((item) =>
  require(`braft-extensions/dist/assets/${item}`),
);
const hooks = {
  'set-image-alignment': () => {
    return 'left';
  },
};
 */

/*
BraftEditor.use([
  Emoticon({
    emoticons: emoticons,
  }),
  // ColorPicker({
  //   theme: 'dark'
  // }),
  Table(),
  CodeHighlighter(),
]);
const initContent =
'<p data-foo="adasd" class="my-classname"><img src="https://www.baidu.com/img/bd_logo1.png?where=super" /><span style="color:#e25041;">asdasdasda</span>asdads</p>';
*/


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // readOnly: false,
      editorState: BraftEditor.createEditorState(null),
    };
  }

  handleChange = (editorState) => {
    this.setState({ editorState }, () => {
      this.logHTML();
      // this.logRAW();
    });
  };

  logHTML = () => {
    const html = this.state.editorState.toHTML();
    console.log(html)
  };

  logRAW = () => {
    console.log(this.state.editorState.toRAW());
  };

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <div className="demo" id="demo">
          <BraftEditor
            // colors={['#e25041']}
            // headings={['header-one', 'unstyled']}
            placeholder="Hello World!"
            language="en"
            // fixPlaceholder
            allowInsertLinkText
            triggerChangeOnMount={false}
            value={editorState}
            onChange={this.handleChange}
            // readOnly={readOnly}
            // hooks={hooks}
            // imageResizable
            // imageEqualRatio
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
