const axios = require('axios');
const crypto = require('crypto');
const { promises } = require('fs');
const configFile = require('../config/p24.conf')
const logger = require('./logger');

class p24 {
  constructor(dev) {
    if (dev) this.config = configFile.sandbox
    else this.config = configFile.production

    this.auth = Buffer.from(`${this.config.merchantId}:${this.config.reportKey}`, 'utf8').toString('base64')
  }

  async createTransaction(transactionId, amount, descryption, email) {
    const currency = 'PLN';
    const country = 'PL';
    const language = 'pl';
    const encoding = 'UTF-8';

    const sign = {"sessionId":transactionId,"merchantId":this.config.merchantId,"amount":amount,"currency":currency,"crc":this.config.crc};
    let hash = crypto.createHash('sha384').update(JSON.stringify(sign)).digest("hex");

    const token = await new Promise((resolve) => {
      axios.post(`${this.config.url}/transaction/register`, {
        "merchantId": this.config.merchantId,
        "posId": this.config.merchantId,
        "sessionId": transactionId,
        "amount": amount,
        "currency": currency,
        "description": descryption,
        "email": email,
        "country": country,
        "language": language,
        "urlReturn": "https://zaginiony-swiat.pl/",
        "urlStatus": "https://api.zaginiony-swiat.pl/api/confirm_transaction",
        "sign": hash,
        "encoding": encoding
      }, {
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      })
      .then((response) => {
        if (!response.data.code) {
          logger.debug('p24', `Generated new payment with token: ${response.data.data.token}`)
          resolve({ success: true, token: response.data.data.token })
        }
        else {
          logger.debug('p24', 'Cannot get token')
          resolve({ success: false, error: 'Cannot get token' })
        }
      })
      .catch(function (error) {
        logger.error('p24', 'Internal Error')
        resolve({ success: false, error: error.response.data })
      });
    })

    return token;
  }
  async confirmTransaction(transactionId, amount, currency, orderId) {
    const sign = {"sessionId":transactionId,"orderId":orderId,"amount":amount,"currency":currency,"crc":this.config.crc};
    let hash = crypto.createHash('sha384').update(JSON.stringify(sign)).digest("hex");

    const token = await new Promise((resolve) => {
      axios.put(`${this.config.url}/transaction/verify`, {
        "merchantId": this.config.merchantId,
        "posId": this.config.merchantId,
        "sessionId": transactionId,
        "amount": amount,
        "currency": currency,
        "orderId": orderId,
        "sign": hash
      }, {
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      })
      .then((response) => {
        if (!response.data.code) {
          logger.debug('p24', 'Payment verified')
          resolve({ success: true })
        }
        else {
          logger.debug('p24', 'Error while verifying payment')
          resolve({ success: false })
        }
      })
      .catch(function (error) {
        logger.error('p24', 'Internal Error')
        console.log(error)
        resolve({ success: false, error: error.response.data })
      });
    })

    return token;
  }
}

module.exports = p24;
