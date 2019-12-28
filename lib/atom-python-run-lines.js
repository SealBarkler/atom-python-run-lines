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
      'atom-python-run-lines:toggle': () => this.toggle()
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

  toggle() {
    let editor
    var fs = require('fs');
    const terminal = require('./terminal');
    const path = require('path');
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.selectLinesContainingCursors()
      let selection = editor.getSelectedText()
      let pathToFile = path.dirname(editor.buffer.file.path)
      fs.writeFile(pathToFile.concat('/test.py'), selection, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      let object = {
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
      process.on('exit', code => {
        console.log(`Exit code is: ${code}`);
        /*
        fs.unlink('/Users/lars/Documents/test.py', (err) => {
          console.log('arrrrgh')
          if (err) throw err;
          console.log('lines were executed and deleted');
        })
        */
      });

    }
  }

};
