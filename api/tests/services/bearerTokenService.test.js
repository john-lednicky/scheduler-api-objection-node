/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const bearerTokenService = require('../../services/bearerTokenService');

test('bearerTokenService should get token from header', async () => {
  const authHeaderValue = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzOGE1MGQ2ZGI1NjUxZmJhZDYxMTg0NDdiYTZjNDM3ZDkwYmJjN2QifQ.eyJpc3MiOiJodHRwczovL2xlZG5pY2t5LmxvY2FsaG9zdC9kZXgiLCJzdWIiOiJDZ0V4RWdWc2IyTmhiQSIsImF1ZCI6ImxlZG5pY2t5LmxvY2FsaG9zdCIsImV4cCI6MTYzNTQ0NjY4NiwiaWF0IjoxNjM1MzYwMjg2LCJhdF9oYXNoIjoiV2hxRzB4VEE1V2FKYkpWajlhS3FyQSIsImNfaGFzaCI6Ikt2akxCaHR0ZVl1dEZoTFpyd0RJTXciLCJlbWFpbCI6ImFubkBkb3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhbm4uYWJib3QifQ.BRDSSmbP4l17aCadI08eSMDWTr7aQatk5yCpUIS6X0GSFQGFuVmYcOBuzHPKZEtF9lUxJkWZ0rVAjJoibj3S98hNKh6Rhejo8W0YSVDbrrek45Wp51jf5QVqeyA5FV2EmXLFYBmV8Gm81VrnPiegn8phYD2NJIOfU_APGC4M-C8_pmhImXnCDu1hfIb6cgQT5zOQYJBrSCoq-x9oxBOAYp8ZgXa3q4KAa_gXgfJmiz8UcAsO8qo6WR_f3VcOIGLuOVPkyaR2I0OTwOK1uc4fm0NS3ZeMu1Kipy0PlRzFTS_eiAolr1UArccw3ZxugjfU4KBdBB6MN5g-GULeNuaTKg';
  const token = bearerTokenService.getTokenFromHeader(authHeaderValue);
  expect(token).toBe('eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzOGE1MGQ2ZGI1NjUxZmJhZDYxMTg0NDdiYTZjNDM3ZDkwYmJjN2QifQ.eyJpc3MiOiJodHRwczovL2xlZG5pY2t5LmxvY2FsaG9zdC9kZXgiLCJzdWIiOiJDZ0V4RWdWc2IyTmhiQSIsImF1ZCI6ImxlZG5pY2t5LmxvY2FsaG9zdCIsImV4cCI6MTYzNTQ0NjY4NiwiaWF0IjoxNjM1MzYwMjg2LCJhdF9oYXNoIjoiV2hxRzB4VEE1V2FKYkpWajlhS3FyQSIsImNfaGFzaCI6Ikt2akxCaHR0ZVl1dEZoTFpyd0RJTXciLCJlbWFpbCI6ImFubkBkb3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhbm4uYWJib3QifQ.BRDSSmbP4l17aCadI08eSMDWTr7aQatk5yCpUIS6X0GSFQGFuVmYcOBuzHPKZEtF9lUxJkWZ0rVAjJoibj3S98hNKh6Rhejo8W0YSVDbrrek45Wp51jf5QVqeyA5FV2EmXLFYBmV8Gm81VrnPiegn8phYD2NJIOfU_APGC4M-C8_pmhImXnCDu1hfIb6cgQT5zOQYJBrSCoq-x9oxBOAYp8ZgXa3q4KAa_gXgfJmiz8UcAsO8qo6WR_f3VcOIGLuOVPkyaR2I0OTwOK1uc4fm0NS3ZeMu1Kipy0PlRzFTS_eiAolr1UArccw3ZxugjfU4KBdBB6MN5g-GULeNuaTKg');
});

test('bearerTokenService should fail if header is falsy', async () => {
  const authHeaderValue = null;
  await expect(() => { bearerTokenService.getTokenFromHeader(authHeaderValue); }).toThrow('authorization header not found');
});

test('bearerTokenService should fail if header does not start with Bearer', async () => {
  const authHeaderValue = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzOGE1MGQ2ZGI1NjUxZmJhZDYxMTg0NDdiYTZjNDM3ZDkwYmJjN2QifQ.eyJpc3MiOiJodHRwczovL2xlZG5pY2t5LmxvY2FsaG9zdC9kZXgiLCJzdWIiOiJDZ0V4RWdWc2IyTmhiQSIsImF1ZCI6ImxlZG5pY2t5LmxvY2FsaG9zdCIsImV4cCI6MTYzNTQ0NjY4NiwiaWF0IjoxNjM1MzYwMjg2LCJhdF9oYXNoIjoiV2hxRzB4VEE1V2FKYkpWajlhS3FyQSIsImNfaGFzaCI6Ikt2akxCaHR0ZVl1dEZoTFpyd0RJTXciLCJlbWFpbCI6ImFubkBkb3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhbm4uYWJib3QifQ.BRDSSmbP4l17aCadI08eSMDWTr7aQatk5yCpUIS6X0GSFQGFuVmYcOBuzHPKZEtF9lUxJkWZ0rVAjJoibj3S98hNKh6Rhejo8W0YSVDbrrek45Wp51jf5QVqeyA5FV2EmXLFYBmV8Gm81VrnPiegn8phYD2NJIOfU_APGC4M-C8_pmhImXnCDu1hfIb6cgQT5zOQYJBrSCoq-x9oxBOAYp8ZgXa3q4KAa_gXgfJmiz8UcAsO8qo6WR_f3VcOIGLuOVPkyaR2I0OTwOK1uc4fm0NS3ZeMu1Kipy0PlRzFTS_eiAolr1UArccw3ZxugjfU4KBdBB6MN5g-GULeNuaTKg';
  await expect(() => { bearerTokenService.getTokenFromHeader(authHeaderValue); }).toThrow('authorization header does not begin with "Bearer "');
});

