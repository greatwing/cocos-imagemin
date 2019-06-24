'use strict';

function onBeforeBuildFinish (options, callback) {
  let buildResults = options.buildResults; 


  Editor.log("compress images begin...");
  
  // get all textures in build
  let textures = [];
  let assets = buildResults.getAssetUuids();
  let textureType = cc.js._getClassId(cc.Texture2D);
  for (let i = 0; i < assets.length; ++i)
  {
      let asset = assets[i];
      if (buildResults.getAssetType(asset) === textureType) 
      {
          textures.push(buildResults.getNativeAssetPath(asset));
      }
  }

  compressImages(textures).then(()=>{
    Editor.log("compress images end !");
    callback();
  });
}

async function compressImages(textures) {
  var imagemin = require('imagemin');
  var imageminJpegtran = require('imagemin-jpegtran');
  var imageminPngquant = require('imagemin-pngquant');

  for(let path of textures)
  {
    let dir = path.substring(0, path.lastIndexOf("\\") + 1)

    Editor.log(`compress file: ${path}`)
    await imagemin([path], dir, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    })
  }
}

module.exports = {
  load () {
    // execute when package loaded
    Editor.Builder.on('before-change-files', onBeforeBuildFinish);
  },

  unload () {
    // execute when package unloaded
    Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
  },
}