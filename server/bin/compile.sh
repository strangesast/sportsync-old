#!/bin/bash
cd bin
echo "getting jade, less, js...";
jade -o '../../docs/' -O '{"static":true}' -P ../views/index.jade
mkdir -p ../../docs/{javascripts,stylesheets}/
lessc ../public/stylesheets/style.less > ../../docs/stylesheets/style.css
cat ../public/javascripts/{models,bluetooth,adapters,index}.js > ../../docs/javascripts/index.js
#cp ../public/javascripts/* ../../docs/javascripts/
