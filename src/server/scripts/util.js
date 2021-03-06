import cryptoRandomString from 'crypto-random-string'

export function log (message) {
  console.log(`${new Date().toISOString().substr(0, 19)} ${message}`)
}

export function generateAPIKey () {
  return cryptoRandomString(30)
}
