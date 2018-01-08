'use strict'

require('dotenv').config()
var storage = require('azure-storage')
var blobService = storage.createBlobService(process.env.AZURE_URL)
let Duplex = require('stream').Duplex
const upload = require('multer')()

const CONTAINER_NAME = 'container'

var UPLOAD = [upload.single('fileToUpload'), (req, res) => {
    blobService.createContainerIfNotExists(CONTAINER_NAME, function (error) {
        if (error) {
            res.status(500)
            res.json({'success': false})
        }
        blobService.createBlockBlobFromStream(CONTAINER_NAME, req.file.originalname, bufferToStream(req.file.buffer), req.file.buffer.byteLength, (error) => {
            if (error) {
                res.status(500)
                res.json({'success': false})
            }
            res.status(200)
            res.json({
                publicPath: '/images/' + req.file.originalname
            })
        })
    })
}]

function bufferToStream (buffer) {
    let stream = new Duplex()
    stream.push(buffer)
    stream.push(null)
    return stream
}

module.exports = UPLOAD
