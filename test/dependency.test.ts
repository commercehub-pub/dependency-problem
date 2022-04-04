import axios from 'axios';
import { Server } from 'http';
import { createApp } from '../src/app';

describe('/package/:name/:version endpoint', () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    port = 3000
    server = createApp().listen(port);
  });

  afterAll((done) => {
    server.close(done);
  }, 10);

  it('responds', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = (await axios(
       `http://localhost:${port}/dependency/${packageName}/${packageVersion}`,
    )).data;

    expect(res.name).toEqual(packageName);
    expect(res.version).toEqual(packageVersion);
  });

  it('compare react package with the same version of react package', async () => {
    const packageName = 'react';
    const packageVersion = '18.0.0';

    const res: any = (await axios(
       `http://localhost:${port}/dependency/${packageName}/${packageVersion}/conflicts/${packageName}/${packageVersion}`,
    )).data;

    expect(res.conflics.length).toEqual(0);
  });

  it('compare 2 different react packagesversion', async () => {
    const packageName = 'react';
    const packageVersion = '18.0.0';
    const compareWithVer = '16.13.0';

    const res: any = (await axios(
       `http://localhost:${port}/dependency/${packageName}/${packageVersion}/conflicts/${packageName}/${compareWithVer}`,
    )).data;

    expect(res.conflics.length).toEqual(0);
  });

  it('compare 2 different react packagesversion', async () => {
    const packageName = 'react-redux';
    const packageVersion = '7.2.8';
    const compareWithVer = '7.2.8';

    const res: any = (await axios(
       `http://localhost:${port}/dependency/${packageName}/${packageVersion}/conflicts/${packageName}/${compareWithVer}`,
    )).data;

    // Has side effect as transident react-reduc dependencies are using different react-is versions.
    /* Please check 
    react-is": {"name": "react-is", "version": "^16.7.0",
    "referredBy": ["hoist-non-react-statics", "react-redux"]},
    */
    expect(res.conflics.length).toEqual(1);
    expect(res.conflics[0]).toEqual(['react-is', '^16.7.0', '^17.0.2']);
  });

});
