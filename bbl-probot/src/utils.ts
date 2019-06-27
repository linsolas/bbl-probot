import { Context } from 'probot';

export interface ProbotConfiguration {
  speaker: string;
  [key: string]: string;
}

export async function getConfig(context: Context): Promise<ProbotConfiguration | null> {
  try {
    return context.config<ProbotConfiguration>('bbl-probot.yml');
  } catch (err) {
    if (err.code !== 404) {
      throw err
    }
    return null;
  }
}