test('bearerTokenService should validate token', async () => {
  const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzOGE1MGQ2ZGI1NjUxZmJhZDYxMTg0NDdiYTZjNDM3ZDkwYmJjN2QifQ.eyJpc3MiOiJodHRwczovL2xlZG5pY2t5LmxvY2FsaG9zdC9kZXgiLCJzdWIiOiJDZ0V4RWdWc2IyTmhiQSIsImF1ZCI6ImxlZG5pY2t5LmxvY2FsaG9zdCIsImV4cCI6MTYzNTQ0NjY4NiwiaWF0IjoxNjM1MzYwMjg2LCJhdF9oYXNoIjoiV2hxRzB4VEE1V2FKYkpWajlhS3FyQSIsImNfaGFzaCI6Ikt2akxCaHR0ZVl1dEZoTFpyd0RJTXciLCJlbWFpbCI6ImFubkBkb3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhbm4uYWJib3QifQ.BRDSSmbP4l17aCadI08eSMDWTr7aQatk5yCpUIS6X0GSFQGFuVmYcOBuzHPKZEtF9lUxJkWZ0rVAjJoibj3S98hNKh6Rhejo8W0YSVDbrrek45Wp51jf5QVqeyA5FV2EmXLFYBmV8Gm81VrnPiegn8phYD2NJIOfU_APGC4M-C8_pmhImXnCDu1hfIb6cgQT5zOQYJBrSCoq-x9oxBOAYp8ZgXa3q4KAa_gXgfJmiz8UcAsO8qo6WR_f3VcOIGLuOVPkyaR2I0OTwOK1uc4fm0NS3ZeMu1Kipy0PlRzFTS_eiAolr1UArccw3ZxugjfU4KBdBB6MN5g-GULeNuaTKg';
  const key = {
    use: 'sig',
    kty: 'RSA',
    kid: 'a38a50d6db5651fbad6118447ba6c437d90bbc7d',
    alg: 'RS256',
    n: '6xEvg360-xcaniMHcBC8ekmxNvV2sGcnEZmQZmfVgqZqULHHfZiZAKAWW1Hyivx3MJQAAgPMJvqa_povxkVwX-rcHhlEnPGbvIsSfcQW79imJ70B-lsyRdsurJtbthb_b9txNXOKF0TKPO6botbjovQGcpe48OMx9iU-icOy6eBU3_o4yGC4nnntC8nWmRA1-B_qJzQxPGnuW2Y-gEogpwlizqsNDENRX1MirxDqbfyZSBc1yfmKendifGYVYbLHICsdVUUFezRN7mJ_kboGSnLwebzCvSJOqMAYPqYdXxqoqqjTd_tvZWnsxHN_M3TDQs7tiZ4z-DBJQYb6szDwmw',
    e: 'AQAB',
  };
  const payload = await bearerTokenService.validateTokenReturnPayload(token, key);
  expect(payload.name).toBe('ann.abbot');
});

