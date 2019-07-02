import nock from 'nock';
import { Probot } from 'probot';
import myProbotApp from '../src';

export const API = 'https://api.github.com';
export const TEST_ORGA = 'linsolas';
export const TEST_REPO = 'bbl-probot';
export const SPEAKER = 'linsolas';

export const issueEvent = (title: string = 'BBL SG') => ({
  action: 'opened',
  issue: {
    number: 1,
    user: {
      login: SPEAKER
    },
    title
  },
  repository: {
    name: TEST_REPO,
    owner: {
      login: TEST_ORGA
    }
  }
});

export const eventComment = (body: string = 'Lorem Ipsum') => ({
  issue: {
    number: 1,
    user: {
      login: SPEAKER
    },
    title: 'BBL SG'
  },
  repository: {
    name: TEST_REPO,
    owner: {
      login: TEST_ORGA
    }
  },
  action: 'created',
  comment: {
    id: 1,
    user: {
      login: SPEAKER
    },
    body
  }
});

const CONFIG = `
speaker: ${SPEAKER}
bonjour: >
  Hello, ça va ?
catalogue: >
  Le catalogue des Apps est ici : https://probot.github.io/apps/
`;

export function initProbot(): Probot {
  nock(API)
  .post('/app/installations/2/access_tokens')
  .reply(200, { token: 'test' });

  nock(API)
    .get(`/repos/${TEST_ORGA}/${TEST_REPO}/contents/.github/bbl-probot.yml`)
    .reply(200, {
      content: Buffer.from(CONFIG).toString('base64')
    });

  const probot = new Probot({ id: 123, cert: 'test' });

  const app = probot.load(myProbotApp);

  app.app = () => 'test';

  return probot;
};

export const expectCommentIsMade = (done: any, message: string) => {
  nock(API)
    .post(`/repos/${TEST_ORGA}/${TEST_REPO}/issues/1/comments`, (body: any) => {
      done(expect(body.body.trim()).toMatch(message.trim()));
      return true;
    })
    .reply(200);
};

export const failIfCommentIsMade = (done: any) => {
  const scope = nock(API)
      .post(`/repos/${TEST_ORGA}/${TEST_REPO}/issues/1/comments`, () => {
        done(fail());
        return false;
      })
      .reply(200);
  return scope;
}

export const expectNoAction = (done: any) => {
  const scope = failIfCommentIsMade(done);
  setTimeout(() => {
    expect(scope.isDone()).toBeFalsy();
    done();
  }, 4000);
}
