import { VersionMetadata, VersionMetadataParcer } from '../src/types'

describe('/package/:name/:version types', () => {
  
  beforeAll(async () => {
    return;
    // do nothing
  });

  afterAll((done) => {
    done();
    // do nothing
  });

  it('valid fixed version', async () => {
    // arrage
    const packageVersion = '16.13.0';
    
    // act
    const res: VersionMetadata = VersionMetadataParcer.parse(packageVersion);

    // assert
    expect(res.rawVersion).toEqual('16.13.0');
    expect(res.cleanVersion).toEqual('16.13.0');
    expect(res.isValid).toEqual(true);
  });

  it('valid alternative versions', async () => {
    // arrage
    const packageVersion = '1.13.0 || 2.0.0';
    
    // act
    const res: VersionMetadata = VersionMetadataParcer.parse(packageVersion);

    // assert
    expect(res.rawVersion).toEqual(packageVersion);
    expect(res.cleanVersion).toEqual('2.0.0');
    expect(res.isValid).toEqual(true);
  });

  it('Valid semantic version with ^', async () => {
    // arrage
    const packageVersion = '^1.13.0';
    
    // act
    const res: VersionMetadata = VersionMetadataParcer.parse(packageVersion);

    // assert
    expect(res.rawVersion).toEqual(packageVersion);
    expect(res.cleanVersion).toEqual('1.13.0');
    expect(res.isValid).toEqual(true);
  });

  it('Valid semantic version with ~', async () => {
    // arrage
    const packageVersion = '~1.13.0';
    
    // act
    const res: VersionMetadata = VersionMetadataParcer.parse(packageVersion);

    // assert
    expect(res.rawVersion).toEqual(packageVersion);
    expect(res.cleanVersion).toEqual('1.13.0');
    expect(res.isValid).toEqual(true);
  });

  it('Valid semantic version with *', async () => {
    // arrage
    const packageVersion = '~1.13.*';
    
    // act
    const res: VersionMetadata = VersionMetadataParcer.parse(packageVersion);

    // assert
    expect(res.rawVersion).toEqual(packageVersion);
    expect(res.cleanVersion).toEqual('1.13.*');
    expect(res.isValid).toEqual(true);
  });

  it('any major *', async () => {
    // arrage
    const packageVersion = '*';
    
    // act
    const res: VersionMetadata = VersionMetadataParcer.parse(packageVersion);

    // assert
    expect(res.rawVersion).toEqual(packageVersion);
    expect(res.cleanVersion).toEqual(undefined);
    expect(res.isValid).toEqual(true);
    expect(res.isAnyMajorVer).toEqual(true);
  });
});
