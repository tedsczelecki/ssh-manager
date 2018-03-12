const Events = require('../constants/Events');
const electron = window.require('electron');
const { ipcRenderer } = window.require('electron');

class ElectronService{

  static os = electron.remote.getGlobal('os');

  static setup(store){
    this.addListeners();
  }

  static addListeners(){
  }

  static getInitialState(callback = ()=>{}){
    ipcRenderer.send(Events.GET_INITIAL_DATA);
    ipcRenderer.on(Events.INITIAL_DATA, ( evt, data ) => {
      console.log(data);
      const {settings, ...userData} = data;
      callback( {
        ...(userData || {}),
        settings: {
          name: this.os.hostname(),
          profileImage: '',
          slackId: '',
          defaultPemPath: '',
          ...(settings || {}),
        },
      });
    });
  }

  static saveData(data){
    console.log('SAVING DATA', data);
    ipcRenderer.send(Events.SAVE_DATA, data);
  }

  static openConnection(connection, settings){
    ipcRenderer.send(Events.OPEN_CONNECTION, {connection, settings});
  }
}

export default ElectronService;
