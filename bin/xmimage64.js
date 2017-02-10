#!/usr/bin/env node
var base64Img = require('base64-img');
var sharp = require('sharp');
var fs = require('fs');

const DEBUG = false;
const B64_1_1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

let checkArgs = function(argv) {
    if (argv.length != 4) {
        console.error('参数错误！');
        console.log('Usage: xmimage64 width height');
        return false;
    }
    let width = argv[2];
    let height = argv[3];
    try {
        let w = parseInt(width);
        let h = parseInt(height);
        if (w > 0 && w < 16384 && h > 0 && h < 16384) {
            return true;
        } else {
            console.error('宽高范围 [0~16383]');
            return false;
        }
    } catch (error) {
        console.error('宽高必须是整数!');
        return false;
    }
    return true;
};

let generate = function(width, height) {
    // generate empty 1*1 image
    base64Img.img(B64_1_1, './', '1-1', function(err, filepath) {
        if (err) {
            console.error(err);
            return;
        }
        DEBUG && console.log('1-1 image generated', filepath);

        // generate target size image
        sharp('./1-1.png')
            .resize(width, height)
            .toFile('./output.png', function (error, info) {
                if (err) {
                    console.error(err);
                    fs.unlinkSync('./1-1.png');
                    return;
                }
                DEBUG && console.log('image generated', info);

                // generate base64
                base64Img.base64('./output.png', function(err, data) {
                    if (err) {
                        console.error(err);
                        fs.unlinkSync('./1-1.png');
                        fs.unlinkSync('./output.png');
                        return;
                    }
                    console.log('base64 generated');
                    console.log('============================================================');
                    console.log(data);
                    console.log('============================================================');

                    // delete image
                    fs.unlinkSync('./1-1.png');
                    fs.unlinkSync('./output.png');

                    DEBUG && console.log('xmimage end');
                })
            });
    });
}

let main = function () {
    DEBUG && console.log('xmimage start');

    let argv = process.argv;
    if (!checkArgs(argv)) {
        return;
    }

    let width = argv[2];
    let height = argv[3];
    width = parseInt(width);
    height = parseInt(height);
    generate(width, height);    
};

main();