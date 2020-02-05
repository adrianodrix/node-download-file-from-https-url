'use strict'

const { existsSync, mkdirSync, createWriteStream } = require('fs')  
const { resolve, dirname } = require('path')  
const axios = require('axios')

const urlPJBank = 'https://api.pjbank.com.br/boletos/grupos/adba41e79de7ce4892c9e3bb05f1c13c9b39592b'
const filePJBank = resolve(__dirname, '..', 'downloads', 'boletos.pdf') 

async function downloadImage () {  
  const url = urlPJBank
  const path = filePJBank

  if (!existsSync(dirname(filePJBank))){
    mkdirSync(dirname(filePJBank));
  }

  const writer = createWriteStream(path)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  const contentType = response.headers['content-type']
  if (contentType === 'application/pdf') {
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }
}

downloadImage() 