test('bearerTokenService should throw exception if token is invalid (wrong key)', async () => {
  const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzOGE1MGQ2ZGI1NjUxZmJhZDYxMTg0NDdiYTZjNDM3ZDkwYmJjN2QifQ.eyJpc3MiOiJodHRwczovL2xlZG5pY2t5LmxvY2FsaG9zdC9kZXgiLCJzdWIiOiJDZ0V4RWdWc2IyTmhiQSIsImF1ZCI6ImxlZG5pY2t5LmxvY2FsaG9zdCIsImV4cCI6MTYzNTQ0NjY4NiwiaWF0IjoxNjM1MzYwMjg2LCJhdF9oYXNoIjoiV2hxRzB4VEE1V2FKYkpWajlhS3FyQSIsImNfaGFzaCI6Ikt2akxCaHR0ZVl1dEZoTFpyd0RJTXciLCJlbWFpbCI6ImFubkBkb3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhbm4uYWJib3QifQ.BRDSSmbP4l17aCadI08eSMDWTr7aQatk5yCpUIS6X0GSFQGFuVmYcOBuzHPKZEtF9lUxJkWZ0rVAjJoibj3S98hNKh6Rhejo8W0YSVDbrrek45Wp51jf5QVqeyA5FV2EmXLFYBmV8Gm81VrnPiegn8phYD2NJIOfU_APGC4M-C8_pmhImXnCDu1hfIb6cgQT5zOQYJBrSCoq-x9oxBOAYp8ZgXa3q4KAa_gXgfJmiz8UcAsO8qo6WR_f3VcOIGLuOVPkyaR2I0OTwOK1uc4fm0NS3ZeMu1Kipy0PlRzFTS_eiAolr1UArccw3ZxugjfU4KBdBB6MN5g-GULeNuaTKg';
  const key = {
    use: "sig",
    kty: "RSA",
    kid: "fab07f2857f50e712cd422732093558febc2a6a4",
    alg: "RS256",
    n: "z3-ClcXP3XQXQTmHOb2Mxfv0Jf4VvSAmgRQBpXymbhTuMqEYkaVC1WyEruixUxv6MEQAy-5c2ANiAomgMJPLhc8wIAc3tDL6XuWG-67_P9HJ1HjlUFVeGXdUPU088qbuuCHN1_3RdfzVbtdBWFHW0G_5Bi9iJLDo-7Oyq4d_-0upquUACx90CsZwZhrPcyHAndMVZBiwxUSZCtuMoy4MlZ9yrz_AKPegILq7PDMdKVJlMv_kh5IbyF_KJzAow9wfUJ-mkk1Xs4EU8J6_cRseZt39JZ8UCgFg1d8iiGjNm4jz8HzAFb7sga4qZeDtofAkNfKj6w5QUz3wGHwRlJRmVw",
    e: "AQAB",
  };
  bearerTokenService.validateTokenReturnPayload(token, key)
    .then(() => { throw new Error('service did not throw an exception'); })
    .catch((e) => {
      expect(e.message).toBe('signature verification failed');
    });
});

test('bearerTokenService should throw exception if token is invalid (bad token)', async () => {
  const token = ' eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzOGE1MGQ2ZGI1NjUxZmJhZDYxMTg0NDdiYTZjNDM3ZDkwYmJjN2QifQ.eyJpc3MiOiJodHRwczovL2xlZG5pY2t5LmxvY2FsaG9zdC9kZXgiLCJzdWIiOiJDZ0V4RWdWc2IyTmhiQSIsImF1ZCI6ImxlZG5pY2t5LmxvY2FsaG9zdCIsImV4cCI6MTYzNTQ0NjY4NiwiaWF0IjoxNjM1MzYwMjg2LCJhdF9oYXNoIjoiV2hxRzB4VEE1V2FKYkpWajlhS3FyQSIsImNfaGFzaCI6Ikt2akxCaHR0ZVl1dEZoTFpyd0RJTXciLCJlbWFpbCI6ImFubkBkb3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhbm4uYWJib3QifQ.BRDSSmbP4l17aCadI08eSMDWTr7aQatk5yCpUIS6X0GSFQGFuVmYcOBuzHPKZEtF9lUxJkWZ0rVAjJoibj3S98hNKh6Rhejo8W0YSVDbrrek45Wp51jf5QVqeyA5FV2EmXLFYBmV8Gm81VrnPiegn8phYD2NJIOfU_APGC4M-C8_pmhImXnCDu1hfIb6cgQT5zOQYJBrSCoq-x9oxBOAYp8ZgXa3q4KAa_gXgfJmiz8UcAsO8qo6WR_f3VcOIGLuOVPkyaR2I0OTwOK1uc4fm0NS3ZeMu1Kipy0PlRzFTS_eiAolr1UArccw3ZxugjfU4KBdBB6MN5g-GULeNuaTKg';
  const key = {
    use: 'sig',
    kty: 'RSA',
    kid: 'a38a50d6db5651fbad6118447ba6c437d90bbc7d',
    alg: 'RS256',
    n: '6xEvg360-xcaniMHcBC8ekmxNvV2sGcnEZmQZmfVgqZqULHHfZiZAKAWW1Hyivx3MJQAAgPMJvqa_povxkVwX-rcHhlEnPGbvIsSfcQW79imJ70B-lsyRdsurJtbthb_b9txNXOKF0TKPO6botbjovQGcpe48OMx9iU-icOy6eBU3_o4yGC4nnntC8nWmRA1-B_qJzQxPGnuW2Y-gEogpwlizqsNDENRX1MirxDqbfyZSBc1yfmKendifGYVYbLHICsdVUUFezRN7mJ_kboGSnLwebzCvSJOqMAYPqYdXxqoqqjTd_tvZWnsxHN_M3TDQs7tiZ4z-DBJQYb6szDwmw',
    e: 'AQAB',
  };
  bearerTokenService.validateTokenReturnPayload(token, key)
    .then(() => { throw new Error('service did not throw an exception'); })
    .catch((e) => {
      expect(e.message).toBe('signature verification failed');
    });
});
