'use babel';

import AtomPythonRunLinesView from './atom-python-run-lines-view';
import { CompositeDisposable } from 'atom';

export default {

  atomPythonRunLinesView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomPythonRunLinesView = new AtomPythonRunLinesView(state.atomPythonRunLinesViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomPythonRunLinesView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-python-run-lines:runLines': () => this.runLines(),
      'atom-python-run-lines:run': () => this.run()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomPythonRunLinesView.destroy();
  },

  serialize() {
    return {
      atomPythonRunLinesViewState: this.atomPythonRunLinesView.serialize()
    };
  },

  run() {
    let editor;
    var fs = require('fs');
    const terminal = require('./terminal');
    const path = require('path');
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.selectAll();
      var selections = editor.getSelections();
      var x;
      var text = '';
      for (x in selections) {
        text += selections[x].getText()
        //text += '\n'
      }
      //console.log(text)
      //let selection = editor.getSelectedText()
      //console.log(selection)
      let pathToFile = path.dirname(editor.buffer.file.path)
      fs.writeFile(pathToFile.concat('/test.py'), text, function (err) {
        if (err) throw err;
        //console.log('Saved!');
      });

      let object = {
          'pause': true,
          'log': true,
          'cp': true,
          'options': {},
          'args': [
              'python',
              pathToFile.concat('/test.py')
          ]
        }

      let shell = new terminal.Shell();
      let spawn = new terminal.SpawnWrapper(shell.object);
      let process = spawn.tty(object);
      /*process.on('SIGINT', function() {
        console.log('mampf')
        process.exit(0)
      });*/
      process.unref();
    };
  },

  runLines() {
    let editor
    var fs = require('fs');
    const terminal = require('./terminal');
    const path = require('path');
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.selectLinesContainingCursors();
      var selections = editor.getSelections();
      var x;
      var text = '';
      for (x in selections) {
        text += selections[x].getText()
        //text += '\n'
      }
      //console.log(text)
      //let selection = editor.getSelectedText()
      //console.log(selection)
      let pathToFile = path.dirname(editor.buffer.file.path)
      fs.writeFile(pathToFile.concat('/test.py'), text, function (err) {
        if (err) throw err;
        //console.log('Saved!');
      });

      let object = {
          'pause': true,
          'log': true,
          'cp': true,
          'options': {},
          'args': [
              'python',
              pathToFile.concat('/test.py')
          ]
        }

      let shell = new terminal.Shell();
      let spawn = new terminal.SpawnWrapper(shell.object);
      let process = spawn.tty(object);
      /*process.on('SIGINT', function() {
        console.log('mampf')
        process.exit(0)
      });*/
      process.unref();
  }
}
};
