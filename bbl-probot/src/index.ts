import { Application } from 'probot';
import { newISsue } from './new-issue';

export = (app: Application) => {
  app.on('issues.opened', newISsue);
};
