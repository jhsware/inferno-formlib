import { globalRegistry, createUtility } from 'component-registry'
import axios from 'axios'
import { IFileUploadUtil } from '../../../../lib/interfaces'

const FileUploadUtil = createUtility({
  implements: IFileUploadUtil,
  name: 'Image.Simple',

  upload: function (file, onProgress) {
      var config = {
          onUploadProgress: function(progressEvent) {
              var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
              onProgress(percentCompleted)
          }
      };

      var data = new FormData();
      data.append('file', file);

      return axios.post('/images', data, config)
          .then((res) => {
              return Promise.resolve(res.data.publicPath)
          })
          .catch((e) => { throw e })
  },

  delete: function () {}
}).registerWith(globalRegistry)