import { Context } from 'probot';
import { getConfig } from './utils';

export async function newISsue(context: Context) {
  const config = await getConfig(context);
  console.log('CONFIG', config)
  if (config === null) {
    return;
  }
  const creator = context.payload.issue.user.login;
  const title = context.payload.issue.title;
  console.log('>>', creator, '//', config.speaker)
  if (
    title.toLowerCase().indexOf('bbl ') > -1 &&
    creator === config.speaker
  ) {
    const bbl = title.substring(4).trim();
    const comment = context.issue({
      body: `
Bonjour ${creator}.

Je suis prêt pour démarrer le BBL ${bbl}.
On y va ? :tada:`
    });
    await context.github.issues.createComment(comment);
  }
}
