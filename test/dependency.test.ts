import axios from 'axios';
import { Server } from 'http';
import { createApp } from '../src/app';

describe('/dependency/:name_a/:version_a/:name_b/:version_b endpoint', () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    port = 3000
    server = createApp().listen(port);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('responds', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = (await axios(
      `http://localhost:${port}/dependency/${packageName}/${packageVersion}/${packageName}/${packageVersion}`,
    )).data;

    expect(res).toEqual([]);
  });

  it('returns empty array when there are no incompatibilities', async () => {
    const packageNameA = 'wrt';
    const packageVersionA = '0.0.0';
    const packageNameB = 'wrt';
    const packageVersionB = '0.0.1';
    const res: any = (await axios(
      `http://localhost:${port}/dependency/${packageNameA}/${packageVersionA}/${packageNameB}/${packageVersionB}`,
    )).data;

    expect(res).toEqual([]);
  });

  it('returns an array of tuples when there is an incompatibility', async () => {
    const packageNameA = 'wrt';
    const packageVersionA = '0.0.0';
    const packageNameB = 'umi';
    const packageVersionB = '3.5.21';
    const res: any = (await axios(
      `http://localhost:${port}/dependency/${packageNameA}/${packageVersionA}/${packageNameB}/${packageVersionB}`,
    )).data;

    expect(res).toEqual([["react","^0.12.2","16.x"]]);
  });
});
