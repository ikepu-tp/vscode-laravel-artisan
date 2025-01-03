import Common from '../../Common';

declare type ControllerType = 'basic' | 'resource' | 'api';

export default class MakeController extends Common {
  public static async run() {
    // Get the name of the controller to create
    let ctrlName = await this.getInput('Controller Name');
    if (ctrlName.length === 0) {
      this.showError('A controller name is required');
      return;
    }

    // Determine the type of controller (basic, resource, api)
    let type = (await this.getListInput('What type of controller is this?', ['Basic', 'Resource', 'API'])).toLowerCase() as ControllerType;

    let refModel = false;
    let refParent = false;
    let modelToUse = '';
    let parentToUse = '';
    let modelToUseCommands = [];
    if (type != 'basic') {
      // Determine the model reference
      refModel = await this.getYesNo('Should this reference a model?');
      if (refModel) {
        modelToUse = await this.getInput('What is the name of the model?');
        modelToUseCommands.push(`--model=${modelToUse}`);

        // Determine the parent model reference
        refParent = await this.getYesNo('Should this reference a parent model?');
        if (refParent) {
          parentToUse = await this.getInput('What is the name of the parent model?');
          modelToUseCommands.push(`--parent=${parentToUse}`);
        }

        modelToUseCommands.push(`--no-interaction`);
      }
    }

    let typeCommand = type === 'resource' ? '--resource' : type === 'api' ? '--api' : '';
    let command = `make:controller ${ctrlName} ${typeCommand} ${modelToUseCommands.join(' ')}`;
    // let command = `make:controller ${ctrlName} ${isResource ? '--resource' : ''} ${isAPI ? '--api' : ''}`.trim()

    // Generate the controller
    this.execCmd(command, async info => {
      console.log('info', info);
      if (info.err) {
        this.showError('Could not create the controller', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/Http/Controllers/' + ctrlName + '.php');
      }
    });
  }
}
