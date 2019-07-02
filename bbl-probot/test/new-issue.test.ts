import nock from 'nock';
import { Probot } from 'probot';
import { SPEAKER, issueEvent, initProbot, expectCommentIsMade, expectNoAction } from './test-utils';

nock.disableNetConnect()

describe('BBL Probot', () => {
  let probot: Probot;

  beforeEach(() => {
    probot = initProbot();
  });

  test('should say hello when the issue is created with BBL in the title', async (done) => {
    expectCommentIsMade(done, `
Bonjour ${SPEAKER}.

Je suis prêt pour démarrer le BBL SG.
On y va ? :tada:`
    );

    // Receive a webhook event
    await probot.receive({ name: 'issues', payload: issueEvent() });
  });

  test('should do nothing when the issue is created without BBL in the title', async (done) => {
    expectNoAction(done);

    await probot.receive({ name: 'issues', payload: issueEvent('Lorem Ipsum') });
  });

  test('should do nothing when the issue is created by someone else than the speaker', async (done) => {
    expectNoAction(done);

    const payload = issueEvent();
    payload.issue.user.login = 'john.doe';
    await probot.receive({ name: 'issues', payload });
  });
})
