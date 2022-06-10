import axios from 'axios';
import { Server } from 'http';
import { createApp } from '../src/app';

describe('/package/:name/:versionOne/:versionTwo endpoint', () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    port = 3000;
    server = createApp().listen(port);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('test no conflicting dependency versions', async () => {
    const packageName = 'react';
    const packageVersionOne = '16.13.0';
    const packageVersionTwo = '16.13.1';

    const res: any = (await axios(
      `http://localhost:${port}/dependency/${packageName}/${packageVersionOne}/${packageVersionTwo}`,
    )).data;

    expect(res.differences).toEqual('No conflicts');
  });

  it('test conflicting dependency versions', async () => {
    const packageName = 'react';
    const packageVersionOne = '15.0.1';
    const packageVersionTwo = '16.13.1';

    const res: any = (await axios(
      `http://localhost:${port}/dependency/${packageName}/${packageVersionOne}/${packageVersionTwo}`,
    )).data;

    expect(res.differences.length).toBeGreaterThan(0);
  });
});
