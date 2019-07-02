import { Application } from 'probot';
import { newIssue } from './new-issue';
import { newComment } from './new-comment';

export = (app: Application) => {
  app.on('issues.opened', newIssue);

  app.on('issue_comment.created', newComment);
};
