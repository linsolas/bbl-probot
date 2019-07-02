import { Probot } from 'probot';
import { eventComment, expectCommentIsMade, initProbot, expectNoAction } from './test-utils';

describe('BBL Probot', () => {
  let probot: Probot;

  beforeEach(() => {
    probot = initProbot();
  });

  test('should comment when a comment contains a special keyword', async (done) => {
    expectCommentIsMade(done, 'Hello, ça va ?');

    // Receive a webhook event
    await probot.receive({ name: 'issue_comment', payload: eventComment('Bonjour !') });
  });

  test('should do nothing when the comment contains no special keyword', async (done) => {
    expectNoAction(done);

    await probot.receive({ name: 'issue_comment', payload: eventComment() });
  });

  test('should do nothing when the comment is not made by the speaker', async (done) => {
    expectNoAction(done);

    const payload = eventComment('Bonjour !');
    payload.comment.user.login = 'john.doe';
    await probot.receive({ name: 'issue_comment', payload });
  });
});
