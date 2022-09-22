import { initPayloadTest } from '../helpers/configHelpers';
import { RESTClient } from '../helpers/rest';
import { applicationEndpoint, collectionSlug, globalEndpoint, globalSlug, rootEndpoint } from './config';

require('isomorphic-fetch');

let client: RESTClient;

describe('Endpoints', () => {
  beforeAll(async () => {
    const config = await initPayloadTest({ __dirname, init: { local: false } });
    const { serverURL } = config;
    client = new RESTClient(config, { serverURL, defaultSlug: collectionSlug });
  });

  describe('Collections', () => {
    it('should GET a static endpoint', async () => {
      const { status, data } = await client.endpoint(`/api/${collectionSlug}/say-hello/joe-bloggs`);
      expect(status).toBe(200);
      expect(data.message).toStrictEqual('Hey Joey!');
    });

    it('should GET an endpoint with a parameter', async () => {
      const name = 'George';
      const { status, data } = await client.endpoint(`/api/${collectionSlug}/say-hello/${name}`);
      expect(status).toBe(200);
      expect(data.message).toStrictEqual(`Hello ${name}!`);
    });

    it('should POST an endpoint with data', async () => {
      const params = { name: 'George', age: 29 };
      const { status, data } = await client.endpoint(`/api/${collectionSlug}/whoami`, 'post', params);
      expect(status).toBe(200);
      expect(data.name).toStrictEqual(params.name);
      expect(data.age).toStrictEqual(params.age);
    });
  });

  describe('Globals', () => {
    it('should call custom endpoint', async () => {
      const params = { globals: 'response' };
      const { status, data } = await client.endpoint(`/api/globals/${globalSlug}/${globalEndpoint}`, 'post', params);

      expect(status).toBe(200);
      expect(params).toMatchObject(data);
    });
  });

  describe('API', () => {
    it('should call custom endpoint', async () => {
      const params = { app: 'response' };
      const { status, data } = await client.endpoint(`/api/${applicationEndpoint}`, 'post', params);

      expect(status).toBe(200);
      expect(params).toMatchObject(data);
    });
  });

  describe('Root', () => {
    it('should call custom root endpoint', async () => {
      const params = { root: 'response' };
      const { status, data } = await client.endpoint(`/${rootEndpoint}`, 'post', params);

      expect(status).toBe(200);
      expect(params).toMatchObject(data);
    });
  });
});
