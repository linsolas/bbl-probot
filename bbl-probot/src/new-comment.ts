import { Context } from 'probot';
import { getConfig } from './utils';

export async function newComment(context: Context) {
  const config = await getConfig(context);
  if (config === null) {
    return;
  }
  const commentator = context.payload.comment.user.login;
  const body = context.payload.comment.body.toLowerCase();
  if (commentator === config.speaker) {
    for (const prop in config) {
      if (prop !== 'speaker' && body.indexOf(prop) > -1) {
        const comment = context.issue({
          body: config[prop]
        });
        await context.github.issues.createComment(comment);
      }
    }
  }
}
