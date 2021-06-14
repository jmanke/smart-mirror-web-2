import WidgetsGapiIndex from '../gapi';

interface WidgetsTasksIndexArgs {
  maxTasks: number;
}

export default class WidgetsTasksIndex extends WidgetsGapiIndex {
  constructor(owner: any, args: WidgetsTasksIndexArgs) {
    super(owner, args);

    this.startGetItems(() => this.getTasks(args.maxTasks));
  }

  async getTasks(maxTasks: number) {
    return this.googleApiService.getTasks({
      maxResults: maxTasks,
    });
  }
}
