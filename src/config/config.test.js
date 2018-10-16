import cfg from './config'

test('ensure config path', () => {
  expect(() => { cfg.setDefaultsPath('badfile.yaml') }).toThrowError('ENOENT')
  expect(() => { cfg.setDefaultsPath('defaults.yaml') }).not.toThrowError()
  expect(() => { cfg.setDefaultsPath() }).not.toThrowError()
})

test('set and get defaults', () => {
  expect(() => { cfg.setDefaults() }).not.toThrowError()
  const keyLen = Object.keys(cfg.getDefaults()).length
  expect(keyLen).toBeGreaterThan(2)
})

test('loads SSM params', async () => {
  const ssm = await cfg.loadSSM()
  expect(ssm).toBe(true)
})

test('load final params', async () => {
  const c = await cfg.load()
  expect(Object.keys(c).length).toBeGreaterThan(2)
})

test('production params', async () => {
  process.env.NODE_ENV = 'production'
  const c = await cfg.load()
  expect(Object.keys(c).length).toBeGreaterThan(2)
  expect(c.mongoDBPassword).toBeTruthy()
})
