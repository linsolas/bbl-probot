import nock from 'nock';
import { Probot } from 'probot';
import { SPEAKER, ISSUE_EVENT, initProbot, expectCommentIsMade, API, TEST_ORGA, TEST_REPO } from './test-utils';

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
    await probot.receive({ name: 'issues', payload: ISSUE_EVENT });
  });

  test('should do nothing when the issue is created without BBL in the title', async (done) => {
    const scope = nock(API)
      .post(`/repos/${TEST_ORGA}/${TEST_REPO}/issues/1/comments`, (body: any) => {
        done(fail());
        return false;
      })
      .reply(200);

    setTimeout(() => {
      expect(scope.isDone()).toBeFalsy();
      done();
    }, 4000);

    const payload = ISSUE_EVENT;
    payload.issue.title = 'Lorem Ipsum';
    await probot.receive({ name: 'issues', payload });
  });

  test('should do nothing when the issue is created by someone else than the speaker', async (done) => {
    const scope = nock(API)
      .post(`/repos/${TEST_ORGA}/${TEST_REPO}/issues/1/comments`, (body: any) => {
        done(fail());
        return false;
      })
      .reply(200);

    setTimeout(() => {
      expect(scope.isDone()).toBeFalsy();
      done();
    }, 4000);

    const payload = ISSUE_EVENT;
    payload.issue.user.login = 'john.doe';
    await probot.receive({ name: 'issues', payload });
  });
})
